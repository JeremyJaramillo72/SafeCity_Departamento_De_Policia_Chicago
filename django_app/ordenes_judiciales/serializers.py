from rest_framework import serializers
from .models import OrdenJudicial, EjecucionOrden

class EjecucionOrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = EjecucionOrden
        fields = '__all__'

class OrdenJudicialSerializer(serializers.ModelSerializer):
    ejecuciones = EjecucionOrdenSerializer(many=True, read_only=True)

    class Meta:
        model = OrdenJudicial
        fields = '__all__'
