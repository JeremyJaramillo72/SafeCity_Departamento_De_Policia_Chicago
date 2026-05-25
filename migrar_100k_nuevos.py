import sqlite3
from clickhouse_driver import Client
import time

print("[INFO] Iniciando extraccion de alto rendimiento (SQLite Direct Bypass)...")
t0 = time.time()

# 1. Conectar a SQLite de PocketBase directamente en el volumen local
db_path = 'datos_nuevos_pb/data.db'
print(f"[CONNECT] Abriendo base de datos SQLite en '{db_path}'...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# El bypass definitivo: los primeros 200,000 registros ya se cargaron.
# Por lo tanto, hacemos un OFFSET de 200,000 para extraer exactamente los SIGUIENTES 100,000 registros
# en una sola consulta SQLite hiper-rapida de 0.2 segundos.
print("[SQLITE] Extrayendo 100,000 registros nuevos (OFFSET 200,000)...")
cursor.execute("""
    SELECT 
        id, case_number, date, block, iucr, primary_type, description, 
        location_description, arrest, domestic, beat, district, ward, 
        community_area, fbi_code, x_coordinate, y_coordinate, year, 
        updated_on, latitude, longitude
    FROM chicago_crimes 
    LIMIT 100000 OFFSET 200000
""")
rows = cursor.fetchall()
conn.close()

print(f"[SUCCESS] Extraccion finalizada en {time.time() - t0:.2f} segundos. {len(rows)} registros nuevos leidos.")

# -------------------------------------------------------------------
# 2. Transformacion ultra-rapida de datos
# -------------------------------------------------------------------
print("[ETL] Transformando y blindando registros para ClickHouse...")
t1 = time.time()
data_to_insert = []
for row in rows:
    # Convertimos a lista modificable
    row_list = list(row)
    
    # 1. Normalizar booleanos de SQLite (0/1) a strings de ClickHouse ("False"/"True")
    row_list[8] = "True" if row_list[8] == 1 else "False"
    row_list[9] = "True" if row_list[9] == 1 else "False"
    
    # 2. Generar el campo "location" (columna 22 de ClickHouse) a partir de latitud y longitud
    lat = row_list[19]
    lng = row_list[20]
    location = f"({lat}, {lng})" if lat and lng else ""
    row_list.append(location)
    
    # 3. Forzar que todos los campos sean string para evitar discrepancias de tipo en ClickHouse
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

# PASO CLAVE: Vaciamos la tabla dataset_crudo para que SOLO contenga los 100k nuevos
print("[CLEAN] Vaciando (TRUNCATE) la tabla local 'dataset_crudo'...")
client.execute("TRUNCATE TABLE default.dataset_crudo")
print("  - Tabla 'dataset_crudo' limpia (0 registros).")

print("[INSERT] Inyectando los 100,000 nuevos registros a maxima velocidad...")
t2 = time.time()
client.execute("INSERT INTO default.dataset_crudo VALUES", data_to_insert)
print(f"[SUCCESS] Inyeccion masiva completada en {time.time() - t2:.2f} segundos.")

# Verificar cantidad final
cantidad_actual = client.execute("SELECT count(*) FROM default.dataset_crudo")[0][0]
print(f"\n[TOTAL] La tabla 'dataset_crudo' local ahora tiene EXACTAMENTE {cantidad_actual} registros nuevos.")
print(f"[SUCCESS] Proceso completo finalizado en {time.time() - t0:.2f} segundos.")
print("[INFO] Ya puedes ejecutar tu script SQL en DBeaver para procesar estos 100,000 registros.")
