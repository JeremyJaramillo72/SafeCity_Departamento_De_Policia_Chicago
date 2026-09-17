from clickhouse_driver import Client

def update_schema():
    client = Client(host='clickhouse', user='default', password='password12345')
    
    print("Creating accidente_transito table...")
    client.execute('''
        CREATE TABLE IF NOT EXISTS accidente_transito (
            id_accidente UUID,
            ubicacion String,
            latitud String,
            longitud String,
            fecha_hora DateTime,
            gravedad String,
            vehiculos_involucrados Int32,
            heridos Int32,
            fallecidos Int32,
            causa_probable String,
            estado String,
            evidencia_url Nullable(String)
        ) ENGINE = MergeTree()
        ORDER BY fecha_hora
    ''')
    print("accidente_transito table created successfully!")

if __name__ == '__main__':
    update_schema()
