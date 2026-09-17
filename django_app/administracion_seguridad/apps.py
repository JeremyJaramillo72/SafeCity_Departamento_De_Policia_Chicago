from django.apps import AppConfig


class AdministracionSeguridadConfig(AppConfig):
    name = 'administracion_seguridad'

    def ready(self):
        from .db_patch import patch_clickhouse_client
        patch_clickhouse_client()
        
        # --- AUTOMATIZACIÓN DE RESPALDOS (04:00 AM) ---
        import os
        import sys
        import threading
        import time
        import datetime
        
        def run_scheduler():
            # Esperar a que el servidor inicialice completamente
            time.sleep(15)
            print("[SAFE-CITY] Programador de respaldos automáticos iniciado.")
            while True:
                try:
                    now = datetime.datetime.now()
                    # Si es exactamente las 04:00 AM
                    if now.hour == 4 and now.minute == 0:
                        print("[SAFE-CITY] Ejecutando respaldo automático diario (04:00 AM)...")
                        from .backups_manager import BackupManager
                        BackupManager.create_backup(backup_type='completo')
                        print("[SAFE-CITY] Respaldo automático diario completado.")
                        time.sleep(65) # Evitar re-ejecución en el mismo minuto
                except Exception as e:
                    print(f"[SAFE-CITY] Error en el programador de respaldos: {e}")
                time.sleep(30)
                
        # Evitar doble ejecución en el servidor de desarrollo de Django
        is_runserver = any('runserver' in arg for arg in sys.argv)
        if not is_runserver or os.environ.get('RUN_MAIN') == 'true':
            t = threading.Thread(target=run_scheduler, daemon=True, name="BackupSchedulerThread")
            t.start()
