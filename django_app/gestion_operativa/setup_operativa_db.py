import os
import sys
from clickhouse_driver import Client

def setup_operativa_clickhouse():
    # Connect to ClickHouse
    try:
        host = os.environ.get('CLICKHOUSE_HOST', 'localhost')
        client = Client(host=host, port=9000, user='default', password='password12345')
        print(f"Connected to ClickHouse at {host}. Creating operational tables...")

        # 1. Tránsito e Infracciones (e-Citations & BAC)
        client.execute('DROP TABLE IF EXISTS infraccion_transito')
        client.execute('''
            CREATE TABLE infraccion_transito (
                id_infraccion String,
                id_oficial UInt32,
                ubicacion String,
                latitude String,
                longitude String,
                fecha_hora DateTime,
                ley_transito String,
                monto_multa Float32,
                nivel_bac Float32,
                limite_velocidad Int32,
                velocidad_registrada Int32,
                placa_vehiculo String,
                estado_placa String,
                marca_vehiculo String,
                modelo_vehiculo String,
                anio_vehiculo Int32,
                color_vehiculo String,
                licencia_conductor String,
                estado_licencia String,
                nombre_conductor String,
                direccion_conductor String,
                fecha_nacimiento String,
                condiciones_climaticas String,
                condiciones_trafico String,
                comentarios String,
                evidencia_url Nullable(String)
            ) ENGINE = MergeTree ORDER BY id_infraccion
        ''')

        # 2. Control de Detenidos (Booking)
        client.execute('DROP TABLE IF EXISTS ingreso_celda')
        client.execute('''
            CREATE TABLE ingreso_celda (
                id_ingreso String,
                id_oficial UInt32,
                nombre_detenido String,
                alias String,
                fecha_nacimiento String,
                genero String,
                nacionalidad String,
                id_incidente_asociado String,
                cargo_principal String,
                gravedad_cargo String,
                estatura Float32,
                peso Float32,
                senas_particulares String,
                numero_celda String,
                estado_salud String,
                nivel_intoxicacion String,
                articulos_retenidos String,
                dinero_retenido Float32,
                custodia_estado String,
                permiso_visitas String,
                permiso_llamadas String,
                permiso_patio String,
                hora_ingreso DateTime,
                hora_salida Nullable(DateTime),
                id_sospechoso UInt32,
                motivo_salida String
            ) ENGINE = MergeTree ORDER BY id_ingreso
        ''')

        # 3. Bitácora del Detenido
        client.execute('DROP TABLE IF EXISTS bitacora_detenido')
        client.execute('''
            CREATE TABLE bitacora_detenido (
                id_log String,
                id_ingreso String,
                tipo_accion String,
                descripcion String,
                fecha_hora DateTime
            ) ENGINE = MergeTree ORDER BY (id_ingreso, id_log)
        ''')

        # 4. Reunión Comunitaria
        client.execute('''
            CREATE TABLE IF NOT EXISTS reunion_comunitaria (
                id_reunion String,
                id_oficial UInt32,
                ubicacion String,
                comentarios_vecinales String,
                sentimiento_nlp Float32,
                fecha_hora DateTime
            ) ENGINE = Log
        ''')

        # 5. Descarga Taser (Uso de fuerza no letal)
        client.execute('''
            CREATE TABLE IF NOT EXISTS descarga_taser (
                id_descarga String,
                id_oficial UInt32,
                id_incidente String,
                serial_taser String,
                justificacion String,
                fecha_hora DateTime
            ) ENGINE = Log
        ''')

        # 6. Despacho Grúa
        client.execute('''
            CREATE TABLE IF NOT EXISTS despacho_grua (
                id_despacho String,
                ubicacion String,
                motivo String,
                estado String,
                fecha_hora DateTime,
                placa_vehiculo String,
                marca_modelo String,
                prioridad String,
                tipo_grua String,
                comentarios String,
                evidencia_url Nullable(String)
            ) ENGINE = Log
        ''')

        # 7. Persecución Vehicular
        client.execute('DROP TABLE IF EXISTS persecucion_vehicular')
        client.execute('''
            CREATE TABLE persecucion_vehicular (
                id_persecucion String,
                id_incidente String,
                id_oficial UInt32,
                nombre_oficial String,
                motivo String,
                velocidad_maxima Int32,
                duracion_minutos Int32,
                condiciones_climaticas String,
                resultado String,
                heridos Int32,
                fallecidos Int32,
                estado_revision String,
                revision_comentarios Nullable(String),
                revisado_por Nullable(String),
                fecha_registro DateTime,
                fecha_revision Nullable(DateTime)
            ) ENGINE = MergeTree ORDER BY id_persecucion
        ''')

        print("Operational tables successfully created in ClickHouse!")

    except Exception as e:
        print(f"Error setting up ClickHouse: {e}")

if __name__ == '__main__':
    setup_operativa_clickhouse()
