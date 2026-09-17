from rest_framework import serializers
from .models import QuejaCiudadana, UsoDeFuerza, ReunionComunitaria

class QuejaCiudadanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuejaCiudadana
        fields = '__all__'

class UsoDeFuerzaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsoDeFuerza
        fields = '__all__'

class ReunionComunitariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReunionComunitaria
        fields = '__all__'
