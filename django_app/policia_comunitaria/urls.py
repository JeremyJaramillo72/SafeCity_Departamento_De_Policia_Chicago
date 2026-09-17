from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuejaCiudadanaViewSet, UsoDeFuerzaViewSet, ReunionComunitariaViewSet

router = DefaultRouter()
router.register(r'quejas', QuejaCiudadanaViewSet, basename='queja')
router.register(r'uso-fuerza', UsoDeFuerzaViewSet, basename='uso-fuerza')
router.register(r'reuniones', ReunionComunitariaViewSet, basename='reunion')

urlpatterns = [
    path('', include(router.urls)),
]
