from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import QuejaCiudadana, UsoDeFuerza, ReunionComunitaria
from .serializers import QuejaCiudadanaSerializer, UsoDeFuerzaSerializer, ReunionComunitariaSerializer

class QuejaCiudadanaViewSet(viewsets.ModelViewSet):
    # Allow anonymous users to submit complaints (public portal)
    permission_classes = [AllowAny]
    queryset = QuejaCiudadana.objects.all().order_by('-fecha_registro')
    serializer_class = QuejaCiudadanaSerializer

class UsoDeFuerzaViewSet(viewsets.ModelViewSet):
    # Only authenticated officers can submit use of force
    permission_classes = [IsAuthenticated]
    queryset = UsoDeFuerza.objects.all().order_by('-fecha_registro')
    serializer_class = UsoDeFuerzaSerializer

class ReunionComunitariaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ReunionComunitaria.objects.all().order_by('-fecha_registro')
    serializer_class = ReunionComunitariaSerializer
