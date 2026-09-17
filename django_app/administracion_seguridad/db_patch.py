import re
import os
import datetime
from clickhouse_driver import Client
from .middleware import get_current_request

def patch_clickhouse_client():
    original_execute = Client.execute

    def patched_execute(self, query, params=None, *args, **kwargs):
        # 1. Execute the query first
        res = original_execute(self, query, params, *args, **kwargs)

        # 2. Audit log after successful execution
        try:
            query_upper = query.upper().strip()
            
            # Avoid auditing logging operations on auditoria_sistema to prevent infinite recursion
            if 'AUDITORIA_SISTEMA' in query_upper:
                return res

            operation = None
            table_name = None
            details = ''

            # Regex search for modifying queries
            insert_match = re.search(r'INSERT\s+INTO\s+([a-zA-Z0-9_]+)', query_upper)
            alter_match = re.search(r'ALTER\s+TABLE\s+([a-zA-Z0-9_]+)\s+(UPDATE|DELETE)', query_upper)

            if insert_match:
                operation = 'INSERT'
                table_name = insert_match.group(1).lower()
                details = f"Query: {query[:300]}"
                if params:
                    details += f" | Params: {str(params)[:300]}"
            elif alter_match:
                table_name = alter_match.group(1).lower()
                op_sub = alter_match.group(2)
                operation = op_sub
                details = f"Query: {query[:300]}"
                if params:
                    details += f" | Params: {str(params)[:300]}"

            if operation and table_name:
                request = get_current_request()
                user_id = 0
                username = 'sistema'
                ip = '127.0.0.1'

                if request:
                    if hasattr(request, 'user') and request.user and request.user.is_authenticated:
                        user_id = getattr(request.user, 'id_usuario', 0)
                        username = getattr(request.user, 'username', 'sistema')
                    
                    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                    ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR', '127.0.0.1')

                # Create a clean Client instance to record audit entries
                audit_client = Client(host=os.environ.get('CLICKHOUSE_HOST', 'localhost'), port=9000, user='default', password='password12345')
                
                # Fetch next ID using original_execute to bypass patch
                max_id_res = original_execute(audit_client, "SELECT max(id_auditoria) FROM auditoria_sistema")
                next_id = 1
                if max_id_res and max_id_res[0][0] is not None:
                    next_id = max_id_res[0][0] + 1
                
                full_details = f"IP: {ip} | {details}"
                
                # Insert into ClickHouse using original_execute
                original_execute(
                    audit_client,
                    "INSERT INTO auditoria_sistema (id_auditoria, nombre_tabla, operacion, id_usuario, fecha_hora, registro_afectado, valor_anterior, valor_nuevo, detalles_adicionales) VALUES",
                    [(next_id, table_name, operation, user_id, datetime.datetime.now(), '', '', '', full_details)]
                )
        except Exception as e:
            # Silent fallback to prevent database errors from breaking core app logic
            print(f"Error in ClickHouse audit patch: {e}")

        return res

    Client.execute = patched_execute
    print("ClickHouse Client execute successfully patched for global auditing.")
