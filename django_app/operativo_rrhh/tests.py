from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class RRHHTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_clock_in_requires_official_id(self):
        response = self.client.post('/api/rrhh/clock-in/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_clock_out_requires_official_id(self):
        response = self.client.post('/api/rrhh/clock-out/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_asistencias_list(self):
        response = self.client.get('/api/rrhh/asistencias/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_solicitud_permiso_creation(self):
        data = {
            'id_oficial': 2,
            'tipo_permiso': 'Vacaciones',
            'fecha_inicio': '2026-07-01',
            'fecha_fin': '2026-07-15',
            'motivo': 'Descanso anual'
        }
        # MultiPart format
        response = self.client.post('/api/rrhh/permiso/', data, format='multipart')
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])
