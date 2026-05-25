from django.urls import path
from .views import DashboardKPIView, IncidentListView, IncidentDetailView, IncidentCreateView, IncidentLogCreateView
from .logistics_views import LogisticsDashboardView, VehicleCRUDView, OfficerCRUDView, PatrolShiftCRUDView
from .intel_views import GangCRUDView, SuspectCRUDView, EvidenceCRUDView, WitnessCRUDView, VictimCRUDView

urlpatterns = [
    path('dashboard/kpis/', DashboardKPIView.as_view(), name='dashboard_kpis'),
    path('logistics/dashboard/', LogisticsDashboardView.as_view(), name='logistics_dashboard'),
    path('logistics/vehicles/', VehicleCRUDView.as_view(), name='vehicle_list'),
    path('logistics/vehicles/<int:vehicle_id>/', VehicleCRUDView.as_view(), name='vehicle_detail'),
    path('logistics/officers/', OfficerCRUDView.as_view(), name='officer_list'),
    path('logistics/officers/<int:officer_id>/', OfficerCRUDView.as_view(), name='officer_detail'),
    path('logistics/patrol-shifts/', PatrolShiftCRUDView.as_view(), name='patrol_shift_list'),
    path('logistics/patrol-shifts/<int:shift_id>/', PatrolShiftCRUDView.as_view(), name='patrol_shift_detail'),
    
    # Criminal Intelligence Hub
    path('intel/gangs/', GangCRUDView.as_view(), name='gang_list'),
    path('intel/gangs/<int:gang_id>/', GangCRUDView.as_view(), name='gang_detail'),
    path('intel/suspects/', SuspectCRUDView.as_view(), name='suspect_list'),
    path('intel/suspects/<int:suspect_id>/', SuspectCRUDView.as_view(), name='suspect_detail'),
    path('intel/evidence/', EvidenceCRUDView.as_view(), name='evidence_list'),
    path('intel/evidence/<int:evidence_id>/', EvidenceCRUDView.as_view(), name='evidence_detail'),
    path('intel/witnesses/', WitnessCRUDView.as_view(), name='witness_list'),
    path('intel/witnesses/<int:witness_id>/', WitnessCRUDView.as_view(), name='witness_detail'),
    path('intel/victims/', VictimCRUDView.as_view(), name='victim_list'),
    path('intel/victims/<int:victim_id>/', VictimCRUDView.as_view(), name='victim_detail'),
    
    path('incidents/', IncidentListView.as_view(), name='incident_list'),         # GET list + POST create
    path('incidents/create/', IncidentCreateView.as_view(), name='incident_create'),
    path('incidents/<str:case_number>/', IncidentDetailView.as_view(), name='incident_detail'),  # GET, PUT, DELETE
    path('incidents/<str:case_number>/logs/', IncidentLogCreateView.as_view(), name='incident_logs'),
]
