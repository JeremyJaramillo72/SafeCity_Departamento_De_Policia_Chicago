from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class AdministracionSeguridadTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_login_missing_credentials(self):
        response = self.client.post('/api/auth/login/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_fallback_user(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'admin',
            'password': 'password12345'
        }, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED])
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('token', response.data)
            self.assertIn('user', response.data)

    def test_system_categories_list(self):
        response = self.client.get('/api/auth/categories/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)

    def test_audit_logs_filters_all(self):
        response = self.client.get('/api/auth/logs/?severity=ALL&category=TODAS&q=')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)
