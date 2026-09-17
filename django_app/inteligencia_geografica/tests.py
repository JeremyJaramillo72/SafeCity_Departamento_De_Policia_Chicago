from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class InteligenciaGeograficaTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_predict_trends(self):
        response = self.client.get('/api/geo/predict-trends/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('historical', response.data)
        self.assertIn('forecast', response.data)
        self.assertIn('insights', response.data)
