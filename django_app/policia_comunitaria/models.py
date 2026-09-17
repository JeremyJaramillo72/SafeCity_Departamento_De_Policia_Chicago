from django.db import models

class QuejaCiudadana(models.Model):
    ESTADOS = [
        ('Recibida', 'Recibida'),
        ('En Investigacion', 'En Investigación'),
        ('Resuelta', 'Resuelta'),
        ('Desestimada', 'Desestimada')
    ]
    nombre_ciudadano = models.CharField(max_length=150)
    contacto_ciudadano = models.CharField(max_length=150)
    id_oficial_implicado = models.IntegerField(help_text="ID ClickHouse del oficial", null=True, blank=True)
    fecha_incidente = models.DateField()
    descripcion = models.TextField()
    estado = models.CharField(max_length=50, choices=ESTADOS, default='Recibida')
    resolucion = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Queja de {self.nombre_ciudadano} vs Oficial {self.id_oficial_implicado}"


class UsoDeFuerza(models.Model):
    TIPOS_FUERZA = [
        ('Fisica No Letal', 'Física No Letal'),
        ('Arma Electrica (Taser)', 'Arma Eléctrica (Taser)'),
        ('Arma Quimica (Gas)', 'Arma Química (Gas)'),
        ('Arma de Fuego (Letal)', 'Arma de Fuego (Letal)')
    ]
    id_oficial = models.IntegerField(help_text="ID ClickHouse del oficial")
    id_incidente = models.CharField(max_length=50, blank=True, null=True, help_text="Case Number opcional")
    fecha_hora = models.DateTimeField()
    ubicacion = models.CharField(max_length=255)
    tipo_fuerza = models.CharField(max_length=50, choices=TIPOS_FUERZA)
    justificacion_legal = models.TextField()
    hubo_heridos = models.BooleanField(default=False)
    reporte_medico_url = models.FileField(upload_to='comunidad/fuerza/', blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Uso de fuerza ({self.tipo_fuerza}) por Oficial {self.id_oficial}"


class ReunionComunitaria(models.Model):
    cuadrante_distrito = models.CharField(max_length=50)
    fecha_reunion = models.DateField()
    cantidad_asistentes = models.IntegerField()
    temas_tratados = models.TextField()
    compromisos = models.TextField(blank=True, null=True)
    oficial_responsable = models.CharField(max_length=150)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reunión en {self.cuadrante_distrito} - {self.fecha_reunion}"
