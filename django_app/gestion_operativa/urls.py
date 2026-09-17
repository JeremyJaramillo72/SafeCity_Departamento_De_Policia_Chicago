from django.urls import path
from .views import DashboardKPIView, IncidentListView, IncidentDetailView, IncidentCreateView, NextCaseNumberView, GeocodeProxyView, IncidentLogCreateView, PatrolIncidentsReportView
from .emergency_views import EmergencyCallCRUDView, EmergencyCallKPIsView, EmergencyCallDispatchView, EmergencyCallStatusUpdateView, EmergencyCallHistoryView, EmergencyCallLinkIncidentView
from .operativa_views import (
    TrafficViolationCRUDView, TrafficViolationDetailView, BookingCRUDView, BookingDetailView, 
    BookingReleaseView, BookingLogCRUDView, AllBookingLogsView, CommunityMeetingCRUDView, TaserDischargeCRUDView, 
    TowDispatchCRUDView, TowDispatchDetailView, TrafficAccidentCRUDView, TrafficAccidentDetailView,
    CellStatusView
)
from .sheriff_dashboard_views import SheriffExecutiveDashboardView

urlpatterns = [
    path('dashboard/kpis/', DashboardKPIView.as_view(), name='dashboard_kpis'),
    path('incidents/', IncidentListView.as_view(), name='incident_list'),
    path('incidents/patrol/', PatrolIncidentsReportView.as_view(), name='patrol_incidents_report'),
    path('incidents/create/', IncidentCreateView.as_view(), name='incident_create'),
    path('incidents/next-case-number/', NextCaseNumberView.as_view(), name='next_case_number'),
    path('incidents/geocode/', GeocodeProxyView.as_view(), name='geocode_proxy'),
    path('incidents/<str:case_number>/', IncidentDetailView.as_view(), name='incident_detail'),
    path('incidents/<str:case_number>/logs/', IncidentLogCreateView.as_view(), name='incident_logs'),
    
    # Emergency Dispatch Console APIs
    path('emergency-calls/', EmergencyCallCRUDView.as_view(), name='emergency_calls'),
    path('emergency-calls/history/', EmergencyCallHistoryView.as_view(), name='emergency_history'),
    path('emergency-calls/kpis/', EmergencyCallKPIsView.as_view(), name='emergency_kpis'),
    path('emergency-calls/<int:call_id>/dispatch/', EmergencyCallDispatchView.as_view(), name='emergency_dispatch'),
    path('emergency-calls/<int:call_id>/status/', EmergencyCallStatusUpdateView.as_view(), name='emergency_status'),
    path('emergency-calls/<int:call_id>/link/', EmergencyCallLinkIncidentView.as_view(), name='emergency_link_incident'),

    # Nuevos Módulos Operativos (Tránsito, Comunidad, Logística Auxiliar, Detenidos)
    path('traffic-violations/', TrafficViolationCRUDView.as_view(), name='traffic_violations'),
    path('traffic-violations/<str:id_infraccion>/', TrafficViolationDetailView.as_view(), name='traffic_violation_detail'),
    path('traffic-accidents/', TrafficAccidentCRUDView.as_view(), name='traffic_accidents'),
    path('traffic-accidents/<str:id_accidente>/', TrafficAccidentDetailView.as_view(), name='traffic_accident_detail'),
    path('tow-dispatch/', TowDispatchCRUDView.as_view(), name='tow_dispatch'),
    path('tow-dispatch/<str:id_despacho>/', TowDispatchDetailView.as_view(), name='tow_dispatch_detail'),

    path('bookings/', BookingCRUDView.as_view(), name='bookings'),
    path('bookings/logs/', AllBookingLogsView.as_view(), name='all_booking_logs'),
    path('bookings/<str:id_ingreso>/', BookingDetailView.as_view(), name='booking_detail'),
    path('bookings/<str:id_ingreso>/release/', BookingReleaseView.as_view(), name='booking_release'),
    path('bookings/<str:id_ingreso>/logs/', BookingLogCRUDView.as_view(), name='booking_logs'),
    path('community-meetings/', CommunityMeetingCRUDView.as_view(), name='community_meetings'),
    path('taser-discharges/', TaserDischargeCRUDView.as_view(), name='taser_discharges'),
    path('tow-dispatches/', TowDispatchCRUDView.as_view(), name='tow_dispatches'),
    

    path('cells/', CellStatusView.as_view(), name='cell_status'),
    path('sheriff-executive-dashboard/', SheriffExecutiveDashboardView.as_view(), name='sheriff_executive_dashboard'),
]
