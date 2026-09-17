import os
import sys
import datetime

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
import django
django.setup()

from rest_framework import serializers
from policia_comunitaria.serializers import QuejaCiudadanaSerializer, UsoDeFuerzaSerializer, ReunionComunitariaSerializer

class TypeMismatchQATestSuite:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.results = []

    def record(self, test_id, category, input_tested, expected_type, condition, details=""):
        status_text = "PASS" if condition else "FAIL"
        symbol = "✅" if condition else "❌"
        if condition:
            self.passed += 1
        else:
            self.failed += 1
        self.results.append({
            "id": test_id,
            "category": category,
            "input": input_tested,
            "expected_type": expected_type,
            "status": status_text,
            "details": details
        })
        print(f"[{symbol} {status_text}] {test_id} [{input_tested} ➔ {expected_type}] - {category}")
        if details:
            print(f"       └─ {details}")

    def run_type_mismatch_tests(self):
        print("\n" + "="*85)
        print("🔢 SUITE DE PRUEBAS DE INCOMPATIBILIDAD DE TIPOS (TYPE SAFETY & CASTING)")
        print("="*85)

        # -------------------------------------------------------------
        # 1. TEXTO EN LUGAR DE ENTERO (STRING IN INTEGER FIELD)
        # -------------------------------------------------------------
        # 1.1 Enviar texto "cinco_oficiales" en campo id_oficial (IntegerField)
        ser_str_int = UsoDeFuerzaSerializer(data={
            "id_oficial": "cinco_oficiales",
            "fecha_hora": "2026-08-22T10:00:00Z",
            "ubicacion": "Distrito 1",
            "tipo_fuerza": "Fisica No Letal",
            "justificacion_legal": "Control de sospechoso"
        })
        rejected_str_int = not ser_str_int.is_valid() and 'id_oficial' in ser_str_int.errors
        self.record(
            "TYP-01", "Texto en Campo Entero",
            "id_oficial: 'cinco_oficiales'", "Integer",
            rejected_str_int,
            f"Error capturado: {ser_str_int.errors.get('id_oficial')}"
        )

        # 1.2 Enviar caracteres especiales y SQL injection en campo entero ("1; DROP TABLE")
        ser_sql_int = UsoDeFuerzaSerializer(data={
            "id_oficial": "1; DROP TABLE usuarios;",
            "fecha_hora": "2026-08-22T10:00:00Z",
            "ubicacion": "Distrito 1",
            "tipo_fuerza": "Fisica No Letal",
            "justificacion_legal": "Control"
        })
        rejected_sql_int = not ser_sql_int.is_valid() and 'id_oficial' in ser_sql_int.errors
        self.record(
            "TYP-02", "Inyección / Texto Malicioso en Entero",
            "id_oficial: '1; DROP TABLE usuarios;'", "Integer",
            rejected_sql_int,
            f"Inyección neutralizada y tipada como error: {ser_sql_int.errors.get('id_oficial')}"
        )

        # -------------------------------------------------------------
        # 2. FLOTANTE / DECIMAL EN LUGAR DE ENTERO ESTRICTO
        # -------------------------------------------------------------
        # 2.1 Enviar decimal "45.89" en cantidad_asistentes (Personas no pueden ser fraccionadas)
        ser_float_int = ReunionComunitariaSerializer(data={
            "cuadrante_distrito": "BEAT-102",
            "fecha_reunion": "2026-08-22",
            "cantidad_asistentes": "45.89",
            "temas_tratados": "Seguridad ciudadana",
            "oficial_responsable": "Ofc. Miller"
        })
        rejected_float_int = not ser_float_int.is_valid() and 'cantidad_asistentes' in ser_float_int.errors
        self.record(
            "TYP-03", "Decimal en Campo Entero Discreto",
            "cantidad_asistentes: '45.89'", "Integer",
            rejected_float_int,
            f"El motor rechazó el valor fraccionario para conteo de personas: {ser_float_int.errors.get('cantidad_asistentes')}"
        )

        # -------------------------------------------------------------
        # 3. TEXTO ARBITRARIO EN LUGAR DE BOOLEANO
        # -------------------------------------------------------------
        # 3.1 Enviar texto "tal_vez" / "no_se_sabe" en campo hubo_heridos (BooleanField)
        ser_bool_str = UsoDeFuerzaSerializer(data={
            "id_oficial": 1,
            "fecha_hora": "2026-08-22T10:00:00Z",
            "ubicacion": "Distrito 1",
            "tipo_fuerza": "Fisica No Letal",
            "justificacion_legal": "Control",
            "hubo_heridos": "tal_vez_hubo_heridos"
        })
        rejected_bool_str = not ser_bool_str.is_valid() and 'hubo_heridos' in ser_bool_str.errors
        self.record(
            "TYP-04", "Texto Arbitrario en Booleano",
            "hubo_heridos: 'tal_vez_hubo_heridos'", "Boolean",
            rejected_bool_str,
            f"Error capturado: {ser_bool_str.errors.get('hubo_heridos')}"
        )

        # -------------------------------------------------------------
        # 4. VALORES ENTEROS EN CAMPOS DE FECHA
        # -------------------------------------------------------------
        # 4.1 Enviar número entero 99999999 en lugar de fecha ISO
        ser_num_date = QuejaCiudadanaSerializer(data={
            "nombre_ciudadano": "Pedro",
            "contacto_ciudadano": "pedro@test.com",
            "fecha_incidente": 99999999,
            "descripcion": "Descripción"
        })
        rejected_num_date = not ser_num_date.is_valid() and 'fecha_incidente' in ser_num_date.errors
        self.record(
            "TYP-05", "Número Entero en Campo Date",
            "fecha_incidente: 99999999", "Date (YYYY-MM-DD)",
            rejected_num_date,
            f"El serializador exigió formato de calendario válido: {ser_num_date.errors.get('fecha_incidente')}"
        )

        # -------------------------------------------------------------
        # 5. OBJETOS / ARRAYS EN CAMPOS DE TEXTO PLANO
        # -------------------------------------------------------------
        # 5.1 Enviar array JSON ['Juan', 'Pedro'] en campo nombre_ciudadano (CharField)
        ser_arr_str = QuejaCiudadanaSerializer(data={
            "nombre_ciudadano": ["Juan", "Pedro", "Lista_Invalida"],
            "contacto_ciudadano": "contacto@test.com",
            "fecha_incidente": "2026-08-22",
            "descripcion": "Descripción"
        })
        rejected_arr_str = not ser_arr_str.is_valid() and 'nombre_ciudadano' in ser_arr_str.errors
        self.record(
            "TYP-06", "Array / Objeto en Campo String",
            "nombre_ciudadano: ['Juan', 'Pedro']", "String",
            rejected_arr_str,
            f"Rechazo de estructura de datos no escalar: {ser_arr_str.errors.get('nombre_ciudadano')}"
        )

        # -------------------------------------------------------------
        # 6. CASTEOS VÁLIDOS (NUMERIC STRING TO INTEGER)
        # -------------------------------------------------------------
        # 6.1 Enviar string numérico "25" en campo id_oficial (Casteo determinístico estándar)
        ser_valid_cast = UsoDeFuerzaSerializer(data={
            "id_oficial": "25",
            "fecha_hora": "2026-08-22T10:00:00Z",
            "ubicacion": "Distrito 1",
            "tipo_fuerza": "Fisica No Letal",
            "justificacion_legal": "Control",
            "hubo_heridos": False
        })
        cast_ok = ser_valid_cast.is_valid() and ser_valid_cast.validated_data.get('id_oficial') == 25
        self.record(
            "TYP-07", "Casteo Numérico Determinístico",
            "id_oficial: '25' ➔ 25 (int)", "Integer",
            cast_ok,
            f"El string numérico '25' fue casteado de forma segura al entero nativo {ser_valid_cast.validated_data.get('id_oficial')}."
        )

    def print_final_summary(self):
        total = self.passed + self.failed
        rate = (self.passed / total * 100) if total > 0 else 0
        print("\n" + "="*85)
        print("🏆 RESUMEN GENERAL DE PRUEBAS DE INCOMPATIBILIDAD DE TIPOS")
        print("="*85)
        print(f"Total Casos de Incompatibilidad Evaluados: {total}")
        print(f"Casos Validados Exitosamente (Passed):      {self.passed} ✅")
        print(f"Casos Fallidos (Failed):                  {self.failed} ❌")
        print(f"Tasa de Aprobación de Tipado:             {rate:.1f}%")
        print("="*85 + "\n")

if __name__ == "__main__":
    suite = TypeMismatchQATestSuite()
    suite.run_type_mismatch_tests()
    suite.print_final_summary()
