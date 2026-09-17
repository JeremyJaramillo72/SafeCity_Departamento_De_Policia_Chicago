from django.urls import path
from .views import PredictiveTrendsAPIView

urlpatterns = [
    path('predict-trends/', PredictiveTrendsAPIView.as_view(), name='predict_trends'),
]
