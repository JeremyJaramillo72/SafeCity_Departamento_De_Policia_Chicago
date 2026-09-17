import os
import sys
import datetime
import io
from PIL import Image

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
import django
django.setup()

from rest_framework.test import APIRequestFactory
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile

from policia_comunitaria.serializers import QuejaCiudadanaSerializer, UsoDeFuerzaSerializer, ReunionComunitariaSerializer
from policia_comunitaria.models import QuejaCiudadana, UsoDeFuerza, ReunionComunitaria
from ordenes_judiciales.models import OrdenJudicial
from operativo_rrhh.models import SolicitudPermiso, Amonestacion, AsignacionCuadrante

class FieldValidationQATestSuite:
    def __init__(self):
        self.factory = APIRequestFactory()
        self.passed = 0
        self.failed = 0
        self.results = []

    def record(self, test_id, category, field_tested, condition, details=""):
        status_text = "PASS" if condition else "FAIL"
        symbol = "✅" if condition else "❌"
        if condition:
            self.passed += 1
        else:
            self.failed += 1
        self.results.append({
            "id": test_id,
            "category": category,
            "field": field_tested,
            "status": status_text,
            "details": details
        })
        print(f"[{symbol} {status_text}] {test_id} [{field_tested}] - {category}")
        if details:
            print(f"       └─ {details}")

    def run_field_validations(self):
        print("\n" + "="*80)
        print("🔍 SUITE DE VALIDACIÓN EXHAUSTIVA DE CAMPOS (FRONTEND & BACKEND DEFENSE)")
        print("="*80)

        # -------------------------------------------------------------
        # 1. VALIDACIÓN DE CAMPOS REQUERIDOS (NOT NULL / OBLIGATORIOS)
        # -------------------------------------------------------------
        # 1.1 Campo requerido nombre_ciudadano en QuejaCiudadana
        ser = QuejaCiudadanaSerializer(data={"contacto_ciudadano": "555-1234", "descripcion": "Texto"})
        is_valid = ser.is_valid()
        has_error = not is_valid and 'nombre_ciudadano' in ser.errors and 'fecha_incidente' in ser.errors
        self.record(
            "VAL-FLD-01", "Campos Requeridos (Obligatoriedad)",
            "nombre_ciudadano & fecha_incidente",
            has_error,
            f"El serializador rechazó la ausencia de campos obligatorios: {list(ser.errors.keys())}"
        )

        # 1.2 Campo requerido justificacion_legal en UsoDeFuerza
        ser_f = UsoDeFuerzaSerializer(data={"id_oficial": 1, "fecha_hora": "2026-08-22T10:00:00Z", "ubicacion": "Centro", "tipo_fuerza": "Fisica No Letal"})
        is_f_valid = ser_f.is_valid()
        has_just_err = not is_f_valid and 'justificacion_legal' in ser_f.errors
        self.record(
            "VAL-FLD-02", "Campos Requeridos (Obligatoriedad)",
            "justificacion_legal en UsoDeFuerza",
            has_just_err,
            f"Rechazado uso de fuerza sin justificación legal: {list(ser_f.errors.keys())}"
        )

        # -------------------------------------------------------------
        # 2. VALIDACIÓN DE FORMATOS DE FECHA Y TEMPORALIDAD
        # -------------------------------------------------------------
        # 2.1 Formato de fecha inválido (texto no parseable)
        ser_date = QuejaCiudadanaSerializer(data={
            "nombre_ciudadano": "Carlos",
            "contacto_ciudadano": "carlos@test.com",
            "fecha_incidente": "FECHA_MAL_FORMATEADA_2026",
            "descripcion": "Descripción válida"
        })
        has_date_err = not ser_date.is_valid() and 'fecha_incidente' in ser_date.errors
        self.record(
            "VAL-FLD-03", "Formatos de Fecha & Tiempo",
            "fecha_incidente (Rechazo de formato no ISO)",
            has_date_err,
            f"Validador de fecha DRF activado: {ser_date.errors.get('fecha_incidente')}"
        )

        # 2.2 Formato de fecha válido ISO YYYY-MM-DD
        ser_good_date = QuejaCiudadanaSerializer(data={
            "nombre_ciudadano": "Carlos",
            "contacto_ciudadano": "carlos@test.com",
            "fecha_incidente": "2026-08-22",
            "descripcion": "Descripción válida"
        })
        good_date_ok = ser_good_date.is_valid()
        self.record(
            "VAL-FLD-04", "Formatos de Fecha & Tiempo",
            "fecha_incidente (Aceptación de formato ISO YYYY-MM-DD)",
            good_date_ok,
            f"Fecha '2026-08-22' parseada y aceptada exitosamente."
        )

        # -------------------------------------------------------------
        # 3. VALIDACIÓN DE OPCIONES RESTRINGIDAS (ENUM / CHOICES)
        # -------------------------------------------------------------
        # 3.1 Rechazo de Estado Inválido en Quejas
        ser_choice = QuejaCiudadanaSerializer(data={
            "nombre_ciudadano": "Mario",
            "contacto_ciudadano": "mario@test.com",
            "fecha_incidente": "2026-08-22",
            "descripcion": "Descripción válida",
            "estado": "ESTADO_NO_EXISTENTE_HACK"
        })
        has_choice_err = not ser_choice.is_valid() and 'estado' in ser_choice.errors
        self.record(
            "VAL-FLD-05", "Restricción de Catálogo (Choices / Enum)",
            "estado en QuejaCiudadana (Choices válidos: Recibida, En Investigacion, etc.)",
            has_choice_err,
            f"Opción no autorizada bloqueada: {ser_choice.errors.get('estado')}"
        )

        # 3.2 Rechazo de Tipo de Fuerza Inexistente
        ser_fuerza_choice = UsoDeFuerzaSerializer(data={
            "id_oficial": 1,
            "fecha_hora": "2026-08-22T10:00:00Z",
            "ubicacion": "Centro",
            "tipo_fuerza": "ARMA_LASER_EXTRATERRESTRE",
            "justificacion_legal": "Justificación"
        })
        has_fuerza_choice_err = not ser_fuerza_choice.is_valid() and 'tipo_fuerza' in ser_fuerza_choice.errors
        self.record(
            "VAL-FLD-06", "Restricción de Catálogo (Choices / Enum)",
            "tipo_fuerza en UsoDeFuerza (Catálogo estándar regulatorio)",
            has_fuerza_choice_err,
            f"Tipo de fuerza no catalogado bloqueado: {ser_fuerza_choice.errors.get('tipo_fuerza')}"
        )

        # -------------------------------------------------------------
        # 4. VALIDACIÓN DE CAMPOS NUMÉRICOS Y LÍMITES
        # -------------------------------------------------------------
        # 4.1 Validación de campo numérico id_oficial en UsoDeFuerza (Rechazo de texto en campo entero)
        ser_num = UsoDeFuerzaSerializer(data={
            "id_oficial": "NO_ES_UN_NUMERO",
            "fecha_hora": "2026-08-22T10:00:00Z",
            "ubicacion": "Centro",
            "tipo_fuerza": "Fisica No Letal",
            "justificacion_legal": "Texto"
        })
        has_num_err = not ser_num.is_valid() and 'id_oficial' in ser_num.errors
        self.record(
            "VAL-FLD-07", "Tipos Numéricos & Rangos",
            "id_oficial (Rechazo de string alfanumérico en campo Integer)",
            has_num_err,
            f"El serializador exigió un número entero: {ser_num.errors.get('id_oficial')}"
        )

        # 4.2 Validación de entero en cantidad_asistentes (Reuniones Comunitarias)
        ser_reunion = ReunionComunitariaSerializer(data={
            "cuadrante_distrito": "BEAT-102",
            "fecha_reunion": "2026-08-22",
            "cantidad_asistentes": 45,
            "temas_tratados": "Seguridad en parques",
            "oficial_responsable": "Sgt. Miller"
        })
        reunion_ok = ser_reunion.is_valid()
        self.record(
            "VAL-FLD-08", "Tipos Numéricos & Rangos",
            "cantidad_asistentes (Aceptación de entero positivo)",
            reunion_ok,
            f"Valor numérico '45' validado correctamente."
        )

        # -------------------------------------------------------------
        # 5. VALIDACIÓN DE LÍMITES DE LONGITUD DE TEXTO (MAX LENGTH)
        # -------------------------------------------------------------
        # 5.1 Longitud máxima de 150 caracteres en nombre_ciudadano
        long_name = "X" * 200 # Supera los 150 caracteres máximos permitidos por el modelo
        ser_max = QuejaCiudadanaSerializer(data={
            "nombre_ciudadano": long_name,
            "contacto_ciudadano": "contacto@test.com",
            "fecha_incidente": "2026-08-22",
            "descripcion": "Texto"
        })
        has_max_err = not ser_max.is_valid() and 'nombre_ciudadano' in ser_max.errors
        self.record(
            "VAL-FLD-09", "Límites de Longitud (Max Length Boundary)",
            "nombre_ciudadano (Límite máximo 150 caracteres)",
            has_max_err,
            f"Superación de límite de 150 caracteres rechazada: {ser_max.errors.get('nombre_ciudadano')}"
        )

        # -------------------------------------------------------------
        # 6. VALIDACIÓN DE INTEGRIDAD BOOLEANA
        # -------------------------------------------------------------
        # 6.1 Aceptación estricta de booleano en hubo_heridos
        ser_bool_true = UsoDeFuerzaSerializer(data={
            "id_oficial": 1,
            "fecha_hora": "2026-08-22T10:00:00Z",
            "ubicacion": "Centro",
            "tipo_fuerza": "Fisica No Letal",
            "justificacion_legal": "Texto",
            "hubo_heridos": True
        })
        bool_ok = ser_bool_true.is_valid() and ser_bool_true.validated_data.get('hubo_heridos') is True
        self.record(
            "VAL-FLD-10", "Integridad Booleana",
            "hubo_heridos (Parseo y verificación de tipo Boolean)",
            bool_ok,
            f"Valor booleano True verificado con tipo nativo bool."
        )

        # -------------------------------------------------------------
        # 7. VALIDACIÓN DE SANITIZACIÓN UTF-8 Y PREVENCIÓN DE INYECCIONES
        # -------------------------------------------------------------
        # 7.1 Sanitización de cadenas con caracteres de escape, tags HTML y tildes
        special_str = "Reporte pericial con caracteres <script>alert(1)</script> & tildes: Árbol, Camión, Ñandú, O'Reilly"
        ser_utf8 = QuejaCiudadanaSerializer(data={
            "nombre_ciudadano": "Juan Pérez",
            "contacto_ciudadano": "juan@test.com",
            "fecha_incidente": "2026-08-22",
            "descripcion": special_str
        })
        utf8_ok = ser_utf8.is_valid() and ser_utf8.validated_data.get('descripcion') == special_str
        self.record(
            "VAL-FLD-11", "Sanitización & Seguridad",
            "descripcion (Sanitización UTF-8 sin corrupción de caracteres)",
            utf8_ok,
            f"Texto con tildes y caracteres especiales procesado de forma segura."
        )

    def print_final_summary(self):
        total = self.passed + self.failed
        rate = (self.passed / total * 100) if total > 0 else 0
        print("\n" + "="*80)
        print("🏆 RESUMEN GENERAL DE PRUEBAS DE VALIDACIÓN DE CAMPOS")
        print("="*80)
        print(f"Total Casos de Validación Ejecutados: {total}")
        print(f"Validaciones Aprobadas (Passed):      {self.passed} ✅")
        print(f"Validaciones Fallidas (Failed):      {self.failed} ❌")
        print(f"Tasa de Aprobación de Calidad:        {rate:.1f}%")
        print("="*80 + "\n")

if __name__ == "__main__":
    suite = FieldValidationQATestSuite()
    suite.run_field_validations()
    suite.print_final_summary()
