import pandas as pd
import sqlite3
import random
import string
from datetime import datetime, timezone

# 1. configuracion
ruta_csv = 'dataset/chicago_crimes.csv'
ruta_db = 'datos_nuevos_pb/data.db'
limite_datos = 1600000

print(f"leyendo el csv y limitando a {limite_datos} filas...")
df = pd.read_csv(ruta_csv, dtype=str).head(limite_datos)

format_origen = '%m/%d/%Y %I:%M:%S %p'

print("traduciendo fechas al formato de pocketbase...")
df['date'] = pd.to_datetime(df['date'], format=format_origen, errors='coerce').dt.strftime('%Y-%m-%d %H:%M:%S.000Z')
df['updated_on'] = pd.to_datetime(df['updated_on'], format=format_origen, errors='coerce').dt.strftime('%Y-%m-%d %H:%M:%S.000Z')

def pb_str(valor):
    if pd.isna(valor) or valor is None or str(valor).strip() in ['nan', 'None', '']:
        return ""
    return str(valor).strip()

def pb_coord(valor):
    v = pb_str(valor)
    return v.replace(',', '.') if v != "" else ""

def pb_int(valor):
    v = pb_str(valor)
    try: return str(int(float(v))) if v != "" else ""
    except: return ""

def pb_bool(valor):
    return '1' if pb_str(valor).lower() == 'true' else '0'

def generar_id():
    caracteres = string.ascii_lowercase + string.digits
    return ''.join(random.choice(caracteres) for _ in range(15))

def tiempo_actual():
    return datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S.000Z')

print("empaquetando millones de datos en memoria...")
datos_para_sqlite = []

for _, fila in df.iterrows():
    datos_para_sqlite.append((
        generar_id(), 
        tiempo_actual(), 
        tiempo_actual(), 
        pb_str(fila.get('case_number')),
        pb_str(fila.get('date')),
        pb_str(fila.get('block')),
        pb_str(fila.get('iucr')),
        pb_str(fila.get('primary_type')),
        pb_str(fila.get('description')),
        pb_str(fila.get('location_description')),
        pb_bool(fila.get('arrest')), 
        pb_bool(fila.get('domestic')),
        pb_str(fila.get('beat')),
        pb_str(fila.get('district')),
        pb_str(fila.get('ward')),
        pb_str(fila.get('community_area')),
        pb_str(fila.get('fbi_code')),
        pb_coord(fila.get('x_coordinate')),
        pb_coord(fila.get('y_coordinate')),
        pb_int(fila.get('year')),
        pb_str(fila.get('updated_on')),
        pb_coord(fila.get('latitude')),
        pb_coord(fila.get('longitude'))
    ))

print(f"preparando inyeccion a la vena de {len(datos_para_sqlite)} registros...")

try:
    conexion = sqlite3.connect(ruta_db)
    cursor = conexion.cursor()
    
    print("limpiando registros anteriores...")
    cursor.execute("delete from chicago_crimes")
    
    query = """
        insert into chicago_crimes (
            id, created, updated, case_number, date, block, iucr, primary_type, 
            description, location_description, arrest, domestic, beat, district, 
            ward, community_area, fbi_code, x_coordinate, y_coordinate, year, 
            updated_on, latitude, longitude
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    # la solucion de arquitecto: inyectar en lotes (chunks)
    tamano_lote = 200000
    total_insertados = 0
    
    print("inyectando base de datos por lotes para proteger el disco...")
    for i in range(0, len(datos_para_sqlite), tamano_lote):
        lote = datos_para_sqlite[i:i + tamano_lote]
        cursor.executemany(query, lote)
        conexion.commit() # guardamos cada lote para darle un respiro al disco duro
        total_insertados += len(lote)
        print(f"-> {total_insertados} registros asegurados en disco...")
        
    print("¡boom! migracion colosal terminada con exito sin colapsar el hardware.")

except Exception as e:
    print(f"error en la base de datos: {e}")
finally:
    conexion.close()