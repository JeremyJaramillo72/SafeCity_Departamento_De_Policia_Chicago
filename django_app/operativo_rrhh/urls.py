from django.urls import path
from .views import (
    ClockInView, ClockOutView,
    SolicitudPermisoCreateView, SolicitudPermisoAprobarView,
    AmonestacionListCreateView, CertificacionListCreateView,
    AsistenciaRegistroListView, SolicitudPermisoListView,
    RollCallBriefingListCreateView, ShiftHandoverListCreateView,
    ShiftHandoverConfirmView, AbsenteeismCoverageView,
    OfficerPerformanceView
)

urlpatterns = [
    path('clock-in/', ClockInView.as_view(), name='clock_in'),
    path('clock-out/', ClockOutView.as_view(), name='clock_out'),
    path('asistencias/', AsistenciaRegistroListView.as_view(), name='asistencias_list'),
    path('permiso/', SolicitudPermisoCreateView.as_view(), name='crear_permiso'),
    path('permisos/', SolicitudPermisoListView.as_view(), name='permisos_list'),
    path('permiso/<str:pk>/aprobar/', SolicitudPermisoAprobarView.as_view(), name='aprobar_permiso'),
    path('amonestacion/', AmonestacionListCreateView.as_view(), name='crear_amonestacion'),
    path('certificacion/', CertificacionListCreateView.as_view(), name='crear_certificacion'),
    path('briefings/', RollCallBriefingListCreateView.as_view(), name='briefings_list'),
    path('handovers/', ShiftHandoverListCreateView.as_view(), name='handovers_list'),
    path('handover/<str:pk>/confirmar/', ShiftHandoverConfirmView.as_view(), name='confirmar_handover'),
    path('absenteeism-coverage/', AbsenteeismCoverageView.as_view(), name='absenteeism_coverage'),
    path('officer-performance/', OfficerPerformanceView.as_view(), name='officer_performance'),
]
