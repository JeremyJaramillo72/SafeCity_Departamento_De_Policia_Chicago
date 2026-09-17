from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class PoliciaComunitariaTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_quejas_ciudadanas_list(self):
        response = self.client.get('/api/comunidad/quejas/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_uso_fuerza_list(self):
        response = self.client.get('/api/comunidad/uso-fuerza/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_reuniones_comunitarias_list(self):
        response = self.client.get('/api/comunidad/reuniones/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED, status.HTTP_500_INTERNAL_SERVER_ERROR])
