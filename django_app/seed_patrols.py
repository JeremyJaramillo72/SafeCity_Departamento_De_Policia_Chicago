import os
import json
import datetime
from clickhouse_driver import Client

def seed_patrols():
    print("Connecting to ClickHouse...")
    client = Client(host='127.0.0.1', port=9000, user='default', password='password12345')
    
    print("Truncating turno_patrullaje...")
    try:
        client.execute('TRUNCATE TABLE turno_patrullaje')
    except Exception as e:
        print("Error truncating:", e)
        return

    now = datetime.datetime.now()
    today = now.date()
    yesterday = today - datetime.timedelta(days=1)
    tomorrow = today + datetime.timedelta(days=1)
    
    def time_str(dt):
        return dt.strftime('%H:%M')

    # Realistic Routes in Chicago
    routes = [
        # 1. Downtown Loop (State St)
        [[41.8845, -87.6278], [41.8845, -87.6298], [41.8745, -87.6298], [41.8745, -87.6278]],
        # 2. Michigan Ave
        [[41.8945, -87.6241], [41.8845, -87.6241], [41.8845, -87.6200], [41.8945, -87.6200]],
        # 3. Near North Side
        [[41.9032, -87.6432], [41.9032, -87.6332], [41.8932, -87.6332]],
        # 4. South Loop
        [[41.8600, -87.6250], [41.8600, -87.6350], [41.8500, -87.6350], [41.8500, -87.6250]],
        # 5. West Side
        [[41.8781, -87.6598], [41.8781, -87.6698], [41.8681, -87.6698]],
        # 6. Englewood
        [[41.7796, -87.6534], [41.7796, -87.6434], [41.7696, -87.6434]],
        # 7. Logan Square
        [[41.9288, -87.7063], [41.9288, -87.6963], [41.9188, -87.6963]],
        # 8. Lincoln Park
        [[41.9214, -87.6441], [41.9214, -87.6341], [41.9114, -87.6341]],
    ]

    # Scenarios relative to 'now' - Make ALL of them ACTIVE right now for the video
    
    a1_start = now - datetime.timedelta(minutes=15)
    a1_end = now + datetime.timedelta(hours=4)
    
    a2_start = now - datetime.timedelta(minutes=30)
    a2_end = now + datetime.timedelta(hours=3, minutes=30)
    
    a3_start = now - datetime.timedelta(hours=2)
    a3_end = now + datetime.timedelta(minutes=30)

    a4_start = now - datetime.timedelta(hours=1)
    a4_end = now + datetime.timedelta(hours=2)
    
    a5_start = now - datetime.timedelta(minutes=45)
    a5_end = now + datetime.timedelta(hours=1)

    a6_start = now - datetime.timedelta(minutes=10)
    a6_end = now + datetime.timedelta(hours=5)
    
    a7_start = now - datetime.timedelta(hours=3)
    a7_end = now + datetime.timedelta(hours=5)

    a8_start = now - datetime.timedelta(minutes=2)
    a8_end = now + datetime.timedelta(hours=6)

    data = [
        # id_turno, id_oficial, id_vehiculo, fecha_turno, hora_inicio, hora_fin, ruta_coordenadas, oficiales_adicionales
        # Changed id_vehiculo to 101, 102... to avoid colliding with active emergencies which use 1, 2, 3
        (1, 1, 1, a1_start.date(), time_str(a1_start), time_str(a1_end), json.dumps(routes[0]), [2]),
        (2, 2, 2, a2_start.date(), time_str(a2_start), time_str(a2_end), json.dumps(routes[1]), [11]),
        (3, 4, 3, a3_start.date(), time_str(a3_start), time_str(a3_end), json.dumps(routes[2]), [1]),
        (4, 5, 4, a4_start.date(), time_str(a4_start), time_str(a4_end), json.dumps(routes[3]), []),
        (5, 11, 5, a5_start.date(), time_str(a5_start), time_str(a5_end), json.dumps(routes[4]), []),
        (6, 12, 6, a6_start.date(), time_str(a6_start), time_str(a6_end), json.dumps(routes[5]), [13]),
        (7, 13, 7, a7_start.date(), time_str(a7_start), time_str(a7_end), json.dumps(routes[6]), []),
        (8, 1, 8, a8_start.date(), time_str(a8_start), time_str(a8_end), json.dumps(routes[7]), []),
    ]

    print("Inserting 8 realistic patrol shifts...")
    try:
        client.execute('INSERT INTO turno_patrullaje (id_turno, id_oficial, id_vehiculo, fecha_turno, hora_inicio, hora_fin, ruta_coordenadas, oficiales_adicionales) VALUES', data)
        print("Success!")
    except Exception as e:
        print("Error inserting:", e)

if __name__ == '__main__':
    seed_patrols()
