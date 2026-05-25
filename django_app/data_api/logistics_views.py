from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .views import get_clickhouse_client

class LogisticsDashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            client = get_clickhouse_client()

            # Vehicles KPI
            vehicles_res = client.execute("SELECT count(*), countIf(estado_mantenimiento = 'operativo') FROM vehiculo_patrulla")
            total_vehicles = vehicles_res[0][0] if vehicles_res else 0
            operational_vehicles = vehicles_res[0][1] if vehicles_res else 0
            
            # Officers KPI
            officers_res = client.execute("SELECT count(*) FROM oficial_policia")
            total_officers = officers_res[0][0] if officers_res else 0

            # Equipment KPI
            equipment_res = client.execute("SELECT count(*), countIf(estado = 'operativo') FROM equipamiento_oficial")
            total_equipment = equipment_res[0][0] if equipment_res else 0
            operational_equipment = equipment_res[0][1] if equipment_res else 0

            # Patrol Shifts (Active)
            # In a real scenario we might filter by today's date
            try:
                shifts_res = client.execute("""
                    SELECT o.nombres, o.apellidos, v.codigo_beat, v.placa_vehiculo, t.hora_inicio, t.hora_fin
                    FROM turno_patrullaje t
                    LEFT JOIN oficial_policia o ON t.id_oficial = o.id_oficial
                    LEFT JOIN vehiculo_patrulla v ON t.id_vehiculo = v.id_vehiculo
                    LIMIT 20
                """)
                active_patrols = []
                for row in shifts_res:
                    active_patrols.append({
                        'officer_name': f"{row[0]} {row[1]}",
                        'beat': row[2],
                        'vehicle_plate': row[3],
                        'start_time': row[4],
                        'end_time': row[5],
                        'status': 'Active'
                    })
            except Exception as inner_e:
                # If join fails because tables are empty or missing
                active_patrols = []
                print(f"Error fetching patrols: {inner_e}")
                
            return Response({
                'kpis': {
                    'total_vehicles': total_vehicles,
                    'operational_vehicles': operational_vehicles,
                    'total_officers': total_officers,
                    'total_equipment': total_equipment,
                    'operational_equipment': operational_equipment
                },
                'active_patrols': active_patrols
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VehicleCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, vehicle_id=None):
        try:
            client = get_clickhouse_client()
            if vehicle_id:
                res = client.execute("SELECT id_vehiculo, codigo_beat, placa_vehiculo, tipo_vehiculo, estado_mantenimiento FROM vehiculo_patrulla WHERE id_vehiculo = %(id)s", {'id': vehicle_id})
                if not res:
                    return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)
                row = res[0]
                return Response({'id_vehiculo': row[0], 'codigo_beat': row[1], 'placa_vehiculo': row[2], 'tipo_vehiculo': row[3], 'estado_mantenimiento': row[4]}, status=status.HTTP_200_OK)
            else:
                res = client.execute("SELECT id_vehiculo, codigo_beat, placa_vehiculo, tipo_vehiculo, estado_mantenimiento FROM vehiculo_patrulla ORDER BY id_vehiculo ASC")
                vehicles = [{'id_vehiculo': row[0], 'codigo_beat': row[1], 'placa_vehiculo': row[2], 'tipo_vehiculo': row[3], 'estado_mantenimiento': row[4]} for row in res]
                return Response(vehicles, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            # Generate ID (ClickHouse doesn't have auto-increment like Postgres, we need max ID)
            res = client.execute("SELECT max(id_vehiculo) FROM vehiculo_patrulla")
            next_id = (res[0][0] or 0) + 1
            
            client.execute(
                "INSERT INTO vehiculo_patrulla (id_vehiculo, codigo_beat, placa_vehiculo, tipo_vehiculo, estado_mantenimiento) VALUES",
                [(next_id, data.get('codigo_beat', ''), data.get('placa_vehiculo', ''), data.get('tipo_vehiculo', ''), data.get('estado_mantenimiento', 'operativo'))]
            )
            return Response({'success': True, 'id_vehiculo': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, vehicle_id):
        try:
            client = get_clickhouse_client()
            data = request.data
            # In ClickHouse, updates are mutations: ALTER TABLE UPDATE
            client.execute(
                "ALTER TABLE vehiculo_patrulla UPDATE codigo_beat = %(codigo_beat)s, placa_vehiculo = %(placa_vehiculo)s, tipo_vehiculo = %(tipo_vehiculo)s, estado_mantenimiento = %(estado_mantenimiento)s WHERE id_vehiculo = %(id_vehiculo)s",
                {
                    'codigo_beat': data.get('codigo_beat', ''),
                    'placa_vehiculo': data.get('placa_vehiculo', ''),
                    'tipo_vehiculo': data.get('tipo_vehiculo', ''),
                    'estado_mantenimiento': data.get('estado_mantenimiento', 'operativo'),
                    'id_vehiculo': int(vehicle_id)
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, vehicle_id):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE vehiculo_patrulla DELETE WHERE id_vehiculo = %(id_vehiculo)s", {'id_vehiculo': int(vehicle_id)})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OfficerCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, officer_id=None):
        try:
            client = get_clickhouse_client()
            if officer_id:
                res = client.execute("SELECT id_oficial, placa_policial, nombres, apellidos, correo_electronico, telefono_contacto, fecha_ingreso, id_rol, url_fotografia FROM oficial_policia WHERE id_oficial = %(id)s", {'id': int(officer_id)})
                if not res:
                    return Response({'error': 'Officer not found'}, status=status.HTTP_404_NOT_FOUND)
                row = res[0]
                return Response({
                    'id_oficial': row[0],
                    'placa_policial': row[1],
                    'nombres': row[2],
                    'apellidos': row[3],
                    'correo_electronico': row[4],
                    'telefono_contacto': row[5],
                    'fecha_ingreso': str(row[6]),
                    'id_rol': row[7],
                    'url_fotografia': row[8]
                }, status=status.HTTP_200_OK)
            else:
                res = client.execute("SELECT id_oficial, placa_policial, nombres, apellidos, correo_electronico, telefono_contacto, fecha_ingreso, id_rol, url_fotografia FROM oficial_policia ORDER BY id_oficial ASC")
                officers = [{
                    'id_oficial': row[0],
                    'placa_policial': row[1],
                    'nombres': row[2],
                    'apellidos': row[3],
                    'correo_electronico': row[4],
                    'telefono_contacto': row[5],
                    'fecha_ingreso': str(row[6]),
                    'id_rol': row[7],
                    'url_fotografia': row[8]
                } for row in res]
                return Response(officers, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            import datetime
            client = get_clickhouse_client()
            data = request.data
            
            res = client.execute("SELECT max(id_oficial) FROM oficial_policia")
            next_id = (res[0][0] or 0) + 1
            
            fecha_str = data.get('fecha_ingreso', '')
            try:
                fecha_obj = datetime.date.fromisoformat(fecha_str)
            except Exception:
                fecha_obj = datetime.date.today()
                
            client.execute(
                "INSERT INTO oficial_policia (id_oficial, placa_policial, nombres, apellidos, correo_electronico, telefono_contacto, fecha_ingreso, id_rol, url_fotografia) VALUES",
                [(
                    next_id,
                    data.get('placa_policial', ''),
                    data.get('nombres', ''),
                    data.get('apellidos', ''),
                    data.get('correo_electronico', ''),
                    data.get('telefono_contacto', ''),
                    fecha_obj,
                    int(data.get('id_rol', 2)),
                    data.get('url_fotografia', '/assets/avatars/default.jpg')
                )]
            )
            return Response({'success': True, 'id_oficial': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, officer_id):
        try:
            import datetime
            client = get_clickhouse_client()
            data = request.data
            
            fecha_str = data.get('fecha_ingreso', '')
            try:
                fecha_obj = datetime.date.fromisoformat(fecha_str)
            except Exception:
                fecha_obj = datetime.date.today()

            client.execute(
                "ALTER TABLE oficial_policia UPDATE placa_policial = %(placa_policial)s, nombres = %(nombres)s, apellidos = %(apellidos)s, correo_electronico = %(correo_electronico)s, telefono_contacto = %(telefono_contacto)s, fecha_ingreso = %(fecha_ingreso)s, id_rol = %(id_rol)s, url_fotografia = %(url_fotografia)s WHERE id_oficial = %(id_oficial)s",
                {
                    'placa_policial': data.get('placa_policial', ''),
                    'nombres': data.get('nombres', ''),
                    'apellidos': data.get('apellidos', ''),
                    'correo_electronico': data.get('correo_electronico', ''),
                    'telefono_contacto': data.get('telefono_contacto', ''),
                    'fecha_ingreso': fecha_obj,
                    'id_rol': int(data.get('id_rol', 2)),
                    'url_fotografia': data.get('url_fotografia', '/assets/avatars/default.jpg'),
                    'id_oficial': int(officer_id)
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, officer_id):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE oficial_policia DELETE WHERE id_oficial = %(id_oficial)s", {'id_oficial': int(officer_id)})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PatrolShiftCRUDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, shift_id=None):
        try:
            client = get_clickhouse_client()
            if shift_id:
                res = client.execute("""
                    SELECT t.id_turno, t.id_oficial, o.nombres, o.apellidos, 
                           t.id_vehiculo, v.placa_vehiculo, t.fecha_turno, 
                           t.hora_inicio, t.hora_fin, t.ruta_coordenadas
                    FROM turno_patrullaje t
                    LEFT JOIN oficial_policia o ON t.id_oficial = o.id_oficial
                    LEFT JOIN vehiculo_patrulla v ON t.id_vehiculo = v.id_vehiculo
                    WHERE t.id_turno = %(id)s
                """, {'id': int(shift_id)})
                if not res:
                    return Response({'error': 'Patrol shift not found'}, status=status.HTTP_404_NOT_FOUND)
                row = res[0]
                return Response({
                    'id_turno': row[0],
                    'id_oficial': row[1],
                    'officer_name': f"{row[2]} {row[3]}" if row[2] else "Desconocido",
                    'id_vehiculo': row[4],
                    'vehicle_plate': row[5] or "Desconocido",
                    'fecha_turno': str(row[6]),
                    'hora_inicio': row[7],
                    'hora_fin': row[8],
                    'ruta_coordenadas': row[9]
                }, status=status.HTTP_200_OK)
            else:
                res = client.execute("""
                    SELECT t.id_turno, t.id_oficial, o.nombres, o.apellidos, 
                           t.id_vehiculo, v.placa_vehiculo, t.fecha_turno, 
                           t.hora_inicio, t.hora_fin, t.ruta_coordenadas, v.codigo_beat
                    FROM turno_patrullaje t
                    LEFT JOIN oficial_policia o ON t.id_oficial = o.id_oficial
                    LEFT JOIN vehiculo_patrulla v ON t.id_vehiculo = v.id_vehiculo
                    ORDER BY t.id_turno ASC
                """)
                shifts = [{
                    'id_turno': row[0],
                    'id_oficial': row[1],
                    'officer_name': f"{row[2]} {row[3]}" if row[2] else "Desconocido",
                    'id_vehiculo': row[4],
                    'vehicle_plate': row[5] or "Desconocido",
                    'fecha_turno': str(row[6]),
                    'hora_inicio': row[7],
                    'hora_fin': row[8],
                    'ruta_coordenadas': row[9],
                    'beat': row[10] or "N/A"
                } for row in res]
                return Response(shifts, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            import datetime
            client = get_clickhouse_client()
            data = request.data
            
            res = client.execute("SELECT max(id_turno) FROM turno_patrullaje")
            next_id = (res[0][0] or 0) + 1
            
            fecha_str = data.get('fecha_turno', '')
            try:
                fecha_obj = datetime.date.fromisoformat(fecha_str)
            except Exception:
                fecha_obj = datetime.date.today()
                
            client.execute(
                "INSERT INTO turno_patrullaje (id_turno, id_oficial, id_vehiculo, fecha_turno, hora_inicio, hora_fin, ruta_coordenadas) VALUES",
                [(
                    next_id,
                    int(data.get('id_oficial', 0)),
                    int(data.get('id_vehiculo', 0)),
                    fecha_obj,
                    data.get('hora_inicio', '08:00'),
                    data.get('hora_fin', '16:00'),
                    data.get('ruta_coordenadas', '[]')
                )]
            )
            return Response({'success': True, 'id_turno': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, shift_id):
        try:
            import datetime
            client = get_clickhouse_client()
            data = request.data
            
            fecha_str = data.get('fecha_turno', '')
            try:
                fecha_obj = datetime.date.fromisoformat(fecha_str)
            except Exception:
                fecha_obj = datetime.date.today()

            client.execute(
                "ALTER TABLE turno_patrullaje UPDATE id_oficial = %(id_oficial)s, id_vehiculo = %(id_vehiculo)s, fecha_turno = %(fecha_turno)s, hora_inicio = %(hora_inicio)s, hora_fin = %(hora_fin)s, ruta_coordenadas = %(ruta_coordenadas)s WHERE id_turno = %(id_turno)s",
                {
                    'id_oficial': int(data.get('id_oficial', 0)),
                    'id_vehiculo': int(data.get('id_vehiculo', 0)),
                    'fecha_turno': fecha_obj,
                    'hora_inicio': data.get('hora_inicio', '08:00'),
                    'hora_fin': data.get('hora_fin', '16:00'),
                    'ruta_coordenadas': data.get('ruta_coordenadas', '[]'),
                    'id_turno': int(shift_id)
                }
            )
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, shift_id):
        try:
            client = get_clickhouse_client()
            client.execute("ALTER TABLE turno_patrullaje DELETE WHERE id_turno = %(id_turno)s", {'id_turno': int(shift_id)})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

