from django.urls import path
from .views import (
    DetectiveAssignCaseView, DetectiveEscalateCaseView, DetectiveCloseCaseView,
    DetectiveReopenCaseView, DetectiveMyCasesView, IncidentReportView,
    DetectiveCrearSolicitudView, SheriffListarSolicitudesView, SheriffResolverSolicitudView
)

urlpatterns = [
    path('assign/', DetectiveAssignCaseView.as_view(), name='det_assign'),
    path('escalate/', DetectiveEscalateCaseView.as_view(), name='det_escalate'),
    path('close/', DetectiveCloseCaseView.as_view(), name='det_close'),
    path('reopen/', DetectiveReopenCaseView.as_view(), name='det_reopen'),
    path('my-cases/', DetectiveMyCasesView.as_view(), name='det_my_cases'),
    path('<str:case_number>/report/', IncidentReportView.as_view(), name='case_report'),
    path('solicitar/', DetectiveCrearSolicitudView.as_view(), name='det_solicitar'),
    path('solicitudes/', SheriffListarSolicitudesView.as_view(), name='sheriff_solicitudes'),
    path('solicitudes/<str:id_solicitud>/resolver/', SheriffResolverSolicitudView.as_view(), name='sheriff_resolver_solicitud'),
]
