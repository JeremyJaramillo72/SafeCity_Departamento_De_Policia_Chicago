import uuid
import datetime
import os
from clickhouse_driver import Client
from django.core.files.storage import default_storage
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

def get_clickhouse_client():
    host = os.environ.get('CLICKHOUSE_HOST', 'localhost')
    return Client(host=host, port=9000, user='default', password='password12345')

def get_officer_names_map():
    try:
        client = get_clickhouse_client()
        result = client.execute("SELECT id_oficial, nombres, apellidos, placa_policial FROM oficial_policia")
        return {row[0]: f"{row[1].capitalize()} {row[2].capitalize()} ({row[3]})" for row in result}
    except Exception:
        return {}

class ClockInView(APIView):
    def post(self, request):
        id_oficial = request.data.get('id_oficial')
        if not id_oficial:
            return Response({"error": 'official_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            client = get_clickhouse_client()
            # Check if there is an active shift
            res = client.execute(
                "SELECT id FROM rrhh_asistencia_registro WHERE id_oficial = %(id_oficial)s AND isNull(timestamp_salida) LIMIT 1",
                {'id_oficial': int(id_oficial)}
            )
            if res:
                return Response({"error": 'The officer already has an active shift without a clock-out.'}, status=status.HTTP_400_BAD_REQUEST)
            
            id_registro = f"AST-{uuid.uuid4().hex[:8].upper()}"
            timestamp_entrada = timezone.now()
            
            client.execute(
                "INSERT INTO rrhh_asistencia_registro (id, id_oficial, timestamp_entrada, timestamp_salida) VALUES",
                [(id_registro, int(id_oficial), timestamp_entrada, None)]
            )
            
            return Response({
                "id": id_registro,
                "id_oficial": int(id_oficial),
                "timestamp_entrada": timestamp_entrada.isoformat(),
                "timestamp_salida": None
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Error checking in on ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ClockOutView(APIView):
    def post(self, request):
        id_oficial = request.data.get('id_oficial')
        if not id_oficial:
            return Response({"error": 'official_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            client = get_clickhouse_client()
            res = client.execute(
                "SELECT id, timestamp_entrada FROM rrhh_asistencia_registro WHERE id_oficial = %(id_oficial)s AND isNull(timestamp_salida) LIMIT 1",
                {'id_oficial': int(id_oficial)}
            )
            if not res:
                return Response({"error": 'The officer does not have an active shift.'}, status=status.HTTP_400_BAD_REQUEST)
            
            id_registro = res[0][0]
            timestamp_entrada = res[0][1]
            timestamp_salida = timezone.now()
            
            client.execute(
                "ALTER TABLE rrhh_asistencia_registro UPDATE timestamp_salida = %(timestamp_salida)s WHERE id = %(id)s",
                {'timestamp_salida': timestamp_salida, 'id': id_registro}
            )
            
            return Response({
                "id": id_registro,
                "id_oficial": int(id_oficial),
                "timestamp_entrada": timestamp_entrada.isoformat(),
                "timestamp_salida": timestamp_salida.isoformat()
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error checking out in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AsistenciaRegistroListView(APIView):
    def get(self, request):
        try:
            client = get_clickhouse_client()
            result = client.execute(
                "SELECT id, id_oficial, timestamp_entrada, timestamp_salida FROM rrhh_asistencia_registro ORDER BY timestamp_entrada DESC"
            )
            
            names_map = get_officer_names_map()
            asistencias = []
            for row in result:
                asistencia = {
                    'id': row[0],
                    'id_oficial': row[1],
                    'timestamp_entrada': row[2].isoformat() if row[2] else None,
                    'timestamp_salida': row[3].isoformat() if row[3] else None,
                    'oficial_nombre': names_map.get(row[1], f"Oficial #{row[1]}")
                }
                asistencias.append(asistencia)
            return Response(asistencias, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error when checking attendance in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SolicitudPermisoCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        id_oficial = request.data.get('id_oficial')
        tipo_permiso = request.data.get('tipo_permiso')
        fecha_inicio = request.data.get('fecha_inicio')
        fecha_fin = request.data.get('fecha_fin')

        if not all([id_oficial, tipo_permiso, fecha_inicio, fecha_fin]):
            return Response({"error": 'All fields (official_id, permit_type, start_date, end_date) are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar fechas
        try:
            fecha_inicio_dt = datetime.datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
            fecha_fin_dt = datetime.datetime.strptime(fecha_fin, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        if fecha_inicio_dt > fecha_fin_dt:
            return Response({"error": 'The start date cannot be greater than the end date.'}, status=status.HTTP_400_BAD_REQUEST)

        # Manejar documento de respaldo
        documento_respaldo_url = None
        file_obj = request.FILES.get('documento_respaldo')
        if file_obj:
            file_name = default_storage.save(f"rrhh/permisos/{file_obj.name}", file_obj)
            documento_respaldo_url = default_storage.url(file_name)

        id_permiso = f"PRM-{uuid.uuid4().hex[:8].upper()}"
        timestamp_solicitud = timezone.now()

        try:
            client = get_clickhouse_client()
            client.execute(
                "INSERT INTO rrhh_solicitud_permiso (id, id_oficial, tipo_permiso, fecha_inicio, fecha_fin, estado, id_comandante_aprobador, timestamp_solicitud, timestamp_resolucion, documento_respaldo) VALUES",
                [(id_permiso, int(id_oficial), tipo_permiso, fecha_inicio_dt, fecha_fin_dt, 'Pendiente', None, timestamp_solicitud, None, documento_respaldo_url)]
            )
        except Exception as e:
            return Response({"error": f"Error saving in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "id": id_permiso,
            "id_oficial": int(id_oficial),
            "tipo_permiso": tipo_permiso,
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin,
            "estado": "Pendiente",
            "documento_respaldo": documento_respaldo_url,
            "timestamp_solicitud": timestamp_solicitud.isoformat()
        }, status=status.HTTP_201_CREATED)

class SolicitudPermisoListView(APIView):
    def get(self, request):
        try:
            client = get_clickhouse_client()
            result = client.execute(
                "SELECT id, id_oficial, tipo_permiso, fecha_inicio, fecha_fin, estado, id_comandante_aprobador, timestamp_solicitud, timestamp_resolucion, documento_respaldo FROM rrhh_solicitud_permiso ORDER BY timestamp_solicitud DESC"
            )
            
            names_map = get_officer_names_map()
            permisos = []
            for row in result:
                permiso = {
                    'id': row[0],
                    'id_oficial': row[1],
                    'tipo_permiso': row[2],
                    'fecha_inicio': row[3].isoformat() if row[3] else None,
                    'fecha_fin': row[4].isoformat() if row[4] else None,
                    'estado': row[5],
                    'id_comandante_aprobador': row[6],
                    'timestamp_solicitud': row[7].isoformat() if row[7] else None,
                    'timestamp_resolucion': row[8].isoformat() if row[8] else None,
                    'documento_respaldo': row[9] or None,
                    'oficial_nombre': names_map.get(row[1], f"Oficial #{row[1]}")
                }
                permisos.append(permiso)
            return Response(permisos, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error querying ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SolicitudPermisoAprobarView(APIView):
    def put(self, request, pk):
        estado = request.data.get('estado')
        if estado not in ['Aprobado', 'Rechazado']:
            return Response({"error": "The status must be 'Approved' or 'Rejected'."}, status=status.HTTP_400_BAD_REQUEST)

        # Intentar resolver id_comandante_aprobador
        id_comandante_aprobador = None
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            id_usuario = getattr(user, 'id_usuario', None)
            if id_usuario:
                try:
                    client = get_clickhouse_client()
                    res = client.execute("SELECT id_oficial FROM usuario_sistema WHERE id_usuario = %(id_usuario)s", {'id_usuario': id_usuario})
                    if res:
                        id_comandante_aprobador = res[0][0]
                except Exception:
                    pass

        if not id_comandante_aprobador:
            id_comandante_aprobador = 1

        timestamp_resolucion = timezone.now()

        try:
            client = get_clickhouse_client()
            client.execute(
                "ALTER TABLE rrhh_solicitud_permiso UPDATE estado = %(estado)s, id_comandante_aprobador = %(id_comandante)s, timestamp_resolucion = %(timestamp_resolucion)s WHERE id = %(id)s",
                {
                    'estado': estado,
                    'id_comandante': id_comandante_aprobador,
                    'timestamp_resolucion': timestamp_resolucion,
                    'id': pk
                }
            )
            return Response({
                "id": pk,
                "estado": estado,
                "id_comandante_aprobador": id_comandante_aprobador,
                "timestamp_resolucion": timestamp_resolucion.isoformat()
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error updating ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AmonestacionListCreateView(APIView):
    def post(self, request):
        id_oficial = request.data.get('id_oficial')
        tipo = request.data.get('tipo')
        descripcion = request.data.get('descripcion')
        id_comandante = request.data.get('id_comandante')
        
        if not all([id_oficial, tipo, descripcion, id_comandante]):
            return Response({"error": 'All fields (official_id, type, description, commander_id) are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        id_amonestacion = f"AMN-{uuid.uuid4().hex[:8].upper()}"
        timestamp = timezone.now()
        
        try:
            client = get_clickhouse_client()
            client.execute(
                "INSERT INTO rrhh_amonestacion (id, id_oficial, tipo, descripcion, id_comandante, timestamp) VALUES",
                [(id_amonestacion, int(id_oficial), tipo, descripcion, int(id_comandante), timestamp)]
            )
            
            return Response({
                "id": id_amonestacion,
                "id_oficial": int(id_oficial),
                "tipo": tipo,
                "descripcion": descripcion,
                "id_comandante": int(id_comandante),
                "timestamp": timestamp.isoformat()
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Error saving warning in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            client = get_clickhouse_client()
            result = client.execute(
                "SELECT id, id_oficial, tipo, descripcion, id_comandante, timestamp FROM rrhh_amonestacion ORDER BY timestamp DESC"
            )
            
            names_map = get_officer_names_map()
            amonestaciones = []
            for row in result:
                amonestacion = {
                    'id': row[0],
                    'id_oficial': row[1],
                    'tipo': row[2],
                    'descripcion': row[3],
                    'id_comandante': row[4],
                    'timestamp': row[5].isoformat() if row[5] else None,
                    'oficial_nombre': names_map.get(row[1], f"Oficial #{row[1]}"),
                    'comandante_nombre': names_map.get(row[4], f"Supervisor #{row[4]}")
                }
                amonestaciones.append(amonestacion)
            return Response(amonestaciones, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error when consulting warnings in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CertificacionListCreateView(APIView):
    def post(self, request):
        id_oficial = request.data.get('id_oficial')
        nombre_curso = request.data.get('nombre_curso')
        institucion = request.data.get('institucion')
        fecha_completado = request.data.get('fecha_completado')
        
        if not all([id_oficial, nombre_curso, institucion, fecha_completado]):
            return Response({"error": 'All fields (official_id, course_name, institution, date_completed) are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            fecha_completado_dt = datetime.datetime.strptime(fecha_completado, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Manejar documento de respaldo
        documento_respaldo_url = None
        file_obj = request.FILES.get('documento_respaldo')
        if file_obj:
            file_name = default_storage.save(f"rrhh/certificaciones/{uuid.uuid4().hex}_{file_obj.name}", file_obj)
            documento_respaldo_url = default_storage.url(file_name)

        id_certificacion = f"CRT-{uuid.uuid4().hex[:8].upper()}"
        timestamp_registro = timezone.now()
        
        try:
            client = get_clickhouse_client()
            client.execute(
                "INSERT INTO rrhh_certificacion (id, id_oficial, nombre_curso, institucion, fecha_completado, timestamp_registro, documento_respaldo) VALUES",
                [(id_certificacion, int(id_oficial), nombre_curso, institucion, fecha_completado_dt, timestamp_registro, documento_respaldo_url)]
            )
            
            return Response({
                "id": id_certificacion,
                "id_oficial": int(id_oficial),
                "nombre_curso": nombre_curso,
                "institucion": institucion,
                "fecha_completado": fecha_completado,
                "timestamp_registro": timestamp_registro.isoformat(),
                "documento_respaldo": documento_respaldo_url
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Error when saving certification in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            client = get_clickhouse_client()
            result = client.execute(
                "SELECT id, id_oficial, nombre_curso, institucion, fecha_completado, timestamp_registro, documento_respaldo FROM rrhh_certificacion ORDER BY fecha_completado DESC"
            )
            
            names_map = get_officer_names_map()
            certificaciones = []
            for row in result:
                certificacion = {
                    'id': row[0],
                    'id_oficial': row[1],
                    'nombre_curso': row[2],
                    'institucion': row[3],
                    'fecha_completado': row[4].isoformat() if row[4] else None,
                    'timestamp_registro': row[5].isoformat() if row[5] else None,
                    'documento_respaldo': row[6] or None,
                    'oficial_nombre': names_map.get(row[1], f"Oficial #{row[1]}")
                }
                certificaciones.append(certificacion)
            return Response(certificaciones, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error when consulting certifications in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RollCallBriefingListCreateView(APIView):
    def post(self, request):
        id_supervisor = request.data.get('id_supervisor')
        bolo_details = request.data.get('bolo_details') or ''
        special_assignments = request.data.get('special_assignments') or ''
        asistentes = request.data.get('asistentes') or ''
        
        if not id_supervisor:
            return Response({"error": 'supervisor_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        id_briefing = f"BRF-{uuid.uuid4().hex[:8].upper()}"
        timestamp = timezone.now()
        
        try:
            client = get_clickhouse_client()
            client.execute(
                "INSERT INTO rrhh_roll_call_briefing (id, id_supervisor, bolo_details, special_assignments, asistentes, timestamp) VALUES",
                [(id_briefing, int(id_supervisor), bolo_details, special_assignments, asistentes, timestamp)]
            )
            
            return Response({
                "id": id_briefing,
                "id_supervisor": int(id_supervisor),
                "bolo_details": bolo_details,
                "special_assignments": special_assignments,
                "asistentes": asistentes,
                "timestamp": timestamp.isoformat()
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Error when saving briefing in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            client = get_clickhouse_client()
            result = client.execute(
                "SELECT id, id_supervisor, bolo_details, special_assignments, asistentes, timestamp FROM rrhh_roll_call_briefing ORDER BY timestamp DESC"
            )
            
            names_map = get_officer_names_map()
            briefings = []
            for row in result:
                briefing = {
                    'id': row[0],
                    'id_supervisor': row[1],
                    'bolo_details': row[2],
                    'special_assignments': row[3],
                    'asistentes': row[4],
                    'timestamp': row[5].isoformat() if row[5] else None,
                    'supervisor_nombre': names_map.get(row[1], f"Supervisor #{row[1]}")
                }
                briefings.append(briefing)
            return Response(briefings, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error when consulting briefings in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ShiftHandoverListCreateView(APIView):
    def post(self, request):
        id_oficial_saliente = request.data.get('id_oficial_saliente')
        id_oficial_entrante = request.data.get('id_oficial_entrante')
        checklist_detenidos = 1 if request.data.get('checklist_detenidos') else 0
        checklist_equipos = 1 if request.data.get('checklist_equipos') else 0
        checklist_incidentes = 1 if request.data.get('checklist_incidentes') else 0
        novedades = request.data.get('novedades') or ''
        
        if not all([id_oficial_saliente, id_oficial_entrante]):
            return Response({"error": 'outgoing_official_id and incoming_official_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        id_handover = f"HND-{uuid.uuid4().hex[:8].upper()}"
        timestamp = timezone.now()
        
        try:
            client = get_clickhouse_client()
            client.execute(
                "INSERT INTO rrhh_shift_handover (id, id_oficial_saliente, id_oficial_entrante, checklist_detenidos, checklist_equipos, checklist_incidentes, novedades, leido, timestamp) VALUES",
                [(id_handover, int(id_oficial_saliente), int(id_oficial_entrante), checklist_detenidos, checklist_equipos, checklist_incidentes, novedades, 0, timestamp)]
            )
            
            return Response({
                "id": id_handover,
                "id_oficial_saliente": int(id_oficial_saliente),
                "id_oficial_entrante": int(id_oficial_entrante),
                "checklist_detenidos": bool(checklist_detenidos),
                "checklist_equipos": bool(checklist_equipos),
                "checklist_incidentes": bool(checklist_incidentes),
                "novedades": novedades,
                "leido": False,
                "timestamp": timestamp.isoformat()
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Error when saving transfer in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            client = get_clickhouse_client()
            result = client.execute(
                "SELECT id, id_oficial_saliente, id_oficial_entrante, checklist_detenidos, checklist_equipos, checklist_incidentes, novedades, leido, timestamp FROM rrhh_shift_handover ORDER BY timestamp DESC"
            )
            
            names_map = get_officer_names_map()
            handovers = []
            for row in result:
                handover = {
                    'id': row[0],
                    'id_oficial_saliente': row[1],
                    'id_oficial_entrante': row[2],
                    'checklist_detenidos': bool(row[3]),
                    'checklist_equipos': bool(row[4]),
                    'checklist_incidentes': bool(row[5]),
                    'novedades': row[6],
                    'leido': bool(row[7]),
                    'timestamp': row[8].isoformat() if row[8] else None,
                    'saliente_nombre': names_map.get(row[1], f"Oficial #{row[1]}"),
                    'entrante_nombre': names_map.get(row[2], f"Oficial #{row[2]}")
                }
                handovers.append(handover)
            return Response(handovers, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error when consulting transfers in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ShiftHandoverConfirmView(APIView):
    def post(self, request, pk):
        try:
            client = get_clickhouse_client()
            client.execute(
                "ALTER TABLE rrhh_shift_handover UPDATE leido = 1 WHERE id = %(id)s",
                {'id': pk}
            )
            return Response({"status": "Handover confirmed"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error when confirming transfer in ClickHouse: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AbsenteeismCoverageView(APIView):
    """OT4: Ausentismo y cobertura de cuadrantes de patrullaje."""
    def get(self, request):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        
        # Si no se dan fechas, usar hoy
        if not fecha_inicio or not fecha_fin:
            hoy = datetime.date.today()
            fecha_inicio = hoy.isoformat()
            fecha_fin = hoy.isoformat()
        
        try:
            client = get_clickhouse_client()
            
            # 1. Turnos programados en el rango de fechas
            turnos = client.execute(
                "SELECT t.id_oficial, vp.codigo_beat, t.hora_inicio, t.hora_fin "
                "FROM turno_patrullaje t "
                "LEFT JOIN vehiculo_patrulla vp ON t.id_vehiculo = vp.id_vehiculo "
                "WHERE toDate(t.hora_inicio) >= %(fecha_inicio)s "
                "AND toDate(t.hora_inicio) <= %(fecha_fin)s",
                {'fecha_inicio': fecha_inicio, 'fecha_fin': fecha_fin}
            )
            
            # 2. Registros de asistencia en el mismo rango
            asistencias = client.execute(
                "SELECT id_oficial, timestamp_entrada "
                "FROM rrhh_asistencia_registro "
                "WHERE toDate(timestamp_entrada) >= %(fecha_inicio)s "
                "AND toDate(timestamp_entrada) <= %(fecha_fin)s",
                {'fecha_inicio': fecha_inicio, 'fecha_fin': fecha_fin}
            )
            
            # 3. Cruzar: oficiales con turno pero sin clock-in
            oficiales_con_asistencia = set(row[0] for row in asistencias)
            nombres_map = get_officer_names_map()
            
            turnos_cubiertos = 0
            turnos_sin_cobertura = 0
            beats_descubiertos = set()
            oficiales_ausentes = []
            oficiales_ausentes_ids = set()
            
            for turno in turnos:
                id_oficial = turno[0]
                beat = turno[1] or 'Unknown'
                if id_oficial in oficiales_con_asistencia:
                    turnos_cubiertos += 1
                else:
                    turnos_sin_cobertura += 1
                    beats_descubiertos.add(beat)
                    if id_oficial not in oficiales_ausentes_ids:
                        oficiales_ausentes_ids.add(id_oficial)
                        oficiales_ausentes.append({
                            'id_oficial': id_oficial,
                            'name': nombres_map.get(id_oficial, f"Officer #{id_oficial}"),
                            'assigned_beat': beat
                        })
            
            total_turnos = turnos_cubiertos + turnos_sin_cobertura
            tasa_ausentismo = round((turnos_sin_cobertura / total_turnos * 100), 1) if total_turnos > 0 else 0
            
            return Response({
                'date_range': {'start': fecha_inicio, 'end': fecha_fin},
                'total_scheduled_shifts': total_turnos,
                'covered_shifts': turnos_cubiertos,
                'uncovered_shifts': turnos_sin_cobertura,
                'absenteeism_rate': tasa_ausentismo,
                'uncovered_beats': sorted(list(beats_descubiertos)),
                'absent_officers': oficiales_ausentes
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error querying absenteeism coverage: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OfficerPerformanceView(APIView):
    """OT16: Reporte de rendimiento integral por oficial (scorecard)."""
    def get(self, request):
        id_oficial = request.query_params.get('id_oficial')
        
        try:
            client = get_clickhouse_client()
            nombres_map = get_officer_names_map()
            
            if id_oficial:
                # Scorecard individual
                id_of = int(id_oficial)
                scorecard = self._calcular_scorecard(client, id_of, nombres_map)
                return Response(scorecard, status=status.HTTP_200_OK)
            else:
                # Ranking global de todos los oficiales
                res_oficiales = client.execute("SELECT id_oficial FROM oficial_policia ORDER BY id_oficial")
                
                scorecards = []
                for row in res_oficiales:
                    sc = self._calcular_scorecard(client, row[0], nombres_map)
                    scorecards.append(sc)
                
                # Ordenar por score descendente
                scorecards.sort(key=lambda x: x['performance_score'], reverse=True)
                
                # KPIs globales
                scores = [s['performance_score'] for s in scorecards]
                promedio_score = round(sum(scores) / len(scores), 1) if scores else 0
                necesitan_atencion = len([s for s in scorecards if s['performance_score'] < 40])
                
                return Response({
                    'total_officers': len(scorecards),
                    'average_score': promedio_score,
                    'officers_needing_attention': necesitan_atencion,
                    'top_performer': scorecards[0] if scorecards else None,
                    'ranking': scorecards
                }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error querying officer performance: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _calcular_scorecard(self, client, id_oficial, nombres_map):
        """Calcula el scorecard compuesto de un oficial."""
        # 1. Certificaciones
        res_cert = client.execute(
            "SELECT count(*) FROM rrhh_certificacion WHERE id_oficial = %(id)s",
            {'id': id_oficial}
        )
        total_certificaciones = res_cert[0][0] if res_cert else 0
        
        # 2. Amonestaciones por tipo
        res_amon = client.execute(
            "SELECT tipo, count(*) as total FROM rrhh_amonestacion WHERE id_oficial = %(id)s GROUP BY tipo",
            {'id': id_oficial}
        )
        amonestaciones = {row[0]: row[1] for row in res_amon}
        total_amonestaciones = sum(amonestaciones.values())
        
        # 3. Asistencia (tasa de turnos completados)
        res_asist = client.execute(
            "SELECT count(*) as total, "
            "countIf(isNotNull(timestamp_salida)) as completados "
            "FROM rrhh_asistencia_registro WHERE id_oficial = %(id)s",
            {'id': id_oficial}
        )
        total_registros = res_asist[0][0] if res_asist else 0
        turnos_completados = res_asist[0][1] if res_asist else 0
        tasa_asistencia = round((turnos_completados / total_registros * 100), 1) if total_registros > 0 else 0
        
        # 4. Turnos patrullados
        res_turnos = client.execute(
            "SELECT count(*) FROM turno_patrullaje WHERE id_oficial = %(id)s",
            {'id': id_oficial}
        )
        total_turnos = res_turnos[0][0] if res_turnos else 0
        
        # 5. Calcular score compuesto
        score = (total_certificaciones * 10) + (turnos_completados * 2) - (total_amonestaciones * 15)
        score = max(score, 0)  # No permitir scores negativos
        
        return {
            'id_oficial': id_oficial,
            'name': nombres_map.get(id_oficial, f"Officer #{id_oficial}"),
            'performance_score': score,
            'certifications': total_certificaciones,
            'warnings': amonestaciones,
            'total_warnings': total_amonestaciones,
            'attendance_rate': tasa_asistencia,
            'total_attendance_records': total_registros,
            'completed_shifts': turnos_completados,
            'patrol_shifts': total_turnos
        }
