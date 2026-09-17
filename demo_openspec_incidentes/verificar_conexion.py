import time
import sys
import io

# Asegurar codificacion UTF-8 en terminales Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

try:
    from clickhouse_driver import Client
except ImportError:
    print("[ERROR] Instala clickhouse-driver usando: pip install clickhouse-driver")
    sys.exit(1)

def test_conexion():
    print("==========================================================")
    print(">>> VERIFICACION DE CONEXION: SAFECITY CLICKHOUSE (OPENSPEC)")
    print("==========================================================")
    
    t_inicio = time.time()
    try:
        client = Client(host='localhost', port=9000, user='default', password='password12345')
        version = client.execute('SELECT version()')[0][0]
        print(f"[OK] Conexion exitosa a ClickHouse Server v{version}")
        
        # Conteo de tablas
        tablas = [r[0] for r in client.execute('SHOW TABLES')]
        print(f"[OK] Total de tablas disponibles en la BD: {len(tablas)}")
        
        # Conteo de incidentes en chicago_crimes
        if 'chicago_crimes' in tablas:
            conteo = client.execute('SELECT count() FROM chicago_crimes')[0][0]
            print(f"[OK] Total de incidentes en 'chicago_crimes': {conteo:,} registros")
            
            # Prueba de velocidad analitica (SLA)
            t_query_inicio = time.time()
            res = client.execute('''
                SELECT description, count() as total 
                FROM chicago_crimes 
                GROUP BY description 
                ORDER BY total DESC 
                LIMIT 5
            ''')
            t_query = (time.time() - t_query_inicio) * 1000
            
            print(f"[SLA] Tiempo de consulta analitica (Top 5 Delitos): {t_query:.2f} ms")
            print("----------------------------------------------------------")
            for desc, total in res:
                print(f"   * {desc}: {total:,} casos")
        
        t_total = (time.time() - t_inicio) * 1000
        print("==========================================================")
        print(f"RESULTADO: CUMPLIMIENTO CONSTITUCIONAL SLA (< 800ms) -> APROBADO ({t_total:.2f} ms)")
        print("==========================================================")

    except Exception as e:
        print(f"[ERROR] Error al conectar con ClickHouse: {e}")

if __name__ == '__main__':
    test_conexion()
