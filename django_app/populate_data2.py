from clickhouse_driver import Client
from datetime import datetime, timedelta

def populate():
    client = Client(host='clickhouse', port=9000, user='default', password='password12345')
    now = datetime.now()
    
    # 1. Ingreso Celda (Booking)
    print("Populating ingreso_celda...")
    
    # id_ingreso, id_oficial, nombre_detenido, alias, fecha_nacimiento, genero, nacionalidad, id_incidente_asociado, cargo_principal, gravedad_cargo, estatura, peso, senas_particulares, numero_celda, estado_salud, nivel_intoxicacion, articulos_retenidos, dinero_retenido, custodia_estado, hora_ingreso, hora_salida, id_sospechoso, motivo_salida
    celda_data = [
        ('B-001', 1, 'Marcus Vance', 'Blade', '1995-05-12', 'Masculino', 'Estadounidense', 'G149281', 'Robo a Mano Armada', 'Delito Grave', 182, 85, 'Tatuaje en brazo', 'C-104', 'Estable', 'Sobrio', '{"celular": "iPhone"}', 150.0, 'Activa', now - timedelta(days=2), None, 106, ''),
        ('B-002', 1, 'Darnell Jackson', 'Shadow', '1998-08-22', 'Masculino', 'Estadounidense', 'G149282', 'Asalto', 'Delito Grave', 175, 78, 'Cicatriz en mejilla', 'C-105', 'Herida leve', 'Bajo influencia', '{"llaves": "casa"}', 45.0, 'Liberado', now - timedelta(days=1), now - timedelta(hours=2), 107, 'Falta de pruebas'),
        ('B-003', 2, 'Carlos Mendoza', 'El Toro', '1985-03-10', 'Masculino', 'Mexicano', 'G149283', 'Posesión', 'Delito Menor', 170, 90, '', 'C-201', 'Estable', 'Sobrio', '{"reloj": "Casio"}', 200.0, 'Activa', now - timedelta(hours=5), None, 108, '')
    ]
    
    try:
        client.execute('INSERT INTO ingreso_celda (id_ingreso, id_oficial, nombre_detenido, alias, fecha_nacimiento, genero, nacionalidad, id_incidente_asociado, cargo_principal, gravedad_cargo, estatura, peso, senas_particulares, numero_celda, estado_salud, nivel_intoxicacion, articulos_retenidos, dinero_retenido, custodia_estado, hora_ingreso, hora_salida, id_sospechoso, motivo_salida) VALUES', celda_data)
        print("Inserted into ingreso_celda")
    except Exception as e:
        print("Error ingreso_celda:", e)
        
    # 2. Descarga Taser (Force Report)
    print("Populating descarga_taser...")
    # id_descarga String, id_oficial UInt32, id_incidente String, serial_taser String, justificacion String, fecha_hora DateTime
    taser_data = [
        ('T-001', 1, 'G149281', 'X26-10294A', 'Resistencia agresiva durante arresto en robo', now - timedelta(days=2)),
        ('T-002', 2, 'G149284', 'X26-55411B', 'Individuo amenazaba con arma blanca a civiles', now - timedelta(hours=10)),
        ('T-003', 1, 'G149285', 'X26-99382C', 'Sospechoso intentó atacar al oficial', now - timedelta(days=1))
    ]
    
    try:
        client.execute('INSERT INTO descarga_taser (id_descarga, id_oficial, id_incidente, serial_taser, justificacion, fecha_hora) VALUES', taser_data)
        print("Inserted into descarga_taser")
    except Exception as e:
        print("Error descarga_taser:", e)

    # Let's populate vehiculo_policial and maintenance if empty
    print("Populating vehicle_fleet...")
    # Fields: id_vehiculo String, marca String, modelo String, anio Int32, tipo String, estado String, id_oficial_asignado UInt32, sector_asignado String, notas String, last_gps_lat Float32, last_gps_lng Float32, last_gps_update DateTime
    res = client.execute("SELECT count() FROM vehicle_fleet")
    if res[0][0] == 0:
        vehiculos = [
            ('V-101', 'Ford', 'Explorer', 2021, 'Patrulla', 'En Servicio', 1, 'Sector A', 'Vehículo principal', 41.8781, -87.6298, now),
            ('V-205', 'Chevrolet', 'Tahoe', 2022, 'SUV', 'Mantenimiento', 2, 'Sector B', 'Falla de motor', 41.8827, -87.6233, now),
            ('M-001', 'Harley Davidson', 'Electra Glide', 2020, 'Motocicleta', 'En Servicio', 3, 'Sector C', '', 41.8756, -87.6244, now)
        ]
        try:
            client.execute('INSERT INTO vehicle_fleet (id_vehiculo, marca, modelo, anio, tipo, estado, id_oficial_asignado, sector_asignado, notas, last_gps_lat, last_gps_lng, last_gps_update) VALUES', vehiculos)
            print("Inserted into vehicle_fleet")
        except Exception as e:
            print("Error vehicle_fleet:", e)

if __name__ == '__main__':
    populate()
