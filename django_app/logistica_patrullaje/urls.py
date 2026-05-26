from django.urls import path
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
