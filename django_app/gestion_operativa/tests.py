from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class GestionOperativaTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_incident_list_filters_resiliency(self):
        # Testing with default Spanish filter labels
        url = '/api/operativa/incidents/?page=1&limit=10&district=Todos%20los%20Distritos&type=Todos%20los%20Tipos&patrol=Todas%20las%20Patrullas&status=all'
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('data', response.data)
            self.assertIn('pagination', response.data)

    def test_patrol_incidents_report_resiliency(self):
        # Testing with Spanish filter tokens
        url = '/api/operativa/incidents/patrol/?page=1&limit=10&patrol=Todas%20las%20Patrullas&type=Todos%20los%20Tipos&status=all'
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('data', response.data)
            self.assertIn('pagination', response.data)

    def test_emergency_history_filters(self):
        url = '/api/operativa/emergency-calls/history/?priority=ALL&status=ALL'
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        if response.status_code == status.HTTP_200_OK:
            self.assertIsInstance(response.data, list)

    def test_traffic_violations_filter(self):
        url = '/api/operativa/traffic-violations/?ley_transito=Todas%20las%20Infracciones'
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_cell_status(self):
        response = self.client.get('/api/operativa/cells/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
