import os
import shutil

base_dir = 'C:\\Users\\ASUS\\Documents\\safecity_project\\django_app'

# 1. Move views
shutil.copy(os.path.join(base_dir, 'data_api', 'views.py'), os.path.join(base_dir, 'gestion_operativa', 'views.py'))
shutil.copy(os.path.join(base_dir, 'data_api', 'intel_views.py'), os.path.join(base_dir, 'inteligencia_criminal', 'views.py'))
shutil.copy(os.path.join(base_dir, 'data_api', 'logistics_views.py'), os.path.join(base_dir, 'logistica_patrullaje', 'views.py'))
shutil.copy(os.path.join(base_dir, 'auth_api', 'views.py'), os.path.join(base_dir, 'administracion_seguridad', 'views.py'))

# 2. Create urls.py for each
urls_gestion_operativa = """from django.urls import path
from .views import DashboardKPIView, IncidentListView, IncidentDetailView, IncidentCreateView, IncidentLogCreateView

urlpatterns = [
    path('dashboard/kpis/', DashboardKPIView.as_view(), name='dashboard_kpis'),
    path('incidents/', IncidentListView.as_view(), name='incident_list'),
    path('incidents/create/', IncidentCreateView.as_view(), name='incident_create'),
    path('incidents/<str:case_number>/', IncidentDetailView.as_view(), name='incident_detail'),
    path('incidents/<str:case_number>/logs/', IncidentLogCreateView.as_view(), name='incident_logs'),
]
"""
with open(os.path.join(base_dir, 'gestion_operativa', 'urls.py'), 'w', encoding='utf-8') as f:
    f.write(urls_gestion_operativa)

urls_intel = """from django.urls import path
from .views import GangCRUDView, SuspectCRUDView, EvidenceCRUDView, WitnessCRUDView, VictimCRUDView

urlpatterns = [
    path('gangs/', GangCRUDView.as_view(), name='gang_list'),
    path('gangs/<int:gang_id>/', GangCRUDView.as_view(), name='gang_detail'),
    path('suspects/', SuspectCRUDView.as_view(), name='suspect_list'),
    path('suspects/<int:suspect_id>/', SuspectCRUDView.as_view(), name='suspect_detail'),
    path('evidence/', EvidenceCRUDView.as_view(), name='evidence_list'),
    path('evidence/<int:evidence_id>/', EvidenceCRUDView.as_view(), name='evidence_detail'),
    path('witnesses/', WitnessCRUDView.as_view(), name='witness_list'),
    path('witnesses/<int:witness_id>/', WitnessCRUDView.as_view(), name='witness_detail'),
    path('victims/', VictimCRUDView.as_view(), name='victim_list'),
    path('victims/<int:victim_id>/', VictimCRUDView.as_view(), name='victim_detail'),
]
"""
with open(os.path.join(base_dir, 'inteligencia_criminal', 'urls.py'), 'w', encoding='utf-8') as f:
    f.write(urls_intel)

urls_logistics = """from django.urls import path
from .views import LogisticsDashboardView, VehicleCRUDView, OfficerCRUDView, PatrolShiftCRUDView

urlpatterns = [
    path('dashboard/', LogisticsDashboardView.as_view(), name='logistics_dashboard'),
    path('vehicles/', VehicleCRUDView.as_view(), name='vehicle_list'),
    path('vehicles/<int:vehicle_id>/', VehicleCRUDView.as_view(), name='vehicle_detail'),
    path('officers/', OfficerCRUDView.as_view(), name='officer_list'),
    path('officers/<int:officer_id>/', OfficerCRUDView.as_view(), name='officer_detail'),
    path('patrol-shifts/', PatrolShiftCRUDView.as_view(), name='patrol_shift_list'),
    path('patrol-shifts/<int:shift_id>/', PatrolShiftCRUDView.as_view(), name='patrol_shift_detail'),
]
"""
with open(os.path.join(base_dir, 'logistica_patrullaje', 'urls.py'), 'w', encoding='utf-8') as f:
    f.write(urls_logistics)

# For administracion_seguridad, we need to read the old auth_api/urls.py and adjust it.
auth_urls_path = os.path.join(base_dir, 'auth_api', 'urls.py')
with open(auth_urls_path, 'r', encoding='utf-8') as f:
    auth_urls_content = f.read()
# Copy it over exactly
with open(os.path.join(base_dir, 'administracion_seguridad', 'urls.py'), 'w', encoding='utf-8') as f:
    f.write(auth_urls_content)

# create empty urls.py for inteligencia_geografica
with open(os.path.join(base_dir, 'inteligencia_geografica', 'urls.py'), 'w', encoding='utf-8') as f:
    f.write("from django.urls import path\nurlpatterns = []\n")

print("Backend files moved successfully.")
