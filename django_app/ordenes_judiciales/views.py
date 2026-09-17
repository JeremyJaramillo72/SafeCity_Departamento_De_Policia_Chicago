import datetime
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.files.storage import default_storage
from gestion_operativa.views import get_clickhouse_client, parse_datetime

class OrdenJudicialViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        try:
            client = get_clickhouse_client()
            
            # Fetch all orders
            res_orders = client.execute("""
                SELECT id, tipo_orden, juez_emisor, tribunal, cargos, 
                       fecha_emision, fecha_vencimiento, sospechoso_nombre, 
                       sospechoso_identificacion, expediente_vinculado, 
                       documento_pdf, estado, fecha_creacion 
                FROM orden_judicial 
                ORDER BY fecha_creacion DESC
            """)
            
            # Fetch all executions
            res_execs = client.execute("""
                SELECT id, id_orden, fecha_hora_ejecucion, ubicacion, 
                       oficial_ejecutor, resultado, observaciones, fecha_registro 
                FROM ejecucion_orden
            """)
            
            # Group executions by order ID
            execs_by_order = {}
            for row in res_execs:
                order_id = row[1]
                exec_dict = {
                    'id': row[0],
                    'id_orden': row[1],
                    'fecha_hora_ejecucion': row[2].isoformat() if row[2] else None,
                    'ubicacion': row[3],
                    'oficial_ejecutor': row[4],
                    'resultado': row[5],
                    'observaciones': row[6],
                    'fecha_registro': row[7].isoformat() if row[7] else None,
                }
                execs_by_order.setdefault(order_id, []).append(exec_dict)
            
            orders = []
            for row in res_orders:
                orders.append({
                    'id': row[0],
                    'tipo_orden': row[1],
                    'juez_emisor': row[2],
                    'tribunal': row[3],
                    'cargos': row[4],
                    'fecha_emision': str(row[5]) if row[5] else None,
                    'fecha_vencimiento': str(row[6]) if row[6] else None,
                    'sospechoso_nombre': row[7],
                    'sospechoso_identificacion': row[8],
                    'expediente_vinculado': row[9],
                    'documento_pdf': row[10] or None,
                    'estado': row[11],
                    'fecha_creacion': row[12].isoformat() if row[12] else None,
                    'ejecuciones': execs_by_order.get(row[0], [])
                })

            active_warrants = sum(1 for o in orders if o['estado'] in ('Activa', 'Active'))
            executed_warrants = sum(1 for o in orders if o['estado'] in ('Ejecutada', 'Executed'))
            total_custody_logs = client.execute("SELECT count(*) FROM evidencia_transferencias")[0][0]

            return Response({
                'orders': orders,
                'kpis': {
                    'active_warrants_count': active_warrants,
                    'executed_warrants_count': executed_warrants,
                    'total_custody_logs': total_custody_logs
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            client = get_clickhouse_client()
            res = client.execute("""
                SELECT id, tipo_orden, juez_emisor, tribunal, cargos, 
                       fecha_emision, fecha_vencimiento, sospechoso_nombre, 
                       sospechoso_identificacion, expediente_vinculado, 
                       documento_pdf, estado, fecha_creacion 
                FROM orden_judicial 
                WHERE id = %(id)s
            """, {'id': int(pk)})
            
            if not res:
                return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
            
            row = res[0]
            
            # Fetch executions for this order
            res_execs = client.execute("""
                SELECT id, id_orden, fecha_hora_ejecucion, ubicacion, 
                       oficial_ejecutor, resultado, observaciones, fecha_registro 
                FROM ejecucion_orden 
                WHERE id_orden = %(id)s
            """, {'id': int(pk)})
            
            execuciones = [{
                'id': r[0],
                'id_orden': r[1],
                'fecha_hora_ejecucion': r[2].isoformat() if r[2] else None,
                'ubicacion': r[3],
                'oficial_ejecutor': r[4],
                'resultado': r[5],
                'observaciones': r[6],
                'fecha_registro': r[7].isoformat() if r[7] else None,
            } for r in res_execs]
            
            orden = {
                'id': row[0],
                'tipo_orden': row[1],
                'juez_emisor': row[2],
                'tribunal': row[3],
                'cargos': row[4],
                'fecha_emision': str(row[5]) if row[5] else None,
                'fecha_vencimiento': str(row[6]) if row[6] else None,
                'sospechoso_nombre': row[7],
                'sospechoso_identificacion': row[8],
                'expediente_vinculado': row[9],
                'documento_pdf': row[10] or None,
                'estado': row[11],
                'fecha_creacion': row[12].isoformat() if row[12] else None,
                'ejecuciones': execuciones
            }
            return Response(orden, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request):
        try:
            client = get_clickhouse_client()
            data = request.data
            
            documento_pdf_url = ""
            file_obj = request.FILES.get('documento_pdf')
            if file_obj:
                # Save file to Supabase via S3 django storage backend
                file_path = default_storage.save(f"ordenes_judiciales/pdfs/{file_obj.name}", file_obj)
                documento_pdf_url = default_storage.url(file_path)

            res = client.execute("SELECT max(id) FROM orden_judicial")
            next_id = (res[0][0] or 0) + 1
            
            tipo_orden = data.get('tipo_orden', 'Arresto')
            juez_emisor = data.get('juez_emisor', '')
            tribunal = data.get('tribunal', '')
            cargos = data.get('cargos', '')
            fecha_emision_val = data.get('fecha_emision')
            if isinstance(fecha_emision_val, str) and fecha_emision_val:
                try:
                    fecha_emision = datetime.datetime.strptime(fecha_emision_val, '%Y-%m-%d').date()
                except ValueError:
                    fecha_emision = datetime.date.today()
            else:
                fecha_emision = datetime.date.today()

            fecha_vencimiento_val = data.get('fecha_vencimiento')
            if isinstance(fecha_vencimiento_val, str) and fecha_vencimiento_val:
                try:
                    fecha_vencimiento = datetime.datetime.strptime(fecha_vencimiento_val, '%Y-%m-%d').date()
                except ValueError:
                    fecha_vencimiento = datetime.date.today()
            else:
                fecha_vencimiento = datetime.date.today()
            sospechoso_nombre = data.get('sospechoso_nombre', '')
            sospechoso_identificacion = data.get('sospechoso_identificacion', '')
            expediente_vinculado = data.get('expediente_vinculado', '')
            estado = 'Activa'
            
            client.execute(
                "INSERT INTO orden_judicial (id, tipo_orden, juez_emisor, tribunal, cargos, fecha_emision, fecha_vencimiento, sospechoso_nombre, sospechoso_identificacion, expediente_vinculado, documento_pdf, estado, fecha_creacion) VALUES",
                [(next_id, tipo_orden, juez_emisor, tribunal, cargos, fecha_emision, fecha_vencimiento, sospechoso_nombre, sospechoso_identificacion, expediente_vinculado, documento_pdf_url, estado, datetime.datetime.now())]
            )
            return Response({'success': True, 'id': next_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, pk=None):
        try:
            client = get_clickhouse_client()
            data = request.data
            orden_id = int(pk)
            
            # Fetch existing order to check
            res = client.execute("SELECT id, documento_pdf FROM orden_judicial WHERE id = %(id)s", {'id': orden_id})
            if not res:
                return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
            
            existing_pdf = res[0][1]
            
            file_obj = request.FILES.get('documento_pdf')
            if file_obj:
                file_path = default_storage.save(f"ordenes_judiciales/pdfs/{file_obj.name}", file_obj)
                documento_pdf_url = default_storage.url(file_path)
            else:
                documento_pdf_url = existing_pdf or ""

            update_fields = []
            params = {'id': orden_id}
            
            allowed_fields = [
                'tipo_orden', 'juez_emisor', 'tribunal', 'cargos', 
                'fecha_emision', 'fecha_vencimiento', 'sospechoso_nombre', 
                'sospechoso_identificacion', 'expediente_vinculado', 'estado'
            ]
            
            for field in allowed_fields:
                if field in data:
                    val = data[field]
                    if field in ['fecha_emision', 'fecha_vencimiento'] and isinstance(val, str) and val:
                        try:
                            val = datetime.datetime.strptime(val, '%Y-%m-%d').date()
                        except ValueError:
                            pass
                    update_fields.append(f"{field} = %({field})s")
                    params[field] = val
                    
            if file_obj or 'documento_pdf' in data:
                update_fields.append("documento_pdf = %(documento_pdf)s")
                params['documento_pdf'] = documento_pdf_url

            if not update_fields:
                return Response({'message': 'No fields to update'}, status=status.HTTP_200_OK)
            
            query = f"ALTER TABLE orden_judicial UPDATE {', '.join(update_fields)} WHERE id = %(id)s"
            client.execute(query, params)
            
            return Response({'success': True, 'message': 'Order updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk=None):
        try:
            client = get_clickhouse_client()
            orden_id = int(pk)
            client.execute("ALTER TABLE orden_judicial DELETE WHERE id = %(id)s", {'id': orden_id})
            client.execute("ALTER TABLE ejecucion_orden DELETE WHERE id_orden = %(id)s", {'id': orden_id})
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def verificar(self, request):
        try:
            client = get_clickhouse_client()
            query = request.query_params.get('q', '').strip()
            if not query:
                return Response({"error": "You must provide 'q' parameter"}, status=status.HTTP_400_BAD_REQUEST)
            
            today = datetime.date.today()
            
            # Expire expired orders
            client.execute("ALTER TABLE orden_judicial UPDATE estado = 'Expirada' WHERE estado = 'Activa' AND fecha_vencimiento < %(today)s", {'today': today})
            
            # Search active orders
            res = client.execute("""
                SELECT id, tipo_orden, juez_emisor, tribunal, cargos, 
                       fecha_emision, fecha_vencimiento, sospechoso_nombre, 
                       sospechoso_identificacion, expediente_vinculado, 
                       documento_pdf, estado, fecha_creacion 
                FROM orden_judicial 
                WHERE estado = 'Activa' 
                  AND (sospechoso_nombre ILIKE %(q)s 
                       OR sospechoso_identificacion ILIKE %(q)s)
            """, {'q': f'%{query}%', 'today': today})
            
            orders = [{
                'id': row[0],
                'tipo_orden': row[1],
                'juez_emisor': row[2],
                'tribunal': row[3],
                'cargos': row[4],
                'fecha_emision': str(row[5]) if row[5] else None,
                'fecha_vencimiento': str(row[6]) if row[6] else None,
                'sospechoso_nombre': row[7],
                'sospechoso_identificacion': row[8],
                'expediente_vinculado': row[9],
                'documento_pdf': row[10] or None,
                'estado': row[11],
                'fecha_creacion': row[12].isoformat() if row[12] else None,
                'ejecuciones': []
            } for row in res]
            
            if len(orders) > 0:
                return Response({
                    "status": "ACTIVE WARRANT - CAUTION",
                    "color": "red",
                    "ordenes": orders
                })
            else:
                return Response({
                    "status": "NO ACTIVE WARRANTS",
                    "color": "green",
                    "ordenes": []
                })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def ejecutar(self, request, pk=None):
        try:
            client = get_clickhouse_client()
            orden_id = int(pk)
            
            # Fetch order details
            res = client.execute("SELECT id, estado FROM orden_judicial WHERE id = %(id)s", {'id': orden_id})
            if not res:
                return Response({"error": 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
            
            _, estado = res[0]
            if estado != 'Activa':
                return Response({"error": f"An order cannot be executed in status: {estado}"}, status=status.HTTP_400_BAD_REQUEST)
            
            fecha_hora_ejecucion_val = request.data.get('fecha_hora_ejecucion')
            fecha_hora_ejecucion = parse_datetime(fecha_hora_ejecucion_val) if fecha_hora_ejecucion_val else datetime.datetime.now()
            ubicacion = request.data.get('ubicacion')
            oficial_ejecutor = request.data.get('oficial_ejecutor')
            resultado = request.data.get('resultado')
            observaciones = request.data.get('observaciones', '')
            
            if not all([ubicacion, oficial_ejecutor, resultado]):
                return Response({"error": 'Mandatory data is missing: location, official_executor, result'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get next execution ID
            res_exec = client.execute("SELECT max(id) FROM ejecucion_orden")
            next_id = (res_exec[0][0] or 0) + 1
            
            # Insert execution
            client.execute(
                "INSERT INTO ejecucion_orden (id, id_orden, fecha_hora_ejecucion, ubicacion, oficial_ejecutor, resultado, observaciones, fecha_registro) VALUES",
                [(next_id, orden_id, fecha_hora_ejecucion, ubicacion, oficial_ejecutor, resultado, observaciones, datetime.datetime.now())]
            )
            
            # Update state if successful
            nuevo_estado = estado
            if resultado == 'Exitosa':
                client.execute("ALTER TABLE orden_judicial UPDATE estado = 'Ejecutada' WHERE id = %(id)s", {'id': orden_id})
                nuevo_estado = 'Ejecutada'
                
            return Response({
                "message": 'Execution successfully recorded',
                "ejecucion": {
                    'id': next_id,
                    'id_orden': orden_id,
                    'fecha_hora_ejecucion': fecha_hora_ejecucion.isoformat(),
                    'ubicacion': ubicacion,
                    'oficial_ejecutor': oficial_ejecutor,
                    'resultado': resultado,
                    'observaciones': observaciones,
                },
                "nuevo_estado_orden": nuevo_estado
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def custodia_digital(self, request):
        try:
            client = get_clickhouse_client()
            search = request.query_params.get('search', '').strip()
            accion = request.query_params.get('accion', '').strip()
            
            where_clauses = ["1=1"]
            params = {}

            if search:
                where_clauses.append("(t.codigo_qr ILIKE %(search)s OR e.case_number ILIKE %(search)s OR e.tipo_evidencia ILIKE %(search)s OR t.oficial_origen ILIKE %(search)s OR t.oficial_destino ILIKE %(search)s)")
                params['search'] = f"%{search}%"
                
            if accion and str(accion).upper() not in ('ALL', 'TODOS', 'TODAS', ''):
                where_clauses.append("t.tipo_accion = %(accion)s")
                params['accion'] = accion

            where_sql = " AND ".join(where_clauses)
            
            query = f"""
                SELECT 
                    t.id_transferencia,
                    t.id_evidencia,
                    t.codigo_qr,
                    t.tipo_accion,
                    t.oficial_origen,
                    t.oficial_destino,
                    t.observaciones,
                    t.registrado_por,
                    t.fecha_registro,
                    e.case_number,
                    e.tipo_evidencia,
                    e.url_fotografia
                FROM evidencia_transferencias t
                LEFT JOIN evidencia e ON t.id_evidencia = e.id_evidencia
                WHERE {where_sql}
                ORDER BY t.fecha_registro DESC
            """
            
            res_custody = client.execute(query, params)
            
            logs = [{
                'id_transferencia': r[0],
                'id_evidencia': r[1],
                'codigo_qr': r[2],
                'tipo_accion': r[3],
                'oficial_origen': r[4],
                'oficial_destino': r[5],
                'observaciones': r[6] or '',
                'registrado_por': r[7],
                'fecha_registro': r[8].isoformat() if r[8] else None,
                'case_number': r[9] or 'N/A',
                'tipo_evidencia': r[10] or 'General Evidence',
                'url_fotografia': r[11] or ''
            } for r in res_custody]

            # KPI stats
            active_warrants = client.execute("SELECT count(*) FROM orden_judicial WHERE estado = 'Activa'")[0][0]
            executed_warrants = client.execute("SELECT count(*) FROM orden_judicial WHERE estado = 'Ejecutada'")[0][0]
            total_transfers = len(logs)
            
            return Response({
                'kpis': {
                    'total_custody_logs': total_transfers,
                    'active_warrants_count': active_warrants,
                    'executed_warrants_count': executed_warrants
                },
                'logs': logs
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
