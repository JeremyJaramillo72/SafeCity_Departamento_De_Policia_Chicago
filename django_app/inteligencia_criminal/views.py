import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from gestion_operativa.views import get_clickhouse_client

class GangCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, gang_id=None):
        try:
            client = get_clickhouse_client()
            if gang_id:
                res = client.execute("SELECT id_banda, nombre_banda, zona_operacion, nivel_peligrosidad FROM banda_criminal WHERE id_banda = %(id)s", {'id': int(gang_id)})
                if not res:
                    return Response({'error': 'Gang not found'}, status=status.HTTP_404_NOT_FOUND)
                row = res[0]
                return Response({'id_banda': row[0], 'nombre_banda': row[1], 'zona_operacion': row[2], 'nivel_peligrosidad': row[3]}, status=status.HTTP_200_OK)
            else:
                res = client.execute("SELECT id_banda, nombre_banda, zona_operacion, nivel_peligrosidad FROM banda_criminal ORDER BY id_banda ASC")
                gangs = [{'id_banda': row[0], 'nombre_banda': row[1], 'zona_operacion': row[2], 'nivel_peligrosidad': row[3]} for row in res]
                return Response(gangs, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            res = client.execute("SELECT max(id_banda) FROM banda_criminal")
            next_id = (res[0][0] or 0) + 1
            client.execute(
                "INSERT INTO banda_criminal (id_banda, nombre_banda, zona_operacion, nivel_peligrosidad) VALUES",
                [(next_id, data.get('nombre_banda', ''), data.get('zona_operacion', ''), data.get('nivel_peligrosidad', 'Media'))]
            )
            return Response({'success': True, 'id_banda': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, gang_id):
        try:
            client = get_clickhouse_client()
            data = request.data
            client.execute(
                "ALTER TABLE banda_criminal UPDATE nombre_banda = %(nombre_banda)s, zona_operacion = %(zona_operacion)s, nivel_peligrosidad = %(nivel_peligrosidad)s WHERE id_banda = %(id_banda)s",
                {
                    'nombre_banda': data.get('nombre_banda', ''),
                    'zona_operacion': data.get('zona_operacion', ''),
                    'nivel_peligrosidad': data.get('nivel_peligrosidad', 'Media'),
                    'id_banda': int(gang_id)
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, gang_id):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE banda_criminal DELETE WHERE id_banda = %(id_banda)s", {'id_banda': int(gang_id)})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SuspectCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, suspect_id=None):
        try:
            client = get_clickhouse_client()
            if suspect_id:
                res = client.execute("""
                    SELECT s.id_sospechoso, s.case_number, s.nombres, s.identificacion, 
                           s.genero, s.telefono, s.direccion, s.alias_conocido, 
                           s.fecha_nacimiento, s.antecedentes, s.declaracion, s.id_banda, b.nombre_banda
                    FROM sospechoso s
                    LEFT JOIN banda_criminal b ON s.id_banda = b.id_banda
                    WHERE s.id_sospechoso = %(id)s
                """, {'id': int(suspect_id)})
                if not res:
                    return Response({'error': 'Suspect not found'}, status=status.HTTP_404_NOT_FOUND)
                row = res[0]
                return Response({
                    'id_sospechoso': row[0],
                    'case_number': row[1],
                    'nombres': row[2],
                    'identificacion': row[3],
                    'genero': row[4],
                    'telefono': row[5],
                    'direccion': row[6],
                    'alias_conocido': row[7],
                    'fecha_nacimiento': str(row[8]),
                    'antecedentes': bool(row[9]),
                    'declaracion': row[10],
                    'id_banda': row[11],
                    'nombre_banda': row[12] or "Ninguna"
                }, status=status.HTTP_200_OK)
            else:
                res = client.execute("""
                    SELECT s.id_sospechoso, s.case_number, s.nombres, s.identificacion, 
                           s.genero, s.telefono, s.direccion, s.alias_conocido, 
                           s.fecha_nacimiento, s.antecedentes, s.declaracion, s.id_banda, b.nombre_banda
                    FROM sospechoso s
                    LEFT JOIN banda_criminal b ON s.id_banda = b.id_banda
                    ORDER BY s.id_sospechoso ASC
                """)
                suspects = [{
                    'id_sospechoso': row[0],
                    'case_number': row[1],
                    'nombres': row[2],
                    'identificacion': row[3],
                    'genero': row[4],
                    'telefono': row[5],
                    'direccion': row[6],
                    'alias_conocido': row[7],
                    'fecha_nacimiento': str(row[8]),
                    'antecedentes': bool(row[9]),
                    'declaracion': row[10],
                    'id_banda': row[11],
                    'nombre_banda': row[12] or "Ninguna"
                } for row in res]
                return Response(suspects, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            res = client.execute("SELECT max(id_sospechoso) FROM sospechoso")
            next_id = (res[0][0] or 0) + 1
            
            fn_str = data.get('fecha_nacimiento', '')
            try:
                fn_obj = datetime.date.fromisoformat(fn_str)
            except Exception:
                fn_obj = datetime.date(1990, 1, 1)

            client.execute(
                "INSERT INTO sospechoso (id_sospechoso, case_number, nombres, identificacion, genero, telefono, direccion, alias_conocido, fecha_nacimiento, antecedentes, declaracion, id_banda) VALUES",
                [(
                    next_id,
                    data.get('case_number', ''),
                    data.get('nombres', ''),
                    data.get('identificacion', ''),
                    data.get('genero', 'Masculino'),
                    data.get('telefono', ''),
                    data.get('direccion', ''),
                    data.get('alias_conocido', ''),
                    fn_obj,
                    bool(data.get('antecedentes', False)),
                    data.get('declaracion', ''),
                    int(data.get('id_banda', 0))
                )]
            )
            return Response({'success': True, 'id_sospechoso': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, suspect_id):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            fn_str = data.get('fecha_nacimiento', '')
            try:
                fn_obj = datetime.date.fromisoformat(fn_str)
            except Exception:
                fn_obj = datetime.date(1990, 1, 1)

            client.execute(
                "ALTER TABLE sospechoso UPDATE case_number = %(case_number)s, nombres = %(nombres)s, identificacion = %(identificacion)s, genero = %(genero)s, telefono = %(telefono)s, direccion = %(direccion)s, alias_conocido = %(alias_conocido)s, fecha_nacimiento = %(fecha_nacimiento)s, antecedentes = %(antecedentes)s, declaracion = %(declaracion)s, id_banda = %(id_banda)s WHERE id_sospechoso = %(id_sospechoso)s",
                {
                    'case_number': data.get('case_number', ''),
                    'nombres': data.get('nombres', ''),
                    'identificacion': data.get('identificacion', ''),
                    'genero': data.get('genero', 'Masculino'),
                    'telefono': data.get('telefono', ''),
                    'direccion': data.get('direccion', ''),
                    'alias_conocido': data.get('alias_conocido', ''),
                    'fecha_nacimiento': fn_obj,
                    'antecedentes': bool(data.get('antecedentes', False)),
                    'declaracion': data.get('declaracion', ''),
                    'id_banda': int(data.get('id_banda', 0)),
                    'id_sospechoso': int(suspect_id)
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, suspect_id):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE sospechoso DELETE WHERE id_sospechoso = %(id_sospechoso)s", {'id_sospechoso': int(suspect_id)})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EvidenceCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, evidence_id=None):
        try:
            client = get_clickhouse_client()
            if evidence_id:
                res = client.execute("""
                    SELECT e.id_evidencia, e.case_number, e.tipo_evidencia, e.fecha_recoleccion, 
                           e.id_oficial, o.nombres, o.apellidos
                    FROM evidencia e
                    LEFT JOIN oficial_policia o ON e.id_oficial = o.id_oficial
                    WHERE e.id_evidencia = %(id)s
                """, {'id': int(evidence_id)})
                if not res:
                    return Response({'error': 'Evidence not found'}, status=status.HTTP_404_NOT_FOUND)
                row = res[0]
                return Response({
                    'id_evidencia': row[0],
                    'case_number': row[1],
                    'tipo_evidencia': row[2],
                    'fecha_recoleccion': str(row[3]),
                    'id_oficial': row[4],
                    'officer_name': f"{row[5]} {row[6]}" if row[5] else "Desconocido"
                }, status=status.HTTP_200_OK)
            else:
                res = client.execute("""
                    SELECT e.id_evidencia, e.case_number, e.tipo_evidencia, e.fecha_recoleccion, 
                           e.id_oficial, o.nombres, o.apellidos
                    FROM evidencia e
                    LEFT JOIN oficial_policia o ON e.id_oficial = o.id_oficial
                    ORDER BY e.id_evidencia ASC
                """)
                evidences = [{
                    'id_evidencia': row[0],
                    'case_number': row[1],
                    'tipo_evidencia': row[2],
                    'fecha_recoleccion': str(row[3]),
                    'id_oficial': row[4],
                    'officer_name': f"{row[5]} {row[6]}" if row[5] else "Desconocido"
                } for row in res]
                return Response(evidences, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            res = client.execute("SELECT max(id_evidencia) FROM evidencia")
            next_id = (res[0][0] or 0) + 1
            
            now = datetime.datetime.now()
            client.execute(
                "INSERT INTO evidencia (id_evidencia, case_number, tipo_evidencia, fecha_recoleccion, id_oficial) VALUES",
                [(next_id, data.get('case_number', ''), data.get('tipo_evidencia', ''), now, int(data.get('id_oficial', 1)))]
            )
            return Response({'success': True, 'id_evidencia': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, evidence_id):
        try:
            client = get_clickhouse_client()
            data = request.data
            client.execute(
                "ALTER TABLE evidencia UPDATE case_number = %(case_number)s, tipo_evidencia = %(tipo_evidencia)s, id_oficial = %(id_oficial)s WHERE id_evidencia = %(id_evidencia)s",
                {
                    'case_number': data.get('case_number', ''),
                    'tipo_evidencia': data.get('tipo_evidencia', ''),
                    'id_oficial': int(data.get('id_oficial', 1)),
                    'id_evidencia': int(evidence_id)
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, evidence_id):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE evidencia DELETE WHERE id_evidencia = %(id_evidencia)s", {'id_evidencia': int(evidence_id)})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WitnessCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, witness_id=None):
        try:
            client = get_clickhouse_client()
            if witness_id:
                res = client.execute("SELECT id_testigo, case_number, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo FROM testigo WHERE id_testigo = %(id)s", {'id': int(witness_id)})
                if not res:
                    return Response({'error': 'Witness not found'}, status=status.HTTP_404_NOT_FOUND)
                row = res[0]
                return Response({
                    'id_testigo': row[0], 'case_number': row[1], 'nombres': row[2], 'identificacion': row[3],
                    'genero': row[4], 'telefono': row[5], 'direccion': row[6], 'testimonio': row[7], 'es_anonimo': bool(row[8])
                }, status=status.HTTP_200_OK)
            else:
                res = client.execute("SELECT id_testigo, case_number, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo FROM testigo ORDER BY id_testigo ASC")
                witnesses = [{
                    'id_testigo': row[0], 'case_number': row[1], 'nombres': row[2], 'identificacion': row[3],
                    'genero': row[4], 'telefono': row[5], 'direccion': row[6], 'testimonio': row[7], 'es_anonimo': bool(row[8])
                } for row in res]
                return Response(witnesses, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            res = client.execute("SELECT max(id_testigo) FROM testigo")
            next_id = (res[0][0] or 0) + 1
            client.execute(
                "INSERT INTO testigo (id_testigo, case_number, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo) VALUES",
                [(
                    next_id, data.get('case_number', ''), data.get('nombres', ''), data.get('identificacion', ''),
                    data.get('genero', 'Masculino'), data.get('telefono', ''), data.get('direccion', ''),
                    data.get('testimonio', ''), bool(data.get('es_anonimo', False))
                )]
            )
            return Response({'success': True, 'id_testigo': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, witness_id):
        try:
            client = get_clickhouse_client()
            data = request.data
            client.execute(
                "ALTER TABLE testigo UPDATE case_number = %(case_number)s, nombres = %(nombres)s, identificacion = %(identificacion)s, genero = %(genero)s, telefono = %(telefono)s, direccion = %(direccion)s, testimonio = %(testimonio)s, es_anonimo = %(es_anonimo)s WHERE id_testigo = %(id_testigo)s",
                {
                    'case_number': data.get('case_number', ''), 'nombres': data.get('nombres', ''), 'identificacion': data.get('identificacion', ''),
                    'genero': data.get('genero', 'Masculino'), 'telefono': data.get('telefono', ''), 'direccion': data.get('direccion', ''),
                    'testimonio': data.get('testimonio', ''), 'es_anonimo': bool(data.get('es_anonimo', False)), 'id_testigo': int(witness_id)
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, witness_id):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE testigo DELETE WHERE id_testigo = %(id_testigo)s", {'id_testigo': int(witness_id)})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VictimCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, victim_id=None):
        try:
            client = get_clickhouse_client()
            if victim_id:
                res = client.execute("SELECT id_victima, case_number, nombres, identificacion, genero, telefono, direccion FROM victima WHERE id_victima = %(id)s", {'id': int(victim_id)})
                if not res:
                    return Response({'error': 'Victim not found'}, status=status.HTTP_404_NOT_FOUND)
                row = res[0]
                return Response({
                    'id_victima': row[0], 'case_number': row[1], 'nombres': row[2], 'identificacion': row[3],
                    'genero': row[4], 'telefono': row[5], 'direccion': row[6]
                }, status=status.HTTP_200_OK)
            else:
                res = client.execute("SELECT id_victima, case_number, nombres, identificacion, genero, telefono, direccion FROM victima ORDER BY id_victima ASC")
                victims = [{
                    'id_victima': row[0], 'case_number': row[1], 'nombres': row[2], 'identificacion': row[3],
                    'genero': row[4], 'telefono': row[5], 'direccion': row[6]
                } for row in res]
                return Response(victims, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            res = client.execute("SELECT max(id_victima) FROM victima")
            next_id = (res[0][0] or 0) + 1
            client.execute(
                "INSERT INTO victima (id_victima, case_number, nombres, identificacion, genero, telefono, direccion) VALUES",
                [(
                    next_id, data.get('case_number', ''), data.get('nombres', ''), data.get('identificacion', ''),
                    data.get('genero', 'Masculino'), data.get('telefono', ''), data.get('direccion', '')
                )]
            )
            return Response({'success': True, 'id_victima': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, victim_id):
        try:
            client = get_clickhouse_client()
            data = request.data
            client.execute(
                "ALTER TABLE victima UPDATE case_number = %(case_number)s, nombres = %(nombres)s, identificacion = %(identificacion)s, genero = %(genero)s, telefono = %(telefono)s, direccion = %(direccion)s WHERE id_victima = %(id_victima)s",
                {
                    'case_number': data.get('case_number', ''), 'nombres': data.get('nombres', ''), 'identificacion': data.get('identificacion', ''),
                    'genero': data.get('genero', 'Masculino'), 'telefono': data.get('telefono', ''), 'direccion': data.get('direccion', ''),
                    'id_victima': int(victim_id)
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, victim_id):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE victima DELETE WHERE id_victima = %(id_victima)s", {'id_victima': int(victim_id)})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
