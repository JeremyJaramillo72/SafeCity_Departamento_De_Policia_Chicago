from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from administracion_seguridad.auth import SafeCityJWTAuthentication
from clickhouse_driver import Client
import uuid
from datetime import datetime
import os

def get_clickhouse_client():
    host = os.environ.get('CLICKHOUSE_HOST', 'localhost')
    return Client(host=host, port=9000, user='default', password='password12345')

def parse_datetime(val):
    if not val:
        return None
    if isinstance(val, datetime):
        return val
    s = str(val).replace('T', ' ').rstrip('Z')
    if '.' in s:
        s = s.split('.')[0]
    s = s.strip()
    for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M', '%Y-%m-%d'):
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue
    return None

class TrafficViolationCRUDView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request):
        try:
            page = int(request.query_params.get('page', 1))
            limit = int(request.query_params.get('limit', 10))
            offset = (page - 1) * limit
            
            search_nombre = request.query_params.get('search_nombre', '').strip()
            search_vehiculo = request.query_params.get('search_vehiculo', '').strip()
            ley_transito = request.query_params.get('ley_transito', '').strip()
            date_range = request.query_params.get('date_range', '')

            client = get_clickhouse_client()
            
            filters = []
            params = {'limit': limit, 'offset': offset}
            
            if search_nombre:
                filters.append("(nombre_conductor ILIKE %(search_nombre)s OR licencia_conductor ILIKE %(search_nombre)s)")
                params['search_nombre'] = f"%{search_nombre}%"
                
            if search_vehiculo:
                filters.append("(placa_vehiculo ILIKE %(search_vehiculo)s OR marca_vehiculo ILIKE %(search_vehiculo)s OR modelo_vehiculo ILIKE %(search_vehiculo)s)")
                params['search_vehiculo'] = f"%{search_vehiculo}%"
                
            if ley_transito and str(ley_transito).lower() not in ('all violations', 'todas las infracciones', 'all', 'todos', 'todas', ''):
                filters.append("ley_transito = %(ley_transito)s")
                params['ley_transito'] = ley_transito
                
            if date_range == '24h':
                filters.append("fecha_hora >= now() - INTERVAL 1 DAY")
            elif date_range == '7d':
                filters.append("fecha_hora >= now() - INTERVAL 7 DAY")
            elif date_range == '30d':
                filters.append("fecha_hora >= now() - INTERVAL 30 DAY")
                
            where_clause = "WHERE " + " AND ".join(filters) if filters else ""
            
            columns = ['id_infraccion', 'id_oficial', 'ubicacion', 'latitude', 'longitude', 'fecha_hora', 'ley_transito', 'monto_multa', 'nivel_bac', 'limite_velocidad', 'velocidad_registrada', 'placa_vehiculo', 'estado_placa', 'marca_vehiculo', 'modelo_vehiculo', 'anio_vehiculo', 'color_vehiculo', 'licencia_conductor', 'estado_licencia', 'nombre_conductor', 'direccion_conductor', 'fecha_nacimiento', 'condiciones_climaticas', 'condiciones_trafico', 'comentarios', 'evidencia_url']
            columns_str = ", ".join(columns)
            
            query = f'''
                SELECT {columns_str} FROM infraccion_transito
                {where_clause}
                ORDER BY fecha_hora DESC
                LIMIT %(limit)s OFFSET %(offset)s
            '''
            result = client.execute(query, params)
            
            # Count total for pagination
            total_result = client.execute(f'''
                SELECT count(*) FROM infraccion_transito
                {where_clause}
            ''', params)
            total_count = total_result[0][0] if total_result else 0
            
            data = []
            for row in result:
                row_dict = dict(zip(columns, row))
                # Normalize fecha_hora date to ISO format
                raw_date = row_dict['fecha_hora']
                if isinstance(raw_date, datetime):
                    row_dict['fecha_hora'] = raw_date.isoformat()
                else:
                    row_dict['fecha_hora'] = str(raw_date).replace(' ', 'T').rstrip('Z') + 'Z'
                data.append(row_dict)
                
            return Response({
                'data': data,
                'pagination': {
                    'total': total_count,
                    'page': page,
                    'per_page': limit,
                    'total_pages': (total_count + limit - 1) // limit
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            id_infraccion = str(uuid.uuid4())
            id_oficial = int(data.get('id_oficial', 1))
            ubicacion = data.get('ubicacion', '')
            latitude = data.get('latitude', '')
            longitude = data.get('longitude', '')
            fecha_hora = datetime.now()
            
            ley_transito = str(data.get('ley_transito') or '')
            
            def safe_float(val):
                try:
                    return float(val) if val else 0.0
                except: return 0.0
                
            def safe_int(val):
                try:
                    return int(val) if val else 0
                except: return 0

            monto_multa = safe_float(data.get('monto_multa'))
            nivel_bac = safe_float(data.get('nivel_bac'))
            limite_velocidad = safe_int(data.get('limite_velocidad'))
            velocidad_registrada = safe_int(data.get('velocidad_registrada'))
            
            placa_vehiculo = str(data.get('placa_vehiculo') or '')
            estado_placa = str(data.get('estado_placa') or '')
            marca_vehiculo = str(data.get('marca_vehiculo') or '')
            modelo_vehiculo = str(data.get('modelo_vehiculo') or '')
            anio_vehiculo = safe_int(data.get('anio_vehiculo'))
            color_vehiculo = str(data.get('color_vehiculo') or '')
            
            licencia_conductor = str(data.get('licencia_conductor') or '')
            estado_licencia = str(data.get('estado_licencia') or '')
            nombre_conductor = str(data.get('nombre_conductor') or '')
            direccion_conductor = str(data.get('direccion_conductor') or '')
            fecha_nacimiento = str(data.get('fecha_nacimiento') or '')
            
            condiciones_climaticas = str(data.get('condiciones_climaticas') or '')
            condiciones_trafico = str(data.get('condiciones_trafico') or '')
            comentarios = str(data.get('comentarios') or '')
            evidencia_url = str(data.get('evidencia_url') or '')

            client.execute(
                'INSERT INTO infraccion_transito (id_infraccion, id_oficial, ubicacion, latitude, longitude, fecha_hora, ley_transito, monto_multa, nivel_bac, limite_velocidad, velocidad_registrada, placa_vehiculo, estado_placa, marca_vehiculo, modelo_vehiculo, anio_vehiculo, color_vehiculo, licencia_conductor, estado_licencia, nombre_conductor, direccion_conductor, fecha_nacimiento, condiciones_climaticas, condiciones_trafico, comentarios, evidencia_url) VALUES',
                [(id_infraccion, id_oficial, ubicacion, latitude, longitude, fecha_hora, ley_transito, monto_multa, nivel_bac, limite_velocidad, velocidad_registrada, placa_vehiculo, estado_placa, marca_vehiculo, modelo_vehiculo, anio_vehiculo, color_vehiculo, licencia_conductor, estado_licencia, nombre_conductor, direccion_conductor, fecha_nacimiento, condiciones_climaticas, condiciones_trafico, comentarios, evidencia_url)]
            )
            return Response({'message': 'Traffic violation recorded successfully', 'id': id_infraccion}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("ERROR IN POST:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TrafficViolationDetailView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def put(self, request, id_infraccion):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            # Formateamos las condiciones para el UPDATE en ClickHouse
            set_clauses = []
            params = {'id_infraccion': id_infraccion}
            
            # Lista de campos que se pueden actualizar
            fields = ['ubicacion', 'latitude', 'longitude', 'ley_transito', 'monto_multa', 'nivel_bac', 'limite_velocidad', 'velocidad_registrada', 'placa_vehiculo', 'estado_placa', 'marca_vehiculo', 'modelo_vehiculo', 'anio_vehiculo', 'color_vehiculo', 'licencia_conductor', 'estado_licencia', 'nombre_conductor', 'direccion_conductor', 'fecha_nacimiento', 'condiciones_climaticas', 'condiciones_trafico', 'comentarios', 'evidencia_url']
            
            for field in fields:
                if field in data:
                    val = data[field]
                    if field in ['monto_multa', 'nivel_bac']:
                        val = float(val or 0.0)
                    elif field in ['limite_velocidad', 'velocidad_registrada', 'anio_vehiculo']:
                        val = int(val or 0)
                    else:
                        val = str(val or '')
                    
                    set_clauses.append(f"{field} = %({field})s")
                    params[field] = val
                    
            if not set_clauses:
                return Response({'message': 'No data to update'}, status=status.HTTP_400_BAD_REQUEST)
                
            query = f"ALTER TABLE infraccion_transito UPDATE {', '.join(set_clauses)} WHERE id_infraccion = %(id_infraccion)s"
            client.execute(query, params)
            
            return Response({'message': 'Traffic violation updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id_infraccion):
        try:
            client = get_clickhouse_client()
            # In ClickHouse, deletes are mutations (asynchronous) but we can trigger them
            client.execute(
                'ALTER TABLE infraccion_transito DELETE WHERE id_infraccion = %(id_infraccion)s',
                {'id_infraccion': id_infraccion}
            )
            return Response({'message': 'Traffic violation deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BookingCRUDView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request):
        try:
            page = int(request.query_params.get('page', 1))
            limit = int(request.query_params.get('limit', 10))
            offset = (page - 1) * limit
            
            search_nombre = request.query_params.get('search_nombre', '').strip()
            search_sospechoso = request.query_params.get('search_sospechoso', '').strip()
            search_term = request.query_params.get('search_term', '').strip()
            custodia_estado = request.query_params.get('custodia_estado', '').strip()
            date_range = request.query_params.get('date_range', '')

            client = get_clickhouse_client()
            
            filters = []
            params = {'limit': limit, 'offset': offset}

            if search_term:
                filters.append("(nombre_detenido ILIKE %(search_term)s OR id_ingreso ILIKE %(search_term)s)")
                params['search_term'] = f"%{search_term}%"
            
            if search_nombre:
                filters.append("nombre_detenido ILIKE %(search_nombre)s")
                params['search_nombre'] = f"%{search_nombre}%"
                
            if search_sospechoso:
                filters.append("toString(id_sospechoso) ILIKE %(search_sospechoso)s")
                params['search_sospechoso'] = f"%{search_sospechoso}%"
                
            if custodia_estado and custodia_estado != 'All' and custodia_estado != 'Todos':
                if custodia_estado in ('Activa', 'Active'):
                    filters.append("(custodia_estado IN ('Activa', 'Active', 'Detenido', 'En Custodia') OR (custodia_estado NOT IN ('Liberado', 'Released', 'Transferido', 'Transferred') AND hora_salida IS NULL))")
                elif custodia_estado in ('Liberado', 'Released'):
                    filters.append("(custodia_estado IN ('Liberado', 'Released') OR hora_salida IS NOT NULL)")
                else:
                    filters.append("custodia_estado = %(custodia_estado)s")
                    params['custodia_estado'] = custodia_estado
                
            if date_range == '24h':
                filters.append("hora_ingreso >= now() - INTERVAL 1 DAY")
            elif date_range == '7d':
                filters.append("hora_ingreso >= now() - INTERVAL 7 DAY")
            elif date_range == '30d':
                filters.append("hora_ingreso >= now() - INTERVAL 30 DAY")
                
            where_clause = "WHERE " + " AND ".join(filters) if filters else ""
            
            columns = [
                'id_ingreso', 'id_oficial', 'nombre_detenido', 'alias', 'fecha_nacimiento',
                'genero', 'nacionalidad', 'id_incidente_asociado', 'cargo_principal', 'gravedad_cargo',
                'estatura', 'peso', 'senas_particulares', 'numero_celda', 'estado_salud',
                'nivel_intoxicacion', 'articulos_retenidos', 'dinero_retenido', 'custodia_estado',
                'hora_ingreso', 'hora_salida', 'id_sospechoso', 'motivo_salida'
            ]
            columns_str = ", ".join(columns)
            
            query = f'''
                SELECT {columns_str} FROM ingreso_celda
                {where_clause}
                ORDER BY hora_ingreso DESC
                LIMIT %(limit)s OFFSET %(offset)s
            '''
            result = client.execute(query, params)
            
            # Count total for pagination
            total_result = client.execute(f'''
                SELECT count(*) FROM ingreso_celda
                {where_clause}
            ''', params)
            total_count = total_result[0][0] if total_result else 0
            
            data = []
            for row in result:
                row_dict = dict(zip(columns, row))
                
                # Normalize dates
                for date_field in ['hora_ingreso', 'hora_salida']:
                    raw_date = row_dict[date_field]
                    if raw_date:
                        if isinstance(raw_date, datetime):
                            row_dict[date_field] = raw_date.isoformat()
                        else:
                            row_dict[date_field] = str(raw_date).replace(' ', 'T').rstrip('Z') + 'Z'
                    else:
                        row_dict[date_field] = None
                        
                data.append(row_dict)
                
            return Response({
                'data': data,
                'pagination': {
                    'total': total_count,
                    'page': page,
                    'per_page': limit,
                    'total_pages': (total_count + limit - 1) // limit
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            id_ingreso = str(uuid.uuid4())
            id_oficial = int(data.get('id_oficial', 1))
            nombre_detenido = str(data.get('nombre_detenido') or '')
            alias = str(data.get('alias') or '')
            fecha_nacimiento = str(data.get('fecha_nacimiento') or '')
            genero = str(data.get('genero') or '')
            nacionalidad = str(data.get('nacionalidad') or '')
            id_incidente_asociado = str(data.get('id_incidente_asociado') or '')
            cargo_principal = str(data.get('cargo_principal') or '')
            gravedad_cargo = str(data.get('gravedad_cargo') or '')
            
            def safe_float(val):
                try: return float(val) if val else 0.0
                except: return 0.0
                
            def safe_int(val):
                try: return int(val) if val else 0
                except: return 0
 
            estatura = safe_float(data.get('estatura'))
            peso = safe_float(data.get('peso'))
            senas_particulares = str(data.get('senas_particulares') or '')
            numero_celda = str(data.get('numero_celda') or '')
            estado_salud = str(data.get('estado_salud') or '')
            nivel_intoxicacion = str(data.get('nivel_intoxicacion') or '')
            articulos_retenidos = str(data.get('articulos_retenidos') or '')
            dinero_retenido = safe_float(data.get('dinero_retenido'))
            custodia_estado = str(data.get('custodia_estado') or "Active")
            permiso_visitas = str(data.get('permiso_visitas') or 'Not specified')
            permiso_llamadas = str(data.get('permiso_llamadas') or 'Not specified')
            permiso_patio = str(data.get('permiso_patio') or 'Not specified')
            
            hora_ingreso_raw = data.get('hora_ingreso')
            if hora_ingreso_raw:
                hora_ingreso = parse_datetime(hora_ingreso_raw) or datetime.utcnow()
            else:
                hora_ingreso = datetime.utcnow()
                
            hora_salida_raw = data.get('hora_salida')
            hora_salida = parse_datetime(hora_salida_raw) if hora_salida_raw else None
            
            id_sospechoso = safe_int(data.get('id_sospechoso'))
            motivo_salida = str(data.get('motivo_salida') or "")
            
            client.execute(
                'INSERT INTO ingreso_celda (id_ingreso, id_oficial, nombre_detenido, alias, fecha_nacimiento, genero, nacionalidad, id_incidente_asociado, cargo_principal, gravedad_cargo, estatura, peso, senas_particulares, numero_celda, estado_salud, nivel_intoxicacion, articulos_retenidos, dinero_retenido, custodia_estado, permiso_visitas, permiso_llamadas, permiso_patio, hora_ingreso, hora_salida, id_sospechoso, motivo_salida) VALUES',
                [(id_ingreso, id_oficial, nombre_detenido, alias, fecha_nacimiento, genero, nacionalidad, id_incidente_asociado, cargo_principal, gravedad_cargo, estatura, peso, senas_particulares, numero_celda, estado_salud, nivel_intoxicacion, articulos_retenidos, dinero_retenido, custodia_estado, permiso_visitas, permiso_llamadas, permiso_patio, hora_ingreso, hora_salida, id_sospechoso, motivo_salida)]
            )
            return Response({'message': 'Booking registered successfully', 'id': id_ingreso}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
class BookingDetailView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]
 
    def put(self, request, id_ingreso):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            set_clauses = []
            params = {'id_ingreso': id_ingreso}
            
            fields = [
                'nombre_detenido', 'alias', 'fecha_nacimiento', 'genero', 'nacionalidad',
                'id_incidente_asociado', 'cargo_principal', 'gravedad_cargo', 'estatura', 'peso',
                'senas_particulares', 'numero_celda', 'estado_salud', 'nivel_intoxicacion',
                'articulos_retenidos', 'dinero_retenido', 'custodia_estado', 'id_sospechoso', 'motivo_salida',
                'permiso_visitas', 'permiso_llamadas', 'permiso_patio',
                'hora_ingreso', 'hora_salida'
            ]
            
            for field in fields:
                if field in data:
                    val = data[field]
                    if field in ['estatura', 'peso', 'dinero_retenido']:
                        val = float(val or 0.0)
                    elif field in ['id_sospechoso']:
                        val = int(val or 0)
                    elif field in ['hora_ingreso', 'hora_salida']:
                        val = parse_datetime(val)
                    else:
                        val = str(val or '')
                    
                    set_clauses.append(f"{field} = %({field})s")
                    params[field] = val
                    
            if not set_clauses:
                return Response({'message': 'No data to update'}, status=status.HTTP_400_BAD_REQUEST)
                
            query = f"ALTER TABLE ingreso_celda UPDATE {', '.join(set_clauses)} WHERE id_ingreso = %(id_ingreso)s"
            client.execute(query, params)
            
            return Response({'message': 'Booking updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id_ingreso):
        try:
            client = get_clickhouse_client()
            client.execute('ALTER TABLE ingreso_celda DELETE WHERE id_ingreso = %(id_ingreso)s', {'id_ingreso': id_ingreso})
            client.execute('ALTER TABLE bitacora_detenido DELETE WHERE id_ingreso = %(id_ingreso)s', {'id_ingreso': id_ingreso})
            return Response({'message': 'Booking and logs deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BookingReleaseView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def post(self, request, id_ingreso):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            motivo_salida = str(data.get('motivo_salida') or 'Bail/Standard Release')
            custodia_estado = str(data.get('custodia_estado') or 'Released')
            hora_salida = datetime.utcnow()
            
            client.execute(
                'ALTER TABLE ingreso_celda UPDATE hora_salida = %(hora_salida)s, custodia_estado = %(custodia_estado)s, motivo_salida = %(motivo_salida)s WHERE id_ingreso = %(id_ingreso)s',
                {'hora_salida': hora_salida, 'custodia_estado': custodia_estado, 'motivo_salida': motivo_salida, 'id_ingreso': id_ingreso}
            )
            
            # Log automatically to bitacora
            id_log = str(uuid.uuid4())
            tipo_accion = 'SALIDA'
            descripcion = f"Suspect released from custody. Status: {custodia_estado}. Reason: {motivo_salida}."
            
            client.execute(
                'INSERT INTO bitacora_detenido (id_log, id_ingreso, tipo_accion, descripcion, fecha_hora) VALUES',
                [(id_log, id_ingreso, tipo_accion, descripcion, hora_salida)]
            )
            
            return Response({'message': 'Suspect released and log updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BookingLogCRUDView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request, id_ingreso):
        try:
            client = get_clickhouse_client()
            result = client.execute('SELECT * FROM bitacora_detenido WHERE id_ingreso = %(id_ingreso)s ORDER BY fecha_hora ASC', {'id_ingreso': id_ingreso})
            columns = ['id_log', 'id_ingreso', 'tipo_accion', 'descripcion', 'fecha_hora']
            data = [dict(zip(columns, row)) for row in result]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, id_ingreso):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            id_log = str(uuid.uuid4())
            tipo_accion = data.get('tipo_accion', '')
            descripcion = data.get('descripcion', '')
            fecha_hora = datetime.utcnow()

            client.execute(
                'INSERT INTO bitacora_detenido (id_log, id_ingreso, tipo_accion, descripcion, fecha_hora) VALUES',
                [(id_log, id_ingreso, tipo_accion, descripcion, fecha_hora)]
            )
            return Response({'message': 'Log updated successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AllBookingLogsView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            query = """
                SELECT
                    b.id_log,
                    b.id_ingreso,
                    b.tipo_accion,
                    b.descripcion,
                    toString(b.fecha_hora) AS fecha_hora,
                    i.nombre_detenido
                FROM bitacora_detenido b
                LEFT JOIN ingreso_celda i ON b.id_ingreso = i.id_ingreso
                WHERE b.tipo_accion IN ('VISITA', 'VISITA_LEGAL', 'VISITA_FAMILIAR', 'LLAMADA_TELEFONICA')
                ORDER BY b.fecha_hora DESC
                LIMIT 100
            """
            result = client.execute(query)
            columns = ['id_log', 'id_ingreso', 'tipo_accion', 'descripcion', 'fecha_hora', 'nombre_detenido']
            data = []
            for row in result:
                row_dict = dict(zip(columns, row))
                raw_date = row_dict['fecha_hora']
                if raw_date:
                    row_dict['fecha_hora'] = str(raw_date).replace(' ', 'T')
                data.append(row_dict)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            id_log = str(uuid.uuid4())
            id_ingreso = data.get('id_ingreso', '')
            tipo_accion = data.get('tipo_accion', '')
            descripcion = data.get('descripcion', '')
            
            fh_str = data.get('fecha_hora', '')
            if fh_str:
                try:
                    fecha_hora = datetime.fromisoformat(fh_str.replace('Z', ''))
                except Exception:
                    fecha_hora = datetime.utcnow()
            else:
                fecha_hora = datetime.utcnow()

            client.execute(
                'INSERT INTO bitacora_detenido (id_log, id_ingreso, tipo_accion, descripcion, fecha_hora) VALUES',
                [(id_log, id_ingreso, tipo_accion, descripcion, fecha_hora)]
            )
            return Response({'message': 'Log updated successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CommunityMeetingCRUDView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            result = client.execute('SELECT * FROM reunion_comunitaria ORDER BY fecha_hora DESC LIMIT 100')
            columns = ['id_reunion', 'id_oficial', 'ubicacion', 'comentarios_vecinales', 'sentimiento_nlp', 'fecha_hora']
            data = [dict(zip(columns, row)) for row in result]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            id_reunion = str(uuid.uuid4())
            id_oficial = int(data.get('id_oficial', 1))
            ubicacion = data.get('ubicacion', '')
            comentarios_vecinales = data.get('comentarios_vecinales', '')
            sentimiento_nlp = 0.5  # placeholder until AI is implemented
            fecha_hora = datetime.now()

            client.execute(
                'INSERT INTO reunion_comunitaria (id_reunion, id_oficial, ubicacion, comentarios_vecinales, sentimiento_nlp, fecha_hora) VALUES',
                [(id_reunion, id_oficial, ubicacion, comentarios_vecinales, sentimiento_nlp, fecha_hora)]
            )
            return Response({'message': 'Community meeting registered successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaserDischargeCRUDView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            result = client.execute('SELECT * FROM descarga_taser ORDER BY fecha_hora DESC LIMIT 100')
            columns = ['id_descarga', 'id_oficial', 'id_incidente', 'serial_taser', 'justificacion', 'fecha_hora']
            data = [dict(zip(columns, row)) for row in result]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            id_descarga = str(uuid.uuid4())
            id_oficial = int(data.get('id_oficial', 1))
            id_incidente = data.get('id_incidente', '')
            serial_taser = data.get('serial_taser', '')
            justificacion = data.get('justificacion', '')
            fecha_hora = datetime.now()

            client.execute(
                'INSERT INTO descarga_taser (id_descarga, id_oficial, id_incidente, serial_taser, justificacion, fecha_hora) VALUES',
                [(id_descarga, id_oficial, id_incidente, serial_taser, justificacion, fecha_hora)]
            )
            return Response({'message': 'Taser discharge registered for Internal Affairs'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TowDispatchCRUDView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            columns = ['id_despacho', 'ubicacion', 'motivo', 'estado', 'fecha_hora', 'placa_vehiculo', 'marca_modelo', 'prioridad', 'tipo_grua', 'comentarios', 'evidencia_url']
            columns_str = ", ".join(columns)
            result = client.execute(f'SELECT {columns_str} FROM despacho_grua ORDER BY fecha_hora DESC LIMIT 100')
            data = [dict(zip(columns, row)) for row in result]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            id_despacho = str(uuid.uuid4())
            ubicacion = data.get('ubicacion', '')
            motivo = data.get('motivo', '')
            estado = 'PENDING'
            fecha_hora = datetime.now()
            placa_vehiculo = data.get('placa_vehiculo', '')
            marca_modelo = data.get('marca_modelo', '')
            prioridad = data.get('prioridad', 'Medium')
            tipo_grua = data.get('tipo_grua', 'Flatbed')
            comentarios = data.get('comentarios', '')
            evidencia_url = data.get('evidencia_url', '')

            client.execute(
                'INSERT INTO despacho_grua (id_despacho, ubicacion, motivo, estado, fecha_hora, placa_vehiculo, marca_modelo, prioridad, tipo_grua, comentarios, evidencia_url) VALUES',
                [(id_despacho, ubicacion, motivo, estado, fecha_hora, placa_vehiculo, marca_modelo, prioridad, tipo_grua, comentarios, evidencia_url)]
            )
            return Response({'message': 'Tow truck requested successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TrafficAccidentCRUDView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            columns = ['id_accidente', 'ubicacion', 'latitud', 'longitud', 'fecha_hora', 'gravedad', 'vehiculos_involucrados', 'heridos', 'fallecidos', 'causa_probable', 'estado', 'vehiculos_detalle', 'heridos_detalle', 'evidencia_url']
            columns_str = ", ".join(columns)
            result = client.execute(f'SELECT {columns_str} FROM accidente_transito ORDER BY fecha_hora DESC LIMIT 100')
            data = [dict(zip(columns, row)) for row in result]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            id_accidente = str(uuid.uuid4())
            ubicacion = data.get('ubicacion', '')
            latitud = data.get('latitud', '')
            longitud = data.get('longitud', '')
            fecha_hora = datetime.now()
            gravedad = data.get('gravedad', '')
            vehiculos_involucrados = int(data.get('vehiculos_involucrados', 0))
            heridos = int(data.get('heridos', 0))
            fallecidos = int(data.get('fallecidos', 0))
            causa_probable = data.get('causa_probable', '')
            estado = data.get('estado', 'Under Investigation')
            evidencia_url = data.get('evidencia_url', '')
            
            import json
            vehiculos_detalle = json.dumps(data.get('vehiculos_detalle', []))
            heridos_detalle = json.dumps(data.get('heridos_detalle', []))

            client.execute(
                'INSERT INTO accidente_transito (id_accidente, ubicacion, latitud, longitud, fecha_hora, gravedad, vehiculos_involucrados, heridos, fallecidos, causa_probable, estado, vehiculos_detalle, heridos_detalle, evidencia_url) VALUES',
                [(id_accidente, ubicacion, latitud, longitud, fecha_hora, gravedad, vehiculos_involucrados, heridos, fallecidos, causa_probable, estado, vehiculos_detalle, heridos_detalle, evidencia_url)]
            )
            return Response({'id_accidente': id_accidente, 'evidencia_url': evidencia_url, 'message': 'Accident successfully recorded'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TrafficAccidentDetailView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def put(self, request, id_accidente):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            # Clickhouse doesn't support UPDATE easily, so we drop and insert
            client.execute('ALTER TABLE accidente_transito DELETE WHERE id_accidente = %(id_accidente)s', {'id_accidente': id_accidente})
            
            ubicacion = data.get('ubicacion', '')
            latitud = data.get('latitud', '')
            longitud = data.get('longitud', '')
            
            fecha_hora_str = data.get('fecha_hora')
            if fecha_hora_str:
                try:
                    fecha_hora = datetime.fromisoformat(fecha_hora_str.replace('Z', '+00:00'))
                except Exception:
                    fecha_hora = datetime.now()
            else:
                fecha_hora = datetime.now()

            gravedad = data.get('gravedad', '')
            vehiculos_involucrados = int(data.get('vehiculos_involucrados', 0))
            heridos = int(data.get('heridos', 0))
            fallecidos = int(data.get('fallecidos', 0))
            causa_probable = data.get('causa_probable', '')
            estado = data.get('estado', 'Under Investigation')
            evidencia_url = data.get('evidencia_url', '')

            import json
            vehiculos_detalle = json.dumps(data.get('vehiculos_detalle', []))
            heridos_detalle = json.dumps(data.get('heridos_detalle', []))

            client.execute(
                'INSERT INTO accidente_transito (id_accidente, ubicacion, latitud, longitud, fecha_hora, gravedad, vehiculos_involucrados, heridos, fallecidos, causa_probable, estado, vehiculos_detalle, heridos_detalle, evidencia_url) VALUES',
                [(id_accidente, ubicacion, latitud, longitud, fecha_hora, gravedad, vehiculos_involucrados, heridos, fallecidos, causa_probable, estado, vehiculos_detalle, heridos_detalle, evidencia_url)]
            )
            return Response({'message': 'Crash updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id_accidente):
        try:
            client = get_clickhouse_client()
            client.execute('ALTER TABLE accidente_transito DELETE WHERE id_accidente = %(id_accidente)s', {'id_accidente': id_accidente})
            return Response({'message': 'Accident successfully eliminated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class TowDispatchDetailView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def put(self, request, id_despacho):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            client.execute('ALTER TABLE despacho_grua DELETE WHERE id_despacho = %(id_despacho)s', {'id_despacho': id_despacho})
            
            ubicacion = data.get('ubicacion', '')
            motivo = data.get('motivo', '')
            estado = data.get('estado', 'PENDING')
            
            fecha_hora_str = data.get('fecha_hora')
            if fecha_hora_str:
                try:
                    fecha_hora = datetime.fromisoformat(fecha_hora_str.replace('Z', '+00:00'))
                except Exception:
                    fecha_hora = datetime.now()
            else:
                fecha_hora = datetime.now()
                
            placa_vehiculo = data.get('placa_vehiculo', '')
            marca_modelo = data.get('marca_modelo', '')
            prioridad = data.get('prioridad', 'Medium')
            tipo_grua = data.get('tipo_grua', 'Flatbed')
            comentarios = data.get('comentarios', '')
            evidencia_url = data.get('evidencia_url', '')

            client.execute(
                'INSERT INTO despacho_grua (id_despacho, ubicacion, motivo, estado, fecha_hora, placa_vehiculo, marca_modelo, prioridad, tipo_grua, comentarios, evidencia_url) VALUES',
                [(id_despacho, ubicacion, motivo, estado, fecha_hora, placa_vehiculo, marca_modelo, prioridad, tipo_grua, comentarios, evidencia_url)]
            )
            return Response({'message': 'Crane dispatch successfully updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id_despacho):
        try:
            client = get_clickhouse_client()
            client.execute('ALTER TABLE despacho_grua DELETE WHERE id_despacho = %(id_despacho)s', {'id_despacho': id_despacho})
            return Response({'message': 'Crane dispatch successfully removed'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CellStatusView(APIView):
    authentication_classes = [SafeCityJWTAuthentication]

    def get(self, request):
        try:
            client = get_clickhouse_client()
            
            # Retrieve active bookings occupying cells
            active_bookings = client.execute('''
                SELECT id_ingreso, numero_celda, nombre_detenido, hora_ingreso
                FROM ingreso_celda
                WHERE numero_celda != '' 
                  AND (custodia_estado IN ('Activa', 'Active', 'Detenido', 'En Custodia') OR (custodia_estado NOT IN ('Liberado', 'Released', 'Transferido', 'Transferred') AND hora_salida IS NULL))
            ''')
            
            # Retrieve the latest RONDA_SUPERVISION for these bookings
            ronda_logs = client.execute('''
                SELECT id_ingreso, max(fecha_hora) as ultima_ronda
                FROM bitacora_detenido
                WHERE tipo_accion = 'RONDA_SUPERVISION'
                GROUP BY id_ingreso
            ''')
            
            ronda_map = {row[0]: row[1] for row in ronda_logs}
            
            result = []
            for b in active_bookings:
                id_ingreso = b[0]
                numero_celda = b[1]
                nombre = b[2]
                hora_ingreso = b[3]
                ultima_ronda = ronda_map.get(id_ingreso, hora_ingreso)
                
                result.append({
                    'id_ingreso': id_ingreso,
                    'numero_celda': numero_celda,
                    'nombre_detenido': nombre,
                    'hora_ingreso': hora_ingreso.isoformat() if hasattr(hora_ingreso, 'isoformat') else str(hora_ingreso),
                    'ultima_ronda': ultima_ronda.isoformat() if hasattr(ultima_ronda, 'isoformat') else str(ultima_ronda)
                })
                
            return Response({'data': result}, status=status.HTTP_200_OK)
        except Exception as e:
            print("ERROR CellStatusView:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
