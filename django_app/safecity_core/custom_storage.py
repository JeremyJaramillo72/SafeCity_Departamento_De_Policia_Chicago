import os
import socket
import logging
from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage

logger = logging.getLogger(__name__)

class AlmacenamientoSafeCity(S3Boto3Storage):
    def __init__(self, *args, **kwargs):
        # Siempre inicializar S3Boto3Storage para tener las propiedades por defecto
        super().__init__(*args, **kwargs)
        
        self.usar_local = False
        try:
            # Intentar resolver el dominio de Supabase para ver si hay conexión
            socket.gethostbyname('wockcwvfxhxjhulsshpa.supabase.co')
        except Exception:
            logger.warning("[AlmacenamientoSafeCity] No se pudo resolver el dominio de Supabase. Usando almacenamiento local.")
            self.usar_local = True
            
        if self.usar_local:
            self.almacenamiento_local = FileSystemStorage()

    def get_available_name(self, name, max_length=None):
        if self.usar_local:
            return self.almacenamiento_local.get_available_name(name, max_length)
        try:
            return super().get_available_name(name, max_length)
        except Exception:
            self.usar_local = True
            self.almacenamiento_local = FileSystemStorage()
            return self.almacenamiento_local.get_available_name(name, max_length)

    def _save(self, nombre, contenido):
        if self.usar_local:
            return self.almacenamiento_local._save(nombre, contenido)
        try:
            return super()._save(nombre, contenido)
        except Exception as error_ex:
            logger.error(f"[AlmacenamientoSafeCity] Error al subir a S3: {error_ex}. Cambiando a almacenamiento local.")
            self.usar_local = True
            self.almacenamiento_local = FileSystemStorage()
            return self.almacenamiento_local._save(nombre, contenido)

    def url(self, nombre):
        if self.usar_local:
            return f"http://localhost:8000/media/{nombre}"
        try:
            return super().url(nombre)
        except Exception:
            return f"http://localhost:8000/media/{nombre}"

    def exists(self, nombre):
        if self.usar_local:
            return self.almacenamiento_local.exists(nombre)
        try:
            return super().exists(nombre)
        except Exception:
            return False

    def delete(self, nombre):
        if self.usar_local:
            return self.almacenamiento_local.delete(nombre)
        try:
            return super().delete(nombre)
        except Exception:
            pass

    def size(self, nombre):
        if self.usar_local:
            return self.almacenamiento_local.size(nombre)
        try:
            return super().size(nombre)
        except Exception:
            return 0
