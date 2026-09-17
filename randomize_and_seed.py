import sqlite3
import random
from clickhouse_driver import Client
import time
from datetime import date, datetime

print("[INFO] Iniciando script de redistribucion de años y sembrado de detalles...")
t_start = time.time()

# 1. Conectar a ClickHouse
print("[CONNECT] Conectando a ClickHouse Local Docker...")
client = Client(
    host='localhost',
    port=9000,
    user='default',
    password='password12345', 
    secure=False
)

# 2. Borrar los registros anteriores inyectados (> 300,001)
# Para asegurar que la tabla quede limpia de los 200k anteriores que tenían el año 2001
print("[DELETE] Eliminando los 200,000 registros anteriores (> 300,001) de chicago_crimes e incidente_delito...")
t_del = time.time()
client.execute("ALTER TABLE default.chicago_crimes DELETE WHERE id > 300001")
client.execute("ALTER TABLE default.incidente_delito DELETE WHERE id_incidente_delito > 300001")

# En ClickHouse, las mutaciones de DELETE son asincrónicas, por lo que esperamos a que finalicen
print("  - Esperando que finalicen las mutaciones de eliminacion...")
while True:
    res = client.execute("SELECT mutation_id, is_done FROM system.mutations WHERE table IN ('chicago_crimes', 'incidente_delito') AND is_done = 0")
    if not res:
        break
    print(f"  - Aún ejecutándose mutaciones: {len(res)} activas. Esperando 1 segundo...")
    time.sleep(1)

print(f"[SUCCESS] Eliminacion completada en {time.time() - t_del:.2f} segundos.")

# 3. Conectar a SQLite de PocketBase directamente en el volumen local
db_path = 'datos_nuevos_pb/data.db'
print(f"[CONNECT] Abriendo base de datos SQLite en '{db_path}'...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Hacemos un OFFSET de 300,000 para extraer exactamente los 200,000 registros
offset_value = 300000
limit_value = 200000
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
print(f"[SUCCESS] Extraccion finalizada en {time.time() - t_start:.2f} segundos. {len(rows):,} registros leidos.")

# -------------------------------------------------------------------
# 4. Transformacion y redistribución aleatoria de años (2002 - 2025)
# -------------------------------------------------------------------
print("[ETL] Transformando, redistribuyendo años (2002-2025) y blindando registros para ClickHouse...")
t_trans = time.time()
data_to_insert = []

# Fijamos una semilla para reproducibilidad si es necesario, o aleatorio puro
# Usaremos random aleatorio puro para que parezca real
for row in rows:
    row_list = list(row)
    
    # 1. Normalizar booleanos de SQLite (0/1) a strings de ClickHouse ("False"/"True")
    row_list[8] = "True" if row_list[8] == 1 else "False"
    row_list[9] = "True" if row_list[9] == 1 else "False"
    
    # 2. Generar el campo "location" (columna 22 de ClickHouse) a partir de latitud y longitud
    lat = row_list[19]
    lng = row_list[20]
    location = f"({lat}, {lng})" if lat and lng else ""
    row_list.append(location)
    
    # 3. REDISTRIBUIR AÑOS: Cambiar el año de 2001 a un año aleatorio entre 2002 y 2025
    random_year = random.randint(2002, 2025)
    row_list[17] = str(random_year) # Year
    
    # Modificar el prefijo de año en las fechas
    date_str = row_list[2]
    if date_str and date_str.startswith("2001"):
        row_list[2] = str(random_year) + date_str[4:]
        
    updated_str = row_list[18]
    if updated_str and updated_str.startswith("2001"):
        row_list[18] = str(random_year) + updated_str[4:]
    
    # 4. Forzar que todos los campos sean string para evitar discrepancias de tipo en ClickHouse
    data_to_insert.append(tuple(str(x) for x in row_list))

print(f"[SUCCESS] Transformacion y redistribucion completada en {time.time() - t_trans:.2f} segundos.")

# -------------------------------------------------------------------
# 5. Inyeccion en ClickHouse Local
# -------------------------------------------------------------------
# Vaciamos la tabla dataset_crudo para que SOLO contenga los 200k nuevos con años distribuidos
print("[CLEAN] Vaciando (TRUNCATE) la tabla local 'dataset_crudo'...")
client.execute("TRUNCATE TABLE default.dataset_crudo")
print("  - Tabla 'dataset_crudo' limpia (0 registros).")

print(f"[INSERT] Inyectando los {limit_value:,} nuevos registros con años distribuidos...")
t_ins = time.time()
client.execute("INSERT INTO default.dataset_crudo VALUES", data_to_insert)
print(f"[SUCCESS] Inyeccion masiva completada en {time.time() - t_ins:.2f} segundos.")

# Verificar cantidad final en dataset_crudo
cantidad_cruda = client.execute("SELECT count(*) FROM default.dataset_crudo")[0][0]
print(f"[TOTAL] La tabla 'dataset_crudo' local ahora tiene EXACTAMENTE {cantidad_cruda:,} registros nuevos.")

# -------------------------------------------------------------------
# 6. Ejecutar el script SQL de Migracion de Datos
# -------------------------------------------------------------------
print("\n[MIGRATE] Iniciando ejecucion de scripts de migracion...")

# Consultamos los MAX IDs actuales en Python para inyectar como literales estables
print("[MIGRATE] Consultando identificadores maximos actuales en ClickHouse...")
max_id_ubicacion = client.execute("SELECT max(id_ubicacion) FROM default.catalogo_ubicacion")[0][0] or 0
max_id_codigo = client.execute("SELECT max(id_codigo) FROM default.codigo_penal")[0][0] or 0
max_id_estacion = client.execute("SELECT max(id_estacion) FROM default.estacion_policial")[0][0] or 0
max_id_crime = client.execute("SELECT max(id) FROM default.chicago_crimes")[0][0] or 0
max_id_incidente_delito = client.execute("SELECT max(id_incidente_delito) FROM default.incidente_delito")[0][0] or 0

print(f"  - Max id_ubicacion: {max_id_ubicacion}")
print(f"  - Max id_codigo: {max_id_codigo}")
print(f"  - Max id_estacion: {max_id_estacion}")
print(f"  - Max id (chicago_crimes): {max_id_crime}")
print(f"  - Max id_incidente_delito: {max_id_incidente_delito}")

# 1.1 Extraer ubicaciones únicas nuevas
print("[MIGRATE] 1.1 Migrando catalogo_ubicacion...")
t_m1 = time.time()
client.execute(f"""
    INSERT INTO default.catalogo_ubicacion (id_ubicacion, descripcion_lugar, es_espacio_publico)
    SELECT 
        {max_id_ubicacion} + rowNumberInAllBlocks() + 1 AS id_ubicacion, 
        location_description, 
        false
    FROM (
        SELECT DISTINCT location_description 
        FROM default.dataset_crudo 
        WHERE location_description != '' 
          AND location_description NOT IN (SELECT descripcion_lugar FROM default.catalogo_ubicacion)
    )
""")
print(f"  - Completado en {time.time() - t_m1:.2f} segundos.")

# 1.2 Extraer códigos penales únicos nuevos
print("[MIGRATE] 1.2 Migrando codigo_penal...")
t_m2 = time.time()
client.execute(f"""
    INSERT INTO default.codigo_penal (id_codigo, codigo_iucr, codigo_fbi, gravedad_delito)
    SELECT 
        {max_id_codigo} + rowNumberInAllBlocks() + 1 AS id_codigo, 
        iucr, 
        fbi_code, 
        primary_type
    FROM (
        SELECT DISTINCT iucr, fbi_code, primary_type 
        FROM default.dataset_crudo 
        WHERE iucr != '' 
          AND iucr NOT IN (SELECT codigo_iucr FROM default.codigo_penal)
        LIMIT 1 BY iucr
    )
""")
print(f"  - Completado en {time.time() - t_m2:.2f} segundos.")

# 1.3 Extraer distritos únicos nuevos para estaciones policiales
print("[MIGRATE] 1.3 Migrando estacion_policial...")
t_m3 = time.time()
client.execute(f"""
    INSERT INTO default.estacion_policial (id_estacion, numero_distrito)
    SELECT 
        {max_id_estacion} + rowNumberInAllBlocks() + 1 AS id_estacion, 
        district
    FROM (
        SELECT DISTINCT district 
        FROM default.dataset_crudo 
        WHERE district != '' 
          AND district NOT IN (SELECT numero_distrito FROM default.estacion_policial)
    )
""")
print(f"  - Completado en {time.time() - t_m3:.2f} segundos.")

# 2. Migrar la tabla principal con IDs secuenciales y tipos sanitizados
print("[MIGRATE] 2. Migrando chicago_crimes...")
t_m4 = time.time()
client.execute(f"""
    INSERT INTO default.chicago_crimes (
        id, case_number, date, block, description, id_ubicacion, arrest, domestic, beat, 
        id_estacion, ward, community_area, x_coordinate, y_coordinate, year, updated_on, 
        latitude, longitude
    )
    SELECT 
        {max_id_crime} + rowNumberInAllBlocks() + 1 AS id,
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
        FROM default.dataset_crudo 
        WHERE case_number != ''
        LIMIT 1 BY case_number
    ) AS dc
    LEFT JOIN default.catalogo_ubicacion AS cu ON dc.location_description = cu.descripcion_lugar
    LEFT JOIN default.estacion_policial AS ep ON dc.district = ep.numero_distrito
""")
print(f"  - Completado en {time.time() - t_m4:.2f} segundos.")

# 3. Migrar la tabla intermedia (Puente de Delitos)
print("[MIGRATE] 3. Migrando incidente_delito...")
t_m5 = time.time()
client.execute(f"""
    INSERT INTO default.incidente_delito (id_incidente_delito, case_number, codigo_iucr, es_delito_primario)
    SELECT 
        {max_id_incidente_delito} + rowNumberInAllBlocks() + 1 AS id_incidente_delito,
        case_number,
        iucr,
        true AS es_delito_primario
    FROM (
        SELECT case_number, iucr 
        FROM default.dataset_crudo 
        WHERE case_number != '' AND iucr != ''
        LIMIT 1 BY case_number
    )
""")
print(f"  - Completado en {time.time() - t_m5:.2f} segundos.")

# -------------------------------------------------------------------
# 7. Insertar información de detalle del caso #G493865
# -------------------------------------------------------------------
print("\n[SEED_DETAIL] Iniciando sembrado de informacion detallada para el caso G493865...")
cn = 'G493865'

# Consultamos los MAX IDs actuales en las tablas operativas
max_id_victima = client.execute("SELECT max(id_victima) FROM default.victima")[0][0] or 0
max_id_sospechoso = client.execute("SELECT max(id_sospechoso) FROM default.sospechoso")[0][0] or 0
max_id_testigo = client.execute("SELECT max(id_testigo) FROM default.testigo")[0][0] or 0
max_id_evidencia = client.execute("SELECT max(id_evidencia) FROM default.evidencia")[0][0] or 0
max_id_investigacion = client.execute("SELECT max(id_investigacion) FROM default.investigacion_especial")[0][0] or 0

# Insertar Víctima
print("  - Insertando victima...")
client.execute("INSERT INTO default.victima (id_victima, case_number, nombres, identificacion, genero, telefono, direccion) VALUES", [
    (max_id_victima + 1, cn, "John Smith", "IL-5552233", "Masculino", "555-888-2233", "4401 S State St, Chicago, IL")
])

# Insertar Sospechoso (Asociado a Latin Kings ID 1)
print("  - Insertando sospechoso...")
client.execute("INSERT INTO default.sospechoso (id_sospechoso, case_number, nombres, identificacion, genero, telefono, direccion, alias_conocido, fecha_nacimiento, antecedentes, declaracion, id_banda) VALUES", [
    (max_id_sospechoso + 1, cn, "Jimmy 'Wheels' Vance", "IL-1002341", "Masculino", "555-222-1111", "512 E 47th St, Chicago, IL", "Wheels", date(1994, 4, 12), True, "Estaba caminando y vi las llaves pegadas, solo quería dar una vuelta rápida. No pretendía robar el vehículo de forma permanente.", 1)
])

# Insertar Testigo
print("  - Insertando testigo...")
client.execute("INSERT INTO default.testigo (id_testigo, case_number, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo) VALUES", [
    (max_id_testigo + 1, cn, "Lisa Peterson", "IL-4411222", "Femenino", "555-444-1234", "4415 S State St, Chicago, IL", "Vi al sospechoso merodear el vehículo estacionado por unos minutos. Cuando el dueño entró a la farmacia, se subió rápido, encendió el auto y aceleró en dirección sur por State St.", False)
])

# Insertar Evidencia
print("  - Insertando evidencia física...")
client.execute("INSERT INTO default.evidencia (id_evidencia, case_number, tipo_evidencia, fecha_recoleccion, id_oficial) VALUES", [
    (max_id_evidencia + 1, cn, "Llaves duplicadas de encendido (Ganzúa/Herramienta de bypass)", datetime(2025, 8, 19, 9, 30, 0), 1),
    (max_id_evidencia + 2, cn, "Grabación en formato digital de cámara de seguridad de la gasolinera adyacente", datetime(2025, 8, 19, 10, 15, 0), 11)
])

# Insertar Seguimiento de Incidente (Logs de Bitácora)
# Formato: id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial
print("  - Insertando bitácora de seguimiento...")
client.execute("INSERT INTO default.seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES", [
    (f"{cn}-log-1", cn, datetime(2025, 8, 19, 8, 40, 0), "En Progreso", "Reporte de Hurto", "Propietario del vehículo marca Toyota Camry reporta el robo del mismo de la acera frente a la farmacia. Se emite alerta por radio a todas las unidades de patrulla.", 1, "Oficial John Doe"),
    (f"{cn}-log-2", cn, datetime(2025, 8, 19, 9, 15, 0), "En Progreso", "Persecución y Arresto", "La unidad de patrullaje del cuadrante 022 localiza el vehículo sospechoso y procede a cerrarle el paso. El conductor Jimmy 'Wheels' Vance es detenido sin incidentes mayores.", 5, "Oficial Michael Miller"),
    (f"{cn}-log-3", cn, datetime(2025, 8, 19, 9, 30, 0), "En Progreso", "Evidencia Asegurada", "Se recupera el vehículo con daños menores y se incauta una ganzúa en el encendido. El vehículo es trasladado para la restitución formal a su propietario.", 1, "Oficial John Doe"),
    (f"{cn}-log-assign", cn, datetime(2025, 8, 20, 9, 0, 0), "En Progreso", "Caso Asignado", "Caso transferido a la división de robos de vehículos de motor de la estación. Det. Somerset es asignado al expediente.", 11, "Det. William Somerset"),
    (f"{cn}-log-close", cn, datetime(2025, 8, 21, 16, 0, 0), "Cerrado", "Investigación Cerrada", "El vehículo ha sido recuperado en buen estado y devuelto al propietario John Smith. Se formalizan cargos de robo de vehículo contra Jimmy Vance. Caso concluido y enviado a Fiscalía.", 11, "Det. William Somerset")
])

# Insertar Investigación Especial
# Formato: id_investigacion, case_number, id_detective, es_caso_mayor, estado, reporte_final, fecha_asignacion, fecha_resolucion
print("  - Insertando investigacion especial...")
client.execute("INSERT INTO default.investigacion_especial (id_investigacion, case_number, id_detective, es_caso_mayor, estado, reporte_final, fecha_asignacion, fecha_resolucion) VALUES", [
    (max_id_investigacion + 1, cn, 11, 0, "Cerrado", "El vehículo marca Toyota Camry fue recuperado en buen estado y devuelto formalmente a su propietario John Smith. El sospechoso Jimmy 'Wheels' Vance fue detenido en flagrancia y procesado. Se le imputan cargos de robo de vehículo de motor ante la Corte del Condado.", datetime(2025, 8, 20, 9, 0, 0), datetime(2025, 8, 21, 16, 0, 0))
])

print("[SUCCESS] Sembrado de detalles para G493865 completado.")

# -------------------------------------------------------------------
# 8. Verificaciones Finales de Totales
# -------------------------------------------------------------------
print("\n[VERIFY] Realizando verificaciones de recuentos finales en ClickHouse...")
count_crimes = client.execute("SELECT count(*) FROM default.chicago_crimes")[0][0]
count_inc_del = client.execute("SELECT count(*) FROM default.incidente_delito")[0][0]

# Query recuentos por años para verificar la distribución
res_anos = client.execute("SELECT year, count(*) FROM default.chicago_crimes GROUP BY year ORDER BY year ASC")
print("\nDistribución histórica de incidentes por año en ClickHouse:")
for r in res_anos:
    print(f"  - Año {r[0]}: {r[1]:,} incidentes")

print(f"\n  - Total chicago_crimes: {count_crimes:,}")
print(f"  - Total incidente_delito: {count_inc_del:,}")

print(f"\n[SUCCESS] Proceso completo de redistribucion y sembrado finalizado con éxito en {time.time() - t_start:.2f} segundos!")
