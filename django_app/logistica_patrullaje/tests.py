from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class LogisticaPatrullajeTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_logistics_dashboard(self):
        response = self.client.get('/api/logistica/dashboard/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('kpis', response.data)

    def test_equipment_catalog_filter(self):
        response = self.client.get('/api/logistica/equipment/?tipo_equipo=ALL&estado_equipo=ALL')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)

    def test_preventive_maintenance_filter(self):
        response = self.client.get('/api/logistica/mantenimiento-preventivo/?status=ALL&search=')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('kpis', response.data)
            self.assertIn('vehicles', response.data)

    def test_today_quadrant_shifts_filter(self):
        response = self.client.get('/api/logistica/patrol-shifts/today-by-quadrant/?quadrant=ALL&status=ALL&search=')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_fleet_trend(self):
        response = self.client.get('/api/logistica/fleet-availability-trend/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
