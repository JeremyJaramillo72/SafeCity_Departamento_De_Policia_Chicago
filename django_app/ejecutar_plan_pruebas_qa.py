import os
import sys
import io
import codecs

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
import django
import datetime
from PIL import Image

# Configuración del entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from gestion_operativa.views import get_clickhouse_client
from inteligencia_criminal.views import (
    EvidenceCRUDView,
    EvidenceImageUploadView,
    GangCRUDView,
    WitnessCRUDView,
    VictimCRUDView,
    SuspectVehiclesDirectoryView
)
from gestion_operativa.sheriff_dashboard_views import SheriffExecutiveDashboardView

class QATestRunner:
    def __init__(self):
        self.factory = APIRequestFactory()
        self.client_ch = None
        self.ch_connected = False
        try:
            self.client_ch = get_clickhouse_client()
            # Test ping
            self.client_ch.execute("SELECT 1")
            self.ch_connected = True
        except Exception:
            self.ch_connected = False
        self.passed_tests = 0
        self.failed_tests = 0
        self.results = []

    def log_result(self, test_id, category, name, passed, details=""):
        status_str = "✅ PASS" if passed else "❌ FAIL"
        if passed:
            self.passed_tests += 1
        else:
            self.failed_tests += 1
        self.results.append({
            "id": test_id,
            "category": category,
            "name": name,
            "status": status_str,
            "details": details
        })
        print(f"[{status_str}] {test_id} - {name}")
        if details:
            print(f"       └─ Detalle: {details}")

    def run_database_tests(self):
        print("\n=======================================================")
        print("🗄️ 1. EJECUTANDO PRUEBAS DE BASE DE DATOS (ClickHouse)")
        print("=======================================================")
        
        # TC-DB-01: Esquema de tabla evidencia y columna url_fotografia
        try:
            columns = self.client_ch.execute("DESCRIBE TABLE evidencia")
            col_dict = {col[0]: col[1] for col in columns}
            has_photo_col = 'url_fotografia' in col_dict
            self.log_result(
                "TC-DB-01", "Base de Datos",
                "Verificar esquema de tabla 'evidencia' (columna url_fotografia)",
                has_photo_col,
                f"Columnas detectadas: {list(col_dict.keys())}"
            )
        except Exception as e:
            self.log_result("TC-DB-01", "Base de Datos", "Verificar esquema 'evidencia'", False, str(e))

        # TC-DB-02: Persistencia transaccional de evidencia con URL de fotografía
        try:
            res = self.client_ch.execute("SELECT max(id_evidencia) FROM evidencia")
            test_id = (res[0][0] or 0) + 9999
            test_case = "QA-TEST-CASE-99"
            test_url = "https://safecity.storage/test_qa_evidence.jpg"
            now = datetime.datetime.now()

            # Insertar registro de prueba
            self.client_ch.execute(
                "INSERT INTO evidencia (id_evidencia, case_number, tipo_evidencia, fecha_recoleccion, id_oficial, url_fotografia) VALUES",
                [(test_id, test_case, "Evidencia Forense QA Test", now, 1, test_url)]
            )
            
            # Consultar registro insertado
            check = self.client_ch.execute(
                "SELECT id_evidencia, case_number, url_fotografia FROM evidencia WHERE id_evidencia = %(id)s",
                {'id': test_id}
            )
            inserted_ok = len(check) > 0 and check[0][2] == test_url
            
            # Limpiar registro de prueba
            self.client_ch.execute("ALTER TABLE evidencia DELETE WHERE id_evidencia = %(id)s", {'id': test_id})
            
            self.log_result(
                "TC-DB-02", "Base de Datos",
                "Persistencia y eliminación transaccional en tabla 'evidencia'",
                inserted_ok,
                f"ID prueba={test_id}, url_persistida={inserted_ok}"
            )
        except Exception as e:
            self.log_result("TC-DB-02", "Base de Datos", "Persistencia transaccional evidencia", False, str(e))

        # TC-DB-03: Ordenamiento descendente en tabla banda_criminal
        try:
            gangs = self.client_ch.execute("SELECT id_banda, nombre_banda FROM banda_criminal ORDER BY id_banda DESC LIMIT 5")
            ids = [g[0] for g in gangs]
            is_desc = all(ids[i] >= ids[i+1] for i in range(len(ids)-1))
            self.log_result(
                "TC-DB-03", "Base de Datos",
                "Ordenamiento cronológico descendente en 'banda_criminal'",
                is_desc and len(gangs) > 0,
                f"Secuencia IDs primeros registros: {ids}"
            )
        except Exception as e:
            self.log_result("TC-DB-03", "Base de Datos", "Ordenamiento banda_criminal", False, str(e))

        # TC-DB-04: Exactitud de conteo real en tabla de crímenes (ClickHouse)
        try:
            total_count = self.client_ch.execute("SELECT count(*) FROM chicago_crimes")[0][0]
            count_ok = total_count == 1200011
            self.log_result(
                "TC-DB-04", "Base de Datos",
                "Exactitud métrica en Big Data 'chicago_crimes' (1,200,011 registros)",
                count_ok,
                f"Conteo real en ClickHouse: {total_count:,} registros"
            )
        except Exception as e:
            self.log_result("TC-DB-04", "Base de Datos", "Conteo chicago_crimes", False, str(e))

    def run_backend_tests(self):
        print("\n=======================================================")
        print("⚙️ 2. EJECUTANDO PRUEBAS DE BACKEND (Django REST API)")
        print("=======================================================")

        # TC-BE-01: GET /api/criminal/evidence/
        try:
            request = self.factory.get('/api/criminal/evidence/')
            view = EvidenceCRUDView.as_view()
            response = view(request)
            data = response.data
            has_fields = False
            if response.status_code == status.HTTP_200_OK and len(data) > 0:
                first_item = data[0]
                has_fields = 'id_evidencia' in first_item and 'url_fotografia' in first_item and 'case_number' in first_item
            self.log_result(
                "TC-BE-01", "Backend API",
                "Consulta de lista de evidencias (GET /api/criminal/evidence/)",
                response.status_code == 200 and has_fields,
                f"Status: {response.status_code}, Registros: {len(data)}, Campos validados OK"
            )
        except Exception as e:
            self.log_result("TC-BE-01", "Backend API", "GET /api/criminal/evidence/", False, str(e))

        # TC-BE-02: POST /api/criminal/evidence/ (Creación)
        try:
            payload = {
                "case_number": "QA-AUTO-01",
                "tipo_evidencia": "Cuchillo de combate con huellas dactilares",
                "id_oficial": 1,
                "url_fotografia": "https://storage.safecity.org/evidencias/knife_qa.png"
            }
            request = self.factory.post('/api/criminal/evidence/', payload, format='json')
            view = EvidenceCRUDView.as_view()
            response = view(request)
            created_ok = response.status_code == status.HTTP_201_CREATED and response.data.get('success') is True
            new_id = response.data.get('id_evidencia')
            
            # Cleanup
            if new_id:
                self.client_ch.execute("ALTER TABLE evidencia DELETE WHERE id_evidencia = %(id)s", {'id': new_id})

            self.log_result(
                "TC-BE-02", "Backend API",
                "Creación de nueva evidencia con foto (POST /api/criminal/evidence/)",
                created_ok,
                f"Status: {response.status_code}, ID generado: {new_id}"
            )
        except Exception as e:
            self.log_result("TC-BE-02", "Backend API", "POST /api/criminal/evidence/", False, str(e))

        # TC-BE-03: POST /api/criminal/evidence/upload/ (Subida de archivo imagen)
        try:
            # Crear imagen dummy de 50x50 píxeles en memoria
            img_io = io.BytesIO()
            img = Image.new('RGB', (50, 50), color='red')
            img.save(img_io, format='JPEG')
            img_io.seek(0)
            
            uploaded_file = SimpleUploadedFile("test_evidence.jpg", img_io.getvalue(), content_type="image/jpeg")
            request = self.factory.post('/api/criminal/evidence/upload/', {'file': uploaded_file}, format='multipart')
            view = EvidenceImageUploadView.as_view()
            response = view(request)
            upload_ok = response.status_code == status.HTTP_200_OK and 'url' in response.data
            
            self.log_result(
                "TC-BE-03", "Backend API",
                "Subida de imagen pericial (POST /api/criminal/evidence/upload/)",
                upload_ok,
                f"Status: {response.status_code}, URL generada: {response.data.get('url', '')[:45]}..."
            )
        except Exception as e:
            self.log_result("TC-BE-03", "Backend API", "POST /api/criminal/evidence/upload/", False, str(e))

        # TC-BE-04: GET /api/operativa/sheriff-executive-dashboard/ (Validación métrica)
        try:
            request = self.factory.get('/api/operativa/sheriff-executive-dashboard/')
            view = SheriffExecutiveDashboardView.as_view()
            response = view(request)
            data = response.data
            valid_kpis = (
                response.status_code == 200 and 
                data.get('total_crimes') == 1200011 and 
                data.get('arrest_rate') == 29.5
            )
            self.log_result(
                "TC-BE-04", "Backend API",
                "Métricas reales del Tablero Ejecutivo del Sheriff (GET .../dashboard/)",
                valid_kpis,
                f"Total Crimes: {data.get('total_crimes'):,}, Arrest Rate: {data.get('arrest_rate')}%"
            )
        except Exception as e:
            self.log_result("TC-BE-04", "Backend API", "GET Sheriff Dashboard KPIs", False, str(e))

    def run_integration_tests(self):
        print("\n=======================================================")
        print("🔗 3. EJECUTANDO PRUEBAS DE INTEGRACIÓN Y VISTAS TÁCTICAS")
        print("=======================================================")

        # TC-INT-01: Directorio de Bandas Criminales ordenado
        try:
            request = self.factory.get('/api/criminal/gangs/')
            view = GangCRUDView.as_view()
            response = view(request)
            data = response.data
            gangs_ok = response.status_code == 200 and len(data) >= 4
            self.log_result(
                "TC-INT-01", "Integración",
                "Consulta de Bandas Criminales (GET /api/criminal/gangs/)",
                gangs_ok,
                f"Status: {response.status_code}, Total Bandas: {len(data)}"
            )
        except Exception as e:
            self.log_result("TC-INT-01", "Integración", "GET /api/criminal/gangs/", False, str(e))

        # TC-INT-02: Directorio de Sospechosos y Vehículos Vinculados (OT13)
        try:
            request = self.factory.get('/api/criminal/suspects-vehicles/')
            view = SuspectVehiclesDirectoryView.as_view()
            response = view(request)
            data = response.data
            veh_ok = response.status_code == 200 and isinstance(data, list)
            self.log_result(
                "TC-INT-02", "Integración",
                "Directorio de Sospechosos y Vehículos (OT13)",
                veh_ok,
                f"Status: {response.status_code}, Vehículos vinculados: {len(data)}"
            )
        except Exception as e:
            self.log_result("TC-INT-02", "Integración", "GET /api/criminal/suspects-vehicles/", False, str(e))

        # TC-INT-03: Directorio de Testigos y Víctimas
        try:
            req_w = self.factory.get('/api/criminal/witnesses/')
            req_v = self.factory.get('/api/criminal/victims/')
            res_w = WitnessCRUDView.as_view()(req_w)
            res_v = VictimCRUDView.as_view()(req_v)
            wv_ok = res_w.status_code == 200 and res_v.status_code == 200
            self.log_result(
                "TC-INT-03", "Integración",
                "Directorio de Testigos y Víctimas (OT7)",
                wv_ok,
                f"Testigos: {len(res_w.data)}, Víctimas: {len(res_v.data)}"
            )
        except Exception as e:
            self.log_result("TC-INT-03", "Integración", "Testigos y Víctimas", False, str(e))

    def print_summary(self):
        total = self.passed_tests + self.failed_tests
        pass_rate = (self.passed_tests / total * 100) if total > 0 else 0
        print("\n=======================================================")
        print("📊 RESUMEN FINAL DEL PLAN DE PRUEBAS EJECUTADO")
        print("=======================================================")
        print(f"Total de Casos de Prueba Ejecutados: {total}")
        print(f"Pruebas Exitosas (Passed):           {self.passed_tests} ✅")
        print(f"Pruebas Fallidas (Failed):           {self.failed_tests} ❌")
        print(f"Tasa de Aprobación (Pass Rate):      {pass_rate:.1f}%")
        print("=======================================================\n")

if __name__ == "__main__":
    runner = QATestRunner()
    runner.run_database_tests()
    runner.run_backend_tests()
    runner.run_integration_tests()
    runner.print_summary()
