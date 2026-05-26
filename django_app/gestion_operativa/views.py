import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from clickhouse_driver import Client
from rest_framework.permissions import AllowAny # For now, allow any or use custom auth

def get_clickhouse_client():
    # Connect to the local ClickHouse container in Docker
    return Client(
        host='localhost',
        port=9000,
        user='default',
        password='password12345',
        secure=False
    )
def parse_datetime(val):
    if not val:
        return None
    if isinstance(val, datetime.datetime):
        return val
    # Remove Z, replace T with space
    s = str(val).replace('T', ' ').rstrip('Z')
    # If there's milliseconds, let's strip them
    if '.' in s:
        s = s.split('.')[0]
    try:
        return datetime.datetime.strptime(s, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        try:
            return datetime.datetime.strptime(s.split(' ')[0], '%Y-%m-%d')
        except ValueError:
            return datetime.datetime.utcnow()

def resolve_location_id(client, location_description):
    if not location_description:
        return 2  # 'OTHER' default
    desc = location_description.strip().upper()
    res = client.execute("SELECT id_ubicacion FROM catalogo_ubicacion WHERE descripcion_lugar = %(desc)s LIMIT 1", {'desc': desc})
    if res:
        return res[0][0]
    else:
        max_id_res = client.execute("SELECT max(id_ubicacion) FROM catalogo_ubicacion")
        next_id = (max_id_res[0][0] + 1) if (max_id_res and max_id_res[0][0] is not None) else 1
        client.execute(
            "INSERT INTO catalogo_ubicacion (id_ubicacion, descripcion_lugar, es_espacio_publico) VALUES",
            [(next_id, desc, False)]
        )
        return next_id

def resolve_district_id(client, district_str):
    if not district_str:
        return 0  # Desconocido/Default
    dist_num = str(district_str).strip()
    import re
    match = re.search(r'(\d+)', dist_num)
    if match:
        dist_num = str(int(match.group(1))).zfill(3)
    else:
        dist_num = dist_num.zfill(3)
    
    res = client.execute("SELECT id_estacion FROM estacion_policial WHERE numero_distrito = %(dist)s LIMIT 1", {'dist': dist_num})
    if res:
        return res[0][0]
    else:
        max_id_res = client.execute("SELECT max(id_estacion) FROM estacion_policial")
        next_id = (max_id_res[0][0] + 1) if (max_id_res and max_id_res[0][0] is not None) else 1
        client.execute(
            "INSERT INTO estacion_policial (id_estacion, numero_distrito, direccion, telefono_contacto, id_oficial) VALUES",
            [(next_id, dist_num, '', '', 0)]
        )
        return next_id

def resolve_and_link_crime_code(client, case_number, iucr, primary_type, fbi_code):
    iucr = str(iucr or '').strip().upper()
    primary_type = str(primary_type or '').strip().upper()
    fbi_code = str(fbi_code or '').strip().upper()
    
    if not iucr:
        if primary_type:
            res = client.execute("SELECT codigo_iucr FROM codigo_penal WHERE gravedad_delito = %(pt)s LIMIT 1", {'pt': primary_type})
            if res:
                iucr = res[0][0]
            else:
                iucr = '9999'
        else:
            iucr = '9999'
            primary_type = 'OTHER OFFENSE'
            
    penal_res = client.execute("SELECT id_codigo, codigo_fbi, gravedad_delito FROM codigo_penal WHERE codigo_iucr = %(iucr)s LIMIT 1", {'iucr': iucr})
    if not penal_res:
        max_id_res = client.execute("SELECT max(id_codigo) FROM codigo_penal")
        next_id = (max_id_res[0][0] + 1) if (max_id_res and max_id_res[0][0] is not None) else 1
        client.execute(
            "INSERT INTO codigo_penal (id_codigo, codigo_iucr, codigo_fbi, gravedad_delito) VALUES",
            [(next_id, iucr, fbi_code or '26', primary_type or 'OTHER OFFENSE')]
        )
    else:
        existing_fbi = penal_res[0][1]
        existing_severity = penal_res[0][2]
        if (fbi_code and fbi_code != existing_fbi) or (primary_type and primary_type != existing_severity):
            client.execute(
                "ALTER TABLE codigo_penal UPDATE codigo_fbi = %(fbi)s, gravedad_delito = %(sev)s WHERE codigo_iucr = %(iucr)s",
                {'fbi': fbi_code or existing_fbi, 'sev': primary_type or existing_severity, 'iucr': iucr}
            )
            
    inc_delito_res = client.execute("SELECT id_incidente_delito FROM incidente_delito WHERE case_number = %(cn)s LIMIT 1", {'cn': case_number})
    if inc_delito_res:
        client.execute(
            "ALTER TABLE incidente_delito UPDATE codigo_iucr = %(iucr)s WHERE case_number = %(cn)s",
            {'iucr': iucr, 'cn': case_number}
        )
    else:
        max_id_res = client.execute("SELECT max(id_incidente_delito) FROM incidente_delito")
        next_id = (max_id_res[0][0] + 1) if (max_id_res and max_id_res[0][0] is not None) else 1
        client.execute(
            "INSERT INTO incidente_delito (id_incidente_delito, case_number, codigo_iucr, es_delito_primario) VALUES",
            [(next_id, case_number, iucr, True)]
        )
    return iucr


class DashboardKPIView(APIView):
    permission_classes = [AllowAny] # You may want to restrict this later

    def get(self, request):
        try:
            client = get_clickhouse_client()
            
            # KPI 1: Total Incidents
            total_result = client.execute("SELECT count(*) FROM chicago_crimes")
            total_incidents = total_result[0][0] if total_result else 0
            
            # KPI 2: Total Arrests
            arrests_result = client.execute("SELECT count(*) FROM chicago_crimes WHERE arrest = 1")
            total_arrests = arrests_result[0][0] if arrests_result else 0
            
            # KPI 3: Domestic Incidents
            domestic_result = client.execute("SELECT count(*) FROM chicago_crimes WHERE domestic = 1")
            total_domestic = domestic_result[0][0] if domestic_result else 0
            
            # Calculate Arrest Rate
            arrest_rate = round((total_arrests / total_incidents * 100), 1) if total_incidents > 0 else 0
            
            # Map data: coordinates from the dense 2001 dataset
            map_res = client.execute("""
                SELECT c.latitude, c.longitude, cp.gravedad_delito AS primary_type 
                FROM chicago_crimes c
                LEFT JOIN incidente_delito id ON c.case_number = id.case_number
                LEFT JOIN codigo_penal cp ON id.codigo_iucr = cp.codigo_iucr
                WHERE c.year = 2001 AND c.latitude != 0.0 AND c.longitude != 0.0 
                LIMIT 3000
            """)
            map_points = []
            for row in map_res:
                try:
                    map_points.append({'lat': float(row[0]), 'lng': float(row[1]), 'type': row[2]})
                except ValueError:
                    pass
            
            # Chart data: top 15 districts by crime count in 2001
            chart_res = client.execute("""
                SELECT e.numero_distrito AS district, count(*) as count 
                FROM chicago_crimes c 
                LEFT JOIN estacion_policial e ON c.id_estacion = e.id_estacion
                WHERE c.year = 2001 AND e.numero_distrito != '' 
                GROUP BY district 
                ORDER BY count DESC 
                LIMIT 15
            """)
            # Sort by district name for the chart visually, but we already got the top 15 by count
            chart_res_sorted = sorted(chart_res, key=lambda x: int(x[0]) if x[0].isdigit() else 999)
            chart_data = [{'district': str(row[0]), 'count': int(row[1])} for row in chart_res_sorted]
                
            # Hotspots: Top 5 exact locations with the most crime in 2001
            hotspot_res = client.execute(
                "SELECT latitude, longitude, count(*) as c FROM chicago_crimes WHERE year = 2001 AND latitude != 0.0 AND longitude != 0.0 GROUP BY latitude, longitude ORDER BY c DESC LIMIT 5"
            )
            hotspots = [{'lat': float(row[0]), 'lng': float(row[1]), 'count': int(row[2])} for row in hotspot_res]
                
            # Recent Feed: latest 5 incidents overall
            feed_res = client.execute("""
                SELECT c.date, cp.gravedad_delito AS primary_type, c.block, c.case_number 
                FROM chicago_crimes c 
                LEFT JOIN incidente_delito id ON c.case_number = id.case_number 
                LEFT JOIN codigo_penal cp ON id.codigo_iucr = cp.codigo_iucr 
                ORDER BY c.date DESC 
                LIMIT 5
            """)
            recent_feed = []
            for row in feed_res:
                time_str = row[0].strftime('%H:%M:%S') if isinstance(row[0], datetime.datetime) else str(row[0])[11:19]
                recent_feed.append({
                    'time': time_str,
                    'type': row[1],
                    'location': row[2],
                    'case_number': row[3]
                })

            return Response({
                'total_incidents': total_incidents,
                'total_arrests': total_arrests,
                'arrest_rate': arrest_rate,
                'total_domestic': total_domestic,
                'active_officers': 142, # Mocked since we don't have an active_officers table in cloud
                'unresolved_cases': total_incidents - total_arrests, # Mock logic
                'map_points': map_points,
                'chart_data': chart_data,
                'recent_feed': recent_feed,
                'hotspots': hotspots
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class IncidentListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            page = int(request.query_params.get('page', 1))
            per_page = int(request.query_params.get('limit', 10))
            offset = (page - 1) * per_page
            
            search = request.query_params.get('search', '').strip()
            date_range = request.query_params.get('date_range', '')
            district = request.query_params.get('district', '')
            crime_type = request.query_params.get('type', '')
            
            client = get_clickhouse_client()
            
            filters = []
            params = {'limit': per_page, 'offset': offset}
            
            if search:
                filters.append("(c.case_number ILIKE %(search)s OR c.block ILIKE %(search)s OR cp.gravedad_delito ILIKE %(search)s OR c.description ILIKE %(search)s)")
                params['search'] = f"%{search}%"
                
            if date_range == '24h':
                filters.append("c.date >= now() - INTERVAL 1 DAY")
            elif date_range == '7d':
                filters.append("c.date >= now() - INTERVAL 7 DAY")
            elif date_range == '30d':
                filters.append("c.date >= now() - INTERVAL 30 DAY")
                
            if district and district != 'All Districts':
                # Map 'District 1 - Central' -> '001', 'District 14' -> '014', etc.
                import re
                match = re.search(r'District (\d+)', district)
                if match:
                    dist_num = str(int(match.group(1))).zfill(3)
                    filters.append("e.numero_distrito = %(district)s")
                    params['district'] = dist_num
                
            if crime_type and crime_type != 'All Types':
                filters.append("cp.gravedad_delito ILIKE %(crime_type)s")
                params['crime_type'] = f"%{crime_type}%"
                
            where_clause = "WHERE " + " AND ".join(filters) if filters else ""
            
            # Query incidents, order by date descending
            query = f'''
                SELECT 
                    c.case_number,
                    c.date,
                    c.block,
                    cp.gravedad_delito AS primary_type,
                    c.description,
                    c.arrest,
                    c.domestic,
                    c.ward,
                    c.community_area,
                    e.numero_distrito AS district,
                    c.latitude,
                    c.longitude
                FROM chicago_crimes c
                LEFT JOIN incidente_delito id ON c.case_number = id.case_number
                LEFT JOIN codigo_penal cp ON id.codigo_iucr = cp.codigo_iucr
                LEFT JOIN estacion_policial e ON c.id_estacion = e.id_estacion
                {where_clause}
                ORDER BY c.date DESC
                LIMIT %(limit)s OFFSET %(offset)s
            '''
            
            result = client.execute(query, params)
            
            # Count total for pagination
            total_result = client.execute(f'''
                SELECT count(*) 
                FROM chicago_crimes c
                LEFT JOIN incidente_delito id ON c.case_number = id.case_number
                LEFT JOIN codigo_penal cp ON id.codigo_iucr = cp.codigo_iucr
                LEFT JOIN estacion_policial e ON c.id_estacion = e.id_estacion
                {where_clause}
            ''', params)
            total_count = total_result[0][0] if total_result else 0
            
            incidents = []
            for row in result:
                # Normalize date: ensure it's a clean ISO string compatible with Angular DatePipe
                raw_date = row[1]
                if isinstance(raw_date, datetime.datetime):
                    date_str = raw_date.isoformat()
                else:
                    # Clean up strings like "2025-11-22 04:24:00.000Z" -> valid ISO
                    date_str = str(raw_date).replace(' ', 'T').rstrip('Z') + 'Z'
                
                incidents.append({
                    'case_number': row[0],
                    'date': date_str,
                    'block': row[2],
                    'primary_type': row[3],
                    'description': row[4],
                    'arrest': bool(row[5]),
                    'domestic': bool(row[6]),
                    'ward': row[7],
                    'community_area': row[8],
                    'district': row[9],
                    'latitude': row[10],
                    'longitude': row[11]
                })
                
            return Response({
                'data': incidents,
                'pagination': {
                    'total': total_count,
                    'page': page,
                    'per_page': per_page,
                    'total_pages': (total_count + per_page - 1) // per_page
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def normalize_date(raw):
    """Convert any date value to a valid ISO string for Angular."""
    if isinstance(raw, datetime.datetime):
        return raw.isoformat()
    s = str(raw).strip()
    # Replace space separator with T and ensure it ends with Z
    s = s.replace(' ', 'T')
    if not s.endswith('Z') and '+' not in s:
        s = s.rstrip('Z') + 'Z'
    return s


class IncidentDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, case_number):
        try:
            client = get_clickhouse_client()

            query = """
                SELECT
                    c.case_number,
                    c.date,
                    c.block,
                    cp.codigo_iucr AS iucr,
                    cp.gravedad_delito AS primary_type,
                    c.description,
                    cu.descripcion_lugar AS location_description,
                    c.arrest,
                    c.domestic,
                    c.beat,
                    e.numero_distrito AS district,
                    c.ward,
                    c.community_area,
                    cp.codigo_fbi AS fbi_code,
                    c.x_coordinate,
                    c.y_coordinate,
                    c.year,
                    c.updated_on,
                    c.latitude,
                    c.longitude
                FROM chicago_crimes c
                LEFT JOIN incidente_delito id ON c.case_number = id.case_number
                LEFT JOIN codigo_penal cp ON id.codigo_iucr = cp.codigo_iucr
                LEFT JOIN catalogo_ubicacion cu ON c.id_ubicacion = cu.id_ubicacion
                LEFT JOIN estacion_policial e ON c.id_estacion = e.id_estacion
                WHERE c.case_number = %(case_number)s
                LIMIT 1
            """

            result = client.execute(query, {'case_number': case_number})

            if not result:
                return Response({'error': 'Incident not found'}, status=status.HTTP_404_NOT_FOUND)

            row = result[0]

            # Determine severity based on primary_type
            primary_type = row[4] or ''
            critical_types = ['HOMICIDE', 'ASSAULT', 'ROBBERY', 'KIDNAPPING', 'ARSON', 'BATTERY']
            high_types = ['BURGLARY', 'MOTOR VEHICLE THEFT', 'WEAPONS VIOLATION', 'SEX OFFENSE']
            if any(t in primary_type.upper() for t in critical_types):
                severity = 'CRITICAL'
            elif any(t in primary_type.upper() for t in high_types):
                severity = 'HIGH'
            else:
                severity = 'MODERATE'

            # Determine status label
            arrest_val = bool(row[7])
            status_label = 'Closed - Arrest Made' if arrest_val else 'Active Investigation'

            incident = {
                'case_number': row[0],
                'date': normalize_date(row[1]),
                'block': row[2],
                'iucr': row[3],
                'primary_type': primary_type,
                'description': row[5],
                'location_description': row[6],
                'arrest': arrest_val,
                'domestic': bool(row[8]),
                'beat': row[9],
                'district': row[10],
                'ward': row[11],
                'community_area': row[12],
                'fbi_code': row[13],
                'x_coordinate': row[14],
                'y_coordinate': row[15],
                'year': row[16],
                'updated_on': normalize_date(row[17]) if row[17] else None,
                'latitude': row[18],
                'longitude': row[19],
                'severity': severity,
                'status_label': status_label,
            }

            # Query suspects associated with this case
            suspects_res = client.execute("""
                SELECT s.id_sospechoso, s.nombres, s.alias_conocido, s.antecedentes, s.declaracion, b.nombre_banda, s.identificacion, s.genero, s.telefono, s.direccion, s.fecha_nacimiento
                FROM sospechoso s
                LEFT JOIN banda_criminal b ON s.id_banda = b.id_banda
                WHERE s.case_number = %(case_number)s
                ORDER BY s.id_sospechoso ASC
            """, {'case_number': case_number})
            suspects = [{
                'id_sospechoso': r[0],
                'nombres': r[1],
                'alias_conocido': r[2],
                'antecedentes': bool(r[3]),
                'declaracion': r[4],
                'nombre_banda': r[5] or "Ninguna",
                'identificacion': r[6],
                'genero': r[7],
                'telefono': r[8],
                'direccion': r[9],
                'fecha_nacimiento': str(r[10])
            } for r in suspects_res]

            # Query evidence associated with this case
            evidence_res = client.execute("""
                SELECT e.id_evidencia, e.tipo_evidencia, e.fecha_recoleccion, o.nombres, o.apellidos
                FROM evidencia e
                LEFT JOIN oficial_policia o ON e.id_oficial = o.id_oficial
                WHERE e.case_number = %(case_number)s
                ORDER BY e.id_evidencia ASC
            """, {'case_number': case_number})
            evidence = [{
                'id_evidencia': r[0],
                'tipo_evidencia': r[1],
                'fecha_recoleccion': str(r[2]),
                'officer_name': f"{r[3]} {r[4]}" if r[3] else "Desconocido"
            } for r in evidence_res]

            # Query witnesses associated with this case
            witnesses_res = client.execute("""
                SELECT id_testigo, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo
                FROM testigo
                WHERE case_number = %(case_number)s
                ORDER BY id_testigo ASC
            """, {'case_number': case_number})
            witnesses = [{
                'id_testigo': r[0],
                'nombres': r[1],
                'identificacion': r[2],
                'genero': r[3],
                'telefono': r[4],
                'direccion': r[5],
                'testimonio': r[6],
                'es_anonimo': bool(r[7])
            } for r in witnesses_res]

            # Query victims associated with this case
            victims_res = client.execute("""
                SELECT id_victima, nombres, identificacion, genero, telefono, direccion
                FROM victima
                WHERE case_number = %(case_number)s
                ORDER BY id_victima ASC
            """, {'case_number': case_number})
            victims = [{
                'id_victima': r[0],
                'nombres': r[1],
                'identificacion': r[2],
                'genero': r[3],
                'telefono': r[4],
                'direccion': r[5]
            } for r in victims_res]

            incident['suspects'] = suspects
            incident['evidence'] = evidence
            incident['witnesses'] = witnesses
            incident['victims'] = victims

            # Query case tracking logs from ClickHouse
            client.execute('''
                CREATE TABLE IF NOT EXISTS seguimiento_incidente (
                    id_seguimiento String,
                    case_number String,
                    fecha_registro DateTime,
                    estado_caso String,
                    accion String,
                    descripcion_avance String,
                    id_oficial Int32,
                    oficial String
                ) ENGINE = Log
            ''')
            
            logs_res = client.execute("""
                SELECT id_seguimiento, case_number, fecha_registro, oficial, accion, descripcion_avance
                FROM seguimiento_incidente
                WHERE case_number = %(case_number)s
                ORDER BY fecha_registro DESC
            """, {'case_number': case_number})
            
            timeline_logs = []
            
            # 1. Unify manual notes written by officers
            for r in logs_res:
                raw_date = r[2]
                if isinstance(raw_date, datetime.datetime):
                    date_str = raw_date.isoformat() + 'Z'
                else:
                    date_str = str(raw_date).replace(' ', 'T').rstrip('Z') + 'Z'
                timeline_logs.append({
                    'id_log': r[0],
                    'case_number': r[1],
                    'fecha': date_str,
                    'oficial': r[3],
                    'accion': r[4],
                    'comentario': r[5]
                })
                
            # 2. Inject auto-generated milestones from ClickHouse entities
            # Milestone: Creation of the Case
            timeline_logs.append({
                'id_log': 'virtual-create',
                'case_number': case_number,
                'fecha': incident['date'],
                'oficial': 'Sistema SafeCity',
                'accion': 'Creación de Caso',
                'comentario': f"Caso reportado y clasificado en sistema bajo el tipo de delito: {incident['primary_type']}."
            })
            
            # Milestone: Arrest
            if incident['arrest']:
                arrest_date = incident['updated_on'] if incident['updated_on'] else incident['date']
                timeline_logs.append({
                    'id_log': 'virtual-arrest',
                    'case_number': case_number,
                    'fecha': arrest_date,
                    'oficial': 'Patrulla del Distrito',
                    'accion': 'Arresto Realizado',
                    'comentario': f"Se procedió al arresto del sospechoso implicado. Estatus del caso actualizado a Cerrado por Arresto en el Distrito {incident['district']}."
                })
                
            # Milestones: Evidence logged
            for ev in evidence:
                timeline_logs.append({
                    'id_log': f"virtual-ev-{ev['id_evidencia']}",
                    'case_number': case_number,
                    'fecha': ev['fecha_recoleccion'] + 'Z' if ev['fecha_recoleccion'] and 'T' not in ev['fecha_recoleccion'] else ev['fecha_recoleccion'],
                    'oficial': ev['officer_name'],
                    'accion': 'Evidencia Asegurada',
                    'comentario': f"Evidencia física rotulada bajo custodia policial: {ev['tipo_evidencia']}."
                })
                
            # Milestones: Suspects linked
            for sus in suspects:
                timeline_logs.append({
                    'id_log': f"virtual-sus-{sus['id_sospechoso']}",
                    'case_number': case_number,
                    'fecha': incident['date'],
                    'oficial': 'División de Inteligencia',
                    'accion': 'Sospechoso Vinculado',
                    'comentario': f"Sujeto investigado {sus['nombres']} (Alias: \"{sus['alias_conocido']}\") formalmente vinculado y registrado al expediente del caso."
                })
                
            # Milestones: Witnesses interviewed
            for wit in witnesses:
                timeline_logs.append({
                    'id_log': f"virtual-wit-{wit['id_testigo']}",
                    'case_number': case_number,
                    'fecha': incident['date'],
                    'oficial': 'Oficial de Turno',
                    'accion': 'Declaración Tomada',
                    'comentario': f"Se tomó declaración de testigo {'Anónimo' if wit['es_anonimo'] else wit['nombres']}. Testimonio: \"{wit['testimonio']}\""
                })
                
            # Milestones: Victims registered
            for vic in victims:
                timeline_logs.append({
                    'id_log': f"virtual-vic-{vic['id_victima']}",
                    'case_number': case_number,
                    'fecha': incident['date'],
                    'oficial': 'Sistema SafeCity',
                    'accion': 'Víctima Registrada',
                    'comentario': f"Víctima afectada {vic['nombres']} agregada formalmente al archivo del caso para seguimiento y atención legal."
                })
                
            # Sort everything chronologically descending (newest first)
            timeline_logs = sorted(timeline_logs, key=lambda x: x['fecha'], reverse=True)
            
            incident['timeline_logs'] = timeline_logs

            return Response(incident, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, case_number):
        """Update an incident in chicago_crimes and related tables using ClickHouse ALTER TABLE ... UPDATE mutations."""
        try:
            client = get_clickhouse_client()
            data = request.data

            # Check incident exists first
            exists = client.execute(
                "SELECT count(*) FROM chicago_crimes WHERE case_number = %(cn)s",
                {'cn': case_number}
            )
            if not exists or exists[0][0] == 0:
                return Response({'error': 'Incident not found'}, status=status.HTTP_404_NOT_FOUND)

            # Update crime categories/codes if present
            iucr = data.get('iucr')
            primary_type = data.get('primary_type')
            fbi_code = data.get('fbi_code')
            if iucr or primary_type or fbi_code:
                if not iucr or not primary_type or not fbi_code:
                    current_res = client.execute("""
                        SELECT cp.codigo_iucr, cp.gravedad_delito, cp.codigo_fbi
                        FROM chicago_crimes c
                        LEFT JOIN incidente_delito id ON c.case_number = id.case_number
                        LEFT JOIN codigo_penal cp ON id.codigo_iucr = cp.codigo_iucr
                        WHERE c.case_number = %(cn)s
                        LIMIT 1
                    """, {'cn': case_number})
                    if current_res:
                        curr_iucr, curr_pt, curr_fbi = current_res[0]
                        if not iucr: iucr = curr_iucr
                        if not primary_type: primary_type = curr_pt
                        if not fbi_code: fbi_code = curr_fbi
                resolve_and_link_crime_code(client, case_number, iucr, primary_type, fbi_code)

            # Update location description if present
            id_ubicacion = None
            if 'location_description' in data:
                id_ubicacion = resolve_location_id(client, data['location_description'])

            # Update district/police station if present
            id_estacion = None
            if 'district' in data:
                id_estacion = resolve_district_id(client, data['district'])

            # Direct fields to update in chicago_crimes
            set_parts = []
            params = {}
            
            direct_fields = {
                'date': ('date', lambda v: parse_datetime(v)),
                'block': ('block', lambda v: str(v)),
                'description': ('description', lambda v: str(v)),
                'arrest': ('arrest', lambda v: bool(v) if not isinstance(v, str) else v.lower() in ('true', '1')),
                'domestic': ('domestic', lambda v: bool(v) if not isinstance(v, str) else v.lower() in ('true', '1')),
                'beat': ('beat', lambda v: str(v)),
                'ward': ('ward', lambda v: str(v)),
                'community_area': ('community_area', lambda v: str(v)),
                'x_coordinate': ('x_coordinate', lambda v: float(v) if v else 0.0),
                'y_coordinate': ('y_coordinate', lambda v: float(v) if v else 0.0),
                'latitude': ('latitude', lambda v: float(v) if v else 0.0),
                'longitude': ('longitude', lambda v: float(v) if v else 0.0),
            }

            for req_key, (db_col, transform) in direct_fields.items():
                if req_key in data:
                    val = transform(data[req_key])
                    set_parts.append(f"{db_col} = %({db_col})s")
                    params[db_col] = val

            if id_ubicacion is not None:
                set_parts.append("id_ubicacion = %(id_ubicacion)s")
                params['id_ubicacion'] = id_ubicacion
            
            if id_estacion is not None:
                set_parts.append("id_estacion = %(id_estacion)s")
                params['id_estacion'] = id_estacion

            if 'date' in data:
                dt_obj = parse_datetime(data['date'])
                if dt_obj:
                    set_parts.append("year = %(year)s")
                    params['year'] = dt_obj.year

            if not set_parts and not (iucr or primary_type or fbi_code or 'location_description' in data or 'district' in data):
                return Response({'error': 'No valid fields to update'}, status=status.HTTP_400_BAD_REQUEST)

            if set_parts:
                now_dt = datetime.datetime.utcnow()
                set_parts.append("updated_on = %(updated_on)s")
                params['updated_on'] = now_dt
                params['case_number'] = case_number

                update_query = f"""
                    ALTER TABLE chicago_crimes
                    UPDATE {', '.join(set_parts)}
                    WHERE case_number = %(case_number)s
                """
                client.execute(update_query, params)

            return Response({'message': f'Incident {case_number} updated successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, case_number):
        """Delete an incident using ClickHouse ALTER TABLE ... DELETE mutations."""
        try:
            client = get_clickhouse_client()

            # Check it exists
            exists = client.execute(
                "SELECT count(*) FROM chicago_crimes WHERE case_number = %(cn)s",
                {'cn': case_number}
            )
            if not exists or exists[0][0] == 0:
                return Response({'error': 'Incident not found'}, status=status.HTTP_404_NOT_FOUND)

            # Delete from chicago_crimes
            client.execute(
                "ALTER TABLE chicago_crimes DELETE WHERE case_number = %(cn)s",
                {'cn': case_number}
            )
            
            # Delete from incidente_delito relationship table
            client.execute(
                "ALTER TABLE incidente_delito DELETE WHERE case_number = %(cn)s",
                {'cn': case_number}
            )

            return Response({'message': f'Incident {case_number} deleted successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class IncidentCreateView(APIView):
    """POST /api/data/incidents/ — Insert a new incident into chicago_crimes and setup relationships."""
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data

            # Validate required fields
            required = ['case_number', 'date', 'block', 'primary_type', 'description']
            missing = [f for f in required if not data.get(f)]
            if missing:
                return Response(
                    {'error': f'Missing required fields: {", ".join(missing)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            case_number = data['case_number'].strip().upper()

            # Check for duplicate case_number
            exists = client.execute(
                "SELECT count(*) FROM chicago_crimes WHERE case_number = %(cn)s",
                {'cn': case_number}
            )
            if exists and exists[0][0] > 0:
                return Response(
                    {'error': f'Case number {case_number} already exists'},
                    status=status.HTTP_409_CONFLICT
                )

            # Get next auto-increment id for chicago_crimes
            max_id_res = client.execute("SELECT max(id) FROM chicago_crimes")
            next_id = (max_id_res[0][0] + 1) if (max_id_res and max_id_res[0][0] is not None) else 1

            # Resolve catalog relationships
            id_ubicacion = resolve_location_id(client, data.get('location_description'))
            id_estacion = resolve_district_id(client, data.get('district'))
            
            # Parse datetime & year
            dt_obj = parse_datetime(data.get('date')) or datetime.datetime.utcnow()
            year = dt_obj.year
            now_dt = datetime.datetime.utcnow()

            def to_float(val):
                try:
                    return float(val) if val else 0.0
                except (ValueError, TypeError):
                    return 0.0

            arrest_raw = data.get('arrest', False)
            arrest_val = bool(arrest_raw) if not isinstance(arrest_raw, str) else arrest_raw.lower() in ('true', '1')
            
            domestic_raw = data.get('domestic', False)
            domestic_val = bool(domestic_raw) if not isinstance(domestic_raw, str) else domestic_raw.lower() in ('true', '1')

            row_crime = [(
                next_id,
                case_number,
                dt_obj,
                str(data.get('block') or '').strip(),
                str(data.get('description') or '').strip(),
                id_ubicacion,
                arrest_val,
                domestic_val,
                str(data.get('beat') or '').strip(),
                id_estacion,
                str(data.get('ward') or '').strip(),
                str(data.get('community_area') or '').strip(),
                to_float(data.get('x_coordinate')),
                to_float(data.get('y_coordinate')),
                year,
                now_dt,
                to_float(data.get('latitude')),
                to_float(data.get('longitude'))
            )]

            # Insert structured incident into chicago_crimes
            client.execute(
                """INSERT INTO chicago_crimes
                   (id, case_number, date, block, description, id_ubicacion,
                    arrest, domestic, beat, id_estacion, ward, community_area,
                    x_coordinate, y_coordinate, year, updated_on, latitude, longitude)
                   VALUES""",
                row_crime
            )

            # Insert crime classification and penal code relations
            resolve_and_link_crime_code(
                client,
                case_number,
                data.get('iucr'),
                data.get('primary_type'),
                data.get('fbi_code')
            )

            return Response(
                {'message': f'Incident {case_number} created successfully', 'case_number': case_number},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class IncidentLogCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, case_number):
        try:
            import uuid
            client = get_clickhouse_client()
            data = request.data
            
            comentario = data.get('comentario', '').strip()
            oficial = data.get('oficial', 'Oficial SafeCity').strip()
            accion = data.get('accion', 'Nota de Progreso').strip()
            
            if not comentario:
                return Response({'error': 'El comentario no puede estar vacío.'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Make sure table exists
            client.execute('''
                CREATE TABLE IF NOT EXISTS seguimiento_incidente (
                    id_seguimiento String,
                    case_number String,
                    fecha_registro DateTime,
                    estado_caso String,
                    accion String,
                    descripcion_avance String,
                    id_oficial Int32,
                    oficial String
                ) ENGINE = Log
            ''')
            
            id_log = str(uuid.uuid4())
            fecha = datetime.datetime.utcnow()
            id_oficial = int(data.get('id_oficial', 1))
            estado_caso = data.get('estado_caso', 'abierto').strip()
            
            client.execute(
                """INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES""",
                [(id_log, case_number, fecha, estado_caso, accion, comentario, id_oficial, oficial)]
            )
            
            return Response({
                'id_log': id_log,
                'case_number': case_number,
                'fecha': fecha.isoformat() + 'Z',
                'oficial': oficial,
                'accion': accion,
                'comentario': comentario
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
