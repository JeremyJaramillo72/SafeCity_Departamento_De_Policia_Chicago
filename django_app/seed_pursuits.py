import os
import uuid
import random
from datetime import datetime, timedelta
from clickhouse_driver import Client

def get_clickhouse_client():
    host = os.environ.get('CLICKHOUSE_HOST', 'localhost')
    return Client(host=host, port=9000, user='default', password='password12345')

def seed_pursuits():
    client = get_clickhouse_client()
    
    print("Recreating table persecucion_vehicular...")
    client.execute('DROP TABLE IF EXISTS persecucion_vehicular')
    client.execute('''
        CREATE TABLE persecucion_vehicular (
            id_persecucion UUID,
            id_turno UInt32,
            nivel_prioridad String,
            ruta_escape String,
            estado_persecucion String,
            hora_inicio DateTime,
            hora_fin Nullable(DateTime),
            motivo_conclusion String,
            hubo_danos UInt8,
            ruta_final String,
            revisado_por String,
            fecha_revision Nullable(DateTime)
        ) ENGINE = MergeTree()
        ORDER BY (hora_inicio, id_turno)
    ''')
    
    print("Clearing existing pursuit records...")
    client.execute('TRUNCATE TABLE persecucion_vehicular')
    
    print("Seeding new pursuit records...")
    
    now = datetime.now()
    
    pursuits = [
        # 1. Active pursuit - Critical
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 101,
            'nivel_prioridad': 'Critica',
            'ruta_escape': 'Sospechoso de robo armado evadiendo en moto de cross por callejones del Distrito Central.',
            'estado_persecucion': 'Activa',
            'hora_inicio': now - timedelta(minutes=15),
            'hora_fin': None,
            'motivo_conclusion': '',
            'hubo_danos': 0,
            'ruta_final': '',
            'revisado_por': '',
            'fecha_revision': None
        },
        # 2. Active pursuit - Alta
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 102,
            'nivel_prioridad': 'Alta',
            'ruta_escape': 'Sedán deportivo evadiendo en dirección Este por Interestatal 95 a más de 110 mph.',
            'estado_persecucion': 'Activa',
            'hora_inicio': now - timedelta(minutes=8),
            'hora_fin': None,
            'motivo_conclusion': '',
            'hubo_danos': 0,
            'ruta_final': '',
            'revisado_por': '',
            'fecha_revision': None
        },
        # 3. Active pursuit - Media
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 103,
            'nivel_prioridad': 'Media',
            'ruta_escape': 'SUV negra evadiendo patrulla de tránsito por el Bulevar Costero hacia el Norte.',
            'estado_persecucion': 'Activa',
            'hora_inicio': now - timedelta(minutes=4),
            'hora_fin': None,
            'motivo_conclusion': '',
            'hubo_danos': 0,
            'ruta_final': '',
            'revisado_por': '',
            'fecha_revision': None
        },
        # 4. Finalizada - Alta (Maniobra PIT)
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 104,
            'nivel_prioridad': 'Alta',
            'ruta_escape': 'Camión de carga robado evadiendo control en Autopista Sur.',
            'estado_persecucion': 'Finalizada',
            'hora_inicio': now - timedelta(hours=2),
            'hora_fin': now - timedelta(hours=1, minutes=45),
            'motivo_conclusion': 'Maniobra PIT Exitosa',
            'hubo_danos': 1,
            'ruta_final': 'Salida 42, Autopista Sur',
            'revisado_por': 'Richard Stevens',
            'fecha_revision': now - timedelta(hours=1, minutes=30)
        },
        # 5. Finalizada - Media (Spike Strips)
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 105,
            'nivel_prioridad': 'Media',
            'ruta_escape': 'Sedán familiar con reporte de robo evadiendo por avenidas principales del centro.',
            'estado_persecucion': 'Finalizada',
            'hora_inicio': now - timedelta(hours=4),
            'hora_fin': now - timedelta(hours=3, minutes=40),
            'motivo_conclusion': 'Detención con Barrera de Clavos',
            'hubo_danos': 1,
            'ruta_final': 'Avenida Juárez e Intersección Calle 8',
            'revisado_por': 'Richard Stevens',
            'fecha_revision': now - timedelta(hours=3)
        },
        # 6. Finalizada - Baja (Abandoned)
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 106,
            'nivel_prioridad': 'Baja',
            'ruta_escape': 'Motocicleta evadiendo patrullero tras infracción de velocidad en Calle 5.',
            'estado_persecucion': 'Finalizada',
            'hora_inicio': now - timedelta(hours=6),
            'hora_fin': now - timedelta(hours=5, minutes=50),
            'motivo_conclusion': 'Vehículo Abandonado / Huida a pie',
            'hubo_danos': 0,
            'ruta_final': 'Callejón sin salida del Distrito Industrial',
            'revisado_por': 'Richard Stevens',
            'fecha_revision': now - timedelta(hours=5, minutes=10)
        },
        # 7. Finalizada - Media (Voluntary stop)
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 107,
            'nivel_prioridad': 'Media',
            'ruta_escape': 'Pick-up blanca evadiendo patrulla en Sector Agrícola.',
            'estado_persecucion': 'Finalizada',
            'hora_inicio': now - timedelta(hours=12),
            'hora_fin': now - timedelta(hours=11, minutes=35),
            'motivo_conclusion': 'Sospechoso se detuvo voluntariamente',
            'hubo_danos': 0,
            'ruta_final': 'Camino vecinal de tierra, Km 12',
            'revisado_por': 'Richard Stevens',
            'fecha_revision': now - timedelta(hours=11)
        },
        # 8. Finalizada - Critica (Crash)
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 108,
            'nivel_prioridad': 'Critica',
            'ruta_escape': 'Vehículo sospechoso de participar en tiroteo evadiendo unidades en zona residencial.',
            'estado_persecucion': 'Finalizada',
            'hora_inicio': now - timedelta(days=1),
            'hora_fin': now - timedelta(days=1) + timedelta(minutes=12),
            'motivo_conclusion': 'Colisión con objeto fijo (poste de luz)',
            'hubo_danos': 1,
            'ruta_final': 'Avenida Libertad #450',
            'revisado_por': 'Richard Stevens',
            'fecha_revision': now - timedelta(days=1) + timedelta(hours=1)
        },
        # 9. Finalizada - Baja (Lost visual contact)
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 109,
            'nivel_prioridad': 'Baja',
            'ruta_escape': 'Minivan sospechosa evadiendo patrulla de cuadrante a baja velocidad.',
            'estado_persecucion': 'Finalizada',
            'hora_inicio': now - timedelta(days=1, hours=3),
            'hora_fin': now - timedelta(days=1, hours=2, minutes=45),
            'motivo_conclusion': 'Pérdida de contacto visual por seguridad escolar',
            'hubo_danos': 0,
            'ruta_final': 'Perímetro de la Escuela Primaria Westside',
            'revisado_por': 'Richard Stevens',
            'fecha_revision': now - timedelta(days=1, hours=2)
        },
        # 10. Finalizada - Alta (Tactical box)
        {
            'id_persecucion': uuid.uuid4(),
            'id_turno': 110,
            'nivel_prioridad': 'Alta',
            'ruta_escape': 'Sedán evadiendo múltiples patrullas por el anillo periférico hacia el Sur.',
            'estado_persecucion': 'Finalizada',
            'hora_inicio': now - timedelta(days=2),
            'hora_fin': now - timedelta(days=2) + timedelta(minutes=25),
            'motivo_conclusion': 'Encajonamiento táctico exitoso',
            'hubo_danos': 0,
            'ruta_final': 'Paso elevado del Distribuidor Vial Sur',
            'revisado_por': 'Richard Stevens',
            'fecha_revision': now - timedelta(days=2) + timedelta(hours=2)
        }
    ]
    
    rows = [
        (
            p['id_persecucion'],
            p['id_turno'],
            p['nivel_prioridad'],
            p['ruta_escape'],
            p['estado_persecucion'],
            p['hora_inicio'],
            p['hora_fin'],
            p['motivo_conclusion'],
            p['hubo_danos'],
            p['ruta_final'],
            p['revisado_por'],
            p['fecha_revision']
        )
        for p in pursuits
    ]
    
    client.execute(
        '''INSERT INTO persecucion_vehicular 
           (id_persecucion, id_turno, nivel_prioridad, ruta_escape, estado_persecucion, hora_inicio, hora_fin, motivo_conclusion, hubo_danos, ruta_final, revisado_por, fecha_revision) 
           VALUES''',
        rows
    )
    print(f"Successfully seeded {len(rows)} pursuit records.")

if __name__ == '__main__':
    seed_pursuits()
