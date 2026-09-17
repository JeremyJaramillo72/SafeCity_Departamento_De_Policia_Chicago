import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
sys.path.append('/app')
django.setup()

from gestion_operativa.views import get_clickhouse_client

def run():
    client = get_clickhouse_client()
    print("Creating temporary table...")
    client.execute('''
        CREATE TABLE rrhh_persona_desaparecida_new (
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
        ORDER BY (id, timestamp_registro)
    ''')
    print("Copying data...")
    client.execute('INSERT INTO rrhh_persona_desaparecida_new SELECT * FROM rrhh_persona_desaparecida')
    print("Swapping tables...")
    client.execute('RENAME TABLE rrhh_persona_desaparecida TO rrhh_persona_desaparecida_old, rrhh_persona_desaparecida_new TO rrhh_persona_desaparecida')
    client.execute('DROP TABLE rrhh_persona_desaparecida_old')
    print("Done!")

if __name__ == '__main__':
    run()
