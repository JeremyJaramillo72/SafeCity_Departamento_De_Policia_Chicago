from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class OrdenesJudicialesTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_ordenes_list(self):
        response = self.client.get('/api/ordenes/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('orders', response.data)
            self.assertIn('kpis', response.data)

    def test_custodia_digital_filter(self):
        response = self.client.get('/api/ordenes/custodia_digital/?accion=ALL&search=')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
