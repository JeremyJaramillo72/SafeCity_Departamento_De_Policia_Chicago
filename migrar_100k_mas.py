import sqlite3
from clickhouse_driver import Client
import time
import random

print("[INFO] Iniciando extraccion de 100k registros (OFFSET 800,000)...")
t0 = time.time()

# 1. Conectar a SQLite de PocketBase directamente en el volumen local
db_path = 'datos_nuevos_pb/data.db'
print(f"[CONNECT] Abriendo base de datos SQLite en '{db_path}'...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

offset_value = 800000
limit_value = 100000
print(f"[SQLITE] Extrayendo {limit_value:,} registros nuevos (OFFSET {offset_value:,})...")
cursor.execute(f"""
    SELECT 
        id, case_number, date, block, iucr, primary_type, description, 
        location_description, arrest, domestic, beat, district, ward, 
        community_area, fbi_code, x_coordinate, y_coordinate, year, 
        updated_on, latitude, longitude
    FROM chicago_crimes 
    LIMIT {limit_value} OFFSET {offset_value}
""")
rows = cursor.fetchall()
conn.close()

print(f"[SUCCESS] Extraccion finalizada en {time.time() - t0:.2f} segundos. {len(rows):,} registros nuevos leidos.")

# -------------------------------------------------------------------
# 2. Transformacion de datos con Aleatoriedad de Años
# -------------------------------------------------------------------
print("[ETL] Transformando, redistribuyendo años y blindando registros para ClickHouse...")
t1 = time.time()
data_to_insert = []
for row in rows:
    row_list = list(row)
    
    # 1. Normalizar booleanos de SQLite (0/1) a strings de ClickHouse ("False"/"True")
    row_list[8] = "True" if row_list[8] == 1 else "False"
    row_list[9] = "True" if row_list[9] == 1 else "False"
    
    # 2. Generar el campo "location" a partir de latitud y longitud
    lat = row_list[19]
    lng = row_list[20]
    location = f"({lat}, {lng})" if lat and lng else ""
    row_list.append(location)
    
    # 3. REDISTRIBUIR AÑOS: Cambiar el año a un año aleatorio entre 2002 y 2026
    random_year = random.randint(2002, 2026)
    row_list[17] = str(random_year) # Year
    
    # Modificar el prefijo de año en las fechas
    date_str = str(row_list[2]) if row_list[2] else ""
    if date_str and len(date_str) >= 4:
        row_list[2] = str(random_year) + date_str[4:]
        
    updated_str = str(row_list[18]) if row_list[18] else ""
    if updated_str and len(updated_str) >= 4:
        row_list[18] = str(random_year) + updated_str[4:]
    
    # 4. Forzar que todos los campos sean string
    data_to_insert.append(tuple(str(x) for x in row_list))

print(f"[SUCCESS] Transformacion completada en {time.time() - t1:.2f} segundos.")

# -------------------------------------------------------------------
# 3. Inyeccion en ClickHouse Local
# -------------------------------------------------------------------
print("[CONNECT] Conectando a ClickHouse Local Docker...")
client = Client(
    host='localhost',
    port=9000,
    user='default',
    password='password12345', 
    secure=False
)

print("[CLEAN] Vaciando (TRUNCATE) la tabla local 'dataset_crudo'...")
client.execute("TRUNCATE TABLE default.dataset_crudo")

print(f"[INSERT] Inyectando los {limit_value:,} nuevos registros a maxima velocidad...")
t2 = time.time()
client.execute("INSERT INTO default.dataset_crudo VALUES", data_to_insert)
print(f"[SUCCESS] Inyeccion masiva completada en {time.time() - t2:.2f} segundos.")

# -------------------------------------------------------------------
# 4. Ejecutar el script SQL de Migracion de Datos
# -------------------------------------------------------------------
print("\n[MIGRATE] Iniciando ejecucion de scripts de migracion...")

print("[MIGRATE] 1.1 Migrando catalogo_ubicacion...")
client.execute("""
INSERT INTO catalogo_ubicacion (id_ubicacion, descripcion_lugar, es_espacio_publico)
SELECT 
    coalesce((SELECT max(id_ubicacion) FROM catalogo_ubicacion), 0) + rowNumberInAllBlocks() + 1 AS id_ubicacion, 
    location_description, 
    false
FROM (
    SELECT DISTINCT location_description 
    FROM dataset_crudo 
    WHERE location_description != '' 
      AND location_description NOT IN (SELECT descripcion_lugar FROM catalogo_ubicacion)
)
""")

print("[MIGRATE] 1.2 Migrando codigo_penal...")
client.execute("""
INSERT INTO codigo_penal (id_codigo, codigo_iucr, codigo_fbi, gravedad_delito)
SELECT 
    coalesce((SELECT max(id_codigo) FROM codigo_penal), 0) + rowNumberInAllBlocks() + 1 AS id_codigo, 
    iucr, 
    fbi_code, 
    primary_type
FROM (
    SELECT DISTINCT iucr, fbi_code, primary_type 
    FROM dataset_crudo 
    WHERE iucr != '' 
      AND iucr NOT IN (SELECT codigo_iucr FROM codigo_penal)
    LIMIT 1 BY iucr
)
""")

print("[MIGRATE] 1.3 Migrando estacion_policial...")
client.execute("""
INSERT INTO estacion_policial (id_estacion, numero_distrito)
SELECT 
    coalesce((SELECT max(id_estacion) FROM estacion_policial), 0) + rowNumberInAllBlocks() + 1 AS id_estacion, 
    district
FROM (
    SELECT DISTINCT district 
    FROM dataset_crudo 
    WHERE district != '' 
      AND district NOT IN (SELECT numero_distrito FROM estacion_policial)
)
""")

print("[MIGRATE] 2. Migrando chicago_crimes...")
t_m4 = time.time()
client.execute("""
INSERT INTO chicago_crimes (
    id, case_number, date, block, description, id_ubicacion, arrest, domestic, beat, 
    id_estacion, ward, community_area, x_coordinate, y_coordinate, year, updated_on, 
    latitude, longitude
)
SELECT 
    coalesce((SELECT max(id) FROM chicago_crimes), 0) + rowNumberInAllBlocks() + 1 AS id,
    case_number,
    parseDateTimeBestEffortOrZero(date) AS parsed_date,
    block,
    description,
    ifNull(cu.id_ubicacion, 0) AS id_ubicacion,
    if(lower(arrest) = 'true', true, false) AS parsed_arrest,
    if(lower(domestic) = 'true', true, false) AS parsed_domestic,
    beat,
    ifNull(ep.id_estacion, 0) AS id_estacion,
    ward,
    community_area,
    toFloat64OrZero(replaceAll(x_coordinate, ',', '.')) AS parsed_x,
    toFloat64OrZero(replaceAll(y_coordinate, ',', '.')) AS parsed_y,
    toInt32OrZero(year) AS parsed_year,
    parseDateTimeBestEffortOrZero(updated_on) AS parsed_updated,
    toFloat64OrZero(replaceAll(latitude, ',', '.')) AS parsed_lat,
    toFloat64OrZero(replaceAll(longitude, ',', '.')) AS parsed_lng
FROM (
    SELECT * 
    FROM dataset_crudo 
    WHERE case_number != ''
    LIMIT 1 BY case_number
) AS dc
LEFT JOIN catalogo_ubicacion AS cu ON dc.location_description = cu.descripcion_lugar
LEFT JOIN estacion_policial AS ep ON dc.district = ep.numero_distrito
""")
print(f"  - Completado en {time.time() - t_m4:.2f} segundos.")

print("[MIGRATE] 3. Migrando incidente_delito...")
t_m5 = time.time()
client.execute("""
INSERT INTO incidente_delito (id_incidente_delito, case_number, codigo_iucr, es_delito_primario)
SELECT 
    coalesce((SELECT max(id_incidente_delito) FROM incidente_delito), 0) + rowNumberInAllBlocks() + 1 AS id_incidente_delito,
    case_number,
    iucr,
    true AS es_delito_primario
FROM (
    SELECT case_number, iucr 
    FROM dataset_crudo 
    WHERE case_number != '' AND iucr != ''
    LIMIT 1 BY case_number
)
""")
print(f"  - Completado en {time.time() - t_m5:.2f} segundos.")

# -------------------------------------------------------------------
# 5. Verificaciones Finales de Totales
# -------------------------------------------------------------------
print("\n[VERIFY] Realizando verificaciones de recuentos finales en ClickHouse...")
count_crimes = client.execute("SELECT count(*) FROM default.chicago_crimes")[0][0]
count_incidentes_delitos = client.execute("SELECT count(*) FROM default.incidente_delito")[0][0]

res_anos = client.execute("SELECT year, count(*) FROM default.chicago_crimes GROUP BY year ORDER BY year ASC")
print("\nDistribución histórica de incidentes por año en ClickHouse:")
for r in res_anos:
    print(f"  - Año {r[0]}: {r[1]:,} incidentes")

print(f"  - Total chicago_crimes: {count_crimes:,}")
print(f"  - Total incidente_delito: {count_incidentes_delitos:,}")

print(f"\n[SUCCESS] Proceso completo finalizado con éxito en {time.time() - t0:.2f} segundos!")
