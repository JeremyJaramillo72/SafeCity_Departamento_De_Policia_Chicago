from clickhouse_driver import Client
from datetime import date, datetime
import time

def get_clickhouse_client():
    return Client(
        host='localhost',
        port=9000,
        user='default',
        password='password12345',
        secure=False
    )

def seed_rich_incident_details():
    client = get_clickhouse_client()
    print("Conectado a ClickHouse para sembrado de datos detallados...")

    print("Limpiando tablas de Inteligencia Criminal...")
    client.execute("TRUNCATE TABLE IF EXISTS sospechoso")
    client.execute("TRUNCATE TABLE IF EXISTS evidencia")
    client.execute("TRUNCATE TABLE IF EXISTS testigo")
    client.execute("TRUNCATE TABLE IF EXISTS victima")
    client.execute("TRUNCATE TABLE IF EXISTS seguimiento_incidente")
    client.execute("TRUNCATE TABLE IF EXISTS investigacion_especial")

    # 1. Ensure Bands exist
    print("Verificando catálogo de Bandas Criminales...")
    existing_bands = client.execute("SELECT id_banda FROM banda_criminal")
    band_ids = [r[0] for r in existing_bands]
    
    bands_to_insert = []
    if 1 not in band_ids:
        bands_to_insert.append((1, "Latin Kings", "Chicago South Sector", "Alta"))
    if 2 not in band_ids:
        bands_to_insert.append((2, "Gangster Disciples", "Chicago West Sector", "Crítica"))
    if 3 not in band_ids:
        bands_to_insert.append((3, "Vice Lords", "Chicago North Sector", "Media"))
        
    if bands_to_insert:
        client.execute("INSERT INTO banda_criminal (id_banda, nombre_banda, zona_operacion, nivel_peligrosidad) VALUES", bands_to_insert)
        print(f"Insertadas {len(bands_to_insert)} bandas criminales.")

    # Data lists
    suspects = []
    evidence = []
    witnesses = []
    victims = []
    logs = []
    investigations = []

    # =========================================================================
    # PART A: ORIGINAL SEED DATA (from seed_intel.py)
    # To keep original dashboard and other flows functioning perfectly!
    # =========================================================================
    
    # Original Suspects
    suspects.extend([
        (1, "G149281", "Marcus Vance", "ID-9081", "Masculino", "555-0988", "415 S Damen Ave", "Blade", date(1995, 8, 12), True, "Declara que no estuvo en la zona, pero fue identificado por testigos cerca del local.", 1),
        (2, "G164779", "Darnell Jackson", "ID-4421", "Masculino", "555-1122", "890 W Roosevelt Rd", "Shadow", date(1992, 4, 25), True, "Confiesa haber conducido el vehículo de escape, pero niega participación directa en el robo.", 2),
        (3, "G006114", "Carlos Mendoza", "ID-7721", "Masculino", "555-9988", "1200 S Blue Island Ave", "El Toro", date(1988, 11, 2), True, "Se mantiene en silencio. Arrestado en flagrancia con pertenencias de la víctima.", 1),
        (4, "G069207", "Sarah Connor", "ID-2231", "Femenino", "555-7766", "550 N St Clair St", "Vixen", date(1998, 6, 14), False, "Afirma ser una transeúnte confundida con un cómplice. Sin antecedentes previos.", 3)
    ])

    # Original Evidence
    evidence.extend([
        (1, "G149281", "Pistola Glock 19 9mm (Nro Serie G-98412) con 12 cartuchos", datetime(2026, 5, 23, 9, 0, 0), 1),
        (2, "G149281", "Bolsa hermética con 15 gramos de polvo blanco (cocaína)", datetime(2026, 5, 23, 9, 15, 0), 1),
        (3, "G164779", "Máscara de pasamontañas negra y palanca de hierro de 60cm", datetime(2026, 5, 23, 10, 30, 0), 2),
        (4, "G006114", "Billetera de cuero con tarjetas de crédito reportadas como robadas", datetime(2026, 5, 23, 11, 0, 0), 2)
    ])

    # Original Witnesses
    witnesses.extend([
        (1, "G149281", "Alice Smith", "ID-8841", "Femenino", "555-9011", "450 W Madison St", "Vi a un hombre con chaqueta roja salir corriendo del minimarket inmediatamente después de los disparos.", False),
        (2, "G164779", "Bob Johnson", "ID-9921", "Masculino", "555-8841", "720 N Michigan Ave", "Un sedán negro estuvo estacionado en doble fila con el motor encendido, el sospechoso subió rápido y escaparon.", True)
    ])

    # Original Victims
    victims.extend([
        (1, "G149281", "Jane Carter", "ID-1241", "Femenino", "555-1212", "120 W Randolph St"),
        (2, "G006114", "David Miller", "ID-5512", "Masculino", "555-3221", "500 E Ohio St")
    ])

    # =========================================================================
    # PART B: NEW RICH SEED DATA FOR DETECTIVE DEMO CASES
    # IDs starting from 100 to avoid any possible collisions!
    # =========================================================================

    # -------------------------------------------------------------------------
    # CASE 1: D262438 (Homicide - FIRST DEGREE MURDER) - Active / Major Case
    # Assigned to Det. Somerset (11)
    # -------------------------------------------------------------------------
    case1 = 'D262438'
    
    # Victims
    victims.append((100, case1, "Jack Peterson", "IL-9988231", "Masculino", "555-0145", "412 W 64th St, Chicago, IL"))

    # Suspects
    suspects.append((
        100, case1, "Tony 'The Snake' Galliano", "IL-7744112", "Masculino", "555-0199", 
        "1420 S Blue Island Ave, Chicago, IL", "The Snake", date(1993, 10, 15), True, 
        "Afirma haber estado cenando con su pareja al momento de los disparos, pero la geolocalización de su teléfono celular lo ubica a menos de 50 metros de la escena en el callejón.", 
        1  # Latin Kings
    ))
    suspects.append((
        101, case1, "Damian 'D-Rock' Carter", "IL-6655443", "Masculino", "555-0155", 
        "812 W Roosevelt Rd, Chicago, IL", "D-Rock", date(1996, 2, 18), True, 
        "Se acogió al derecho constitucional de no declarar. Fue interceptado por una patrulla a 4 calles del incidente portando el teléfono iPhone 13 Pro personal de la víctima.", 
        3  # Vice Lords
    ))

    # Witnesses
    witnesses.append((
        100, case1, "Eleanor Vance", "IL-4411990", "Femenino", "555-0131", "405 W 64th St, Chicago, IL",
        "Escuché una discusión sumamente acalorada en el callejón trasero de mi edificio y luego tres detonaciones rápidas. Al asomarme a la ventana, vi a dos hombres con abrigos oscuros correr hacia un sedán gris sin placas.",
        False
    ))
    witnesses.append((
        101, case1, "Testigo Protegido T-12", "ANON-012", "Masculino", "Desconocido", "Desconocido",
        "El tirador fue 'The Snake'. Jack le debía dinero por mercancía de territorio y 'The Snake' le dijo que se le había acabado el tiempo antes de sacar el arma y dispararle a quemarropa.",
        True
    ))

    # Evidence
    evidence.append((100, case1, "Casquillo percutido 9mm (Recuperado en escena)", datetime(2025, 11, 22, 4, 45, 0), 1))  # John Doe
    evidence.append((101, case1, "Pistola Glock 17 9mm con número de serie limado", datetime(2025, 11, 22, 9, 30, 0), 2))  # Jane Smith
    evidence.append((102, case1, "Grabación de cámara de seguridad de Liquor Store contiguo", datetime(2025, 11, 22, 10, 15, 0), 11)) # Somerset
    evidence.append((103, case1, "Teléfono iPhone 13 Pro de la víctima con rastros de sangre", datetime(2025, 11, 22, 6, 30, 0), 4))  # Emily Davis

    # Logs
    logs.append((
        f"{case1}-log-1", case1, datetime(2025, 11, 22, 4, 30, 0), "En Progreso", 
        "Respuesta de Emergencia", "Primer móvil policial llega al lugar tras reporte del 911. Se encuentra a un masculino tendido boca abajo en el callejón con heridas de bala visibles. Se solicita ambulancia de urgencia.",
        1, "Oficial John Doe"
    ))
    logs.append((
        f"{case1}-log-2", case1, datetime(2025, 11, 22, 4, 40, 0), "En Progreso", 
        "Confirmación de Deceso", "Paramédicos del servicio de emergencia confirman que la víctima no tiene signos vitales. Se declara escena de crimen activa y se realiza el acordonamiento perimetral.",
        1, "Oficial John Doe"
    ))
    logs.append((
        f"{case1}-log-3", case1, datetime(2025, 11, 22, 5, 30, 0), "En Progreso", 
        "Procesamiento de Escena", "Llegada del equipo de Criminalística (CSU). Se realiza fijación fotográfica de la escena y se recolectan huellas dactilares latentes en el contenedor de basura contiguo.",
        2, "Oficial Jane Smith"
    ))
    logs.append((
        f"{case1}-log-assign", case1, datetime(2025, 11, 22, 15, 4, 23), "En Progreso", 
        "Caso Asignado", "El detective William Somerset ha tomado posesión formal de la investigación del expediente.",
        11, "Det. William Somerset"
    ))
    logs.append((
        f"{case1}-log-escalate", case1, datetime(2025, 11, 22, 15, 5, 0), "Caso Mayor", 
        "Caso Escalado", "La investigación ha sido clasificada formalmente como Caso Mayor de Alta Prioridad por el detective a cargo.",
        11, "Det. William Somerset"
    ))
    logs.append((
        f"{case1}-log-4", case1, datetime(2025, 11, 23, 9, 0, 0), "En Progreso", 
        "Informe de Autopsia", "Informe forense preliminar indica tres impactos de bala de calibre 9mm. Causa del deceso: shock hipovolémico por proyectil penetrante en cavidad torácica. Distancia de tiro muy corta.",
        11, "Det. William Somerset"
    ))
    logs.append((
        f"{case1}-log-5", case1, datetime(2025, 11, 24, 14, 0, 0), "En Progreso", 
        "Análisis Forense Digital", "Extracción forense del teléfono celular de la víctima revela mensajes de texto amenazantes recibidos horas antes del crimen, asociados al alias 'The Snake'.",
        11, "Det. William Somerset"
    ))
    logs.append((
        f"{case1}-log-6", case1, datetime(2025, 11, 25, 11, 30, 0), "En Progreso", 
        "Operativo de Búsqueda", "Se emite orden de allanamiento y captura contra Tony 'The Snake' Galliano tras confirmarse que las huellas en el arma Glock 17 coinciden con su registro penal.",
        11, "Det. William Somerset"
    ))

    # Special Investigation Table
    investigations.append((
        100, case1, 11, 1, "En Progreso", "", datetime(2025, 11, 22, 15, 4, 23), None
    ))

    # -------------------------------------------------------------------------
    # CASE 2: G287920 (Robbery - ARMED: HANDGUN) - Active Case
    # Assigned to Det. Somerset (11)
    # -------------------------------------------------------------------------
    case2 = 'G287920'

    # Victims
    victims.append((101, case2, "Robert 'Bob' Jenkins", "IL-1122334", "Masculino", "555-0177", "2510 N Lawndale Ave, Chicago, IL"))

    # Suspects
    suspects.append((
        102, case2, "Marcus 'Lil M' Miller", "IL-3344556", "Masculino", "555-0144", 
        "2840 W Diversy Ave, Chicago, IL", "Lil M", date(2003, 5, 12), True, 
        "Afirma que a esa hora estaba durmiendo en casa de su abuela, pero la abuela no pudo confirmar la coartada y se contradijo en las horas del testimonio.", 
        2  # Gangster Disciples
    ))

    # Witnesses
    witnesses.append((
        102, case2, "Sandra Vance", "IL-5566778", "Femenino", "555-0163", "2504 N Lawndale Ave, Chicago, IL",
        "Iba saliendo de mi casa cuando vi a un joven con capucha gris apuntar con un revólver negro al señor Jenkins. Le arrebató el maletín de cuero y corrió hacia el callejón de Lawndale.",
        False
    ))

    # Evidence
    evidence.append((104, case2, "Revólver calibre .38 Special marca Taurus", datetime(2001, 5, 19, 1, 15, 0), 5))  # Michael Miller
    evidence.append((105, case2, "Maletín de cuero negro con pertenencias de la víctima", datetime(2001, 5, 18, 23, 59, 0), 4)) # Emily Davis

    # Logs
    logs.append((
        f"{case2}-log-1", case2, datetime(2001, 5, 18, 23, 50, 0), "En Progreso", 
        "Reporte de Robo", "Llamada al 911 reporta robo en proceso a mano armada en plena calle. La víctima describe al agresor como un joven de 1.80m, abrigo gris con capucha y máscara negra.",
        1, "Oficial de Turno"
    ))
    logs.append((
        f"{case2}-log-2", case2, datetime(2001, 5, 19, 0, 5, 0), "En Progreso", 
        "Intervención Inicial", "Patrulla del cuadrante intercepta a la víctima quien presenta una crisis nerviosa y una contusión leve en la cabeza por golpe con la cacha del revólver.",
        5, "Oficial Michael Miller"
    ))
    logs.append((
        f"{case2}-log-assign", case2, datetime(2001, 5, 20, 10, 0, 0), "En Progreso", 
        "Caso Asignado", "El caso se asigna al departamento de robos urbanos. Det. Somerset toma las riendas del expediente.",
        11, "Det. William Somerset"
    ))
    logs.append((
        f"{case2}-log-3", case2, datetime(2001, 5, 21, 15, 30, 0), "En Progreso", 
        "Revisión de Cámaras", "Se analizan grabaciones de seguridad urbana de la cuadra. Se observa la ruta de escape del sospechoso hacia un complejo de apartamentos cercano.",
        11, "Det. William Somerset"
    ))

    # Investigation
    investigations.append((
        101, case2, 11, 0, "En Progreso", "", datetime(2001, 5, 20, 10, 0, 0), None
    ))

    # -------------------------------------------------------------------------
    # CASE 3: G295054 (Assault - AGGRAVATED: KNIFE) - Closed Case
    # Assigned to Det. Somerset (11)
    # -------------------------------------------------------------------------
    case3 = 'G295054'

    # Victims
    victims.append((102, case3, "Maria Rodriguez", "IL-8899001", "Femenino", "555-0182", "1415 N Tripp Ave, Chicago, IL"))

    # Suspects
    suspects.append((
        103, case3, "Juan Carlos Ramirez", "IL-4455667", "Masculino", "555-0129", 
        "1419 N Tripp Ave, Chicago, IL", "El Gato", date(1989, 7, 21), True, 
        "Declaró que actuó en defensa propia durante una acalorada discusión vecinal, pero los testigos oculares desmienten por completo su versión.", 
        0  # Ninguna banda
    ))

    # Witnesses
    witnesses.append((
        103, case3, "Pedro Gomez", "IL-7788992", "Masculino", "555-0191", "1421 N Tripp Ave, Chicago, IL",
        "Juan Carlos estaba sumamente agresivo y gritando insultos a María. De repente sacó una navaja e intentó agredirla físicamente. Por suerte, intervenimos a tiempo para desarmarlo.",
        False
    ))

    # Evidence
    evidence.append((106, case3, "Navaja de muelle de 10cm con manchas de sangre", datetime(2001, 5, 21, 9, 0, 0), 7))  # David Moore

    # Logs
    logs.append((
        f"{case3}-log-1", case3, datetime(2001, 5, 21, 8, 47, 0), "En Progreso", 
        "Llamada de Alerta", "Vecinos reportan riña doméstica y agresión física con arma blanca en la vía pública. Se desplaza patrullero de inmediato.",
        1, "Oficial de Turno"
    ))
    logs.append((
        f"{case3}-log-2", case3, datetime(2001, 5, 21, 8, 55, 0), "En Progreso", 
        "Arresto en Flagrancia", "Oficiales llegan al lugar y proceden con la detención del sospechoso Juan Carlos Ramirez, quien había sido reducido por testigos.",
        7, "Oficial David Moore"
    ))
    logs.append((
        f"{case3}-log-assign", case3, datetime(2001, 5, 21, 10, 0, 0), "En Progreso", 
        "Caso Asignado", "El detective William Somerset asume la dirección del caso para la estructuración de la acusación penal.",
        11, "Det. William Somerset"
    ))
    logs.append((
        f"{case3}-log-close", case3, datetime(2001, 5, 22, 14, 0, 0), "Cerrado", 
        "Investigación Cerrada", "Caso concluido. Se formalizan los cargos de asalto agravado con arma blanca. El caso es derivado a la Fiscalía para juicio definitivo.",
        11, "Det. William Somerset"
    ))

    # Investigation
    investigations.append((
        102, case3, 11, 0, "Cerrado", 
        "El sospechoso fue detenido en flagrancia. Se presentaron cargos formales por asalto agravado con arma blanca. La víctima fue dada de alta y testificó en la audiencia preliminar.", 
        datetime(2001, 5, 21, 10, 0, 0), datetime(2001, 5, 22, 14, 0, 0)
    ))

    # -------------------------------------------------------------------------
    # CASE 4: G225994 (Homicide - FIRST DEGREE MURDER) - Closed / Major Case
    # Assigned to Det. Somerset (11)
    # -------------------------------------------------------------------------
    case4 = 'G225994'

    # Victims
    victims.append((103, case4, "Daniel 'Danny' Brody", "IL-4455889", "Masculino", "555-0111", "3408 S Ashland Ave, Chicago, IL"))

    # Suspects
    suspects.append((
        104, case4, "Carlos Mendoza", "ID-7721", "Masculino", "555-9988", 
        "1200 S Blue Island Ave, Chicago, IL", "El Toro", date(1988, 11, 2), True, 
        "Se mantuvo en completo silencio durante todos los interrogatorios. Fue arrestado portando el reloj de oro personal de la víctima y el arma homicida.", 
        1  # Latin Kings
    ))

    # Witnesses
    witnesses.append((
        104, case4, "Martha Stewart", "IL-1122998", "Femenino", "555-0104", "3402 S Ashland Ave, Chicago, IL",
        "Escuché gritos fuera de mi tienda y luego vi a 'El Toro' disparar dos veces contra Daniel antes de correr hacia una camioneta negra.",
        False
    ))

    # Evidence
    evidence.append((107, case4, "Pistola Glock 19 9mm (Nro Serie G-98412) con huellas de Carlos Mendoza", datetime(2001, 4, 21, 1, 30, 0), 1))  # John Doe

    # Logs
    logs.append((
        f"{case4}-log-1", case4, datetime(2001, 4, 20, 23, 20, 0), "En Progreso", 
        "Reporte de Disparos", "Se reciben múltiples alertas de disparos en la cuadra 34 de Ashland Ave. Unidades policiales se desplazan al lugar.",
        1, "Oficial de Turno"
    ))
    logs.append((
        f"{case4}-log-2", case4, datetime(2001, 4, 21, 0, 10, 0), "En Progreso", 
        "Llegada de Detectives", "Se confirma homicidio consumado. El detective Somerset asume el control del perímetro e inicia toma de declaraciones preliminares.",
        11, "Det. William Somerset"
    ))
    logs.append((
        f"{case4}-log-3", case4, datetime(2001, 4, 21, 2, 45, 0), "En Progreso", 
        "Detención de Sospechoso", "Operativo cerrojo en sector sur logra la captura de Carlos 'El Toro' Mendoza tras una breve persecución. Portaba elementos de valor de la víctima.",
        1, "Oficial John Doe"
    ))
    logs.append((
        f"{case4}-log-close", case4, datetime(2001, 4, 23, 16, 0, 0), "Cerrado", 
        "Investigación Cerrada", "Caso resuelto. Pruebas balísticas confirman que el proyectil extraído coincide con el arma incautada al sospechoso. Juicio rápido programado.",
        11, "Det. William Somerset"
    ))

    # Investigation
    investigations.append((
        103, case4, 11, 1, "Cerrado", 
        "Caso concluido con éxito. El sospechoso fue detenido en flagrancia con el arma homicida y pertenencias de la víctima. Las pruebas científicas y declaraciones de testigos presenciales resultaron determinantes para el dictamen condenatorio.", 
        datetime(2001, 4, 21, 0, 10, 0), datetime(2001, 4, 23, 16, 0, 0)
    ))

    # =========================================================================
    # INSERT EVERYTHING INTO CLICKHOUSE
    # =========================================================================
    print(f"Insertando {len(victims)} víctimas...")
    client.execute("INSERT INTO victima (id_victima, case_number, nombres, identificacion, genero, telefono, direccion) VALUES", victims)

    print(f"Insertando {len(suspects)} sospechosos...")
    client.execute("INSERT INTO sospechoso (id_sospechoso, case_number, nombres, identificacion, genero, telefono, direccion, alias_conocido, fecha_nacimiento, antecedentes, declaracion, id_banda) VALUES", suspects)

    print(f"Insertando {len(witnesses)} testigos...")
    client.execute("INSERT INTO testigo (id_testigo, case_number, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo) VALUES", witnesses)

    print(f"Insertando {len(evidence)} evidencias...")
    client.execute("INSERT INTO evidencia (id_evidencia, case_number, tipo_evidencia, fecha_recoleccion, id_oficial) VALUES", evidence)

    print(f"Insertando {len(logs)} registros de seguimiento...")
    client.execute("INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES", logs)

    print(f"Insertando {len(investigations)} investigaciones en investigacion_especial...")
    client.execute("INSERT INTO investigacion_especial (id_investigacion, case_number, id_detective, es_caso_mayor, estado, reporte_final, fecha_asignacion, fecha_resolucion) VALUES", investigations)

    print("¡Sembrado de datos enriquecidos completado con total éxito!")

if __name__ == "__main__":
    seed_rich_incident_details()
