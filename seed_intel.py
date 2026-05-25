from clickhouse_driver import Client
from datetime import date, datetime

def seed_intelligence():
    print("Conectando a ClickHouse Local...")
    client = Client(
        host='localhost',
        port=9000,
        user='default',
        password='password12345',
        secure=False
    )


    print("Limpiando tablas de Inteligencia Criminal...")
    client.execute("TRUNCATE TABLE IF EXISTS banda_criminal")
    client.execute("TRUNCATE TABLE IF EXISTS sospechoso")
    client.execute("TRUNCATE TABLE IF EXISTS evidencia")
    client.execute("TRUNCATE TABLE IF EXISTS testigo")
    client.execute("TRUNCATE TABLE IF EXISTS victima")

    # 1. Seed Gangs (Banda Criminal)
    print("Sembrando Bandas Criminales...")
    gangs = [
        (1, "Latin Kings", "Chicago South Sector", "Alta"),
        (2, "Gangster Disciples", "Chicago West Sector", "Crítica"),
        (3, "Vice Lords", "Chicago North Sector", "Media")
    ]
    client.execute("INSERT INTO banda_criminal (id_banda, nombre_banda, zona_operacion, nivel_peligrosidad) VALUES", gangs)

    # 2. Seed Suspects (Sospechosos)
    print("Sembrando Sospechosos...")
    suspects = [
        (1, "G149281", "Marcus Vance", "ID-9081", "Masculino", "555-0988", "415 S Damen Ave", "Blade", date(1995, 8, 12), True, "Declara que no estuvo en la zona, pero fue identificado por testigos cerca del local.", 1),
        (2, "G164779", "Darnell Jackson", "ID-4421", "Masculino", "555-1122", "890 W Roosevelt Rd", "Shadow", date(1992, 4, 25), True, "Confiesa haber conducido el vehículo de escape, pero niega participación directa en el robo.", 2),
        (3, "G006114", "Carlos Mendoza", "ID-7721", "Masculino", "555-9988", "1200 S Blue Island Ave", "El Toro", date(1988, 11, 2), True, "Se mantiene en silencio. Arrestado en flagrancia con pertenencias de la víctima.", 1),
        (4, "G069207", "Sarah Connor", "ID-2231", "Femenino", "555-7766", "550 N St Clair St", "Vixen", date(1998, 6, 14), False, "Afirma ser una transeúnte confundida con un cómplice. Sin antecedentes previos.", 3)
    ]
    client.execute("INSERT INTO sospechoso (id_sospechoso, case_number, nombres, identificacion, genero, telefono, direccion, alias_conocido, fecha_nacimiento, antecedentes, declaracion, id_banda) VALUES", suspects)

    # 3. Seed Evidence (Evidencias)
    print("Sembrando Evidencias...")
    evidence = [
        (1, "G149281", "Pistola Glock 19 9mm (Nro Serie G-98412) con 12 cartuchos", datetime(2026, 5, 23, 9, 0, 0), 1),
        (2, "G149281", "Bolsa hermética con 15 gramos de polvo blanco (cocaína)", datetime(2026, 5, 23, 9, 15, 0), 1),
        (3, "G164779", "Máscara de pasamontañas negra y palanca de hierro de 60cm", datetime(2026, 5, 23, 10, 30, 0), 2),
        (4, "G006114", "Billetera de cuero con tarjetas de crédito reportadas como robadas", datetime(2026, 5, 23, 11, 0, 0), 2)
    ]
    client.execute("INSERT INTO evidencia (id_evidencia, case_number, tipo_evidencia, fecha_recoleccion, id_oficial) VALUES", evidence)

    # 4. Seed Witnesses (Testigos)
    print("Sembrando Testigos...")
    witnesses = [
        (1, "G149281", "Alice Smith", "ID-8841", "Femenino", "555-9011", "450 W Madison St", "Vi a un hombre con chaqueta roja salir corriendo del minimarket inmediatamente después de los disparos.", False),
        (2, "G164779", "Bob Johnson", "ID-9921", "Masculino", "555-8841", "720 N Michigan Ave", "Un sedán negro estuvo estacionado en doble fila con el motor encendido, el sospechoso subió rápido y escaparon.", True)
    ]
    client.execute("INSERT INTO testigo (id_testigo, case_number, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo) VALUES", witnesses)

    # 5. Seed Victims (Víctimas)
    print("Sembrando Víctimas...")
    victims = [
        (1, "G149281", "Jane Carter", "ID-1241", "Femenino", "555-1212", "120 W Randolph St"),
        (2, "G006114", "David Miller", "ID-5512", "Masculino", "555-3221", "500 E Ohio St")
    ]
    client.execute("INSERT INTO victima (id_victima, case_number, nombres, identificacion, genero, telefono, direccion) VALUES", victims)

    print("Sembrado de Inteligencia Criminal completado con éxito!")

if __name__ == "__main__":
    seed_intelligence()
