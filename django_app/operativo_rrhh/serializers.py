from rest_framework import serializers
from .models import (
    AsistenciaRegistro, AsignacionCuadrante, SolicitudPermiso,
    Amonestacion, Certificacion, RollCallBriefing, ShiftHandover
)
from django.utils import timezone

class AsistenciaRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsistenciaRegistro
        fields = '__all__'
        read_only_fields = ('timestamp_entrada', 'timestamp_salida')

    def validate(self, data):
        # In this context, validate might not have full context of request method,
        # but we can do it in the view. We'll add some basic rules here.
        # CA-RRH-003 and RN-RRH-001: handled mainly in the View when creating a new record.
        return data

class AsignacionCuadranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignacionCuadrante
        fields = '__all__'
        read_only_fields = ('fecha', 'timestamp_asignacion')

class SolicitudPermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudPermiso
        fields = '__all__'
        read_only_fields = ('estado', 'id_comandante_aprobador', 'timestamp_solicitud', 'timestamp_resolucion')

    def validate(self, data):
        if data.get('fecha_inicio') and data.get('fecha_fin'):
            if data['fecha_inicio'] > data['fecha_fin']:
                raise serializers.ValidationError("La fecha de inicio no puede ser mayor a la fecha de fin.")
        return data

class SolicitudPermisoAprobacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudPermiso
        fields = ['estado', 'id_comandante_aprobador', 'timestamp_resolucion']

    def validate_estado(self, value):
        if value not in ['Aprobado', 'Rechazado']:
            raise serializers.ValidationError("El estado debe ser 'Aprobado' o 'Rechazado'.")
        return value

class AmonestacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amonestacion
        fields = '__all__'
        read_only_fields = ('timestamp',)

class CertificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificacion
        fields = '__all__'
        read_only_fields = ('timestamp_registro',)

class RollCallBriefingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RollCallBriefing
        fields = '__all__'
        read_only_fields = ('timestamp',)

class ShiftHandoverSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftHandover
        fields = '__all__'
        read_only_fields = ('timestamp',)
