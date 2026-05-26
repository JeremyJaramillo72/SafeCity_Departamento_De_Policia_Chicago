import datetime
import jwt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from clickhouse_driver import Client

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Query ClickHouse for the user and join with related tables
            client = Client(host='localhost', port=9000, user='default', password='password12345')
            
            # Since ClickHouse is columnar and not optimized for point queries with joins, 
            # we do a direct query. A simple join with oficial_policia and rol_oficial:
            query = f'''
                SELECT 
                    u.id_usuario,
                    u.username,
                    u.password_hash,
                    o.nombres,
                    o.apellidos,
                    r.nombre_rol,
                    u.id_oficial
                FROM usuario_sistema u
                JOIN oficial_policia o ON u.id_oficial = o.id_oficial
                JOIN rol_oficial r ON o.id_rol = r.id_rol
                WHERE u.username = %(username)s
                LIMIT 1
            '''
            result = client.execute(query, {'username': username})

            if not result:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            user_row = result[0]
            db_password_hash = user_row[2]
            role_name = user_row[5]

            # Verify password using Django's check_password
            if not check_password(password, db_password_hash):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            # Generate JWT Token manually since we are not using Django's built-in User model
            payload = {
                'id_usuario': user_row[0],
                'username': user_row[1],
                'role': role_name,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                'iat': datetime.datetime.utcnow()
            }
            
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            return Response({
                'token': token,
                'role': role_name,
                'user': {
                    'username': user_row[1],
                    'nombres': user_row[3],
                    'apellidos': user_row[4],
                    'id_oficial': user_row[6]
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
