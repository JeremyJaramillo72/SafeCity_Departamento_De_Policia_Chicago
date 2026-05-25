from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import pandas as pd
import requests
import clickhouse_connect
import os

# 1. la funcion principal que hara todo el trabajo sucio de forma automatica
def ejecutar_migracion_semanal():
    print("iniciando extraccion automatica desde la red interna de docker...")
    
    # el truco de nivel arquitecto: conexion por nombre de servicio en puerto original
    url_base = "http://safecity_pocketbase:8090/api/collections/chicago_crimes/records"
    pagina = 1
    todos_los_crimes = []
    
    # el tope incremental de esta semana
    limite_semanal = 200000
    
    while len(todos_los_crimes) < limite_semanal:
        try:
            respuesta = requests.get(f"{url_base}?page={pagina}&perPage=500")
            data = respuesta.json()
            items = data.get("items", [])
        except Exception as e:
            print(f"error en la conexion http de docker: {e}")
            break
            
        if not items:
            break
            
        todos_los_crimes.extend(items)
        pagina += 1
        
        if len(todos_los_crimes) >= limite_semanal:
            todos_los_crimes = todos_los_crimes[:limite_semanal]
            print("¡tope incremental alcanzado!")
            break

    if not todos_los_crimes:
        print("no hay datos nuevos en pocketbase para procesar.")
        return

    # 2. proceso etl con pandas
    df = pd.DataFrame(todos_los_crimes)
    print(f"registros listos para transformar: {len(df)}")
    
    # tipificado estricto de columnas analiticas
    df['year'] = pd.to_numeric(df['year'], errors='coerce').fillna(0).astype('int32')
    df['latitude'] = pd.to_numeric(df['latitude'], errors='coerce').fillna(0.0).astype('float64')
    df['longitude'] = pd.to_numeric(df['longitude'], errors='coerce').fillna(0.0).astype('float64')
    
    # las columnas del negocio ordenadas
    columnas_finales = ["id", "case_number", "date", "block", "description", "beat", "ward", "community_area", "arrest", "domestic", "year", "latitude", "longitude"]
    df_final = df[columnas_finales]
    
    # guardamos el parquet intermedio dentro del volumen de airflow
    ruta_parquet = "/opt/airflow/dataset/temp/chicago_crimes_semana1.parquet"
    os.makedirs(os.path.dirname(ruta_parquet), exist_ok=True)
    
    print("comprimiendo lote de datos en formato columnar parquet...")
    df_final.to_parquet(ruta_parquet, engine="pyarrow", index=False)
    print("¡archivo parquet intermedio guardado exitosamente!")
    
    # 3. inyeccion directa a la base de datos ClickHouse local
    print("abriendo conexion con clickhouse local...")
    cliente = clickhouse_connect.get_client(
        host='safecity_clickhouse',
        port=8123,
        username='default',
        password='password12345',
        secure=False
    )
    
    print("inyectando lotes de la tabla ancha hacia clickhouse local...")
    cliente.insert_df('default.chicago_crimes', df_final)
    print("¡mision cumplida! el robot ha actualizado clickhouse local de forma automatica.")


# 2. la configuracion general de tu robot (metadatos)
argumentos_por_defecto = {
    'owner': 'luis_jaramillo',
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

# 3. definicion formal del dag (orquestador)
with DAG(
    dag_id='safecity_carga_incremental_semanal',
    default_args=argumentos_por_defecto,
    start_date=datetime(2026, 5, 18),
    schedule_interval='@weekly', # se activa solo una vez a la semana
    catchup=False
) as dag:
    
    # 4. la tarea encargada de disparar la funcion
    tarea_principal = PythonOperator(
        task_id='extraer_y_cargar_clickhouse',
        python_callable=ejecutar_migracion_semanal
    )