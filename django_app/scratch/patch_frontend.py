import os

base_dir = 'C:\\Users\\ASUS\\Documents\\safecity_project\\frontend\\src\\app'

def fix_logistics():
    filepath = os.path.join(base_dir, 'logistica_patrullaje', 'logistics', 'logistics.ts')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # fix auth service import
    content = content.replace("import { AuthService } from '../../administracion_seguridad/services/auth.service';", 
                              "import { AuthService } from '../../administracion_seguridad/services/auth.service';")
    # Actually wait, in logistics.ts it was `import { AuthService } from '../services/auth.service';` originally.
    # If the python script failed to replace it because it was modified or something. Let's just enforce it:
    content = content.replace("import { AuthService } from '../services/auth.service';", "import { AuthService } from '../../administracion_seguridad/services/auth.service';")
    content = content.replace("import { DataService } from '../services/data.service';", "")
    content = content.replace("import { SidebarComponent } from '../sidebar/sidebar';", "import { SidebarComponent } from '../../sidebar/sidebar';")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_criminal_intel():
    filepath = os.path.join(base_dir, 'inteligencia_criminal', 'criminal-intel', 'criminal-intel.ts')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # inject missing services
    content = content.replace("import { IntelService }", "import { IncidentService } from '../../gestion_operativa/services/incident.service';\nimport { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';\nimport { IntelService }")
    content = content.replace("private dataService: IntelService,", "private dataService: IntelService,\n    private incidentService: IncidentService,\n    private logisticsService: LogisticsService,")
    
    # update calls
    content = content.replace("this.dataService.getOfficers()", "this.logisticsService.getOfficers()")
    content = content.replace("this.dataService.getIncidents", "this.incidentService.getIncidents")
    
    content = content.replace("import { SidebarComponent } from '../sidebar/sidebar';", "import { SidebarComponent } from '../../sidebar/sidebar';")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_sidebar():
    filepath = os.path.join(base_dir, 'sidebar', 'sidebar.ts')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("import { AuthService } from '../services/auth.service';", "import { AuthService } from '../administracion_seguridad/services/auth.service';")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_others():
    for comp in ['gestion_operativa/dashboard/dashboard.ts', 
                 'gestion_operativa/incident-detail/incident-detail.ts', 
                 'gestion_operativa/incident-form/incident-form.ts', 
                 'gestion_operativa/incidents/incidents.ts',
                 'inteligencia_geografica/tactical-map/tactical-map.ts']:
        filepath = os.path.join(base_dir, comp)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            content = content.replace("import { SidebarComponent } from '../sidebar/sidebar';", "import { SidebarComponent } from '../../sidebar/sidebar';")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

def fix_guards():
    filepath = os.path.join(base_dir, 'administracion_seguridad', 'guards', 'auth.guard.ts')
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace("import { AuthService } from '../services/auth.service';", "import { AuthService } from '../services/auth.service';") # already correct or needs ./services
        content = content.replace("'../services/auth.service'", "'../services/auth.service'")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

fix_logistics()
fix_criminal_intel()
fix_sidebar()
fix_others()
fix_guards()

print("Manual fixes applied.")
