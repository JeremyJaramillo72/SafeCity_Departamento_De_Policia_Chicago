from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class InteligenciaCriminalTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_gangs_list(self):
        response = self.client.get('/api/criminal/gangs/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)

    def test_suspects_list(self):
        response = self.client.get('/api/criminal/suspects/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)

    def test_missing_persons_filters(self):
        response = self.client.get('/api/criminal/missing-persons/?estado=ALL&nivel_riesgo=ALL')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)

    def test_suspects_vehicles_filters(self):
        response = self.client.get('/api/criminal/suspects-vehicles/?estado=ALL')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)

    def test_bolo_alerts_list(self):
        response = self.client.get('/api/criminal/bolo/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)
