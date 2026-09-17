import os
import sys
import django
from clickhouse_driver import Client

# Configure Django settings so we can use make_password
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from datetime import date, datetime

def seed_admin():
    try:
        client = Client(host='localhost', port=9000, user='default', password='password12345')
        
        # Insert Role
        print("Inserting role 'administrador_sistema'...")
        client.execute('INSERT INTO rol_oficial (id_rol, nombre_rol, descripcion) VALUES', [
            (4, 'administrador_sistema', 'Administrador global del sistema con acceso total')
        ])

        # Insert Officer
        print("Inserting Admin Officer...")
        client.execute('INSERT INTO oficial_policia (id_oficial, placa_policial, nombres, apellidos, correo_electronico, telefono_contacto, fecha_ingreso, id_rol, url_fotografia) VALUES', [
            (4, 'admin-001', 'Admin', 'Sistema', 'admin@safecity.gov', '555-0000', date.today(), 4, 'https://ui-avatars.com/api/?name=Admin+Sistema&background=00173d&color=ffffff')
        ])

        # Insert User
        print("Generating password hash...")
        pwd_hash = make_password('admin123')
        
        print("Inserting Admin User...")
        now = datetime.now()
        client.execute('INSERT INTO usuario_sistema (id_usuario, id_oficial, username, password_hash, estado_cuenta, ultimo_acceso) VALUES', [
            (4, 4, 'admin-001', pwd_hash, 'activo', now)
        ])

        print("System Admin seeded successfully! Username: admin-001, Password: admin123")
    except Exception as e:
        print(f"Error seeding admin: {e}")

if __name__ == '__main__':
    seed_admin()
