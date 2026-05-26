from django.urls import path
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
