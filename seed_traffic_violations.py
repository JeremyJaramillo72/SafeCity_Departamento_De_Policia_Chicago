import os
import uuid
from datetime import datetime, timedelta
import random
from clickhouse_driver import Client

def seed_traffic_violations():
    # Connect to ClickHouse
    try:
        host = os.environ.get('CLICKHOUSE_HOST', 'localhost')
        client = Client(host=host, port=9000, user='default', password='password12345')
        print(f"Connected to ClickHouse at {host}.")

        leyes = ['EXCESO_VELOCIDAD', 'CONDUCCION_TEMERARIA', 'DUI', 'PASAR_SEMAFORO_ROJO', 'SIN_LICENCIA']
        nombres = ['Juan Perez', 'Maria Garcia', 'Carlos Lopez', 'Ana Martinez', 'Luis Rodriguez']
        placas = ['ABC-1234', 'XYZ-9876', 'LMN-4567', 'PQR-1122', 'TYU-9988']

        records_to_insert = []
        for i in range(5):
            id_infraccion = str(uuid.uuid4())
            id_oficial = 1
            ubicacion = f"{random.randint(100, 999)} W Chicago Ave, Chicago, IL"
            latitude = str(41.896 + random.uniform(-0.05, 0.05))
            longitude = str(-87.629 + random.uniform(-0.05, 0.05))
            fecha_hora = datetime.now() - timedelta(days=random.randint(0, 10))
            ley_transito = random.choice(leyes)
            monto_multa = float(random.randint(100, 500))
            nivel_bac = 0.0 if ley_transito != 'DUI' else random.uniform(0.08, 0.20)
            limite_velocidad = 35 if ley_transito == 'EXCESO_VELOCIDAD' else 0
            velocidad_registrada = random.randint(50, 80) if ley_transito == 'EXCESO_VELOCIDAD' else 0
            placa_vehiculo = placas[i]
            estado_placa = 'IL'
            marca_vehiculo = random.choice(['Toyota', 'Ford', 'Honda', 'Chevrolet'])
            modelo_vehiculo = random.choice(['Corolla', 'F-150', 'Civic', 'Cruze'])
            anio_vehiculo = random.randint(2010, 2023)
            color_vehiculo = random.choice(['Blanco', 'Negro', 'Gris', 'Rojo'])
            licencia_conductor = f"{random.randint(10000000, 99999999)}"
            estado_licencia = 'IL'
            nombre_conductor = nombres[i]
            direccion_conductor = "123 Main St, Chicago, IL"
            fecha_nacimiento = "1990-01-01"
            condiciones_climaticas = 'DESPEJADO'
            condiciones_trafico = 'MODERADO'
            comentarios = "Infractor cooperativo."

            records_to_insert.append((
                id_infraccion, id_oficial, ubicacion, latitude, longitude, fecha_hora, ley_transito, 
                monto_multa, nivel_bac, limite_velocidad, velocidad_registrada, placa_vehiculo, 
                estado_placa, marca_vehiculo, modelo_vehiculo, anio_vehiculo, color_vehiculo, 
                licencia_conductor, estado_licencia, nombre_conductor, direccion_conductor, 
                fecha_nacimiento, condiciones_climaticas, condiciones_trafico, comentarios
            ))

        client.execute(
            'INSERT INTO infraccion_transito (id_infraccion, id_oficial, ubicacion, latitude, longitude, fecha_hora, ley_transito, monto_multa, nivel_bac, limite_velocidad, velocidad_registrada, placa_vehiculo, estado_placa, marca_vehiculo, modelo_vehiculo, anio_vehiculo, color_vehiculo, licencia_conductor, estado_licencia, nombre_conductor, direccion_conductor, fecha_nacimiento, condiciones_climaticas, condiciones_trafico, comentarios) VALUES',
            records_to_insert
        )
        print("Inserted 5 fake traffic violations!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    seed_traffic_violations()
