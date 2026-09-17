from clickhouse_driver import Client
from datetime import datetime, timedelta

def populate():
    client = Client(host='clickhouse', port=9000, user='default', password='password12345')
    
    # 1. Ingreso Custodia
    print("Populating ingreso_custodia...")
    now = datetime.now()
    
    custodia_data = [
        ('B-001', 'Marcus Vance', 'Blade', datetime(1995, 5, 12), 'Masculino', 'Estadounidense', 'G149281', 'Robo a Mano Armada', 'Delito Grave', 182, 85, 'Tatuaje de navaja en brazo derecho', 'C-104', 'Estable', 'Sobrio', '{"celular": "iPhone 12", "dinero": 150}', 150.0, 106, now - timedelta(days=2), None, 'Activa', ''),
        ('B-002', 'Darnell Jackson', 'Shadow', datetime(1998, 8, 22), 'Masculino', 'Estadounidense', 'G149282', 'Asalto', 'Delito Grave', 175, 78, 'Cicatriz en mejilla', 'C-105', 'Herida leve', 'Bajo influencia', '{"llaves": "casa", "dinero": 45}', 45.0, 107, now - timedelta(days=1), now - timedelta(hours=2), 'Liberado', 'Falta de pruebas firmes'),
        ('B-003', 'Carlos Mendoza', 'El Toro', datetime(1985, 3, 10), 'Masculino', 'Mexicano', 'G149283', 'Posesión de Drogas', 'Delito Menor', 170, 90, '', 'C-201', 'Estable', 'Sobrio', '{"reloj": "Casio", "dinero": 200}', 200.0, 108, now - timedelta(hours=5), None, 'Activa', '')
    ]
    
    try:
        client.execute('INSERT INTO ingreso_custodia (id_ingreso, nombre_detenido, alias, fecha_nacimiento, genero, nacionalidad, id_incidente_asociado, cargo_principal, gravedad_cargo, estatura, peso, senas_particulares, numero_celda, estado_salud, nivel_intoxicacion, articulos_retenidos, dinero_retenido, id_sospechoso, hora_ingreso, hora_salida, custodia_estado, motivo_salida) VALUES', custodia_data)
        print("Inserted into ingreso_custodia")
    except Exception as e:
        print("Error ingreso_custodia:", e)
        
    # 2. Reporte Fuerza
    print("Populating reporte_fuerza...")
    fuerza_data = [
        ('F-001', 'G149281', 'Taser Discharged', 'Resistencia agresiva durante arresto en robo', 'X26-10294A', now - timedelta(days=2), 1, 'Detective'),
        ('F-002', 'G149284', 'Physical Restraint', 'Sospechoso intentó huir a pie, derribado', '', now - timedelta(days=1), 2, 'Oficial Martinez'),
        ('F-003', 'G149285', 'Taser Discharged', 'Individuo amenazaba con arma blanca', 'X26-99382B', now - timedelta(hours=10), 1, 'Detective')
    ]
    
    try:
        client.execute('INSERT INTO reporte_fuerza (id_reporte_fuerza, case_number, tipo_fuerza, justificacion, numero_serie_taser, fecha_reporte, id_oficial, oficial_nombre) VALUES', fuerza_data)
        print("Inserted into reporte_fuerza")
    except Exception as e:
        print("Error reporte_fuerza:", e)

    # Let's populate vehiculo_policial if empty
    res = client.execute("SELECT count() FROM vehiculo_policial")
    if res[0][0] == 0:
        print("Populating vehiculo_policial...")
        vehiculos = [
            (1, 'Patrulla', 'Ford', 'Explorer', 2021, 'CPD-101', 'En Servicio', now, 41.8781, -87.6298, 1, 'Sector A'),
            (2, 'SUV', 'Chevrolet', 'Tahoe', 2022, 'CPD-205', 'Mantenimiento', now, 41.8827, -87.6233, 2, 'Sector B'),
            (3, 'Moto', 'Harley Davidson', 'Electra Glide', 2020, 'CPD-M01', 'En Servicio', now, 41.8756, -87.6244, 3, 'Sector C')
        ]
        try:
            client.execute('INSERT INTO vehiculo_policial (id_vehiculo, tipo_vehiculo, marca, modelo, anio, matricula, estado, ultima_actualizacion_gps, latitud_actual, longitud_actual, id_oficial_asignado, sector_asignado) VALUES', vehiculos)
        except Exception as e:
            print("Error vehiculo_policial:", e)

if __name__ == '__main__':
    populate()
