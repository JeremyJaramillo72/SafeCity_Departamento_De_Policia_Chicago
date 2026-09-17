import datetime
from datetime import date, datetime
from clickhouse_driver import Client

def get_clickhouse_client():
    return Client(
        host='localhost',
        port=9000,
        user='default',
        password='password12345',
        secure=False
    )

def run():
    client = get_clickhouse_client()
    print("Conectado a ClickHouse para sembrar datos en los 3 primeros casos...")

    cases = ['HH185938', 'HJ102333', 'HH870476']

    # 1. Clean existing detail rows for these 3 cases if any
    print("Limpiando registros previos de estos 3 casos en tablas relacionadas...")
    client.execute("ALTER TABLE sospechoso DELETE WHERE case_number IN %(cases)s", {'cases': tuple(cases)})
    client.execute("ALTER TABLE evidencia DELETE WHERE case_number IN %(cases)s", {'cases': tuple(cases)})
    client.execute("ALTER TABLE testigo DELETE WHERE case_number IN %(cases)s", {'cases': tuple(cases)})
    client.execute("ALTER TABLE victima DELETE WHERE case_number IN %(cases)s", {'cases': tuple(cases)})
    client.execute("ALTER TABLE vehiculo_sospechoso DELETE WHERE case_number IN %(cases)s", {'cases': tuple(cases)})
    client.execute("ALTER TABLE seguimiento_incidente DELETE WHERE case_number IN %(cases)s", {'cases': tuple(cases)})
    client.execute("ALTER TABLE investigacion_especial DELETE WHERE case_number IN %(cases)s", {'cases': tuple(cases)})
    client.execute("ALTER TABLE ingreso_celda DELETE WHERE id_incidente_asociado IN %(cases)s", {'cases': tuple(cases)})
    client.execute("ALTER TABLE bitacora_detenido DELETE WHERE id_ingreso = 'BOOK-2027-003'")
    client.execute("ALTER TABLE orden_judicial DELETE WHERE expediente_vinculado IN %(cases)s", {'cases': tuple(cases)})

    # 2. Update chicago_crimes base records for the 3 cases
    print("Actualizando información base en chicago_crimes...")

    # Case 1: HH185938
    report_1 = (
        "On January 1, 2027 at approximately 00:05 hrs, patrol unit CPD-001 was dispatched to 020XX N Burling St "
        "following reports of intentional property damage to several parked luxury vehicles during New Year's celebrations. "
        "Upon arrival, responding officers identified shattered windows and heavy door denting on a 2024 Mercedes-Benz C300. "
        "Eyewitnesses observed a male in a dark hooded jacket fleeing on foot toward Halsted St. "
        "A discarded heavy steel crowbar and tire iron were recovered at the scene. Crime Scene Unit dispatched for latent fingerprint processing."
    )
    client.execute("""
        ALTER TABLE chicago_crimes
        UPDATE
            patrol_assigned = 'CPD-001 (SUV Patrol)',
            officers_assigned = ['Ofc. John Doe', 'Ofc. Richard Stevens'],
            police_report_text = %(report)s,
            updated_on = now()
        WHERE case_number = 'HH185938'
    """, {'report': report_1})

    # Case 2: HJ102333
    report_2 = (
        "On December 31, 2026 at approximately 23:50 hrs, unit CPD-008 responded to a priority call at 025XX W 68th St "
        "regarding extensive property destruction. Multiple vehicles parked along the street suffered slashed tires, "
        "shattered windshields, and gang graffiti taggings. The resident reported hearing loud strikes and yelling outside his house. "
        "Responding units secured physical evidence including spray paint cans and canvassed the neighborhood."
    )
    client.execute("""
        ALTER TABLE chicago_crimes
        UPDATE
            patrol_assigned = 'CPD-008 (SUV Patrol)',
            officers_assigned = ['Ofc. Richard Stevens', 'Ofc. John Doe'],
            police_report_text = %(report)s,
            updated_on = now()
        WHERE case_number = 'HJ102333'
    """, {'report': report_2})

    # Case 3: HH870476
    report_3 = (
        "On December 31, 2026 at approximately 23:20 hrs, units CPD-005 and backup responded to a priority domestic disturbance "
        "at 059XX S Hermitage Ave. Upon arrival, officers heard violent screaming inside. Forced entry was made under exigent circumstances. "
        "Suspect Marcus Sterling was found actively assaulting the victim. Officers deployed de-escalation control holds and took the suspect "
        "into custody without incident. Paramedics provided on-scene medical care for minor facial contusions. "
        "Suspect was transported to 7th District holding facility for formal booking."
    )
    client.execute("""
        ALTER TABLE chicago_crimes
        UPDATE
            patrol_assigned = 'CPD-005 (Transport Van)',
            officers_assigned = ['Ofc. John Doe', 'Ofc. Emma Watson'],
            police_report_text = %(report)s,
            updated_on = now()
        WHERE case_number = 'HH870476'
    """, {'report': report_3})

    # 3. Insert Suspects
    print("Insertando sospechosos...")
    suspects_data = [
        # (id_sospechoso, case_number, nombres, identificacion, genero, telefono, direccion, alias_conocido, fecha_nacimiento, antecedentes, declaracion, id_banda)
        (
            201, 'HH185938', 'Julian Drake', 'IL-8823901', 'Masculino', '555-0193',
            '1845 N Halsted St, Chicago, IL', 'Viper', date(1999, 4, 14), True,
            'Afirma haber estado festejando el Año Nuevo en un bar de Clark Street. Niega haber estado en Burling St a la medianoche.',
            3  # Vice Lords
        ),
        (
            202, 'HJ102333', 'Mateo Rivera', 'IL-7719204', 'Masculino', '555-0174',
            '6732 S Western Ave, Chicago, IL', 'Ghost', date(2001, 9, 22), True,
            'Afirma que estuvo en la fiesta de fin de año en casa de un familiar en Western Ave. Desconoce la procedencia de las latas de pintura.',
            1  # Latin Kings
        ),
        (
            203, 'HH870476', 'Marcus Sterling', 'IL-4419820', 'Masculino', '555-0137',
            '5924 S Hermitage Ave, Chicago, IL', 'Red', date(1991, 3, 17), True,
            'Admite haber discutido violentamente con su pareja por desacuerdos familiares de fin de año, perdiendo el control.',
            0  # Sin banda
        )
    ]
    client.execute("INSERT INTO sospechoso (id_sospechoso, case_number, nombres, identificacion, genero, telefono, direccion, alias_conocido, fecha_nacimiento, antecedentes, declaracion, id_banda) VALUES", suspects_data)

    # 4. Insert Victims
    print("Insertando víctimas...")
    victims_data = [
        # (id_victima, case_number, nombres, identificacion, genero, telefono, direccion)
        (201, 'HH185938', 'Alexander Wright', 'IL-5419082', 'Masculino', '555-0188', '2024 N Burling St, Apt 3B, Chicago, IL'),
        (202, 'HJ102333', 'Hector Gutierrez', 'IL-3319088', 'Masculino', '555-0166', '2542 W 68th St, Chicago, IL'),
        (203, 'HH870476', 'Vanessa Jenkins', 'IL-6655129', 'Femenino', '555-0121', '5924 S Hermitage Ave, Chicago, IL')
    ]
    client.execute("INSERT INTO victima (id_victima, case_number, nombres, identificacion, genero, telefono, direccion) VALUES", victims_data)

    # 5. Insert Witnesses
    print("Insertando testigos...")
    witnesses_data = [
        # (id_testigo, case_number, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo)
        (
            201, 'HH185938', 'Claire Montgomery', 'IL-6677213', 'Femenino', '555-0142', '2028 N Burling St, Chicago, IL',
            'Estaba en el balcón brindando por Año Nuevo cuando escuché vidrios romperse. Vi a un hombre con sudadera oscura golpear el vehículo con una palanca y huir hacia Halsted.',
            False
        ),
        (
            202, 'HH185938', 'Testigo Protegido (T-04)', 'ANON-004', 'Masculino', 'Desconocido', 'Desconocido',
            'Un sujeto conocido como Viper estuvo presumiendo en la zona horas antes de que iba a atacar vehículos en el sector norte.',
            True
        ),
        (
            203, 'HJ102333', 'Rosa Morales', 'IL-9988112', 'Femenino', '555-0158', '2538 W 68th St, Chicago, IL',
            'Observé por la ventana a tres sujetos encapuchados golpeando los espejos laterales con un bate de madera y pintando siglas en los capós antes de escapar corriendo.',
            False
        ),
        (
            204, 'HH870476', 'Brenda Washington', 'IL-8822991', 'Femenino', '555-0118', '5920 S Hermitage Ave, Chicago, IL',
            'Vivo en la casa de al lado y escuché gritos desesperados y ruidos de muebles cayendo. Llamé de inmediato al 911 para solicitar ayuda policial urgente.',
            False
        )
    ]
    client.execute("INSERT INTO testigo (id_testigo, case_number, nombres, identificacion, genero, telefono, direccion, testimonio, es_anonimo) VALUES", witnesses_data)

    # 6. Insert Evidence
    print("Insertando evidencias...")
    evidence_data = [
        # (id_evidencia, case_number, tipo_evidencia, fecha_recoleccion, id_oficial, url_fotografia)
        (2001, 'HH185938', 'Palanca de acero de 60cm con restos de pintura y huellas latentes', datetime(2027, 1, 1, 1, 15, 0), 2, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'),
        (2002, 'HH185938', 'Grabación de videovigilancia HD de edificio en Burling St', datetime(2027, 1, 1, 2, 0, 0), 11, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80'),
        (2003, 'HH185938', 'Muestras de vidrio templado y fragmentos de pintura automotriz', datetime(2027, 1, 1, 1, 30, 0), 2, ''),

        (2004, 'HJ102333', 'Lata de pintura en aerosol negra con crestas dactilares visibles', datetime(2027, 1, 1, 0, 30, 0), 1, 'https://images.unsplash.com/photo-1569074187119-c87815b476da?auto=format&fit=crop&w=400&q=80'),
        (2005, 'HJ102333', 'Bate de madera modificado con esquirlas de vidrio de parabrisas', datetime(2027, 1, 1, 1, 0, 0), 1, ''),
        (2006, 'HJ102333', 'Registro fotográfico pericial de grafittis y daños en 3 vehículos', datetime(2027, 1, 1, 1, 20, 0), 2, ''),

        (2007, 'HH870476', 'Grabación de audio de la llamada al 911 (ID: EM-LL-9041)', datetime(2026, 12, 31, 23, 20, 0), 12, ''),
        (2008, 'HH870476', 'Fotografías periciales de contusiones de la víctima y mobiliario afectado', datetime(2026, 12, 31, 23, 45, 0), 2, 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=400&q=80'),
        (2009, 'HH870476', 'Informe de atención paramédica preliminar in situ de CFD Unidad 14', datetime(2027, 1, 1, 0, 15, 0), 12, '')
    ]
    client.execute("INSERT INTO evidencia (id_evidencia, case_number, tipo_evidencia, fecha_recoleccion, id_oficial, url_fotografia) VALUES", evidence_data)

    # 7. Insert Suspect Vehicles
    print("Insertando vehículos sospechosos...")
    vehicles_data = [
        # (id_vehiculo_sospechoso, id_sospechoso, case_number, placa, marca, modelo, color, estado_reporte, observaciones, fecha_registro)
        (101, 201, 'HH185938', 'IL-789-KLX', 'Dodge', 'Charger', 'Negro mate', 'En investigación', 'Visto a alta velocidad en inmediaciones de Halsted poco después de sonar las alarmas.', datetime(2027, 1, 1, 2, 30, 0)),
        (102, 202, 'HJ102333', 'IL-442-BTY', 'Chevrolet', 'Impala', 'Azul oscuro', 'En investigación', 'Sedán visto rondando la cuadra con luces apagadas momentos antes de los ataques.', datetime(2027, 1, 1, 1, 45, 0))
    ]
    client.execute("INSERT INTO vehiculo_sospechoso (id_vehiculo_sospechoso, id_sospechoso, case_number, placa, marca, modelo, color, estado_reporte, observaciones, fecha_registro) VALUES", vehicles_data)

    # 8. Insert Tracking Logs
    print("Insertando historial de seguimiento y avances (seguimiento_incidente)...")
    logs_data = [
        # Case 1: HH185938
        ('HH185938-log-1', 'HH185938', datetime(2027, 1, 1, 0, 5, 0), 'En Progreso', 'Emergency Response', 'Llamada al 911 reporta vandalismo de vehículo en progreso. Móvil CPD-001 despachado con código 2.', 2, 'Ofc. John Doe'),
        ('HH185938-log-2', 'HH185938', datetime(2027, 1, 1, 0, 20, 0), 'En Progreso', 'Scene Secured', 'Móvil en sitio. Se constatan daños graves en ventanillas y carrocería del Mercedes C300. Perímetro acordonado.', 2, 'Ofc. John Doe'),
        ('HH185938-log-3', 'HH185938', datetime(2027, 1, 1, 1, 15, 0), 'En Progreso', 'Evidence Secured', 'Se recupera palanca de acero descartada debajo de vehículo contiguo. Embalada como evidencia EV-2001.', 2, 'Ofc. John Doe'),
        ('HH185938-log-4', 'HH185938', datetime(2027, 1, 1, 2, 30, 0), 'En Progreso', 'Statement Taken', 'Entrevistas a la víctima Alexander Wright y testigo presencial Claire Montgomery finalizadas.', 2, 'Ofc. John Doe'),
        ('HH185938-log-5', 'HH185938', datetime(2027, 1, 1, 9, 0, 0), 'En Progreso', 'Case Assigned', 'El detective William Somerset asume formalmente la dirección de la investigación penal.', 11, 'Det. William Somerset'),
        ('HH185938-log-6', 'HH185938', datetime(2027, 1, 1, 14, 0, 0), 'En Progreso', 'Progress Note', 'Cotejo preliminar en sistema AFIS de huellas en la palanca apunta al sospechoso Julian Drake.', 11, 'Det. William Somerset'),

        # Case 2: HJ102333
        ('HJ102333-log-1', 'HJ102333', datetime(2026, 12, 31, 23, 50, 0), 'En Progreso', 'Emergency Response', 'Despacho del 911 asigna alerta de vandalismo grupal en 68th St. Móvil CPD-008 arriba al sector.', 1, 'Ofc. Richard Stevens'),
        ('HJ102333-log-2', 'HJ102333', datetime(2027, 1, 1, 0, 10, 0), 'En Progreso', 'Scene Secured', 'Se constatan 3 vehículos con roturas de cristales y grafitis. Se levantan latas de pintura y peritaje fotográfico.', 1, 'Ofc. Richard Stevens'),
        ('HJ102333-log-3', 'HJ102333', datetime(2027, 1, 1, 0, 45, 0), 'En Progreso', 'Statement Taken', 'Declaración tomada a la víctima Hector Gutierrez y testigo presencial vecinal Rosa Morales.', 2, 'Ofc. John Doe'),
        ('HJ102333-log-4', 'HJ102333', datetime(2027, 1, 1, 8, 30, 0), 'En Progreso', 'Case Assigned', 'El detective William Somerset es asignado para verificar el nexo con pandillas de la zona.', 11, 'Det. William Somerset'),
        ('HJ102333-log-5', 'HJ102333', datetime(2027, 1, 1, 11, 15, 0), 'En Progreso', 'Progress Note', 'Tags identificados pertenecen al capítulo local de Latin Kings. Se cotejan registros de sospechosos.', 11, 'Det. William Somerset'),

        # Case 3: HH870476
        ('HH870476-log-1', 'HH870476', datetime(2026, 12, 31, 23, 18, 0), 'En Progreso', 'Emergency Response', 'Despacho prioritario por llamada de auxilio de violencia doméstica al 911.', 12, 'Ofc. Emma Watson'),
        ('HH870476-log-2', 'HH870476', datetime(2026, 12, 31, 23, 25, 0), 'En Progreso', 'Arrest Made', 'Ingreso urgente al inmueble. Detención en flagrancia del agresor Marcus Sterling.', 2, 'Ofc. John Doe'),
        ('HH870476-log-3', 'HH870476', datetime(2026, 12, 31, 23, 40, 0), 'En Progreso', 'Medical Care Provided', 'Asistencia médica de urgencia a la víctima por paramédicos del CFD. Lesiones menores tratadas en el sitio.', 12, 'Ofc. Emma Watson'),
        ('HH870476-log-4', 'HH870476', datetime(2027, 1, 1, 0, 30, 0), 'En Progreso', 'Booking Completed', 'Traslado e ingreso formal del detenido en celdas de la Estación Distrito 007 (Ficha BOOK-2027-003).', 2, 'Ofc. John Doe'),
        ('HH870476-log-5', 'HH870476', datetime(2027, 1, 1, 9, 0, 0), 'En Progreso', 'Case Assigned', 'El detective William Somerset procesa el expediente para radicación penal en corte.', 11, 'Det. William Somerset'),
        ('HH870476-log-6', 'HH870476', datetime(2027, 1, 1, 15, 30, 0), 'Cerrado', 'Investigation Closed', 'Cargos formales de Agresión Doméstica radicados ante la fiscalía. Orden de protección emitida.', 11, 'Det. William Somerset')
    ]
    client.execute("INSERT INTO seguimiento_incidente (id_seguimiento, case_number, fecha_registro, estado_caso, accion, descripcion_avance, id_oficial, oficial) VALUES", logs_data)

    # 9. Insert Special Investigations
    print("Insertando investigaciones especiales (investigacion_especial)...")
    investigations_data = [
        (201, 'HH185938', 11, 0, 'En Progreso', '', datetime(2027, 1, 1, 9, 0, 0), None),
        (202, 'HJ102333', 11, 0, 'En Progreso', '', datetime(2027, 1, 1, 8, 30, 0), None),
        (
            203, 'HH870476', 11, 0, 'Cerrado',
            'El sospechoso fue detenido en flagrancia por los oficiales intervinientes. Se tomaron declaraciones de la víctima y testigos, se aseguraron pruebas periciales y se procesó el ingreso a celda. El caso queda cerrado y derivado al Juzgado de Violencia Doméstica de Cook County.',
            datetime(2027, 1, 1, 9, 0, 0), datetime(2027, 1, 1, 15, 30, 0)
        )
    ]
    client.execute("INSERT INTO investigacion_especial (id_investigacion, case_number, id_detective, es_caso_mayor, estado, reporte_final, fecha_asignacion, fecha_resolucion) VALUES", investigations_data)

    # 10. Insert Cell Booking for HH870476 (Arrest Made)
    print("Insertando ficha de celda / booking para el arrestado de HH870476...")
    celda_data = [(
        'BOOK-2027-003',
        2,  # id_oficial (John Doe)
        'Marcus Sterling',
        'Red',
        '1991-03-17',
        'Masculino',
        'Estadounidense',
        'HH870476',
        'Domestic Battery Simple',
        'Class A Misdemeanor',
        1.82,
        84.5,
        'Tatuaje de águila en antebrazo derecho, cicatriz en ceja izquierda',
        'C-104',
        'Estable - Sin lesiones evidentes',
        'Leve (Alcohol)',
        'Billetera de cuero, reloj digital Casio, cinturón, llaves, smartphone',
        45.0,
        'Detenido',
        'Restringido',
        'Permitido (1 llamada)',
        'No',
        datetime(2027, 1, 1, 0, 30, 0),
        None,
        203,  # id_sospechoso
        ''
    )]
    client.execute("""
        INSERT INTO ingreso_celda (
            id_ingreso, id_oficial, nombre_detenido, alias, fecha_nacimiento, genero, nacionalidad,
            id_incidente_asociado, cargo_principal, gravedad_cargo, estatura, peso, senas_particulares,
            numero_celda, estado_salud, nivel_intoxicacion, articulos_retenidos, dinero_retenido,
            custodia_estado, permiso_visitas, permiso_llamadas, permiso_patio, hora_ingreso, hora_salida,
            id_sospechoso, motivo_salida
        ) VALUES
    """, celda_data)

    # Detained logs in cell
    bitacora_data = [
        ('LOG-B03-1', 'BOOK-2027-003', 'Ingreso y Registro', 'Detenido ingresado a celda C-104 tras revisión corporal y retención de pertenencias.', datetime(2027, 1, 1, 0, 35, 0)),
        ('LOG-B03-2', 'BOOK-2027-003', 'Llamada Telefónica', 'El detenido realizó llamada reglamentaria de 5 minutos a su abogado defensor.', datetime(2027, 1, 1, 2, 0, 0)),
        ('LOG-B03-3', 'BOOK-2027-003', 'Revisión Médica', 'Evaluación de signos vitales por enfermería de guardia, parámetros normales.', datetime(2027, 1, 1, 6, 0, 0))
    ]
    client.execute("INSERT INTO bitacora_detenido (id_log, id_ingreso, tipo_accion, descripcion, fecha_hora) VALUES", bitacora_data)

    # 11. Judicial order for HH870476
    print("Insertando orden judicial vinculada...")
    orden_data = [(
        201,
        'Orden de Proteccion de Emergencia',
        'Hon. Sarah Jenkins',
        'Cook County Domestic Relations Court',
        'Violencia Domestica y Agresion Simple',
        date(2027, 1, 1),
        date(2027, 7, 1),
        'Marcus Sterling',
        'IL-4419820',
        'HH870476',
        '',
        'Activa',
        datetime(2027, 1, 1, 16, 0, 0)
    )]
    client.execute("""
        INSERT INTO orden_judicial (
            id, tipo_orden, juez_emisor, tribunal, cargos, fecha_emision, fecha_vencimiento,
            sospechoso_nombre, sospechoso_identificacion, expediente_vinculado, documento_pdf, estado, fecha_creacion
        ) VALUES
    """, orden_data)

    print("\n¡Sembrado de datos para los 3 primeros casos completado con total éxito!")

if __name__ == '__main__':
    run()
