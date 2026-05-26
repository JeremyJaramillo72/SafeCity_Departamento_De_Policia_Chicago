import os
import re

base_dir = 'C:\\Users\\ASUS\\Documents\\safecity_project\\frontend\\src\\app'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine depth based on relative path
    rel_path = os.path.relpath(filepath, base_dir)
    depth = rel_path.count(os.sep)
    up = '../' * depth if depth > 0 else './'
    
    # sidebar
    content = content.replace("'../sidebar/sidebar'", f"'{up}sidebar/sidebar'")
    
    # auth service
    content = content.replace("'../services/auth.service'", f"'{up}administracion_seguridad/services/auth.service'")
    
    # data service -> we need to figure out which one is needed.
    # We will replace DataService with IncidentService, LogisticsService, or IntelService based on package
    pkg = rel_path.split(os.sep)[0] if depth > 0 else ''
    
    if pkg == 'gestion_operativa':
        content = content.replace("'../services/data.service'", f"'{up}gestion_operativa/services/incident.service'")
        content = content.replace("import { DataService }", "import { IncidentService }")
        content = content.replace("private dataService: DataService", "private dataService: IncidentService")
        content = content.replace("public dataService: DataService", "public dataService: IncidentService")
        content = content.replace("DataService", "IncidentService")
        # incident cache
        content = content.replace("'../services/incident-cache.service'", f"'{up}gestion_operativa/services/incident-cache.service'")
        
    elif pkg == 'logistica_patrullaje':
        content = content.replace("'../services/data.service'", f"'{up}logistica_patrullaje/services/logistics.service'")
        content = content.replace("import { DataService }", "import { LogisticsService }")
        content = content.replace("private dataService: DataService", "private dataService: LogisticsService")
        content = content.replace("public dataService: DataService", "public dataService: LogisticsService")
        content = content.replace("DataService", "LogisticsService")
        
    elif pkg == 'inteligencia_criminal':
        content = content.replace("'../services/data.service'", f"'{up}inteligencia_criminal/services/intel.service'")
        content = content.replace("import { DataService }", "import { IntelService }")
        content = content.replace("private dataService: DataService", "private dataService: IntelService")
        content = content.replace("public dataService: DataService", "public dataService: IntelService")
        content = content.replace("DataService", "IntelService")
        
    elif pkg == 'inteligencia_geografica':
        # Tactical map might use incident service to fetch incidents
        content = content.replace("'../services/data.service'", f"'{up}gestion_operativa/services/incident.service'")
        content = content.replace("import { DataService }", "import { IncidentService }")
        content = content.replace("private dataService: DataService", "private dataService: IncidentService")
        content = content.replace("DataService", "IncidentService")

    # The sidebar still needs auth.service
    if pkg == 'sidebar':
        content = content.replace("'../services/auth.service'", f"'{up}administracion_seguridad/services/auth.service'")

    # Administracion_seguridad might use auth service
    if pkg == 'administracion_seguridad':
        content = content.replace("'../services/auth.service'", f"'./services/auth.service'")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.ts'):
            process_file(os.path.join(root, f))

print("Imports updated.")
