import os
import sys
import django
from clickhouse_driver import Client

# Configure Django settings so we can use make_password
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
django.setup()

from django.contrib.auth.hashers import make_password

def setup_clickhouse():
    # Connect to ClickHouse. Assumes default credentials on localhost:9000
    try:
        client = Client(host='localhost', port=9000, user='safecity', password='safecity123')
        
        # 1. Create tables if they don't exist
        print("Creating tables...")
        client.execute('DROP TABLE IF EXISTS rol_oficial')
        client.execute('''
            CREATE TABLE IF NOT EXISTS rol_oficial (
                id_rol UInt32,
                nombre_rol String,
                descripcion String
            ) ENGINE = Log
        ''')

        client.execute('DROP TABLE IF EXISTS oficial_policia')
        client.execute('''
            CREATE TABLE IF NOT EXISTS oficial_policia (
                id_oficial UInt32,
                placa_policial String,
                nombres String,
                apellidos String,
                correo_electronico String,
                telefono_contacto String,
                fecha_ingreso Date,
                id_rol UInt32,
                url_fotografia String
            ) ENGINE = Log
        ''')

        client.execute('DROP TABLE IF EXISTS usuario_sistema')
        client.execute('''
            CREATE TABLE IF NOT EXISTS usuario_sistema (
                id_usuario UInt32,
                id_oficial UInt32,
                username String,
                password_hash String,
                estado_cuenta String,
                ultimo_acceso DateTime
            ) ENGINE = Log
        ''')

        # 2. Insert Roles
        print("Inserting Roles...")
        client.execute('TRUNCATE TABLE rol_oficial')
        client.execute('INSERT INTO rol_oficial (id_rol, nombre_rol, descripcion) VALUES', [
            (1, 'administrador', 'comandante con acceso a global command y analitica'),
            (2, 'oficial', 'oficial de patrulla con acceso a tactical map y reportes')
        ])

        # 3. Insert Officers
        print("Inserting Officers...")
        client.execute('TRUNCATE TABLE oficial_policia')
        from datetime import date
        client.execute('INSERT INTO oficial_policia (id_oficial, placa_policial, nombres, apellidos, correo_electronico, telefono_contacto, fecha_ingreso, id_rol, url_fotografia) VALUES', [
            (1, 'sc-0001', 'richard', 'stevens', 'rstevens@safecity.gov', '555-0101', date(2026, 5, 19), 1, '/assets/avatars/cmdte_stevens.jpg'),
            (2, 'sc-7482', 'john', 'doe', 'jdoe@safecity.gov', '555-0202', date(2026, 5, 19), 2, '/assets/avatars/ofc_doe.jpg')
        ])

        # 4. Insert Users with Django password hashes
        # We use 'password123' as the default password for both accounts
        print("Generating password hashes...")
        pwd_hash = make_password('password123')
        
        print("Inserting Users...")
        client.execute('TRUNCATE TABLE usuario_sistema')
        # ultimo_acceso requires datetime object in clickhouse-driver
        from datetime import datetime
        now = datetime.now()
        
        client.execute('INSERT INTO usuario_sistema (id_usuario, id_oficial, username, password_hash, estado_cuenta, ultimo_acceso) VALUES', [
            (1, 1, 'sc-0001', pwd_hash, 'activo', now),
            (2, 2, 'sc-7482', pwd_hash, 'activo', now)
        ])

        print("ClickHouse database setup successfully! Default password for both users is: password123")
    except Exception as e:
        print(f"Error setting up ClickHouse: {e}")
        print("Make sure ClickHouse is running on localhost:9000.")

if __name__ == '__main__':
    setup_clickhouse()
