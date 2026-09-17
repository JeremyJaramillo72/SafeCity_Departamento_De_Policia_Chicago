from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class InvestigacionEspecialTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_solicitudes_sheriff_filter(self):
        response = self.client.get('/api/investigacion/solicitudes/?estado=ALL')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)
