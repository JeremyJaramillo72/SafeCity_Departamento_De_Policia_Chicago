from django.urls import path
from .views import (
    LogisticsDashboardView, VehicleCRUDView, OfficerCRUDView, PatrolShiftCRUDView,
    EquipmentCatalogView, AssignEquipmentView, ReturnEquipmentView, NextEquipmentSerialView,
    MaintenanceTicketsView, MaintenanceTicketDetailView, VehicleFleetView, EquipmentAssignmentsView,
    VehicleDecommissionView, PreventiveMaintenancePlanView, TodayQuadrantShiftsView,
    FleetAvailabilityTrendView, MileageByQuadrantView, PredictiveMaintenanceAPIView,
    PredictBurnoutAPIView
)

urlpatterns = [
    path('predict-burnout/', PredictBurnoutAPIView.as_view(), name='predict_burnout'),
    path('predict-maintenance/', PredictiveMaintenanceAPIView.as_view(), name='predict_maintenance'),
    path('mantenimiento-preventivo/', PreventiveMaintenancePlanView.as_view(), name='mantenimiento_preventivo'),
    path('dashboard/', LogisticsDashboardView.as_view(), name='logistics_dashboard'),
    path('fleet-availability-trend/', FleetAvailabilityTrendView.as_view(), name='fleet_availability_trend'),
    path('mileage-by-quadrant/', MileageByQuadrantView.as_view(), name='mileage_by_quadrant'),
    path('vehicles/', VehicleCRUDView.as_view(), name='vehicle_list'),
    path('vehicles/<int:vehicle_id>/', VehicleCRUDView.as_view(), name='vehicle_detail'),
    path('vehicles/<str:vehicle_id>/decommission/', VehicleDecommissionView.as_view(), name='vehicle_decommission'),
    path('officers/', OfficerCRUDView.as_view(), name='officer_list'),
    path('officers/<int:officer_id>/', OfficerCRUDView.as_view(), name='officer_detail'),
    path('patrol-shifts/today-by-quadrant/', TodayQuadrantShiftsView.as_view(), name='shifts_by_quadrant'),
    path('patrol-shifts/', PatrolShiftCRUDView.as_view(), name='patrol_shift_list'),

    path('patrol-shifts/<int:shift_id>/', PatrolShiftCRUDView.as_view(), name='patrol_shift_detail'),
    
    path('equipment/', EquipmentCatalogView.as_view()),
    path('equipment/next-serial/', NextEquipmentSerialView.as_view()),
    path('equipment/<str:id_equipo>/', EquipmentCatalogView.as_view()),
    path('equipment/<str:id_equipo>/assign/', AssignEquipmentView.as_view()),
    path('equipment/<str:id_equipo>/return/', ReturnEquipmentView.as_view()),
    
    path('equipment-assignments/', EquipmentAssignmentsView.as_view()),
    
    path('maintenance/', MaintenanceTicketsView.as_view()),
    path('maintenance/<str:id_ticket>/', MaintenanceTicketDetailView.as_view()),
    
    path('vehicle-fleet/', VehicleFleetView.as_view()),
    path('vehicle-fleet/<str:id_vehiculo>/', VehicleFleetView.as_view()),
]
