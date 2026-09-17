from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrdenJudicialViewSet

router = DefaultRouter()
router.register(r'', OrdenJudicialViewSet, basename='ordenes-judiciales')

urlpatterns = [
    path('', include(router.urls)),
]
