import os
import sys
import io
import json
import datetime
from PIL import Image

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
import django
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from policia_comunitaria.views import QuejaCiudadanaViewSet, UsoDeFuerzaViewSet, ReunionComunitariaViewSet
from policia_comunitaria.models import QuejaCiudadana, UsoDeFuerza, ReunionComunitaria
from policia_comunitaria.serializers import QuejaCiudadanaSerializer, UsoDeFuerzaSerializer
from inteligencia_criminal.views import EvidenceImageUploadView

class BackendQATestSuite:
    def __init__(self):
        self.factory = APIRequestFactory()
        self.passed = 0
        self.failed = 0
        self.results = []
        # Crear o recuperar usuario de prueba para endpoints autenticados
        self.test_user, _ = User.objects.get_or_create(
            username='officer_qa_test',
            defaults={'email': 'qa@safecity.org', 'is_staff': True}
        )

    def record(self, test_id, category, name, condition, details=""):
        status_text = "PASS" if condition else "FAIL"
        symbol = "✅" if condition else "❌"
        if condition:
            self.passed += 1
        else:
            self.failed += 1
        self.results.append({
            "id": test_id,
            "category": category,
            "name": name,
            "status": status_text,
            "details": details
        })
        print(f"[{symbol} {status_text}] {test_id} - {name}")
        if details:
            print(f"       └─ {details}")

    def run_suite_1_rest_contracts_and_crud(self):
        print("\n" + "="*75)
        print("🌐 SUITE 1: CONTRATOS REST Y OPERACIONES CRUD EN CONTROLADORES")
        print("="*75)

        # 1.1 GET /api/comunidad/quejas/ (Listar)
        try:
            req = self.factory.get('/api/comunidad/quejas/')
            view = QuejaCiudadanaViewSet.as_view({'get': 'list'})
            res = view(req)
            is_ok = res.status_code == status.HTTP_200_OK and isinstance(res.data, list)
            self.record(
                "TC-BE-REST-01", "Contratos REST",
                "Consulta de Lista Serializada (GET /api/comunidad/quejas/ -> 200 OK)",
                is_ok,
                f"HTTP Status: {res.status_code}, Formato: Array JSON, Elementos: {len(res.data)}"
            )
        except Exception as e:
            self.record("TC-BE-REST-01", "Contratos REST", "GET /api/comunidad/quejas/", False, str(e))

        # 1.2 POST /api/comunidad/quejas/ (Crear)
        created_id = None
        try:
            payload = {
                "nombre_ciudadano": "Elena Rostova",
                "contacto_ciudadano": "555-0199 / elena.rostova@chicago.org",
                "id_oficial_implicado": 5,
                "fecha_incidente": "2026-08-20",
                "descripcion": "Demora excesiva en la respuesta al llamado de altercado vecinal.",
                "estado": "Recibida"
            }
            req = self.factory.post('/api/comunidad/quejas/', payload, format='json')
            view = QuejaCiudadanaViewSet.as_view({'post': 'create'})
            res = view(req)
            created_ok = res.status_code == status.HTTP_201_CREATED and 'id' in res.data
            if created_ok:
                created_id = res.data['id']
            self.record(
                "TC-BE-REST-02", "Contratos REST",
                "Creación de Recurso con Payload JSON (POST .../quejas/ -> 201 Created)",
                created_ok,
                f"HTTP Status: {res.status_code}, ID Asignado: #{created_id}, Ciudadano: '{payload['nombre_ciudadano']}'"
            )
        except Exception as e:
            self.record("TC-BE-REST-02", "Contratos REST", "POST /api/comunidad/quejas/", False, str(e))

        # 1.3 GET /api/comunidad/quejas/<id>/ (Detalle)
        if created_id:
            try:
                req = self.factory.get(f'/api/comunidad/quejas/{created_id}/')
                view = QuejaCiudadanaViewSet.as_view({'get': 'retrieve'})
                res = view(req, pk=created_id)
                detail_ok = res.status_code == status.HTTP_200_OK and res.data.get('id') == created_id
                self.record(
                    "TC-BE-REST-03", "Contratos REST",
                    "Consulta de Detalle por Identificador (GET .../quejas/<id>/ -> 200 OK)",
                    detail_ok,
                    f"HTTP Status: {res.status_code}, Registro verificado: ID #{created_id}"
                )
            except Exception as e:
                self.record("TC-BE-REST-03", "Contratos REST", "GET Detail Queja", False, str(e))

        # 1.4 PATCH /api/comunidad/quejas/<id>/ (Actualización Parcial)
        if created_id:
            try:
                update_payload = {"estado": "En Investigacion", "resolucion": "Asignado a Asuntos Internos."}
                req = self.factory.patch(f'/api/comunidad/quejas/{created_id}/', update_payload, format='json')
                view = QuejaCiudadanaViewSet.as_view({'patch': 'partial_update'})
                res = view(req, pk=created_id)
                patch_ok = res.status_code == status.HTTP_200_OK and res.data.get('estado') == 'En Investigacion'
                self.record(
                    "TC-BE-REST-04", "Contratos REST",
                    "Actualización Parcial Atómica (PATCH .../quejas/<id>/ -> 200 OK)",
                    patch_ok,
                    f"HTTP Status: {res.status_code}, Nuevo Estado: '{res.data.get('estado')}'"
                )
            except Exception as e:
                self.record("TC-BE-REST-04", "Contratos REST", "PATCH Queja", False, str(e))

        # 1.5 DELETE /api/comunidad/quejas/<id>/ (Eliminación)
        if created_id:
            try:
                req = self.factory.delete(f'/api/comunidad/quejas/{created_id}/')
                view = QuejaCiudadanaViewSet.as_view({'delete': 'destroy'})
                res = view(req, pk=created_id)
                del_ok = res.status_code == status.HTTP_204_NO_CONTENT
                self.record(
                    "TC-BE-REST-05", "Contratos REST",
                    "Eliminación Segura de Recurso (DELETE .../quejas/<id>/ -> 204 No Content)",
                    del_ok,
                    f"HTTP Status: {res.status_code} (Recurso #{created_id} eliminado exitosamente)."
                )
            except Exception as e:
                self.record("TC-BE-REST-05", "Contratos REST", "DELETE Queja", False, str(e))

        # 1.6 GET /api/comunidad/quejas/999999/ (Recurso Inexistente)
        try:
            req = self.factory.get('/api/comunidad/quejas/999999/')
            view = QuejaCiudadanaViewSet.as_view({'get': 'retrieve'})
            res = view(req, pk=999999)
            not_found_ok = res.status_code == status.HTTP_404_NOT_FOUND
            self.record(
                "TC-BE-REST-06", "Contratos REST",
                "Manejo de Recurso Inexistente (GET .../quejas/999999/ -> 404 Not Found)",
                not_found_ok,
                f"HTTP Status: {res.status_code} (Manejo correcto de excepción Http404)."
            )
        except Exception as e:
            self.record("TC-BE-REST-06", "Contratos REST", "404 Not Found Test", False, str(e))

    def run_suite_2_input_validation_and_sanitization(self):
        print("\n" + "="*75)
        print("🛡️ SUITE 2: VALIDACIONES DE ENTRADA, PAYLOADS Y SANITIZACIÓN")
        print("="*75)

        # 2.1 Rechazo de Campos Obligatorios Ausentes
        try:
            invalid_payload = {"contacto_ciudadano": "solo-telefono"} # Falta 'nombre_ciudadano', 'fecha_incidente', 'descripcion'
            req = self.factory.post('/api/comunidad/quejas/', invalid_payload, format='json')
            view = QuejaCiudadanaViewSet.as_view({'post': 'create'})
            res = view(req)
            is_rejected = res.status_code == status.HTTP_400_BAD_REQUEST and 'nombre_ciudadano' in res.data
            self.record(
                "TC-BE-VAL-01", "Validación de Entradas",
                "Rechazo de Payload con Campos Requeridos Faltantes (400 Bad Request)",
                is_rejected,
                f"HTTP Status: {res.status_code}, Errores detectados: {list(res.data.keys())}"
            )
        except Exception as e:
            self.record("TC-BE-VAL-01", "Validación de Entradas", "Falta campos requeridos", False, str(e))

        # 2.2 Validación de Tipos y Formatos de Fecha
        try:
            bad_date_payload = {
                "nombre_ciudadano": "Juan Perez",
                "contacto_ciudadano": "juan@test.com",
                "fecha_incidente": "FECHA_INVALIDA_2026",
                "descripcion": "Descripción de prueba"
            }
            req = self.factory.post('/api/comunidad/quejas/', bad_date_payload, format='json')
            view = QuejaCiudadanaViewSet.as_view({'post': 'create'})
            res = view(req)
            bad_date_rejected = res.status_code == status.HTTP_400_BAD_REQUEST and 'fecha_incidente' in res.data
            self.record(
                "TC-BE-VAL-02", "Validación de Entradas",
                "Rechazo de Formatos de Fecha Inválidos (400 Bad Request)",
                bad_date_rejected,
                f"HTTP Status: {res.status_code}, Detalle validador: {res.data.get('fecha_incidente')}"
            )
        except Exception as e:
            self.record("TC-BE-VAL-02", "Validación de Entradas", "Formato fecha inválido", False, str(e))

        # 2.3 Validación de Opciones Restringidas (Choices Enum)
        try:
            bad_choice_payload = {
                "nombre_ciudadano": "Maria Gomez",
                "contacto_ciudadano": "maria@test.com",
                "fecha_incidente": "2026-08-21",
                "descripcion": "Descripción de prueba",
                "estado": "ESTADO_HACK_INVALIDO"
            }
            req = self.factory.post('/api/comunidad/quejas/', bad_choice_payload, format='json')
            view = QuejaCiudadanaViewSet.as_view({'post': 'create'})
            res = view(req)
            bad_choice_rejected = res.status_code == status.HTTP_400_BAD_REQUEST and 'estado' in res.data
            self.record(
                "TC-BE-VAL-03", "Validación de Entradas",
                "Rechazo de Valores Fuera de Enum/Choices Permitidos (400 Bad Request)",
                bad_choice_rejected,
                f"HTTP Status: {res.status_code}, Detalle validador: {res.data.get('estado')}"
            )
        except Exception as e:
            self.record("TC-BE-VAL-03", "Validación de Entradas", "Choice inválido", False, str(e))

        # 2.4 Sanitización de Caracteres Especiales y Acentos (UTF-8)
        try:
            utf8_payload = {
                "nombre_ciudadano": "Sebastián José Peña-Ñañez",
                "contacto_ciudadano": "contacto+test@jurisdicción.policial.gov",
                "fecha_incidente": "2026-08-22",
                "descripcion": "Inspección pericial en Calle O'Higgins #450 — ¡Evidencias & Testimonios 100% OK!",
                "estado": "Recibida"
            }
            req = self.factory.post('/api/comunidad/quejas/', utf8_payload, format='json')
            view = QuejaCiudadanaViewSet.as_view({'post': 'create'})
            res = view(req)
            utf8_ok = res.status_code == status.HTTP_201_CREATED and res.data.get('nombre_ciudadano') == utf8_payload['nombre_ciudadano']
            if utf8_ok:
                QuejaCiudadana.objects.filter(id=res.data['id']).delete()
            self.record(
                "TC-BE-VAL-04", "Sanitización UTF-8",
                "Persistencia y Sanitización de Caracteres Especiales y Tildes (UTF-8)",
                utf8_ok,
                f"Texto sanitizado y recuperado idéntico: '{utf8_payload['nombre_ciudadano']}'"
            )
        except Exception as e:
            self.record("TC-BE-VAL-04", "Sanitización UTF-8", "Caracteres especiales", False, str(e))

    def run_suite_3_serialization_and_types(self):
        print("\n" + "="*75)
        print("📦 SUITE 3: INTEGRIDAD DE SERIALIZADORES Y TIPADO JSON")
        print("="*75)

        # 3.1 Integridad de Tipos en QuejaCiudadanaSerializer
        try:
            mock_queja = QuejaCiudadana(
                id=999,
                nombre_ciudadano="Test Ciudadano",
                contacto_ciudadano="555-9000",
                id_oficial_implicado=4,
                fecha_incidente=datetime.date(2026, 8, 22),
                descripcion="Prueba de tipado de serializador",
                estado="Recibida",
                fecha_registro=datetime.datetime.now()
            )
            serializer = QuejaCiudadanaSerializer(mock_queja)
            data = serializer.data
            types_ok = (
                isinstance(data['id'], int) and
                isinstance(data['nombre_ciudadano'], str) and
                isinstance(data['id_oficial_implicado'], int) and
                isinstance(data['fecha_incidente'], str)
            )
            self.record(
                "TC-BE-SER-01", "Serialización",
                "Integridad de Tipos de Datos en 'QuejaCiudadanaSerializer'",
                types_ok,
                f"Tipos verificados: id (int), oficial (int), fecha (date str), texto (str)."
            )
        except Exception as e:
            self.record("TC-BE-SER-01", "Serialización", "Tipado QuejaSerializer", False, str(e))

        # 3.2 Integridad de Flags Booleanos y Enums en UsoDeFuerzaSerializer
        try:
            mock_fuerza = UsoDeFuerza(
                id=10,
                id_oficial=1,
                fecha_hora=datetime.datetime.now(),
                ubicacion="Sector Central",
                tipo_fuerza="Arma Electrica (Taser)",
                justificacion_legal="Sujeto armado desobedeciendo orden de alto.",
                hubo_heridos=False,
                fecha_registro=datetime.datetime.now()
            )
            serializer_f = UsoDeFuerzaSerializer(mock_fuerza)
            data_f = serializer_f.data
            bool_ok = isinstance(data_f['hubo_heridos'], bool) and data_f['hubo_heridos'] is False
            self.record(
                "TC-BE-SER-02", "Serialización",
                "Integridad de Flags Booleanos en 'UsoDeFuerzaSerializer'",
                bool_ok,
                f"Campo 'hubo_heridos' serializado como booleano nativo: {data_f['hubo_heridos']} (no string)."
            )
        except Exception as e:
            self.record("TC-BE-SER-02", "Serialización", "Booleano UsoDeFuerzaSerializer", False, str(e))

    def run_suite_4_security_and_multipart(self):
        print("\n" + "="*75)
        print("🔒 SUITE 4: SEGURIDAD, CONTROL DE ACCESOS Y MULTIMEDIA MULTIPART")
        print("="*75)

        # 4.1 Permisos en UsoDeFuerza (Requiere Autenticación)
        try:
            # Petición anónima (sin login)
            req_anon = self.factory.get('/api/comunidad/uso-fuerza/')
            view_fuerza = UsoDeFuerzaViewSet.as_view({'get': 'list'})
            res_anon = view_fuerza(req_anon)
            auth_required_ok = res_anon.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)

            # Petición autenticada (con usuario oficial)
            req_auth = self.factory.get('/api/comunidad/uso-fuerza/')
            force_authenticate(req_auth, user=self.test_user)
            res_auth = view_fuerza(req_auth)
            auth_pass_ok = res_auth.status_code == status.HTTP_200_OK

            self.record(
                "TC-BE-SEC-01", "Control de Acceso",
                "Protección de Endpoints Críticos (RBAC / IsAuthenticated)",
                auth_required_ok and auth_pass_ok,
                f"Anónimo: {res_anon.status_code} (Bloqueado) | Autenticado: {res_auth.status_code} (Permitido)."
            )
        except Exception as e:
            self.record("TC-BE-SEC-01", "Control de Acceso", "RBAC UsoDeFuerza", False, str(e))

        # 4.2 Subida Multipart de Archivos Multimedia Periciales
        try:
            img_io = io.BytesIO()
            img = Image.new('RGB', (60, 60), color='blue')
            img.save(img_io, format='JPEG')
            img_io.seek(0)
            
            uploaded_file = SimpleUploadedFile("evidencia_forense_qa.jpg", img_io.getvalue(), content_type="image/jpeg")
            req_upload = self.factory.post('/api/criminal/evidence/upload/', {'file': uploaded_file}, format='multipart')
            view_upload = EvidenceImageUploadView.as_view()
            res_upload = view_upload(req_upload)
            upload_ok = res_upload.status_code == status.HTTP_200_OK and 'url' in res_upload.data
            self.record(
                "TC-BE-SEC-02", "Manejo Multimedia",
                "Subida de Archivos Multipart y Generación de Enlace Seguro (200 OK)",
                upload_ok,
                f"HTTP Status: {res_upload.status_code}, URL generada: {res_upload.data.get('url', '')[:45]}..."
            )
        except Exception as e:
            self.record("TC-BE-SEC-02", "Manejo Multimedia", "Subida multipart", False, str(e))

    def print_final_summary(self):
        total = self.passed + self.failed
        rate = (self.passed / total * 100) if total > 0 else 0
        print("\n" + "="*75)
        print("🏆 RESUMEN GENERAL DE PRUEBAS DE BACKEND Y VALIDACIONES")
        print("="*75)
        print(f"Total Casos de Prueba Ejecutados:  {total}")
        print(f"Casos Exitosos (Passed):           {self.passed} ✅")
        print(f"Casos Fallidos (Failed):           {self.failed} ❌")
        print(f"Tasa de Aprobación de Calidad:     {rate:.1f}%")
        print("="*75 + "\n")

if __name__ == "__main__":
    suite = BackendQATestSuite()
    suite.run_suite_1_rest_contracts_and_crud()
    suite.run_suite_2_input_validation_and_sanitization()
    suite.run_suite_3_serialization_and_types()
    suite.run_suite_4_security_and_multipart()
    suite.print_final_summary()
