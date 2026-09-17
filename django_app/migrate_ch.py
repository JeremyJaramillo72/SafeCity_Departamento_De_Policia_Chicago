from clickhouse_driver import Client

client = Client(host='clickhouse', user='default', password='password12345')

# 1. Fetch data
rows = client.execute('SELECT * FROM rrhh_bolo')

# 2. Drop table
client.execute('DROP TABLE rrhh_bolo')

# 3. Create table
create_stmt = '''
CREATE TABLE default.rrhh_bolo
(
    id String,
    tipo String,
    titulo String,
    descripcion String,
    nivel_riesgo String,
    fecha_expiracion DateTime,
    estado String DEFAULT 'Activa',
    foto_url Nullable(String),
    id_referencia Nullable(String),
    creado_por String,
    timestamp DateTime DEFAULT now()
)
ENGINE = MergeTree
ORDER BY (timestamp, id)
'''
client.execute(create_stmt)

# 4. Insert data
if rows:
    insert_stmt = '''
    INSERT INTO rrhh_bolo (id, tipo, titulo, descripcion, nivel_riesgo, fecha_expiracion, estado, foto_url, id_referencia, creado_por, timestamp)
    VALUES
    '''
    client.execute(insert_stmt, rows)

print("Migration completed successfully!")
