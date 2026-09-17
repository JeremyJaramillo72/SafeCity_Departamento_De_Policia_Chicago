from django.db import models

class OrdenJudicial(models.Model):
    TIPOS_ORDEN = [
        ('Arresto', 'Arresto'),
        ('Allanamiento', 'Allanamiento'),
        ('Comparecencia', 'Comparecencia'),
    ]
    ESTADOS = [
        ('Activa', 'Activa'),
        ('Expirada', 'Expirada'),
        ('Ejecutada', 'Ejecutada'),
    ]

    tipo_orden = models.CharField(max_length=50, choices=TIPOS_ORDEN)
    juez_emisor = models.CharField(max_length=150)
    tribunal = models.CharField(max_length=150)
    cargos = models.TextField()
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField()
    sospechoso_nombre = models.CharField(max_length=150, help_text="Nombre o alias del sospechoso")
    sospechoso_identificacion = models.CharField(max_length=100, blank=True, null=True, help_text="ID o placa vinculada")
    expediente_vinculado = models.CharField(max_length=100, blank=True, null=True)
    documento_pdf = models.FileField(upload_to='ordenes_judiciales/pdfs/', blank=True, null=True)
    estado = models.CharField(max_length=50, choices=ESTADOS, default='Activa')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Orden de {self.tipo_orden} - {self.sospechoso_nombre} ({self.estado})"

class EjecucionOrden(models.Model):
    RESULTADOS = [
        ('Exitosa', 'Exitosa'),
        ('Fallida', 'Fallida'),
    ]

    orden = models.ForeignKey(OrdenJudicial, on_delete=models.CASCADE, related_name='ejecuciones')
    fecha_hora_ejecucion = models.DateTimeField()
    ubicacion = models.CharField(max_length=255)
    oficial_ejecutor = models.CharField(max_length=150)
    resultado = models.CharField(max_length=50, choices=RESULTADOS)
    observaciones = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ejecución de Orden {self.orden.id} - {self.resultado}"
