from clickhouse_driver import Client
import uuid
import random
from datetime import date

client = Client(
    host='localhost',
    port=9000,
    user='default',
    password='password12345',
    secure=False
)

client.execute("CREATE TABLE IF NOT EXISTS vehicle_fleet (id String, placa String, marca_modelo String, estado String, fecha_adquisicion Date) ENGINE = MergeTree() ORDER BY id")

vehiculos = [
    (str(uuid.uuid4())[:8], "CPD-001", "Ford Explorer Police Interceptor", "OPERATIVO", date(2021, 5, 10)),
    (str(uuid.uuid4())[:8], "CPD-002", "Chevrolet Tahoe PPV", "OPERATIVO", date(2022, 3, 15)),
    (str(uuid.uuid4())[:8], "CPD-003", "Dodge Charger Pursuit", "MANTENIMIENTO", date(2020, 8, 22)),
    (str(uuid.uuid4())[:8], "CPD-004", "Ford Crown Victoria", "BAJA", date(2010, 1, 10)),
    (str(uuid.uuid4())[:8], "CPD-005", "Chevrolet Silverado 1500 SSV", "OPERATIVO", date(2023, 11, 2)),
    (str(uuid.uuid4())[:8], "CPD-006", "Harley-Davidson FLHTP", "OPERATIVO", date(2021, 7, 7)),
    (str(uuid.uuid4())[:8], "CPD-007", "Lenco BearCat", "OPERATIVO", date(2018, 4, 18)),
    (str(uuid.uuid4())[:8], "CPD-008", "Ford Explorer Police Interceptor", "MANTENIMIENTO", date(2021, 5, 10)),
    (str(uuid.uuid4())[:8], "CPD-009", "Chevrolet Tahoe PPV", "OPERATIVO", date(2022, 3, 15)),
    (str(uuid.uuid4())[:8], "CPD-010", "Dodge Charger Pursuit", "OPERATIVO", date(2020, 8, 22))
]
client.execute("TRUNCATE TABLE IF EXISTS vehicle_fleet")
client.execute("INSERT INTO vehicle_fleet (id, placa, marca_modelo, estado, fecha_adquisicion) VALUES", vehiculos)
print(f"Inserted {len(vehiculos)} vehicles into vehicle_fleet.")
