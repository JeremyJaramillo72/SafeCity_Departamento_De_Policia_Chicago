import os

base_dir = 'C:\\Users\\ASUS\\Documents\\safecity_project\\django_app'

def replace_in_file(filepath, old_text, new_text):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old_text, new_text)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file(os.path.join(base_dir, 'inteligencia_criminal', 'views.py'), 'from .views import', 'from gestion_operativa.views import')
replace_in_file(os.path.join(base_dir, 'logistica_patrullaje', 'views.py'), 'from .views import', 'from gestion_operativa.views import')
replace_in_file(os.path.join(base_dir, 'administracion_seguridad', 'views.py'), 'from data_api.views import', 'from gestion_operativa.views import')

print("Imports fixed.")
