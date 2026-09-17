import os
import sys
import django
from clickhouse_driver import Client

# Configure Django settings
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from datetime import date, datetime

def seed_transito():
    try:
        client = Client(host='clickhouse', port=9000, user='default', password='password12345')
        
        # Check if role exists
        role_result = client.execute('SELECT id_rol FROM rol_oficial WHERE nombre_rol = %(nombre)s', {'nombre': 'agente_transito'})
        if not role_result:
            print("Inserting role 'agente_transito'...")
            # Assuming id 5 is available
            id_rol = 5
            client.execute('INSERT INTO rol_oficial (id_rol, nombre_rol, descripcion) VALUES', [
                (id_rol, 'agente_transito', 'Agente de Transito con acceso al Modulo 6')
            ])
        else:
            id_rol = role_result[0][0]

        # Insert Officer
        officer_result = client.execute('SELECT id_oficial FROM oficial_policia WHERE placa_policial = %(placa)s', {'placa': 'agente-001'})
        if not officer_result:
            print("Inserting Agente Transito Officer...")
            id_oficial = 5
            client.execute('INSERT INTO oficial_policia (id_oficial, placa_policial, nombres, apellidos, correo_electronico, telefono_contacto, fecha_ingreso, id_rol, url_fotografia) VALUES', [
                (id_oficial, 'agente-001', 'Traffic', 'Agent', 'agente@safecity.gov', '555-0005', date.today(), id_rol, 'https://ui-avatars.com/api/?name=Traffic+Agent&background=00173d&color=ffffff')
            ])
        else:
            id_oficial = officer_result[0][0]

        # Insert User
        user_result = client.execute('SELECT id_usuario FROM usuario_sistema WHERE username = %(username)s', {'username': 'agente-001'})
        if not user_result:
            print("Generating password hash...")
            pwd_hash = make_password('agente123')
            
            print("Inserting Agente Transito User...")
            now = datetime.now()
            id_usuario = 5
            client.execute('INSERT INTO usuario_sistema (id_usuario, id_oficial, username, password_hash, estado_cuenta, ultimo_acceso) VALUES', [
                (id_usuario, id_oficial, 'agente-001', pwd_hash, 'activo', now)
            ])
            print("Agente de transito seeded successfully! Username: agente-001, Password: agente123")
        else:
            print("Agente de transito already exists.")
            
    except Exception as e:
        print(f"Error seeding transito user: {e}")

if __name__ == '__main__':
    seed_transito()
