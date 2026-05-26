from django.urls import path
from .views import DashboardKPIView, IncidentListView, IncidentDetailView, IncidentCreateView, IncidentLogCreateView

urlpatterns = [
    path('dashboard/kpis/', DashboardKPIView.as_view(), name='dashboard_kpis'),
    path('incidents/', IncidentListView.as_view(), name='incident_list'),
    path('incidents/create/', IncidentCreateView.as_view(), name='incident_create'),
    path('incidents/<str:case_number>/', IncidentDetailView.as_view(), name='incident_detail'),
    path('incidents/<str:case_number>/logs/', IncidentLogCreateView.as_view(), name='incident_logs'),
]
