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
        host = os.environ.get('CLICKHOUSE_HOST', 'localhost')
        client = Client(host=host, port=9000, user='default', password='password12345')
        
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
                url_fotografia String,
                grupo_sanguineo String DEFAULT 'O+',
                contacto_emergencia_nombre String DEFAULT '',
                contacto_emergencia_telefono String DEFAULT '',
                insignias String DEFAULT '',
                url_hoja_vida String DEFAULT ''
            ) ENGINE = MergeTree()
            ORDER BY id_oficial
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
            ) ENGINE = MergeTree ORDER BY id_usuario
        ''')

        # 2. Insert Roles
        print("Inserting Roles...")
        client.execute('TRUNCATE TABLE rol_oficial')
        client.execute('INSERT INTO rol_oficial (id_rol, nombre_rol, descripcion) VALUES', [
            (1, 'administrador', 'comandante con acceso a global command y analitica'),
            (2, 'oficial', 'oficial de patrulla con acceso a tactical map y reportes'),
            (6, 'recursos_humanos', 'Personal de recursos humanos a cargo de marcas y permisos')
        ])

        # 3. Insert Officers
        print("Inserting Officers...")
        client.execute('TRUNCATE TABLE oficial_policia')
        from datetime import date
        client.execute('INSERT INTO oficial_policia (id_oficial, placa_policial, nombres, apellidos, correo_electronico, telefono_contacto, fecha_ingreso, id_rol, url_fotografia, grupo_sanguineo, contacto_emergencia_nombre, contacto_emergencia_telefono, insignias, url_hoja_vida) VALUES', [
            (1, 'sc-0001', 'richard', 'stevens', 'rstevens@safecity.gov', '555-0101', date(2026, 5, 19), 1, '/assets/avatars/cmdte_stevens.jpg', 'O+', 'Sarah Stevens (Esposa)', '555-0199', 'tacticas_urbanas,primer_respondiente,conduccion_tactica,operacion_segura', ''),
            (2, 'sc-7482', 'john', 'doe', 'jdoe@safecity.gov', '555-0202', date(2026, 5, 19), 2, '/assets/avatars/ofc_doe.jpg', 'A+', 'Jane Doe (Esposa)', '555-0144', 'tacticas_urbanas,primer_respondiente', ''),
            (4, 'admin-001', 'Admin', 'Sistema', 'admin@safecity.gov', '555-0000', date.today(), 4, 'https://ui-avatars.com/api/?name=Admin+Sistema&background=00173d&color=ffffff', 'O+', 'Contacto Admin', '555-0000', '', ''),
            (13, 'HR-001', 'Laura', 'Castro', 'lcastro@safecity.gov', '555-0303', date(2026, 5, 19), 6, 'https://ui-avatars.com/api/?name=Laura+Castro&background=0A1128&color=ffffff', 'AB+', 'Carlos Castro (Padre)', '555-0177', 'operacion_segura', ''),
            (20, 'sc-1435', 'Michael', 'Jordan', 'mjordan@safecity.gov', '555-0860', date(2022, 8, 19), 2, 'https://ui-avatars.com/api/?name=Michael+Jordan&background=0D1B2A&color=ffffff', 'O-', 'Contacto Michael', '555-0912', 'operacion_segura', ''),
            (21, 'sc-3269', 'Sarah', 'Connor', 'sconnor@safecity.gov', '555-0181', date(2023, 9, 16), 2, 'https://ui-avatars.com/api/?name=Sarah+Connor&background=0D1B2A&color=ffffff', 'A+', 'Contacto Sarah', '555-0561', 'operacion_segura', ''),
            (22, 'sc-7527', 'James', 'Bond', 'jbond@safecity.gov', '555-0966', date(2024, 12, 23), 2, 'https://ui-avatars.com/api/?name=James+Bond&background=0D1B2A&color=ffffff', 'A+', 'Contacto James', '555-0148', 'primer_respondiente', ''),
            (23, 'sc-8783', 'Olivia', 'Benson', 'obenson@safecity.gov', '555-0774', date(2022, 8, 25), 2, 'https://ui-avatars.com/api/?name=Olivia+Benson&background=0D1B2A&color=ffffff', 'O+', 'Contacto Olivia', '555-0264', 'primer_respondiente', ''),
            (24, 'sc-7623', 'Elliot', 'Stabler', 'establer@safecity.gov', '555-0327', date(2022, 2, 3), 2, 'https://ui-avatars.com/api/?name=Elliot+Stabler&background=0D1B2A&color=ffffff', 'O+', 'Contacto Elliot', '555-0950', 'operacion_segura', ''),
            (25, 'sc-2332', 'Fin', 'Tutuola', 'ftutuola@safecity.gov', '555-0905', date(2024, 2, 21), 2, 'https://ui-avatars.com/api/?name=Fin+Tutuola&background=0D1B2A&color=ffffff', 'AB+', 'Contacto Fin', '555-0815', 'operacion_segura', ''),
            (26, 'sc-1304', 'Amanda', 'Rollins', 'arollins@safecity.gov', '555-0566', date(2024, 3, 2), 2, 'https://ui-avatars.com/api/?name=Amanda+Rollins&background=0D1B2A&color=ffffff', 'AB+', 'Contacto Amanda', '555-0392', 'operacion_segura', ''),
            (27, 'sc-8574', 'Hank', 'Voight', 'hvoight@safecity.gov', '555-0118', date(2024, 9, 7), 2, 'https://ui-avatars.com/api/?name=Hank+Voight&background=0D1B2A&color=ffffff', 'O+', 'Contacto Hank', '555-0597', 'tacticas_urbanas', ''),
            (28, 'sc-5852', 'Jay', 'Halstead', 'jhalstead@safecity.gov', '555-0169', date(2024, 3, 19), 2, 'https://ui-avatars.com/api/?name=Jay+Halstead&background=0D1B2A&color=ffffff', 'B+', 'Contacto Jay', '555-0200', 'primer_respondiente', ''),
            (29, 'sc-7671', 'Kim', 'Burgess', 'kburgess@safecity.gov', '555-0177', date(2021, 2, 17), 2, 'https://ui-avatars.com/api/?name=Kim+Burgess&background=0D1B2A&color=ffffff', 'A+', 'Contacto Kim', '555-0353', 'primer_respondiente', ''),
            (30, 'sc-4518', 'Kevin', 'Atwater', 'katwater@safecity.gov', '555-0340', date(2025, 10, 4), 2, 'https://ui-avatars.com/api/?name=Kevin+Atwater&background=0D1B2A&color=ffffff', 'AB+', 'Contacto Kevin', '555-0719', 'tacticas_urbanas', ''),
            (31, 'sc-1309', 'Adam', 'Ruzek', 'aruzek@safecity.gov', '555-0643', date(2021, 3, 12), 2, 'https://ui-avatars.com/api/?name=Adam+Ruzek&background=0D1B2A&color=ffffff', 'O-', 'Contacto Adam', '555-0203', 'conduccion_tactica', '')
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
            (2, 2, 'sc-7482', pwd_hash, 'activo', now),
            (7, 13, 'sc-rrhh', pwd_hash, 'activo', now)
        ])

        # 5. Create rrhh_solicitud_permiso table
        print("Creating rrhh_solicitud_permiso table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS rrhh_solicitud_permiso (
                id String,
                id_oficial UInt32,
                tipo_permiso String,
                fecha_inicio Date,
                fecha_fin Date,
                estado String,
                id_comandante_aprobador Nullable(UInt32),
                timestamp_solicitud DateTime,
                timestamp_resolucion Nullable(DateTime),
                documento_respaldo Nullable(String)
            ) ENGINE = MergeTree()
            ORDER BY id
        ''')

        # 5.5. Crear tabla de solicitud_asignacion_caso en ClickHouse
        print("Creando tabla de solicitud_asignacion_caso...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS solicitud_asignacion_caso (
                id_solicitud String,
                case_number String,
                id_detective UInt32,
                nombre_detective String,
                estado String,
                fecha_solicitud DateTime,
                fecha_resolucion Nullable(DateTime)
            ) ENGINE = MergeTree()
            ORDER BY id_solicitud
        ''')

        # 6. Create rrhh_asistencia_registro table
        print("Creating rrhh_asistencia_registro table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS rrhh_asistencia_registro (
                id String,
                id_oficial UInt32,
                timestamp_entrada DateTime,
                timestamp_salida Nullable(DateTime)
            ) ENGINE = MergeTree()
            ORDER BY (id_oficial, timestamp_entrada)
        ''')

        # 8. Create rrhh_amonestacion table
        print("Creating rrhh_amonestacion table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS rrhh_amonestacion (
                id String,
                id_oficial UInt32,
                tipo String,
                descripcion String,
                id_comandante UInt32,
                timestamp DateTime
            ) ENGINE = MergeTree()
            ORDER BY id
        ''')

        # 9. Create rrhh_certificacion table
        print("Creating rrhh_certificacion table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS rrhh_certificacion (
                id String,
                id_oficial UInt32,
                nombre_curso String,
                institucion String,
                fecha_completado Date,
                timestamp_registro DateTime,
                documento_respaldo Nullable(String)
            ) ENGINE = MergeTree()
            ORDER BY id
        ''')


        # 10. Create rrhh_roll_call_briefing table
        print("Creating rrhh_roll_call_briefing table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS rrhh_roll_call_briefing (
                id String,
                id_supervisor UInt32,
                bolo_details String,
                special_assignments String,
                asistentes String,
                timestamp DateTime
            ) ENGINE = MergeTree()
            ORDER BY id
        ''')

        # 11. Create rrhh_shift_handover table
        print("Creating rrhh_shift_handover table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS rrhh_shift_handover (
                id String,
                id_oficial_saliente UInt32,
                id_oficial_entrante UInt32,
                checklist_detenidos UInt8,
                checklist_equipos UInt8,
                checklist_incidentes UInt8,
                novedades String,
                leido UInt8,
                timestamp DateTime
            ) ENGINE = MergeTree()
            ORDER BY id
        ''')

        # 12. Create judicial orders table (orden_judicial)
        print("Creating orden_judicial table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS orden_judicial (
                id UInt32,
                tipo_orden String,
                juez_emisor String,
                tribunal String,
                cargos String,
                fecha_emision Date,
                fecha_vencimiento Date,
                sospechoso_nombre String,
                sospechoso_identificacion String,
                expediente_vinculado String,
                documento_pdf String,
                estado String,
                fecha_creacion DateTime
            ) ENGINE = MergeTree()
            ORDER BY id
        ''')

        # 13. Create judicial orders execution table (ejecucion_orden)
        print("Creating ejecucion_orden table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS ejecucion_orden (
                id UInt32,
                id_orden UInt32,
                fecha_hora_ejecucion DateTime,
                ubicacion String,
                oficial_ejecutor String,
                resultado String,
                observaciones String,
                fecha_registro DateTime
            ) ENGINE = MergeTree()
            ORDER BY id
        ''')

        # 14. Create vehicle fleet table
        print("Creating vehicle_fleet table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS vehicle_fleet (
                id String,
                placa String,
                marca_modelo String,
                estado String,
                fecha_adquisicion Date
            ) ENGINE = MergeTree()
            ORDER BY id
        ''')

        client.execute('TRUNCATE TABLE vehicle_fleet')
        client.execute('INSERT INTO vehicle_fleet (id, placa, marca_modelo, estado, fecha_adquisicion) VALUES', [
            ('V-001', 'P-007', 'Ford Explorer Police Interceptor', 'OPERATIVO', date(2025, 1, 10)),
            ('V-002', 'P-008', 'Dodge Charger Pursuit', 'OPERATIVO', date(2025, 1, 15)),
            ('V-003', 'P-009', 'Chevrolet Tahoe PPV', 'FUERA_DE_SERVICIO', date(2024, 6, 20))
        ])

        # 15. Create equipment catalog table
        print("Creating equipment_catalog table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS equipment_catalog (
                id_equipo String,
                codigo_serial String,
                tipo_equipo String,
                marca_modelo String,
                estado_equipo String,
                id_oficial_actual Nullable(UInt32),
                nombre_oficial_actual Nullable(String),
                notas Nullable(String),
                creado_por String,
                fecha_creacion DateTime,
                fecha_modificacion DateTime
            ) ENGINE = MergeTree()
            ORDER BY id_equipo
        ''')

        client.execute('TRUNCATE TABLE equipment_catalog')
        client.execute('INSERT INTO equipment_catalog (id_equipo, codigo_serial, tipo_equipo, marca_modelo, estado_equipo, id_oficial_actual, nombre_oficial_actual, creado_por, fecha_creacion, fecha_modificacion) VALUES', [
            ('EQ-001', 'RADIO-001', 'RADIO', 'Motorola APX 6000', 'DISPONIBLE', None, None, 'sc-0001', now, now),
            ('EQ-002', 'RADIO-002', 'RADIO', 'Motorola APX 6000', 'ASIGNADO', 2, 'john doe', 'sc-0001', now, now),
            ('EQ-003', 'BCAM-001', 'BODYCAM', 'Axon Body 3', 'EN_MANTENIMIENTO', None, None, 'sc-0001', now, now),
            ('EQ-004', 'CHAL-001', 'CHALECO', 'Point Blank', 'DISPONIBLE', None, None, 'sc-0001', now, now),
            ('EQ-005', 'TASER-001', 'TASER', 'Axon Taser 7', 'DISPONIBLE', None, None, 'sc-0001', now, now)
        ])

        # 16. Create equipment assignments log table
        print("Creating equipment_assignments table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS equipment_assignments (
                id_asignacion String,
                id_equipo String,
                codigo_serial String,
                tipo_equipo String,
                id_oficial UInt32,
                nombre_oficial String,
                tipo_accion String,
                observaciones Nullable(String),
                registrado_por String,
                fecha_registro DateTime
            ) ENGINE = MergeTree()
            ORDER BY id_asignacion
        ''')

        client.execute('TRUNCATE TABLE equipment_assignments')
        client.execute('INSERT INTO equipment_assignments (id_asignacion, id_equipo, codigo_serial, tipo_equipo, id_oficial, nombre_oficial, tipo_accion, observaciones, registrado_por, fecha_registro) VALUES', [
            ('ASG-001', 'EQ-002', 'RADIO-002', 'RADIO', 2, 'john doe', 'ASIGNACION', 'Turno regular', 'sc-0001', now)
        ])

        # 17. Create maintenance tickets table
        print("Creating maintenance_tickets table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS maintenance_tickets (
                id_ticket String,
                id_vehiculo String,
                placa_vehiculo String,
                categoria_falla String,
                descripcion String,
                gravedad String,
                estado_ticket String,
                fecha_resolucion Nullable(DateTime),
                resuelto_por Nullable(String),
                reportado_por String,
                fecha_creacion DateTime,
                fecha_modificacion DateTime
            ) ENGINE = MergeTree()
            ORDER BY id_ticket
        ''')

        client.execute('TRUNCATE TABLE maintenance_tickets')
        client.execute('INSERT INTO maintenance_tickets (id_ticket, id_vehiculo, placa_vehiculo, categoria_falla, descripcion, gravedad, estado_ticket, reportado_por, fecha_creacion, fecha_modificacion) VALUES', [
            ('TKT-001', 'V-003', 'P-009', 'MOTOR', 'Falla en el encendido, ruido extraño en el motor.', 'ALTA', 'ABIERTO', 'sc-7482', now, now)
        ])

        # 18. Create missing persons table (rrhh_persona_desaparecida)
        print("Creating rrhh_persona_desaparecida table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS rrhh_persona_desaparecida (
                id String,
                case_number Nullable(String),
                id_oficial_reportante UInt32,
                nombre_completo String,
                edad UInt8,
                tiene_dependencia_medicamentos UInt8 DEFAULT 0,
                fotografia Nullable(String),
                descripcion_fisica String,
                vestimenta String,
                ultima_ubicacion String,
                datos_reportante String,
                nivel_riesgo String,
                estado String DEFAULT 'Búsqueda Activa',
                id_comandante_aprobador Nullable(UInt32),
                timestamp_registro DateTime DEFAULT now(),
                timestamp_resolucion Nullable(DateTime)
            ) ENGINE = MergeTree()
            ORDER BY (timestamp_registro, nivel_riesgo, estado)
        ''')

        # 19. Create BOLO alerts table (rrhh_bolo)
        print("Creating rrhh_bolo table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS rrhh_bolo (
                id String,
                tipo String,
                titulo String,
                descripcion String,
                nivel_riesgo String,
                fecha_expiracion DateTime,
                estado String DEFAULT 'Activa',
                foto_url Nullable(String),
                id_referencia Nullable(String),
                creado_por String,
                timestamp DateTime DEFAULT now()
            ) ENGINE = MergeTree()
            ORDER BY (timestamp, tipo, estado)
        ''')

        # 20. Create catalogo_sistema table
        print("Creating catalogo_sistema table...")
        client.execute('DROP TABLE IF EXISTS catalogo_sistema')
        client.execute('''
            CREATE TABLE IF NOT EXISTS catalogo_sistema (
                id_catalogo UInt32,
                tipo_catalogo String,
                valor String,
                descripcion String,
                activo UInt8 DEFAULT 1
            ) ENGINE = MergeTree()
            ORDER BY (tipo_catalogo, id_catalogo)
        ''')

        # Insert defaults
        print("Inserting default catalogs...")
        default_categories = []
        id_counter = 1

        # Crime Categories (primary_type)
        for val in [
            'BATTERY', 'THEFT', 'CRIMINAL DAMAGE', 'NARCOTICS', 'ASSAULT',
            'DECEPTIVE PRACTICE', 'OTHER OFFENSE', 'BURGLARY', 'MOTOR VEHICLE THEFT',
            'ROBBERY', 'CRIMINAL TRESPASS', 'WEAPONS VIOLATION', 'PUBLIC PEACE VIOLATION',
            'OFFENSE INVOLVING CHILDREN', 'SEX OFFENSE', 'HOMICIDE', 'ARSON',
            'KIDNAPPING', 'STALKING', 'HUMAN TRAFFICKING'
        ]:
            default_categories.append((id_counter, 'primary_type', val, f'Category for {val}', 1))
            id_counter += 1

        # Location Types (location_type)
        for val in [
            'STREET', 'APARTMENT', 'RESIDENCE', 'PARKING LOT / GARAGE (NON RESIDENTIAL)',
            'ALLEY', 'SCHOOL PUBLIC BUILDING', 'SIDEWALK', 'RESTAURANT', 'RETAIL STORE',
            'GAS STATION', 'BANK', 'PARK PROPERTY', 'VEHICLE NON-COMMERCIAL', 'OTHER'
        ]:
            default_categories.append((id_counter, 'location_type', val, f'Location type {val}', 1))
            id_counter += 1

        # Districts (district)
        for val in [
            '001','002','003','004','005','006','007','008','009','010',
            '011','012','014','015','016','017','018','019','020','022','024','025'
        ]:
            default_categories.append((id_counter, 'district', val, f'District number {val}', 1))
            id_counter += 1

        # Traffic Laws (traffic_law)
        for val in [
            'EXCESO_VELOCIDAD', 'CONDUCCION_TEMERARIA', 'DUI', 'PASAR_SEMAFORO_ROJO', 'SIN_LICENCIA'
        ]:
            default_categories.append((id_counter, 'traffic_law', val, f'Traffic law violation code {val}', 1))
            id_counter += 1

        # Vehicle Types (vehicle_type)
        for val in [
            'SUV Patrol', 'Sedan', 'Transport Van', 'K9 Unit', 'Armored'
        ]:
            default_categories.append((id_counter, 'vehicle_type', val, f'Vehicle fleet type {val}', 1))
            id_counter += 1

        client.execute('INSERT INTO catalogo_sistema (id_catalogo, tipo_catalogo, valor, descripcion, activo) VALUES', default_categories)

        # 21. Create vehiculo_sospechoso table
        print("Creating vehiculo_sospechoso table...")
        client.execute('''
            CREATE TABLE IF NOT EXISTS vehiculo_sospechoso (
                id_vehiculo_sospechoso UInt32,
                id_sospechoso UInt32,
                case_number String,
                placa String,
                marca String,
                modelo String,
                color String,
                estado_reporte String,
                observaciones String,
                fecha_registro DateTime
            ) ENGINE = MergeTree()
            ORDER BY id_vehiculo_sospechoso
        ''')

        client.execute('TRUNCATE TABLE vehiculo_sospechoso')
        client.execute('''INSERT INTO vehiculo_sospechoso (id_vehiculo_sospechoso, id_sospechoso, case_number, placa, marca, modelo, color, estado_reporte, observaciones, fecha_registro) VALUES''', [
            (1, 106, 'HZ149281', 'IL-889-XTR', 'Ford', 'Mustang GT', 'Negro Mate', 'REQUERIDO', 'Vehículo visto huyendo de la escena del robo en West Loop.', now),
            (2, 107, 'HZ149282', 'IL-442-BKN', 'Dodge', 'Charger R/T', 'Gris Oscuro', 'INCAUTADO', 'Retenido en depósito judicial tras persecución táctica.', now),
            (3, 108, 'HZ149283', 'IL-102-MXC', 'Chevrolet', 'Tahoe SS', 'Azul Marino', 'BAJO_SOSPECHA', 'Vinculado a tareas de vigilancia de la banda Los Toros.', now),
            (4, 109, 'HZ149284', 'IL-991-PDQ', 'BMW', 'M5 Competition', 'Blanco', 'REQUERIDO', 'Reportado con placas clonadas en la zona del Distrito 007.', now),
            (5, 110, 'HZ149285', 'IL-553-VPR', 'Audi', 'RS6 Avant', 'Verde Oliva', 'DESPEJADO', 'Verificado por detectives; inspección negativa de drogas.', now),
            (6, 111, 'HZ149286', 'IL-774-KLL', 'Jeep', 'Grand Cherokee SRT', 'Rojo Granate', 'REQUERIDO', 'Utilizado en alunizaje comercial en Tienda Retail.', now)
        ])

        print("ClickHouse database setup successfully! Default password for both users is: password123")
    except Exception as e:
        print(f"Error setting up ClickHouse: {e}")
        print("Make sure ClickHouse is running on localhost:9000.")

if __name__ == '__main__':
    setup_clickhouse()

