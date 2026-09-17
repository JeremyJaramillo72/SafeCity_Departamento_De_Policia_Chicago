import jwt
import datetime
from django.conf import settings
from rest_framework import authentication
from rest_framework import exceptions
from .models import ForceLogout

class SafeCityUser:
    def __init__(self, id_usuario, username, role):
        self.id_usuario = id_usuario
        self.username = username
        self.role = role
        self.is_authenticated = True

class SafeCityJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
            
        id_usuario = payload.get('id_usuario')
        iat = payload.get('iat')
        
        if not id_usuario or not iat:
            raise exceptions.AuthenticationFailed('Invalid token payload')
            
        # Check if the user was forced to logout
        force_logout = ForceLogout.objects.filter(id_usuario=id_usuario).first()
        if force_logout:
            # iat is seconds since epoch
            iat_datetime = datetime.datetime.fromtimestamp(iat, tz=datetime.timezone.utc)
            if iat_datetime < force_logout.logout_timestamp:
                raise exceptions.AuthenticationFailed('Session revoked by administrator')
                
        user = SafeCityUser(id_usuario, payload.get('username'), payload.get('role'))
        return (user, token)

    def authenticate_header(self, request):
        return 'Bearer'
