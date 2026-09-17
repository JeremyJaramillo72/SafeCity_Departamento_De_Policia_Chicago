import os
import django
from datetime import datetime, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
django.setup()

from policia_comunitaria.models import QuejaCiudadana, UsoDeFuerza, ReunionComunitaria

def populate():
    print("Clearing old data...")
    QuejaCiudadana.objects.all().delete()
    UsoDeFuerza.objects.all().delete()
    ReunionComunitaria.objects.all().delete()

    print("Populating QuejaCiudadana...")
    quejas = [
        QuejaCiudadana(
            nombre_ciudadano="Maria Sanchez",
            contacto_ciudadano="555-0102",
            id_oficial_implicado=12,
            fecha_incidente=datetime.now() - timedelta(days=2),
            descripcion="El oficial fue muy prepotente al detener mi vehículo por un faro roto. Levantó la voz y no quiso explicar el motivo de la detención.",
            estado="Recibida"
        ),
        QuejaCiudadana(
            nombre_ciudadano="John Smith",
            contacto_ciudadano="jsmith@email.com",
            id_oficial_implicado=None,
            fecha_incidente=datetime.now() - timedelta(days=5),
            descripcion="Patrulla bloqueó mi salida de garaje por 2 horas sin estar en emergencia.",
            estado="En Investigacion"
        ),
        QuejaCiudadana(
            nombre_ciudadano="Lucia Gomez",
            contacto_ciudadano="555-8833",
            id_oficial_implicado=8,
            fecha_incidente=datetime.now() - timedelta(days=14),
            descripcion="Oficial usó fuerza excesiva al esposar a mi hermano, dejándole marcas severas en las muñecas.",
            estado="Resuelta",
            resolucion="Se revisó bodycam. El oficial cumplió el protocolo debido a resistencia activa. Queja desestimada internamente pero se dará reentrenamiento."
        ),
        QuejaCiudadana(
            nombre_ciudadano="Carlos Ruiz",
            contacto_ciudadano="555-1122",
            id_oficial_implicado=3,
            fecha_incidente=datetime.now() - timedelta(days=30),
            descripcion="Se negó a tomar mi denuncia por robo en mi local.",
            estado="Desestimada",
            resolucion="Falta de pruebas. El ciudadano se retiró antes de firmar."
        ),
        QuejaCiudadana(
            nombre_ciudadano="Anonimo",
            contacto_ciudadano="No provisto",
            id_oficial_implicado=1,
            fecha_incidente=datetime.now() - timedelta(days=1),
            descripcion="Conducción temeraria de la patrulla 402 en zona escolar.",
            estado="Recibida"
        ),
    ]
    QuejaCiudadana.objects.bulk_create(quejas)

    print("Populating UsoDeFuerza...")
    usos = [
        UsoDeFuerza(
            id_oficial=1,
            id_incidente="INC-2026-8941",
            fecha_hora=datetime.now() - timedelta(days=1, hours=4),
            ubicacion="Av. Principal y 4ta Calle, Sector Norte",
            tipo_fuerza="Fisica No Letal",
            justificacion_legal="El sospechoso se resistió activamente al arresto e intentó golpear al oficial. Se aplicó técnica de derribo controlada.",
            hubo_heridos=False
        ),
        UsoDeFuerza(
            id_oficial=1,
            id_incidente="INC-2026-8911",
            fecha_hora=datetime.now() - timedelta(days=3, hours=10),
            ubicacion="Calle 8, Barrio Sur",
            tipo_fuerza="Arma Electrica (Taser)",
            justificacion_legal="Sospechoso armado con cuchillo avanzaba hacia los oficiales ignorando comandos verbales.",
            hubo_heridos=True
        ),
        UsoDeFuerza(
            id_oficial=5,
            id_incidente="INC-2026-8802",
            fecha_hora=datetime.now() - timedelta(days=10, hours=2),
            ubicacion="Plaza Central",
            tipo_fuerza="Arma Quimica (Gas)",
            justificacion_legal="Control de disturbios: multitud atacaba unidades policiales con piedras y botellas de vidrio.",
            hubo_heridos=True
        ),
        UsoDeFuerza(
            id_oficial=12,
            id_incidente="INC-2026-8799",
            fecha_hora=datetime.now() - timedelta(days=15),
            ubicacion="Callejón oscuro, Distrito Este",
            tipo_fuerza="Arma de Fuego (Letal)",
            justificacion_legal="Sospechoso disparó arma de fuego hacia patrulla en movimiento. Fuego de cobertura devuelto. Reporte de asuntos internos en curso.",
            hubo_heridos=True
        ),
        UsoDeFuerza(
            id_oficial=3,
            id_incidente="INC-2026-9055",
            fecha_hora=datetime.now() - timedelta(hours=5),
            ubicacion="Estacionamiento Subterráneo Mall",
            tipo_fuerza="Fisica No Letal",
            justificacion_legal="Forcejeo durante detención de sospechoso de robo vehicular.",
            hubo_heridos=False
        ),
    ]
    UsoDeFuerza.objects.bulk_create(usos)

    print("Populating ReunionComunitaria...")
    reuniones = [
        ReunionComunitaria(
            cuadrante_distrito="Distrito Central",
            fecha_reunion=datetime.now() - timedelta(days=15),
            cantidad_asistentes=45,
            temas_tratados="Aumento de robos a transeúntes, vigilancia vecinal, iluminación de parques.",
            compromisos="Aumentar patrullaje preventivo de 18:00 a 22:00. Vecinos crearán grupo de WhatsApp.",
            oficial_responsable="Capitán Ramírez"
        ),
        ReunionComunitaria(
            cuadrante_distrito="Sector Sur",
            fecha_reunion=datetime.now() - timedelta(days=5),
            cantidad_asistentes=120,
            temas_tratados="Pandillas locales y grafiti. Reclutamiento juvenil.",
            compromisos="Charlas preventivas en la escuela secundaria local.",
            oficial_responsable="Ofc. Martinez"
        ),
        ReunionComunitaria(
            cuadrante_distrito="Zona Industrial",
            fecha_reunion=datetime.now() + timedelta(days=3),
            cantidad_asistentes=0,
            temas_tratados="Robos nocturnos a bodegas comerciales.",
            compromisos="",
            oficial_responsable="Sgto. Torres"
        ),
    ]
    ReunionComunitaria.objects.bulk_create(reuniones)
    
    print("Dummy data successfully injected!")

if __name__ == "__main__":
    populate()
