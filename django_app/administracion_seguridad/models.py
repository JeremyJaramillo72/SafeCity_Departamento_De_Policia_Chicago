from django.db import models

class ForceLogout(models.Model):
    id_usuario = models.IntegerField(unique=True)
    logout_timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User {self.id_usuario} forced logout at {self.logout_timestamp}"

class UserSession(models.Model):
    id_usuario = models.IntegerField(unique=True)
    ultimo_acceso = models.DateTimeField(auto_now=True)
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return f"User {self.id_usuario} - Online: {self.is_online} - Last Access: {self.ultimo_acceso}"
