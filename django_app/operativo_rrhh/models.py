from django.db import models

class AsistenciaRegistro(models.Model):
    id_oficial = models.IntegerField(db_index=True)
    timestamp_entrada = models.DateTimeField(auto_now_add=True)
    timestamp_salida = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'rrhh_asistencia_registro'
        
    def __str__(self):
        return f"Oficial {self.id_oficial} - Entrada: {self.timestamp_entrada}"

class AsignacionCuadrante(models.Model):
    id_oficial = models.IntegerField(db_index=True)
    id_cuadrante = models.CharField(max_length=50)
    turno = models.CharField(max_length=50)
    fecha = models.DateField(auto_now_add=True)
    timestamp_asignacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'rrhh_asignacion_cuadrante'
        
    def __str__(self):
        return f"Oficial {self.id_oficial} -> {self.id_cuadrante}"

class SolicitudPermiso(models.Model):
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Aprobado', 'Aprobado'),
        ('Rechazado', 'Rechazado'),
    ]
    id_oficial = models.IntegerField(db_index=True)
    tipo_permiso = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')
    id_comandante_aprobador = models.IntegerField(null=True, blank=True)
    timestamp_solicitud = models.DateTimeField(auto_now_add=True)
    timestamp_resolucion = models.DateTimeField(null=True, blank=True)
    documento_respaldo = models.FileField(upload_to='rrhh/permisos/', blank=True, null=True)
    
    class Meta:
        db_table = 'rrhh_solicitud_permiso'

class Amonestacion(models.Model):
    TIPOS = [
        ('Amonestacion', 'Amonestación'),
        ('Felicitacion', 'Felicitación'),
    ]
    id_oficial = models.IntegerField(db_index=True)
    tipo = models.CharField(max_length=20, choices=TIPOS)
    descripcion = models.TextField()
    id_comandante = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'rrhh_amonestacion'

class Certificacion(models.Model):
    id_oficial = models.IntegerField(db_index=True)
    nombre_curso = models.CharField(max_length=255)
    institucion = models.CharField(max_length=255)
    fecha_completado = models.DateField()
    timestamp_registro = models.DateTimeField(auto_now_add=True)
    documento_respaldo = models.FileField(upload_to='rrhh/certificaciones/', blank=True, null=True)
    
    class Meta:
        db_table = 'rrhh_certificacion'



class RollCallBriefing(models.Model):
    id_supervisor = models.IntegerField(db_index=True)
    bolo_details = models.TextField(blank=True, null=True)
    special_assignments = models.TextField(blank=True, null=True)
    asistentes = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'rrhh_roll_call_briefing'


class ShiftHandover(models.Model):
    id_oficial_saliente = models.IntegerField(db_index=True)
    id_oficial_entrante = models.IntegerField(db_index=True)
    checklist_detenidos = models.BooleanField(default=False)
    checklist_equipos = models.BooleanField(default=False)
    checklist_incidentes = models.BooleanField(default=False)
    novedades = models.TextField(blank=True, null=True)
    leido = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'rrhh_shift_handover'
