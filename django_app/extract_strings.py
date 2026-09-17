import os
import re

base_dir = r'c:\Users\ASUS\Documents\safecity_project\django_app'
files_to_check = [
    r'administracion_seguridad\views.py',
    r'gestion_operativa\emergency_views.py',
    r'gestion_operativa\operativa_views.py',
    r'gestion_operativa\views.py',
    r'inteligencia_criminal\views.py',
    r'investigacion_especial\views.py',
    r'logistica_patrullaje\views.py',
    r'operativo_rrhh\views.py',
    r'ordenes_judiciales\views.py',
]

for rel_file in files_to_check:
    filepath = os.path.join(base_dir, rel_file)
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace the whole string. Let's just print the whole line that contains error/message in Response so we can translate.
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'Response(' in line and ('error' in line or 'message' in line):
            print(f'{rel_file}:{i+1} ||| {line.strip()}')
