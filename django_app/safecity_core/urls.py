"""
URL configuration for safecity_core project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('administracion_seguridad.urls')),
    path('api/operativa/', include('gestion_operativa.urls')),
    path('api/geo/', include('inteligencia_geografica.urls')),
    path('api/criminal/', include('inteligencia_criminal.urls')),
    path('api/logistica/', include('logistica_patrullaje.urls')),
    path('api/investigacion/', include('investigacion_especial.urls')),
    path('api/ordenes/', include('ordenes_judiciales.urls')),
    path('api/rrhh/', include('operativo_rrhh.urls')),
    path('api/comunidad/', include('policia_comunitaria.urls')),
    path('api/inteligencia/', include('inteligencia_geografica.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
