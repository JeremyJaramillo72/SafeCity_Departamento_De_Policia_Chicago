from clickhouse_driver import Client

def migrate():
    client = Client(host='clickhouse', port=9000, user='default', password='password12345')
    
    print("Creating new MergeTree table...")
    client.execute('''
        CREATE TABLE IF NOT EXISTS usuario_sistema_new (
            id_usuario UInt32,
            id_oficial UInt32,
            username String,
            password_hash String,
            estado_cuenta String,
            ultimo_acceso DateTime
        ) ENGINE = MergeTree ORDER BY id_usuario
    ''')
    
    print("Copying data...")
    client.execute('INSERT INTO usuario_sistema_new SELECT * FROM usuario_sistema')
    
    print("Renaming tables...")
    client.execute('RENAME TABLE usuario_sistema TO usuario_sistema_old, usuario_sistema_new TO usuario_sistema')
    
    print("Dropping old table...")
    client.execute('DROP TABLE usuario_sistema_old')
    
    print("Migration complete!")

if __name__ == '__main__':
    migrate()
