from django.urls import path
from .views import (
    GangCRUDView, SuspectCRUDView, SuspectCasesView, SuspectVehiclesDirectoryView, EvidenceCRUDView, WitnessCRUDView, VictimCRUDView, 
    EvidenceImageUploadView, MissingPersonsView, MissingPersonDetailView,
    EvidenceTransferView, EvidenceCustodyLogView, BoloCRUDView, BoloDetailView, CaseTestimoniesSeizuresView,
    RecidivismStatsView, GraphNetworkView
)

urlpatterns = [
    path('gangs/', GangCRUDView.as_view(), name='gang_list'),
    path('gangs/<int:gang_id>/', GangCRUDView.as_view(), name='gang_detail'),
    path('suspects/', SuspectCRUDView.as_view(), name='suspect_list'),
    path('suspects/<int:suspect_id>/', SuspectCRUDView.as_view(), name='suspect_detail'),
    path('suspects/<int:suspect_id>/cases/', SuspectCasesView.as_view(), name='suspect_cases'),
    path('suspects-vehicles/', SuspectVehiclesDirectoryView.as_view(), name='suspect_vehicles_directory'),
    path('case-evidence-testimonies/', CaseTestimoniesSeizuresView.as_view(), name='case_evidence_testimonies'),
    path('evidence/', EvidenceCRUDView.as_view(), name='evidence_list'),
    path('evidence/<int:evidence_id>/', EvidenceCRUDView.as_view(), name='evidence_detail'),
    path('evidence/<int:evidence_id>/transfer/', EvidenceTransferView.as_view(), name='evidence_transfer'),
    path('evidence/<int:evidence_id>/custody-log/', EvidenceCustodyLogView.as_view(), name='evidence_custody_log'),
    path('evidence/upload/', EvidenceImageUploadView.as_view(), name='evidence_image_upload'),
    path('witnesses/', WitnessCRUDView.as_view(), name='witness_list'),
    path('witnesses/<int:witness_id>/', WitnessCRUDView.as_view(), name='witness_detail'),
    path('victims/', VictimCRUDView.as_view(), name='victim_list'),
    path('victims/<int:victim_id>/', VictimCRUDView.as_view(), name='victim_detail'),
    path('missing-persons/', MissingPersonsView.as_view(), name='missing_persons_list'),
    path('missing-persons/<str:id_reporte>/', MissingPersonDetailView.as_view(), name='missing_person_detail'),
    path('bolo/', BoloCRUDView.as_view(), name='bolo_list'),
    path('bolo/<str:bolo_id>/', BoloDetailView.as_view(), name='bolo_detail'),
    path('recidivism-stats/', RecidivismStatsView.as_view(), name='recidivism_stats'),
    path('graph-network/', GraphNetworkView.as_view(), name='graph_network'),
]
