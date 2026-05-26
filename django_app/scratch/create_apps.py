import os
import subprocess

apps = [
    'gestion_operativa',
    'inteligencia_geografica',
    'inteligencia_criminal',
    'logistica_patrullaje',
    'administracion_seguridad'
]

for app in apps:
    if not os.path.exists(app):
        print(f"Creating app: {app}")
        subprocess.run(['..\\.venv\\Scripts\\python.exe', 'manage.py', 'startapp', app], check=True)
    else:
        print(f"App {app} already exists.")
