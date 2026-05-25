from clickhouse_driver import Client
import random
from datetime import date

client = Client(
    host='localhost',
    port=9000,
    user='default',
    password='password12345',
    secure=False
)


def seed_data():
    print("Seeding ClickHouse Logistics tables...")

    client.execute("TRUNCATE TABLE IF EXISTS vehiculo_patrulla")
    client.execute("TRUNCATE TABLE IF EXISTS oficial_policia")
    client.execute("TRUNCATE TABLE IF EXISTS equipamiento_oficial")
    client.execute("TRUNCATE TABLE IF EXISTS turno_patrullaje")

    oficiales = [
        (1, "1001", "John", "Doe", "jdoe@cpd.gov", "555-0101", date(2015, 5, 20), 1, ""),
        (2, "1002", "Jane", "Smith", "jsmith@cpd.gov", "555-0102", date(2018, 8, 15), 1, ""),
        (3, "1003", "Robert", "Johnson", "rjohnson@cpd.gov", "555-0103", date(2010, 1, 10), 2, ""),
        (4, "1004", "Emily", "Davis", "edavis@cpd.gov", "555-0104", date(2020, 11, 1), 1, ""),
        (5, "1005", "Michael", "Miller", "mmiller@cpd.gov", "555-0105", date(2012, 3, 22), 1, ""),
        (6, "1006", "Sarah", "Wilson", "swilson@cpd.gov", "555-0106", date(2019, 7, 30), 1, ""),
        (7, "1007", "David", "Moore", "dmoore@cpd.gov", "555-0107", date(2014, 9, 12), 2, ""),
        (8, "1008", "Laura", "Taylor", "ltaylor@cpd.gov", "555-0108", date(2021, 2, 18), 1, ""),
        (9, "1009", "James", "Anderson", "janderson@cpd.gov", "555-0109", date(2016, 6, 5), 1, ""),
        (10, "1010", "Jessica", "Thomas", "jthomas@cpd.gov", "555-0110", date(2017, 10, 25), 1, "")
    ]
    client.execute("INSERT INTO oficial_policia (id_oficial, placa_policial, nombres, apellidos, correo_electronico, telefono_contacto, fecha_ingreso, id_rol, url_fotografia) VALUES", oficiales)
    print(f"Inserted {len(oficiales)} oficiales.")

    vehiculos = [
        (1, "B-101", "CPD-001", "SUV Patrol", "operativo"),
        (2, "B-102", "CPD-002", "Sedan", "operativo"),
        (3, "B-103", "CPD-003", "SUV Patrol", "mantenimiento"),
        (4, "B-104", "CPD-004", "Sedan", "operativo"),
        (5, "B-105", "CPD-005", "Transport Van", "operativo"),
        (6, "B-201", "CPD-006", "SUV Patrol", "operativo"),
        (7, "B-202", "CPD-007", "Sedan", "mantenimiento"),
        (8, "B-203", "CPD-008", "SUV Patrol", "operativo"),
        (9, "B-204", "CPD-009", "K9 Unit", "operativo"),
        (10, "B-205", "CPD-010", "Sedan", "operativo"),
        (11, "B-301", "CPD-011", "SUV Patrol", "mantenimiento"),
        (12, "B-302", "CPD-012", "Sedan", "operativo"),
        (13, "B-303", "CPD-013", "Armored", "operativo"),
        (14, "B-304", "CPD-014", "SUV Patrol", "operativo"),
        (15, "B-305", "CPD-015", "Sedan", "mantenimiento")
    ]
    client.execute("INSERT INTO vehiculo_patrulla (id_vehiculo, codigo_beat, placa_vehiculo, tipo_vehiculo, estado_mantenimiento) VALUES", vehiculos)
    print(f"Inserted {len(vehiculos)} vehiculos.")

    equipamiento = []
    for i in range(1, 21):
        estado = "operativo" if random.random() > 0.15 else "dañado"
        tipo = random.choice(["Radio", "Taser", "Body Cam", "Laptop"])
        equipamiento.append((i, random.randint(1, 10), tipo, f"SN-{1000+i}", date(2023, 1, 1), estado))
    client.execute("INSERT INTO equipamiento_oficial (id_equipo, id_oficial, tipo_equipo, numero_serie, fecha_asignacion, estado) VALUES", equipamiento)
    print(f"Inserted {len(equipamiento)} equipamientos.")

    turnos = [
        (1, 1, 1, date(2026, 5, 19), "08:00", "16:00"),
        (2, 2, 2, date(2026, 5, 19), "08:00", "16:00"),
        (3, 4, 4, date(2026, 5, 19), "08:00", "16:00"),
        (4, 6, 6, date(2026, 5, 19), "16:00", "00:00"),
        (5, 8, 8, date(2026, 5, 19), "16:00", "00:00"),
    ]
    client.execute("INSERT INTO turno_patrullaje (id_turno, id_oficial, id_vehiculo, fecha_turno, hora_inicio, hora_fin) VALUES", turnos)
    print(f"Inserted {len(turnos)} turnos.")

    print("Seeding complete!")

if __name__ == "__main__":
    seed_data()
