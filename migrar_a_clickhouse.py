import requests
import pandas as pd
import clickhouse_connect

print("iniciando extraccion controlada desde pocketbase...")
url_base = "http://127.0.0.1:8091/api/collections/chicago_crimes/records"
pagina = 1
todos_los_crimes = []

limite_semanal = 200000

while len(todos_los_crimes) < limite_semanal:
    respuesta = requests.get(f"{url_base}?page={pagina}&perPage=500")
    data = respuesta.json()
    items = data.get("items", [])
    
    if not items:
        break
        
    todos_los_crimes.extend(items)
    
    if pagina % 40 == 0:
        print(f"-> progreso de extraccion: {len(todos_los_crimes)} / {limite_semanal} crimenes...")
        
    pagina += 1
    
    if len(todos_los_crimes) >= limite_semanal:
        todos_los_crimes = todos_los_crimes[:limite_semanal]
        print("¡limite semanal alcanzado! deteniendo extraccion...")
        break

df = pd.DataFrame(todos_los_crimes)
print(f"extraccion finalizada. total de registros: {len(df)}")

# -------------------------------------------------------------------
# 2. ELT PURO: Asegurar columnas y convertir TODO a String
# -------------------------------------------------------------------
ruta_parquet = "dataset/temp/chicago_crimes_semana1.parquet"

print("blindando el dataframe para clickhouse (modo texto puro)...")

# Estas son exactamente las 22 columnas que tienes en tu foto de ClickHouse
columnas_clickhouse = [
    "id", "case_number", "date", "block", "iucr", "primary_type", 
    "description", "location_description", "arrest", "domestic", 
    "beat", "district", "ward", "community_area", "fbi_code", 
    "x_coordinate", "y_coordinate", "year", "updated_on", 
    "latitude", "longitude", "location"
]

# 1. Si PocketBase no mandó alguna columna (porque estaba vacía), la creamos nosotros
for col in columnas_clickhouse:
    if col not in df.columns:
        df[col] = ""

# 2. Filtramos solo las columnas que importan, llenamos los vacíos y lo pasamos todo a String
df_final = df[columnas_clickhouse].fillna("").astype(str)

print("guardando dataset en archivo binario parquet...")
df_final.to_parquet(ruta_parquet, engine="pyarrow", index=False)
print(f"¡archivo parquet generado con exito!")

# -------------------------------------------------------------------
# 3. Inyeccion a ClickHouse
# -------------------------------------------------------------------
print("leyendo el archivo parquet local...")
df_carga = pd.read_parquet(ruta_parquet)

print("abriendo conexion con clickhouse local...")
cliente = clickhouse_connect.get_client(
    host='localhost',
    port=8123,
    username='default',
    password='password12345', 
    secure=False
)

print("inyectando lote semanal en la tabla cruda...")
cliente.insert_df('default.dataset_crudo', df_carga)
print("¡operacion nivel senior exitosa! la data ya esta en clickhouse local.")