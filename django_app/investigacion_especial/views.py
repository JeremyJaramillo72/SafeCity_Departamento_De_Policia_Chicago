import datetime
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from clickhouse_driver import Client
from rest_framework.permissions import AllowAny

import os

def get_clickhouse_client():
    return Client(
        host=os.environ.get('CLICKHOUSE_HOST', 'localhost'),
        port=9000,
        user='default',
        password='password12345',
        secure=False
    )

def normalize_date(raw):
    if not raw:
        return None
    if isinstance(raw, datetime.datetime):
        return raw.isoformat()
    s = str(raw).strip()
    s = s.replace(' ', 'T')
    if not s.endswith('Z') and '+' not in s:
        s = s.rstrip('Z') + 'Z'
    return s


class DetectiveAssignCaseView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            client = get_clickhouse_client()
            case_number = request.data.get('case_number')
            id_detective = request.data.get('id_detective')
            
            if not case_number or not id_detective:
                return Response({'error': 'Missing case_number or detective_id'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Check if case is already assigned
            existing = client.execute("SELECT count(*) FROM investigacion_especial WHERE case_number = %(cn)s", {'cn': case_number})
            if existing and existing[0][0] > 0:
                return Response({'error': 'Case already assigned to an investigation'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Insert new investigation
            max_id = client.execute("SELECT max(id_investigacion) FROM investigacion_especial")
            next_id = (max_id[0][0] + 1) if (max_id and max_id[0][0] is not None) else 1
            
            client.execute(
                "INSERT INTO investigacion_especial (id_investigacion, case_number, id_detective, es_caso_mayor, estado, reporte_final, fecha_asignacion, fecha_resolucion) VALUES",
                [(next_id, case_number, int(id_detective), 0, 'In Progress', '', datetime.datetime.now(), None)]
            )
            
            # Add to tracking log
            officer_name = request.data.get('officer_name', 'Detective')
            log_id = 'det-assign-' + str(datetime.datetime.now().timestamp())
            client.execute("INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES",
                           [(log_id, case_number, datetime.datetime.now(), 'In Progress', 'Case Assigned', 'The detective has taken possession of the investigation.', int(id_detective), officer_name)])
                           
            return Response({'message': 'Case successfully assigned to detective'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DetectiveEscalateCaseView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            client = get_clickhouse_client()
            case_number = request.data.get('case_number')
            
            if not case_number:
                return Response({'error': 'Missing case_number'}, status=status.HTTP_400_BAD_REQUEST)
                
            client.execute(
                "ALTER TABLE investigacion_especial UPDATE es_caso_mayor = 1 WHERE case_number = %(cn)s",
                {'cn': case_number}
            )
            
            officer_id = request.data.get('officer_id', 0)
            officer_name = request.data.get('officer_name', 'Detective')
            
            # Add to tracking log
            log_id = 'det-escalate-' + str(datetime.datetime.now().timestamp())
            client.execute("INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES",
                           [(log_id, case_number, datetime.datetime.now(), 'Major Case', 'Case Escalated', 'The investigation has been classified as a Major Case by the detective.', int(officer_id), officer_name)])
                           
            return Response({'message': 'Case escalated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DetectiveCloseCaseView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            client = get_clickhouse_client()
            case_number = request.data.get('case_number')
            reporte_final = request.data.get('reporte_final', '')
            
            if not case_number:
                return Response({'error': 'Missing case_number'}, status=status.HTTP_400_BAD_REQUEST)
                
            now = datetime.datetime.now()
            
            client.execute(
                "ALTER TABLE investigacion_especial UPDATE estado = 'Closed', reporte_final = %(rep)s, fecha_resolucion = %(now)s WHERE case_number = %(cn)s",
                {'cn': case_number, 'rep': reporte_final, 'now': now}
            )
            
            # Also close the case in chicago_crimes
            client.execute(
                "ALTER TABLE chicago_crimes UPDATE arrest = 1 WHERE case_number = %(cn)s",
                {'cn': case_number}
            )
            
            officer_id = request.data.get('officer_id', 0)
            officer_name = request.data.get('officer_name', 'Detective')
            
            # Add to tracking log
            log_id = 'det-close-' + str(now.timestamp())
            client.execute("INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES",
                           [(log_id, case_number, now, 'Closed', 'Investigation Closed', f'Case closed. Report: {reporte_final}', int(officer_id), officer_name)])
                           
            return Response({'message': 'Investigation closed successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class DetectiveReopenCaseView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            client = get_clickhouse_client()
            case_number = request.data.get('case_number')
            razon = request.data.get('razon', 'New evidence reported')
            
            if not case_number:
                return Response({'error': 'Missing case_number'}, status=status.HTTP_400_BAD_REQUEST)
                
            now = datetime.datetime.now()
            
            officer_id = request.data.get('officer_id', 0)
            officer_name = request.data.get('officer_name', 'Detective')
            
            # Reopen the case, setting it to In Progress
            client.execute(
                "ALTER TABLE investigacion_especial UPDATE estado = 'In Progress' WHERE case_number = %(cn)s",
                {'cn': case_number}
            )
            
            # Add to tracking log
            log_id = 'det-reopen-' + str(now.timestamp())
            client.execute("INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES",
                           [(log_id, case_number, now, 'In Progress', 'Case Reopened', f'The investigation has been reopened. Reason: {razon}', int(officer_id), officer_name)])
                           
            return Response({'message': 'Investigation reopened successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DetectiveMyCasesView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            client = get_clickhouse_client()
            id_detective = request.query_params.get('id_detective')
            
            if not id_detective:
                return Response({'error': 'Missing detective_id'}, status=status.HTTP_400_BAD_REQUEST)
                
            query = """
                SELECT i.case_number, i.estado, i.es_caso_mayor, i.fecha_asignacion, c.date, cp.gravedad_delito
                FROM investigacion_especial i
                LEFT JOIN chicago_crimes c ON i.case_number = c.case_number
                LEFT JOIN incidente_delito id ON c.case_number = id.case_number
                LEFT JOIN codigo_penal cp ON id.codigo_iucr = cp.codigo_iucr
                WHERE i.id_detective = %(det)s
                ORDER BY i.fecha_asignacion DESC
            """
            
            result = client.execute(query, {'det': int(id_detective)})
            
            cases = []
            for row in result:
                cases.append({
                    'case_number': row[0],
                    'estado': row[1],
                    'es_caso_mayor': bool(row[2]),
                    'fecha_asignacion': normalize_date(row[3]),
                    'date': normalize_date(row[4]) if row[4] else None,
                    'primary_type': row[5] or 'N/A'
                })
                
            return Response(cases, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from io import BytesIO
import urllib.request
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from django.http import HttpResponse
from gestion_operativa.views import IncidentDetailView

class IncidentReportView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, case_number):
        try:
            # Re-use the existing logic to get all case data
            detail_view = IncidentDetailView()
            response = detail_view.get(request, case_number)
            if response.status_code != 200:
                return Response({'error': 'Incident not found'}, status=status.HTTP_404_NOT_FOUND)
            
            incident = response.data
            
            # Generate PDF
            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
            styles = getSampleStyleSheet()
            
            # Custom styles
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontName='Helvetica-Bold',
                fontSize=20,
                textColor=colors.HexColor("#0f172a"),
                alignment=1, # Center
                spaceAfter=5
            )
            subtitle_style = ParagraphStyle(
                'CustomSubtitle',
                parent=styles['Heading2'],
                fontName='Helvetica',
                fontSize=14,
                textColor=colors.HexColor("#475569"),
                alignment=1,
                spaceAfter=20
            )
            h2_style = ParagraphStyle(
                'CustomH2',
                parent=styles['Heading2'],
                fontName='Helvetica-Bold',
                fontSize=12,
                textColor=colors.white,
                backColor=colors.HexColor("#1e293b"),
                alignment=0,
                spaceBefore=15,
                spaceAfter=10,
                leftIndent=5,
                rightIndent=5,
                borderPadding=5
            )
            normal_style = styles['Normal']
            normal_style.fontName = 'Helvetica'
            normal_style.fontSize = 10
            
            justified_style = ParagraphStyle(
                'Justified',
                parent=normal_style,
                alignment=4 # 4 is TA_JUSTIFY in ReportLab
            )
            
            elements = []
            
            # Logo
            logo_url = "https://lh3.googleusercontent.com/aida-public/AB6AXuBD79bpMlsPyt30Xx086RJmYzJdAMRfM84Mde2muNorBXaqMtV4lAQaNPEZCMeX5LigT_5RbOsVNBKrhrZVPpc7KDhanIyIrBAqcR0FUeIjVESZacQjnGJvwBJeWCNVT05kH8nrVGuGsMPeYfmqJBKH1w-DaVz0j1AhVK9WxEyyHaQq-57IP6gWuHrZhOJj2YepwQOtNyJ1_u99tAIgsAqEcuXwQLHqWKRWM-gz1Ezgra6mwHtOr1d1XjxRV5PJl-0blnI5RKWKI31E"
            try:
                req = urllib.request.Request(logo_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as res:
                    img_data = res.read()
                img_buffer = BytesIO(img_data)
                img = Image(img_buffer, width=60, height=60)
                img.hAlign = 'CENTER'
                elements.append(img)
            except Exception as e:
                pass # If logo fails to load, just ignore it
            
            # Title
            elements.append(Spacer(1, 10))
            elements.append(Paragraph(f"OFFICIAL INVESTIGATION REPORT", title_style))
            elements.append(Paragraph(f"SafeCity Intelligence Department", subtitle_style))
            elements.append(Spacer(1, 15))
            
            # Basic Info
            elements.append(Paragraph("1. INCIDENT INFORMATION", h2_style))
            detective = incident.get('investigation', {}).get('detective_name', 'Not Assigned') if incident.get('investigation') else 'Not Assigned'
            data = [
                ['Case Number:', incident.get('case_number', 'N/A'), 'Date of Incident:', str(incident.get('date', 'N/A'))[:10]],
                ['Primary Type:', incident.get('primary_type', 'N/A'), 'Severity:', incident.get('severity', 'N/A')],
                ['Status:', incident.get('status_label', 'N/A'), 'Arrest:', 'Yes' if incident.get('arrest') else 'No'],
                ['Location:', incident.get('location_description', 'N/A'), 'District:', incident.get('district', 'N/A')],
                ['Description:', incident.get('description', 'N/A'), 'Detective:', detective]
            ]
            t = Table(data, colWidths=[110, 150, 110, 150])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor("#334155")),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 10))
            
            # 2. Suspects
            elements.append(Paragraph("2. INVOLVED SUSPECTS", h2_style))
            suspects = incident.get('suspects', [])
            if not suspects:
                elements.append(Paragraph("No suspects registered for this case.", normal_style))
            else:
                suspect_data = [['ID', 'Name / Alias', 'Gender', 'DOB', 'Gang Affiliation']]
                for s in suspects:
                    name_alias = f"{s.get('nombres', 'N/A')}\n(Alias: {s.get('alias_conocido', 'N/A')})"
                    suspect_data.append([
                        str(s.get('id_sospechoso', '')),
                        Paragraph(name_alias, normal_style),
                        s.get('genero', 'N/A'),
                        str(s.get('fecha_nacimiento', 'N/A'))[:10],
                        s.get('nombre_banda', 'None')
                    ])
                t_susp = Table(suspect_data, colWidths=[40, 180, 50, 70, 180])
                t_susp.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('TOPPADDING', (0, 0), (-1, 0), 8),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
                ]))
                elements.append(t_susp)
            elements.append(Spacer(1, 15))

            # 3. Suspect Vehicles
            elements.append(Paragraph("3. SUSPECT VEHICLES", h2_style))
            vehicles = incident.get('vehicles', [])
            if not vehicles:
                elements.append(Paragraph("No vehicles registered for this case.", normal_style))
            else:
                veh_data = [['Plate', 'Make / Model', 'Color', 'Status', 'Notes']]
                for v in vehicles:
                    make_model = f"{v.get('marca', 'N/A')} {v.get('modelo', 'N/A')}"
                    veh_data.append([
                        v.get('placa', 'N/A'),
                        make_model,
                        v.get('color', 'N/A'),
                        v.get('estado_reporte', 'N/A'),
                        v.get('observaciones', 'N/A')
                    ])
                t_veh = Table(veh_data, colWidths=[80, 160, 60, 80, 140])
                t_veh.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('TOPPADDING', (0, 0), (-1, 0), 8),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
                ]))
                elements.append(t_veh)
            elements.append(Spacer(1, 15))

            # 4. Evidence
            elements.append(Paragraph("4. SEIZED EVIDENCE", h2_style))
            evidence = incident.get('evidence', [])
            if not evidence:
                elements.append(Paragraph("No evidence registered for this case.", normal_style))
            else:
                ev_data = [['ID', 'Type', 'Collection Date', 'Collected By']]
                for e in evidence:
                    ev_data.append([
                        str(e.get('id_evidencia', '')),
                        e.get('tipo_evidencia', 'N/A'),
                        str(e.get('fecha_recoleccion', ''))[:10],
                        e.get('officer_name', 'N/A')
                    ])
                t_ev = Table(ev_data, colWidths=[50, 180, 100, 190])
                t_ev.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('TOPPADDING', (0, 0), (-1, 0), 8),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
                ]))
                elements.append(t_ev)
            elements.append(Spacer(1, 15))

            # 5. Witnesses & Victims
            elements.append(Paragraph("5. WITNESSES & VICTIMS", h2_style))
            witnesses = incident.get('witnesses', [])
            victims = incident.get('victims', [])
            
            if not witnesses and not victims:
                elements.append(Paragraph("No witnesses or victims registered.", normal_style))
            else:
                wv_data = [['Role', 'Name', 'ID / Contact', 'Statement']]
                for v in victims:
                    contact = f"ID: {v.get('identificacion', 'N/A')}\nTel: {v.get('telefono', 'N/A')}"
                    wv_data.append([
                        'VICTIM',
                        Paragraph(v.get('nombres', 'N/A'), normal_style),
                        Paragraph(contact, normal_style),
                        'N/A'
                    ])
                for w in witnesses:
                    name = "ANONYMOUS" if w.get('es_anonimo') else w.get('nombres', 'N/A')
                    contact = "N/A" if w.get('es_anonimo') else f"ID: {w.get('identificacion', 'N/A')}\nTel: {w.get('telefono', 'N/A')}"
                    wv_data.append([
                        'WITNESS',
                        Paragraph(name, normal_style),
                        Paragraph(contact, normal_style),
                        Paragraph(w.get('testimonio', 'N/A'), justified_style)
                    ])
                
                t_wv = Table(wv_data, colWidths=[60, 120, 110, 230])
                t_wv.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('TOPPADDING', (0, 0), (-1, 0), 8),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
                ]))
                elements.append(t_wv)
            elements.append(Spacer(1, 15))

            # Timeline Logs
            elements.append(Paragraph("6. TIMELINE / TRACKING LOGS", h2_style))
            timeline = incident.get('timeline_logs', [])
            if not timeline:
                elements.append(Paragraph("No tracking records found.", normal_style))
            else:
                log_data = [['Date', 'Officer', 'Action', 'Comment']]
                for log in timeline:
                    # Clean up dates and text
                    fecha = Paragraph(str(log.get('fecha', ''))[:16].replace('T', ' '), normal_style)
                    oficial = Paragraph(log.get('oficial', 'N/A'), normal_style)
                    accion = Paragraph(log.get('accion', 'N/A'), normal_style)
                    comentario = Paragraph(str(log.get('comentario', 'N/A')), justified_style)
                    log_data.append([fecha, oficial, accion, comentario])
                    
                t_logs = Table(log_data, colWidths=[85, 105, 110, 220])
                t_logs.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                    ('TOPPADDING', (0, 0), (-1, 0), 10),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f1f5f9")])
                ]))
                elements.append(t_logs)
            
            doc.build(elements)
            
            pdf = buffer.getvalue()
            buffer.close()
            
            response = HttpResponse(pdf, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="Reporte_Caso_{case_number}.pdf"'
            return response
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DetectiveCrearSolicitudView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            cliente = get_clickhouse_client()
            datos = request.data
            
            numero_caso = datos.get('case_number')
            id_detective = datos.get('id_detective')
            nombre_detective = datos.get('nombre_detective')
            
            if not numero_caso or not id_detective or not nombre_detective:
                return Response({'error': 'Faltan parámetros requeridos'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Verificar si ya existe una solicitud pendiente o aprobada para este caso
            solicitud_existente = cliente.execute(
                "SELECT count(*) FROM solicitud_asignacion_caso WHERE case_number = %(cn)s AND estado IN ('Pendiente', 'Aprobado')",
                {'cn': numero_caso}
            )
            if solicitud_existente and solicitud_existente[0][0] > 0:
                return Response({'error': 'Ya existe una solicitud activa o el caso ya está asignado'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Crear la solicitud
            id_solicitud = 'sol-' + str(uuid.uuid4())
            fecha_actual = datetime.datetime.now()
            
            cliente.execute(
                "INSERT INTO solicitud_asignacion_caso (id_solicitud, case_number, id_detective, nombre_detective, estado, fecha_solicitud, fecha_resolucion) VALUES",
                [(id_solicitud, numero_caso, int(id_detective), nombre_detective, 'Pendiente', fecha_actual, None)]
            )
            
            # Registrar en la bitácora de seguimiento
            id_bitacora = 'seg-sol-' + str(fecha_actual.timestamp())
            cliente.execute(
                "INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES",
                [(id_bitacora, numero_caso, fecha_actual, 'Open', 'Request Sent', f"Detective {nombre_detective} has requested to be assigned to this case.", int(id_detective), nombre_detective)]
            )
            
            return Response({'message': 'Solicitud creada con éxito'}, status=status.HTTP_201_CREATED)
        except Exception as error_ex:
            return Response({'error': str(error_ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SheriffListarSolicitudesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            cliente = get_clickhouse_client()
            estado_filtro = request.query_params.get('estado')
            id_detective = request.query_params.get('id_detective')
            
            filtros = []
            parametros = {}
            
            if estado_filtro and str(estado_filtro).upper() not in ('ALL', 'TODOS', 'TODAS', ''):
                filtros.append("estado = %(est)s")
                parametros['est'] = estado_filtro
                
            if id_detective:
                filtros.append("id_detective = %(id_det)s")
                parametros['id_det'] = int(id_detective)
                
            clausula_where = " AND ".join(filtros) if filtros else "1=1"
            
            consulta = f"""
                SELECT id_solicitud, case_number, id_detective, nombre_detective, estado, fecha_solicitud, fecha_resolucion
                FROM solicitud_asignacion_caso
                WHERE {clausula_where}
                ORDER BY fecha_solicitud DESC
            """
            filas = cliente.execute(consulta, parametros)
            
            columnas = ['id_solicitud', 'case_number', 'id_detective', 'nombre_detective', 'estado', 'fecha_solicitud', 'fecha_resolucion']
            resultado = []
            for fila in filas:
                diccionario = dict(zip(columnas, fila))
                if diccionario['fecha_solicitud']:
                    diccionario['fecha_solicitud'] = diccionario['fecha_solicitud'].isoformat()
                if diccionario['fecha_resolucion']:
                    diccionario['fecha_resolucion'] = diccionario['fecha_resolucion'].isoformat()
                resultado.append(diccionario)
                
            return Response(resultado, status=status.HTTP_200_OK)
        except Exception as error_ex:
            return Response({'error': str(error_ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SheriffResolverSolicitudView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, id_solicitud):
        try:
            cliente = get_clickhouse_client()
            datos = request.data
            accion = datos.get('accion')
            nombre_sheriff = datos.get('nombre_sheriff', 'Sheriff')
            id_sheriff = datos.get('id_sheriff', 0)
            
            if accion not in ('Aprobado', 'Rechazado'):
                return Response({'error': 'Acción inválida. Debe ser Aprobado o Rechazado.'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Obtener datos de la solicitud
            solicitud = cliente.execute(
                "SELECT case_number, id_detective, nombre_detective, estado FROM solicitud_asignacion_caso WHERE id_solicitud = %(ids)s",
                {'ids': id_solicitud}
            )
            if not solicitud:
                return Response({'error': 'Solicitud no encontrada'}, status=status.HTTP_404_NOT_FOUND)
                
            numero_caso, id_detective, nombre_detective, estado_actual = solicitud[0]
            
            if estado_actual != 'Pendiente':
                return Response({'error': 'La solicitud ya ha sido resuelta previamente'}, status=status.HTTP_400_BAD_REQUEST)
                
            fecha_actual = datetime.datetime.now()
            
            # Actualizar estado de la solicitud
            cliente.execute(
                "ALTER TABLE solicitud_asignacion_caso UPDATE estado = %(est)s, fecha_resolucion = %(f_res)s WHERE id_solicitud = %(ids)s",
                {'est': accion, 'f_res': fecha_actual, 'ids': id_solicitud}
            )
            
            if accion == 'Aprobado':
                # Insertar en investigacion_especial
                max_id = cliente.execute("SELECT max(id_investigacion) FROM investigacion_especial")
                siguiente_id = (max_id[0][0] + 1) if (max_id and max_id[0][0] is not None) else 1
                
                cliente.execute(
                    "INSERT INTO investigacion_especial (id_investigacion, case_number, id_detective, es_caso_mayor, estado, reporte_final, fecha_asignacion, fecha_resolucion) VALUES",
                    [(siguiente_id, numero_caso, int(id_detective), 0, 'In Progress', '', fecha_actual, None)]
                )
                
                # Registrar en bitácora de seguimiento
                id_bitacora = 'seg-sol-apr-' + str(fecha_actual.timestamp())
                cliente.execute(
                    "INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES",
                    [(id_bitacora, numero_caso, fecha_actual, 'In Progress', 'Request Approved', f"Sheriff approved case assignment to Detective {nombre_detective}.", int(id_sheriff), nombre_sheriff)]
                )
            else:
                # Registrar rechazo en bitácora
                id_bitacora = 'seg-sol-rej-' + str(fecha_actual.timestamp())
                cliente.execute(
                    "INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES",
                    [(id_bitacora, numero_caso, fecha_actual, 'Open', 'Request Rejected', f"Sheriff rejected case assignment request from Detective {nombre_detective}.", int(id_sheriff), nombre_sheriff)]
                )
                
            return Response({'message': f'Solicitud resuelta con éxito: {accion}'}, status=status.HTTP_200_OK)
        except Exception as error_ex:
            return Response({'error': str(error_ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

