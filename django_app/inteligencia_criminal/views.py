import datetime
import uuid
import logging
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from gestion_operativa.views import get_clickhouse_client

logger = logging.getLogger(__name__)

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
                res = client.execute("SELECT id_banda, nombre_banda, zona_operacion, nivel_peligrosidad FROM banda_criminal ORDER BY id_banda DESC")
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
                [(next_id, data.get('nombre_banda', ''), data.get('zona_operacion', ''), data.get('nivel_peligrosidad', 'Medium'))]
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
                    'nombre_banda': row[12] or "None"
                }, status=status.HTTP_200_OK)
            else:
                search_term = request.query_params.get('search', '').strip()
                if search_term:
                    res = client.execute("""
                        SELECT s.id_sospechoso, s.case_number, s.nombres, s.identificacion, 
                               s.genero, s.telefono, s.direccion, s.alias_conocido, 
                               s.fecha_nacimiento, s.antecedentes, s.declaracion, s.id_banda, b.nombre_banda
                        FROM sospechoso s
                        LEFT JOIN banda_criminal b ON s.id_banda = b.id_banda
                        WHERE toString(s.id_sospechoso) ilike %(term)s 
                           OR s.nombres ilike %(term)s
                           OR s.alias_conocido ilike %(term)s
                           OR s.identificacion ilike %(term)s
                        ORDER BY s.id_sospechoso ASC
                        LIMIT 50
                    """, {'term': f'%{search_term}%'})
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
                    'nombre_banda': row[12] or "None"
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
                "ALTER TABLE sospechoso UPDATE nombres = %(nombres)s, identificacion = %(identificacion)s, genero = %(genero)s, telefono = %(telefono)s, direccion = %(direccion)s, alias_conocido = %(alias_conocido)s, fecha_nacimiento = %(fecha_nacimiento)s, antecedentes = %(antecedentes)s, declaracion = %(declaracion)s, id_banda = %(id_banda)s WHERE id_sospechoso = %(id_sospechoso)s",
                {
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


class SuspectVehiclesDirectoryView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        """
        OT13: Consultar el directorio actualizado de sospechosos y sus vehículos vinculados.
        Consulta relacional directa con JOIN entre vehiculo_sospechoso, sospechoso y banda_criminal.
        """
        try:
            client = get_clickhouse_client()
            search_term = request.query_params.get('search', '').strip()
            estado_filter = request.query_params.get('estado', '').strip()
            
            query = """
                SELECT 
                    v.id_vehiculo_sospechoso,
                    v.id_sospechoso,
                    v.case_number,
                    v.placa,
                    v.marca,
                    v.modelo,
                    v.color,
                    v.estado_reporte,
                    v.observaciones,
                    v.fecha_registro,
                    s.nombres AS sospechoso_nombre,
                    s.identificacion AS sospechoso_identificacion,
                    s.alias_conocido AS sospechoso_alias,
                    s.genero AS sospechoso_genero,
                    s.telefono AS sospechoso_telefono,
                    s.antecedentes AS sospechoso_antecedentes,
                    b.nombre_banda AS banda_nombre,
                    b.nivel_peligrosidad AS banda_peligrosidad
                FROM vehiculo_sospechoso v
                LEFT JOIN sospechoso s ON v.id_sospechoso = s.id_sospechoso
                LEFT JOIN banda_criminal b ON s.id_banda = b.id_banda
                WHERE 1=1
            """
            params = {}
            if search_term:
                query += """ AND (
                    v.placa ilike %(term)s OR
                    v.marca ilike %(term)s OR
                    v.modelo ilike %(term)s OR
                    v.case_number ilike %(term)s OR
                    s.nombres ilike %(term)s OR
                    s.alias_conocido ilike %(term)s OR
                    s.identificacion ilike %(term)s
                )"""
                params['term'] = f'%{search_term}%'
                
            if estado_filter and str(estado_filter).upper() not in ('ALL', 'TODOS', 'TODAS', ''):
                query += " AND v.estado_reporte = %(estado)s"
                params['estado'] = estado_filter.upper()
                
            query += " ORDER BY v.id_vehiculo_sospechoso ASC"
            
            res = client.execute(query, params)
            
            vehicles = [{
                'id_vehiculo_sospechoso': row[0],
                'id_sospechoso': row[1],
                'case_number': row[2],
                'placa': row[3],
                'marca': row[4],
                'modelo': row[5],
                'color': row[6],
                'estado_reporte': row[7],
                'observaciones': row[8],
                'fecha_registro': str(row[9]),
                'sospechoso_nombre': row[10] or "Desconocido",
                'sospechoso_identificacion': row[11] or "N/A",
                'sospechoso_alias': row[12] or "N/A",
                'sospechoso_genero': row[13] or "N/A",
                'sospechoso_telefono': row[14] or "N/A",
                'sospechoso_antecedentes': bool(row[15]) if row[15] is not None else False,
                'banda_nombre': row[16] or "Sin Banda",
                'banda_peligrosidad': row[17] or "N/A"
            } for row in res]
            
            return Response(vehicles, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class SuspectCasesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, suspect_id):
        try:
            client = get_clickhouse_client()
            query = """
                SELECT DISTINCT
                    s.case_number,
                    toString(c.date) AS date,
                    cp.gravedad_delito AS primary_type,
                    c.description
                FROM chicago_crimes c
                JOIN sospechoso s ON s.case_number = c.case_number
                LEFT JOIN incidente_delito id ON c.case_number = id.case_number
                LEFT JOIN codigo_penal cp ON id.codigo_iucr = cp.codigo_iucr
                WHERE s.id_sospechoso = %(id_sospechoso)s AND s.case_number != ''
            """
            rows = client.execute(query, {'id_sospechoso': int(suspect_id)})
            
            cases = []
            for row in rows:
                cases.append({
                    'case_number': row[0],
                    'date': row[1],
                    'primary_type': row[2] or 'General Crime',
                    'description': row[3] or ''
                })
                
            return Response(cases, status=status.HTTP_200_OK)
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
                           e.id_oficial, o.nombres, o.apellidos, e.url_fotografia
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
                    'officer_name': f"{row[5]} {row[6]}" if row[5] else "Unknown",
                    'url_fotografia': row[7] if len(row) > 7 and row[7] else ''
                }, status=status.HTTP_200_OK)
            else:
                res = client.execute("""
                    SELECT e.id_evidencia, e.case_number, e.tipo_evidencia, e.fecha_recoleccion, 
                           e.id_oficial, o.nombres, o.apellidos, e.url_fotografia
                    FROM evidencia e
                    LEFT JOIN oficial_policia o ON e.id_oficial = o.id_oficial
                    ORDER BY e.id_evidencia DESC
                """)
                evidences = [{
                    'id_evidencia': row[0],
                    'case_number': row[1],
                    'tipo_evidencia': row[2],
                    'fecha_recoleccion': str(row[3]),
                    'id_oficial': row[4],
                    'officer_name': f"{row[5]} {row[6]}" if row[5] else "Unknown",
                    'url_fotografia': row[7] if len(row) > 7 and row[7] else ''
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
                "INSERT INTO evidencia (id_evidencia, case_number, tipo_evidencia, fecha_recoleccion, id_oficial, url_fotografia) VALUES",
                [(next_id, data.get('case_number', ''), data.get('tipo_evidencia', ''), now, int(data.get('id_oficial', 1)), data.get('url_fotografia', ''))]
            )
            return Response({'success': True, 'id_evidencia': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, evidence_id):
        try:
            client = get_clickhouse_client()
            data = request.data
            client.execute(
                "ALTER TABLE evidencia UPDATE case_number = %(case_number)s, tipo_evidencia = %(tipo_evidencia)s, id_oficial = %(id_oficial)s, url_fotografia = %(url_fotografia)s WHERE id_evidencia = %(id_evidencia)s",
                {
                    'case_number': data.get('case_number', ''),
                    'tipo_evidencia': data.get('tipo_evidencia', ''),
                    'id_oficial': int(data.get('id_oficial', 1)),
                    'url_fotografia': data.get('url_fotografia', ''),
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


class EvidenceTransferView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, evidence_id):
        try:
            client = get_clickhouse_client()
            data = request.data
            oficial_destino = data.get('oficial_destino')
            observaciones = data.get('observaciones', '')

            if not oficial_destino:
                return Response({'error': 'The destination officer is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Get current officer
            res_ev = client.execute("""
                SELECT e.id_oficial, o.nombres, o.apellidos, e.tipo_evidencia
                FROM evidencia e
                LEFT JOIN oficial_policia o ON e.id_oficial = o.id_oficial
                WHERE e.id_evidencia = %(id)s
            """, {'id': int(evidence_id)})

            if not res_ev:
                return Response({'error': 'Evidence not found'}, status=status.HTTP_404_NOT_FOUND)

            oficial_origen_id = res_ev[0][0]
            oficial_origen_nombre = f"{res_ev[0][1]} {res_ev[0][2]}" if res_ev[0][1] else "Unknown"

            # In a real scenario, we would validate that the user making the request is indeed the oficial_origen
            # or has admin rights. Since user authentication is mocked/simplified here, we skip strict validation.
            registrado_por = "sistema"
            if request.user and request.user.is_authenticated:
                registrado_por = request.user.username

            # 1. Insert into evidencia_transferencias
            client.execute(
                "INSERT INTO evidencia_transferencias (id_evidencia, codigo_qr, tipo_accion, oficial_origen, oficial_destino, observaciones, registrado_por) VALUES",
                [(int(evidence_id), f"QR-{evidence_id}", 'TRANSFERENCIA', oficial_origen_nombre, oficial_destino, observaciones, registrado_por)]
            )

            # 2. Update evidencia's current oficial
            # Find the new officer's ID based on their full name (basic match)
            res_new_ofc = client.execute("""
                SELECT id_oficial FROM oficial_policia WHERE concat(nombres, ' ', apellidos) = %(nombre)s
            """, {'nombre': oficial_destino})
            
            if res_new_ofc:
                new_id_oficial = res_new_ofc[0][0]
                client.execute(
                    "ALTER TABLE evidencia UPDATE id_oficial = %(id_oficial)s WHERE id_evidencia = %(id_evidencia)s",
                    {
                        'id_oficial': new_id_oficial,
                        'id_evidencia': int(evidence_id)
                    }
                )

            return Response({'success': True}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EvidenceCustodyLogView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, evidence_id):
        try:
            client = get_clickhouse_client()
            res = client.execute("""
                SELECT id_transferencia, id_evidencia, codigo_qr, tipo_accion, oficial_origen, 
                       oficial_destino, observaciones, registrado_por, fecha_registro
                FROM evidencia_transferencias
                WHERE id_evidencia = %(id)s
                ORDER BY fecha_registro ASC
            """, {'id': int(evidence_id)})

            logs = [{
                'id_transferencia': row[0],
                'id_evidencia': row[1],
                'codigo_qr': row[2],
                'tipo_accion': row[3],
                'oficial_origen': row[4],
                'oficial_destino': row[5],
                'observaciones': row[6],
                'registrado_por': row[7],
                'fecha_registro': row[8].isoformat() if row[8] else None,
            } for row in res]
            return Response(logs, status=status.HTTP_200_OK)
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

import time
import hashlib
import requests

from django.core.files.storage import default_storage

class EvidenceImageUploadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            objeto_archivo = request.FILES.get('file')
            if not objeto_archivo:
                return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

            logger.info(f"[Almacenamiento Supabase] Subiendo archivo de evidencia={objeto_archivo.name} tamaño={objeto_archivo.size}")
            
            # Guardar archivo en Supabase a través del backend de almacenamiento S3 por defecto
            ruta_archivo = default_storage.save(f"evidencias/{uuid.uuid4()}_{objeto_archivo.name}", objeto_archivo)
            url_archivo = default_storage.url(ruta_archivo)
            
            logger.info(f"[Almacenamiento Supabase] Subida exitosa url={url_archivo}")

            return Response({'url': url_archivo}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"[Almacenamiento Supabase] Excepción al subir archivo: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MissingPersonsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            estado = request.query_params.get('estado')
            nivel_riesgo = request.query_params.get('nivel_riesgo')

            query = "SELECT id, case_number, id_oficial_reportante, nombre_completo, edad, tiene_dependencia_medicamentos, fotografia, descripcion_fisica, vestimenta, ultima_ubicacion, datos_reportante, nivel_riesgo, estado, id_comandante_aprobador, timestamp_registro, timestamp_resolucion FROM rrhh_persona_desaparecida"
            
            conditions = []
            params = {}
            if estado and str(estado).upper() not in ('ALL', 'TODOS', 'TODAS', ''):
                conditions.append("estado = %(estado)s")
                params['estado'] = estado
            if nivel_riesgo and str(nivel_riesgo).upper() not in ('ALL', 'TODOS', 'TODAS', ''):
                conditions.append("nivel_riesgo = %(nivel_riesgo)s")
                params['nivel_riesgo'] = nivel_riesgo

            if conditions:
                query += " WHERE " + " AND ".join(conditions)

            query += " ORDER BY timestamp_registro DESC"
            res = client.execute(query, params)
            
            data = []
            for row in res:
                data.append({
                    'id': row[0], 'case_number': row[1], 'id_oficial_reportante': row[2], 'nombre_completo': row[3],
                    'edad': row[4], 'tiene_dependencia_medicamentos': bool(row[5]), 'fotografia': row[6],
                    'descripcion_fisica': row[7], 'vestimenta': row[8], 'ultima_ubicacion': row[9],
                    'datos_reportante': row[10], 'nivel_riesgo': row[11], 'estado': row[12],
                    'id_comandante_aprobador': row[13],
                    'timestamp_registro': row[14].isoformat() if row[14] else None,
                    'timestamp_resolucion': row[15].isoformat() if row[15] else None,
                })
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            nombre_completo = data.get('nombre_completo')
            case_number = data.get('case_number') or None
            edad_str = data.get('edad')
            descripcion_fisica = data.get('descripcion_fisica')
            vestimenta = data.get('vestimenta')
            ultima_ubicacion = data.get('ultima_ubicacion')
            datos_reportante = data.get('datos_reportante')
            tiene_dep_med = int(data.get('tiene_dependencia_medicamentos', 0))
            fotografia = data.get('fotografia') or None

            try:
                edad = int(edad_str)
            except ValueError:
                return Response({'error': 'The age must be a whole number.'}, status=status.HTTP_400_BAD_REQUEST)

            nivel_riesgo = 'CRITICAL' if edad < 12 else ('HIGH' if tiene_dep_med == 1 else 'MEDIUM')
            id_reporte = str(uuid.uuid4())
            now_dt = timezone.now()
            
            client.execute(
                "INSERT INTO rrhh_persona_desaparecida (id, case_number, id_oficial_reportante, nombre_completo, edad, tiene_dependencia_medicamentos, fotografia, descripcion_fisica, vestimenta, ultima_ubicacion, datos_reportante, nivel_riesgo, estado, id_comandante_aprobador, timestamp_registro, timestamp_resolucion) VALUES",
                [(id_reporte, case_number, 1, nombre_completo, edad, tiene_dep_med, fotografia, descripcion_fisica, vestimenta, ultima_ubicacion, datos_reportante, nivel_riesgo, 'Active Search', None, now_dt, None)]
            )

            id_bolo = str(uuid.uuid4())
            expiracion = now_dt + datetime.timedelta(days=30)
            titulo = f"MISSING PERSON: {nombre_completo.upper()}"
            desc = f"Age: {edad} years. Clothing: {vestimenta}. Description: {descripcion_fisica}. Last seen: {ultima_ubicacion}."
            prio = 'Critical' if nivel_riesgo == 'CRITICAL' else ('High' if nivel_riesgo == 'HIGH' else 'Medium')

            client.execute(
                "INSERT INTO rrhh_bolo (id, tipo, titulo, descripcion, nivel_riesgo, fecha_expiracion, estado, foto_url, id_referencia, creado_por, timestamp) VALUES",
                [(id_bolo, 'Missing Person', titulo, desc, prio, expiracion, 'Active', fotografia, id_reporte, 'sistema', now_dt)]
            )

            resp_data = {'success': True, 'id': id_reporte, 'nivel_riesgo': nivel_riesgo, 'estado': 'Active Search'}
            return Response(resp_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MissingPersonDetailView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, id_reporte):
        try:
            client = get_clickhouse_client()
            estado = request.data.get('estado')
            if not estado:
                return Response({'error': 'State is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            ts_res = timezone.now() if estado in ['Located Safe', 'Located Deceased'] else None
            
            client.execute(
                "ALTER TABLE rrhh_persona_desaparecida UPDATE estado = %(estado)s, timestamp_resolucion = %(ts)s WHERE id = %(id)s",
                {'estado': estado, 'ts': ts_res, 'id': id_reporte}
            )

            if ts_res:
                client.execute("ALTER TABLE rrhh_bolo UPDATE estado = 'Inactiva' WHERE id_referencia = %(id_ref)s", {'id_ref': id_reporte})

            return Response({'success': True, 'estado': estado}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, id_reporte):
        try:
            client = get_clickhouse_client()
            data = request.data
            nombre_completo = data.get('nombre_completo')
            case_number = data.get('case_number') or None
            edad_str = data.get('edad')
            descripcion_fisica = data.get('descripcion_fisica')
            vestimenta = data.get('vestimenta')
            ultima_ubicacion = data.get('ultima_ubicacion')
            datos_reportante = data.get('datos_reportante')
            tiene_dep_med = int(data.get('tiene_dependencia_medicamentos', 0))
            fotografia = data.get('fotografia') or None

            try:
                edad = int(edad_str)
            except ValueError:
                return Response({'error': 'The age must be a whole number.'}, status=status.HTTP_400_BAD_REQUEST)

            nivel_riesgo = 'CRITICAL' if edad < 12 else ('HIGH' if tiene_dep_med == 1 else 'MEDIUM')
            
            client.execute(
                """ALTER TABLE rrhh_persona_desaparecida UPDATE 
                   case_number = %(case_number)s, 
                   nombre_completo = %(nombre_completo)s, 
                   edad = %(edad)s, 
                   tiene_dependencia_medicamentos = %(tiene_dep_med)s, 
                   fotografia = %(fotografia)s, 
                   descripcion_fisica = %(descripcion_fisica)s, 
                   vestimenta = %(vestimenta)s, 
                   ultima_ubicacion = %(ultima_ubicacion)s, 
                   datos_reportante = %(datos_reportante)s, 
                   nivel_riesgo = %(nivel_riesgo)s 
                   WHERE id = %(id)s""",
                {
                    'case_number': case_number, 'nombre_completo': nombre_completo, 'edad': edad,
                    'tiene_dep_med': tiene_dep_med, 'fotografia': fotografia, 'descripcion_fisica': descripcion_fisica,
                    'vestimenta': vestimenta, 'ultima_ubicacion': ultima_ubicacion, 'datos_reportante': datos_reportante,
                    'nivel_riesgo': nivel_riesgo, 'id': id_reporte
                }
            )

            # Update associated bolo if exists
            desc = f"Age: {edad} years. Clothing: {vestimenta}. Description: {descripcion_fisica}. Last seen: {ultima_ubicacion}."
            prio = 'Critical' if nivel_riesgo == 'CRITICAL' else ('High' if nivel_riesgo == 'HIGH' else 'Medium')
            client.execute(
                """ALTER TABLE rrhh_bolo UPDATE 
                   titulo = %(titulo)s, 
                   descripcion = %(desc)s, 
                   nivel_riesgo = %(prio)s, 
                   foto_url = %(foto)s 
                   WHERE id_referencia = %(id)s""",
                {
                    'titulo': f"MISSING PERSON: {nombre_completo.upper()}",
                    'desc': desc, 'prio': prio, 'foto': fotografia, 'id': id_reporte
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id_reporte):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE rrhh_persona_desaparecida DELETE WHERE id = %(id)s", {'id': id_reporte})
            client.execute("ALTER TABLE rrhh_bolo DELETE WHERE id_referencia = %(id)s", {'id': id_reporte})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BoloCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            res = client.execute("""
                SELECT id, tipo, titulo, descripcion, nivel_riesgo, fecha_expiracion, estado, foto_url, creado_por, timestamp, id_referencia 
                FROM rrhh_bolo 
                ORDER BY timestamp DESC
            """)
            bolos = [{
                'id': row[0],
                'tipo': row[1],
                'titulo': row[2],
                'descripcion': row[3],
                'nivel_riesgo': row[4],
                'fecha_expiracion': row[5].isoformat() if row[5] else None,
                'estado': row[6],
                'foto_url': row[7],
                'creado_por': row[8],
                'timestamp': row[9].isoformat() if row[9] else None,
                'id_referencia': row[10]
            } for row in res]
            return Response(bolos, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            id_bolo = str(uuid.uuid4())
            now_dt = timezone.now()
            
            exp_str = data.get('fecha_expiracion')
            fecha_expiracion = None
            if exp_str:
                fecha_expiracion = datetime.datetime.fromisoformat(exp_str)

            client.execute(
                "INSERT INTO rrhh_bolo (id, tipo, titulo, descripcion, nivel_riesgo, fecha_expiracion, estado, foto_url, creado_por, timestamp) VALUES",
                [(
                    id_bolo, 
                    data.get('tipo', 'Suspicious Vehicle'), 
                    data.get('titulo', ''), 
                    data.get('descripcion', ''), 
                    data.get('nivel_riesgo', 'Medium'), 
                    fecha_expiracion, 
                    'Active', 
                    data.get('foto_url', None), 
                    request.user.username if request.user and request.user.is_authenticated else 'sistema', 
                    now_dt
                )]
            )
            return Response({'success': True, 'id': id_bolo}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BoloDetailView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, bolo_id):
        try:
            client = get_clickhouse_client()
            estado = request.data.get('estado')
            if not estado:
                return Response({'error': 'State is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            client.execute(
                "ALTER TABLE rrhh_bolo UPDATE estado = %(estado)s WHERE id = %(id)s",
                {'estado': estado, 'id': str(bolo_id)}
            )
            return Response({'success': True, 'estado': estado}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CaseTestimoniesSeizuresView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        """
        OT7: Consultar reportes con listados de testimonios e incautaciones por caso.
        Consulta relacional unificada que agrupa evidencias e incautaciones con las declaraciones de testigos, víctimas y sospechosos.
        """
        try:
            client = get_clickhouse_client()
            case_filter = request.query_params.get('case_number', '').strip()
            search_term = request.query_params.get('search', '').strip()

            params = {}
            ev_query = """
                SELECT e.id_evidencia, e.case_number, e.tipo_evidencia, toString(e.fecha_recoleccion) AS fecha_recoleccion, 
                       e.id_oficial, o.nombres, o.apellidos
                FROM evidencia e
                LEFT JOIN oficial_policia o ON e.id_oficial = o.id_oficial
                WHERE e.case_number != ''
            """
            if case_filter:
                ev_query += " AND e.case_number = %(case_number)s"
                params['case_number'] = case_filter
            if search_term:
                ev_query += " AND (e.case_number ilike %(term)s OR e.tipo_evidencia ilike %(term)s OR o.nombres ilike %(term)s)"
                params['term'] = f'%{search_term}%'
            ev_query += " ORDER BY e.fecha_recoleccion DESC"

            ev_rows = client.execute(ev_query, params)

            wit_query = """
                SELECT id_testigo, case_number, nombres, identificacion, telefono, testimonio, es_anonimo
                FROM testigo
                WHERE case_number != ''
            """
            if case_filter:
                wit_query += " AND case_number = %(case_number)s"
            if search_term:
                wit_query += " AND (case_number ilike %(term)s OR nombres ilike %(term)s OR testimonio ilike %(term)s)"
            wit_query += " ORDER BY id_testigo ASC"

            wit_rows = client.execute(wit_query, params)

            vic_query = """
                SELECT id_victima, case_number, nombres, identificacion, telefono, genero, direccion
                FROM victima
                WHERE case_number != ''
            """
            if case_filter:
                vic_query += " AND case_number = %(case_number)s"
            if search_term:
                vic_query += " AND (case_number ilike %(term)s OR nombres ilike %(term)s)"
            vic_query += " ORDER BY id_victima ASC"

            vic_rows = client.execute(vic_query, params)

            sosp_query = """
                SELECT id_sospechoso, case_number, nombres, alias_conocido, identificacion, declaracion, antecedentes
                FROM sospechoso
                WHERE case_number != ''
            """
            if case_filter:
                sosp_query += " AND case_number = %(case_number)s"
            if search_term:
                sosp_query += " AND (case_number ilike %(term)s OR nombres ilike %(term)s OR alias_conocido ilike %(term)s OR declaracion ilike %(term)s)"
            sosp_query += " ORDER BY id_sospechoso ASC"

            sosp_rows = client.execute(sosp_query, params)

            cases_dict = {}

            def get_case(c_num):
                if c_num not in cases_dict:
                    cases_dict[c_num] = {
                        'case_number': c_num,
                        'evidences': [],
                        'witnesses': [],
                        'victims': [],
                        'suspects': [],
                        'total_items': 0
                    }
                return cases_dict[c_num]

            for r in ev_rows:
                c = get_case(r[1])
                c['evidences'].append({
                    'id_evidencia': r[0],
                    'tipo_evidencia': r[2],
                    'fecha_recoleccion': r[3],
                    'id_oficial': r[4],
                    'officer_name': f"{r[5]} {r[6]}".strip() if r[5] else "Unknown"
                })
                c['total_items'] += 1

            for r in wit_rows:
                c = get_case(r[1])
                c['witnesses'].append({
                    'id_testigo': r[0],
                    'nombres': r[2],
                    'identificacion': r[3],
                    'telefono': r[4],
                    'declaracion': r[5], # testimonio
                    'es_anonimo': bool(r[6])
                })
                c['total_items'] += 1

            for r in vic_rows:
                c = get_case(r[1])
                c['victims'].append({
                    'id_victima': r[0],
                    'nombres': r[2],
                    'identificacion': r[3],
                    'telefono': r[4],
                    'genero': r[5],
                    'direccion': r[6]
                })
                c['total_items'] += 1

            for r in sosp_rows:
                c = get_case(r[1])
                c['suspects'].append({
                    'id_sospechoso': r[0],
                    'nombres': r[2],
                    'alias_conocido': r[3],
                    'identificacion': r[4],
                    'declaracion': r[5],
                    'antecedentes': bool(r[6])
                })
                c['total_items'] += 1

            result = list(cases_dict.values())
            result.sort(key=lambda x: x['case_number'])

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_suspect_names_map():
    try:
        client = get_clickhouse_client()
        result = client.execute("SELECT id_sospechoso, nombres, alias_conocido FROM sospechoso")
        return {row[0]: f"{row[1]} ({row[2]})" if row[2] else row[1] for row in result}
    except Exception:
        return {}


class RecidivismStatsView(APIView):
    """OT2: Estadísticas de reincidencia criminal — tasa global y top reincidentes."""
    def get(self, request):
        try:
            client = get_clickhouse_client()
            
            # Total de sospechosos únicos
            res_total = client.execute("SELECT count(DISTINCT id_sospechoso) FROM sospechoso")
            total_sospechosos = res_total[0][0] if res_total else 0
            
            # Sospechosos que aparecen en 2+ casos distintos (reincidentes)
            res_reincidentes = client.execute(
                "SELECT id_sospechoso, count(DISTINCT case_number) as total_casos "
                "FROM sospechoso "
                "WHERE case_number != '' "
                "GROUP BY id_sospechoso "
                "HAVING total_casos > 1 "
                "ORDER BY total_casos DESC"
            )
            
            sospechosos_reincidentes = len(res_reincidentes)
            tasa_reincidencia = round((sospechosos_reincidentes / total_sospechosos * 100), 2) if total_sospechosos > 0 else 0
            
            # Resolver nombres para el top 20
            nombres_map = get_suspect_names_map()
            top_reincidentes = []
            for row in res_reincidentes[:20]:
                top_reincidentes.append({
                    'id_sospechoso': row[0],
                    'total_casos': row[1],
                    'nombre': nombres_map.get(row[0], f"Suspect #{row[0]}")
                })
            
            return Response({
                'total_suspects': total_sospechosos,
                'repeat_offenders': sospechosos_reincidentes,
                'recidivism_rate': tasa_reincidencia,
                'top_repeat_offenders': top_reincidentes
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error querying recidivism stats: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GraphNetworkView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            
            # Fetch Gangs (Nodes)
            res_gangs = client.execute("SELECT id_banda, nombre_banda, nivel_peligrosidad FROM banda_criminal")
            gangs_dict = {}
            for row in res_gangs:
                g_id = f"g_{row[0]}"
                if g_id not in gangs_dict:
                    gangs_dict[g_id] = {'id': g_id, 'label': row[1], 'group': 'gang', 'level': row[2]}
            gangs = list(gangs_dict.values())
            
            # Fetch Suspects (Nodes)
            res_suspects = client.execute("SELECT id_sospechoso, nombres, id_banda FROM sospechoso")
            suspects_dict = {}
            edges = []
            suspect_incident_counts = {}
            
            for row in res_suspects:
                s_id = f"s_{row[0]}"
                if s_id not in suspects_dict:
                    suspects_dict[s_id] = {'id': s_id, 'label': row[1] or f"Sospechoso {row[0]}", 'group': 'suspect'}
                # Avoid duplicate edges if the same suspect row is returned multiple times
                edge_exists = False
                if row[2]:
                    for e in edges:
                        if e['from'] == s_id and e['to'] == f"g_{row[2]}":
                            edge_exists = True
                            break
                    if not edge_exists:
                        edges.append({'from': s_id, 'to': f"g_{row[2]}", 'label': 'Belongs to'})
                    
            # Fetch Incidents connected to suspects
            res_incidents = client.execute('''
                SELECT s.id_sospechoso, s.id_banda, s.case_number, c.beat 
                FROM sospechoso s 
                JOIN chicago_crimes c ON s.case_number = c.case_number 
                WHERE s.case_number != ''
            ''')
            
            incidents = {}
            gang_beat_counts = {}
            
            for row in res_incidents:
                s_id = f"s_{row[0]}"
                b_id = f"g_{row[1]}" if row[1] else None
                c_id = f"c_{row[2]}"
                beat = row[3]
                
                # Count incidents per suspect
                suspect_incident_counts[s_id] = suspect_incident_counts.get(s_id, 0) + 1
                
                # Count incidents per gang per beat
                if b_id and beat:
                    gang_beat_key = (b_id, beat)
                    gang_beat_counts[gang_beat_key] = gang_beat_counts.get(gang_beat_key, 0) + 1
                    
                if c_id not in incidents:
                    incidents[c_id] = {'id': c_id, 'label': f"Case {row[2]}", 'group': 'incident'}
                
                edges.append({'from': s_id, 'to': c_id, 'label': 'Involved in'})
                
            # Anomaly Detection Logic
            anomalies = []
            
            # Anomaly 1: Suspect linked to > 3 cases
            for s in suspects_dict.values():
                count = suspect_incident_counts.get(s['id'], 0)
                if count > 3:
                    s['is_anomaly'] = True
                    s['anomaly_reason'] = f'Hyper-connected: involved in {count} cases'
                    anomalies.append(s['id'])
                    
            # Anomaly 2: Gang with > 5 cases in the same beat
            for (b_id, beat), count in gang_beat_counts.items():
                if count > 5:
                    if b_id in gangs_dict:
                        gangs_dict[b_id]['is_anomaly'] = True
                        gangs_dict[b_id]['anomaly_reason'] = f'High activity peak: {count} crimes in beat {beat}'
                        anomalies.append(b_id)
            
            nodes = list(gangs_dict.values()) + list(suspects_dict.values()) + list(incidents.values())
            
            return Response({
                'nodes': nodes,
                'edges': edges,
                'anomalies_count': len(anomalies)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

