CREATE TABLE codigo_penal (
    iucr VARCHAR(50) PRIMARY KEY,
    codigo_fbi VARCHAR(50),
    gravedad_delito VARCHAR(100)
);

CREATE TABLE catalogo_ubicacion (
    id_ubicacion INT PRIMARY KEY,
    descripcion_lugar VARCHAR(255),
    es_espacio_publico BOOLEAN
);

CREATE TABLE rol_oficial (
    id_rol INT PRIMARY KEY,
    nombre_rol VARCHAR(100),
    descripcion TEXT
);

CREATE TABLE oficial_policia (
    id_oficial INT PRIMARY KEY,
    placa_policial VARCHAR(50),
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    correo_electronico VARCHAR(100),
    telefono_contacto VARCHAR(50),
    fecha_ingreso DATE,
    id_rol INT,
    fotografia VARCHAR(255),
    FOREIGN KEY (id_rol) REFERENCES rol_oficial(id_rol)
);

CREATE TABLE chicago_crimes (
    id BIGINT,
    case_number VARCHAR(255) PRIMARY KEY,
    date TIMESTAMP,
    block VARCHAR(255),
    description VARCHAR(255),
    id_ubicacion INT,
    arrest BOOLEAN,
    domestic BOOLEAN,
    beat VARCHAR(50),
    id_estacion INT,
    ward VARCHAR(50),
    community_area VARCHAR(50),
    x_coordinate DECIMAL(15,2),
    y_coordinate DECIMAL(15,2),
    year INT,
    updated_on TIMESTAMP,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    officers_assigned TEXT,
    patrol_assigned VARCHAR(255),
    police_report_text TEXT,
    police_report_file VARCHAR(255),
    FOREIGN KEY (id_ubicacion) REFERENCES catalogo_ubicacion(id_ubicacion),
    FOREIGN KEY (id_estacion) REFERENCES estacion_policial(id_estacion)
);

CREATE TABLE incidente_delito (
    id_incidente_delito INT PRIMARY KEY,
    case_number VARCHAR(255),
    es_delito_primario BOOLEAN,
    estado_climatico VARCHAR(100),
    detonacion_armas BOOLEAN,
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number)
);

CREATE TABLE seguimiento_incidente (
    id_seguimiento INT PRIMARY KEY,
    case_number VARCHAR(255),
    fecha_registro TIMESTAMP,
    estado_caso VARCHAR(100),
    descripcion_avance TEXT,
    id_oficial INT,
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE caso_judicial (
    id_caso_judicial INT PRIMARY KEY,
    case_number VARCHAR(255),
    juzgado_asignado VARCHAR(255),
    fecha_audiencia DATE,
    veredicto VARCHAR(255),
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number)
);

CREATE TABLE testigo (
    id_testigo INT PRIMARY KEY,
    case_number VARCHAR(255),
    nombre VARCHAR(255),
    identificacion VARCHAR(100),
    genero VARCHAR(50),
    telefono VARCHAR(50),
    direccion VARCHAR(255),
    testimonio TEXT,
    es_anonimo BOOLEAN,
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number)
);

CREATE TABLE victima (
    id_victima INT PRIMARY KEY,
    case_number VARCHAR(255),
    nombre VARCHAR(255),
    identificacion VARCHAR(100),
    genero VARCHAR(50),
    telefono VARCHAR(50),
    direccion VARCHAR(255),
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number)
);

CREATE TABLE banda_criminal (
    id_banda INT PRIMARY KEY,
    nombre_banda VARCHAR(255),
    zona_operacion VARCHAR(255),
    nivel_peligrosidad VARCHAR(50)
);

CREATE TABLE sospechoso (
    id_sospechoso INT PRIMARY KEY,
    case_number VARCHAR(255),
    nombre VARCHAR(255),
    identificacion VARCHAR(100),
    genero VARCHAR(50),
    telefono VARCHAR(50),
    direccion VARCHAR(255),
    alias_conocido VARCHAR(255),
    fecha_nacimiento DATE,
    antecedentes BOOLEAN,
    observacion TEXT,
    id_banda INT,
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number),
    FOREIGN KEY (id_banda) REFERENCES banda_criminal(id_banda)
);

CREATE TABLE investigacion_especial (
    id_investigacion INT PRIMARY KEY,
    case_number VARCHAR(255),
    id_detective INT,
    prioridad_mayor INT,
    estado VARCHAR(100),
    reporte_final TEXT,
    fecha_asignacion DATE,
    fecha_resolucion DATE,
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number),
    FOREIGN KEY (id_detective) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE evidencia (
    id_evidencia INT PRIMARY KEY,
    case_number VARCHAR(255),
    tipo_evidencia VARCHAR(100),
    fecha_recoleccion TIMESTAMP,
    id_oficial INT,
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE vehiculo_patrulla (
    id_vehiculo INT PRIMARY KEY,
    codigo_flota VARCHAR(50),
    placa_vehiculo VARCHAR(50),
    tipo_vehiculo VARCHAR(100),
    estado_mantenimiento VARCHAR(100)
);

CREATE TABLE turno_patrullaje (
    id_turno INT PRIMARY KEY,
    id_oficial INT,
    id_vehiculo INT,
    fecha_turno DATE,
    hora_inicio VARCHAR(50),
    hora_fin VARCHAR(50),
    ruta_coordenadas TEXT,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo_patrulla(id_vehiculo)
);

CREATE TABLE llamada_emergencia (
    id_llamada INT PRIMARY KEY,
    case_number VARCHAR(255),
    fecha_hora_llamado TIMESTAMP,
    telefono_origen VARCHAR(50),
    id_oficial_despacho INT,
    nivel_prioridad VARCHAR(50),
    nivel_triage VARCHAR(50),
    descripcion_inicial TEXT,
    estado VARCHAR(100),
    latitud DECIMAL(10,6),
    longitud DECIMAL(10,6),
    direccion VARCHAR(255),
    tiempo_llegada TIMESTAMP,
    tiempo_resolucion TIMESTAMP,
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number),
    FOREIGN KEY (id_oficial_despacho) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE usuario_sistema (
    id_usuario INT PRIMARY KEY,
    id_oficial INT,
    username VARCHAR(100),
    password_hash VARCHAR(255),
    estado_cuenta VARCHAR(50),
    ultimo_acceso TIMESTAMP,
    intentos_fallidos INT,
    cuenta_bloqueada BOOLEAN,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE historial_sesion (
    id_sesion INT PRIMARY KEY,
    id_usuario INT,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    direccion_ip VARCHAR(50),
    dispositivo VARCHAR(100),
    FOREIGN KEY (id_usuario) REFERENCES usuario_sistema(id_usuario)
);

CREATE TABLE auditoria_sistema (
    id_auditoria INT PRIMARY KEY,
    nombre_tabla VARCHAR(100),
    operacion VARCHAR(50),
    id_usuario INT,
    fecha_hora TIMESTAMP,
    registro_afectado VARCHAR(255),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    detalles_adicionales TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario_sistema(id_usuario)
);

CREATE TABLE registro_respaldo (
    id_respaldo INT PRIMARY KEY,
    id_usuario INT,
    fecha_ejecucion TIMESTAMP,
    tipo_respaldo VARCHAR(100),
    ruta_archivo VARCHAR(255),
    tamano_mb DECIMAL(10,2),
    estado VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuario_sistema(id_usuario)
);

CREATE TABLE equipamiento_oficial (
    id_equipo INT PRIMARY KEY,
    id_oficial INT,
    tipo_equipo VARCHAR(100),
    numero_serie VARCHAR(100),
    fecha_asignacion DATE,
    estado VARCHAR(50),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE estacion_policial (
    id_estacion INT PRIMARY KEY,
    nombre_estacion VARCHAR(255),
    direccion VARCHAR(255),
    numero_celdas INT,
    oficial_encargado INT,
    FOREIGN KEY (oficial_encargado) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE descarga_taser (
    id_descarga INT PRIMARY KEY,
    id_oficial INT,
    case_number VARCHAR(255),
    fecha_descarga TIMESTAMP,
    voltaje VARCHAR(50),
    cartuchos_usados INT,
    motivo TEXT,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial),
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number)
);

CREATE TABLE fotografia_evidencia (
    id_foto INT PRIMARY KEY,
    id_evidencia INT,
    ruta_supabase_url VARCHAR(255),
    fecha_captura TIMESTAMP,
    resolucion VARCHAR(50),
    metadata_gps VARCHAR(255),
    FOREIGN KEY (id_evidencia) REFERENCES evidencia(id_evidencia)
);

CREATE TABLE caracteristica_fisica_tatuaje (
    id_caracteristica INT PRIMARY KEY,
    id_sospechoso INT,
    tipo VARCHAR(100),
    zona_cuerpo VARCHAR(100),
    descripcion_detallada TEXT,
    fotografia_url VARCHAR(255),
    FOREIGN KEY (id_sospechoso) REFERENCES sospechoso(id_sospechoso)
);

CREATE TABLE vehiculo_sospechoso (
    id_vehiculo_sospechoso INT PRIMARY KEY,
    case_number VARCHAR(255),
    placa VARCHAR(50),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    color VARCHAR(50),
    estado_reporte VARCHAR(100),
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number)
);

CREATE TABLE interrogatorio_audio (
    id_audio INT PRIMARY KEY,
    case_number VARCHAR(255),
    id_oficial INT,
    id_sospechoso INT,
    ruta_supabase_url VARCHAR(255),
    duracion VARCHAR(50),
    fecha_grabacion TIMESTAMP,
    FOREIGN KEY (case_number) REFERENCES chicago_crimes(case_number),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial),
    FOREIGN KEY (id_sospechoso) REFERENCES sospechoso(id_sospechoso)
);

CREATE TABLE cadena_custodia_log (
    id_custodia INT PRIMARY KEY,
    id_evidencia INT,
    id_oficial INT,
    fecha_hora_transferencia TIMESTAMP,
    motivo_transferencia VARCHAR(255),
    firma_digital VARCHAR(255),
    FOREIGN KEY (id_evidencia) REFERENCES evidencia(id_evidencia),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE nota_pericial (
    id_nota INT PRIMARY KEY,
    id_evidencia INT,
    id_oficial INT,
    fecha_nota TIMESTAMP,
    hallazgos TEXT,
    FOREIGN KEY (id_evidencia) REFERENCES evidencia(id_evidencia),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE registro_celdas_booking (
    id_booking INT PRIMARY KEY,
    id_sospechoso INT,
    id_oficial INT,
    id_estacion INT,
    fecha_ingreso TIMESTAMP,
    celda_asignada VARCHAR(50),
    inventario_pertenencias TEXT,
    fecha_liberacion TIMESTAMP,
    FOREIGN KEY (id_sospechoso) REFERENCES sospechoso(id_sospechoso),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial),
    FOREIGN KEY (id_estacion) REFERENCES estacion_policial(id_estacion)
);

CREATE TABLE inspeccion_vehicular_diaria (
    id_inspeccion INT PRIMARY KEY,
    id_vehiculo INT,
    id_oficial INT,
    fecha_inspeccion DATE,
    kilometraje_actual INT,
    nivel_combustible VARCHAR(50),
    presion_neumaticos_psi INT,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo_patrulla(id_vehiculo),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE reporte_dano_carroceria (
    id_dano INT PRIMARY KEY,
    id_vehiculo INT,
    id_oficial INT,
    fecha_reporte TIMESTAMP,
    zona_afectada VARCHAR(100),
    descripcion_dano TEXT,
    fotografia_url VARCHAR(255),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo_patrulla(id_vehiculo),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE ticket_falla_mecanica (
    id_ticket INT PRIMARY KEY,
    id_vehiculo INT,
    id_oficial INT,
    fecha_falla TIMESTAMP,
    descripcion_falla TEXT,
    estado_reparacion VARCHAR(100),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo_patrulla(id_vehiculo),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE registro_asistencia (
    id_asistencia INT PRIMARY KEY,
    id_oficial INT,
    fecha DATE,
    hora_entrada TIMESTAMP,
    hora_salida TIMESTAMP,
    metodo_registro VARCHAR(100),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE asignacion_cuadrante (
    id_asignacion INT PRIMARY KEY,
    id_oficial INT,
    cuadrante_poligono VARCHAR(255),
    turno_asignado VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE solicitud_permiso (
    id_solicitud INT PRIMARY KEY,
    id_oficial INT,
    tipo_permiso VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    motivo TEXT,
    estado_aprobacion VARCHAR(50),
    id_comandante INT,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial),
    FOREIGN KEY (id_comandante) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE evaluacion_desempeno (
    id_evaluacion INT PRIMARY KEY,
    id_oficial INT,
    id_comandante INT,
    fecha_evaluacion DATE,
    puntaje_respuesta INT,
    puntaje_uso_fuerza INT,
    comentarios TEXT,
    firma_oficial BOOLEAN,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial),
    FOREIGN KEY (id_comandante) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE expediente_disciplinario (
    id_expediente INT PRIMARY KEY,
    id_oficial INT,
    fecha_incidente DATE,
    tipo_infraccion VARCHAR(100),
    descripcion_hechos TEXT,
    estado_resolucion VARCHAR(100),
    resolucion_final TEXT,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE certificacion_capacitacion (
    id_certificacion INT PRIMARY KEY,
    id_oficial INT,
    nombre_curso VARCHAR(255),
    fecha_emision DATE,
    fecha_vencimiento DATE,
    estado_vigencia VARCHAR(50),
    documento_url VARCHAR(255),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE infraccion_transito (
    id_infraccion INT PRIMARY KEY,
    id_oficial INT,
    fecha_hora TIMESTAMP,
    ubicacion VARCHAR(255),
    placa_vehiculo VARCHAR(50),
    ley_infringida VARCHAR(255),
    monto_multa DECIMAL(10,2),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE prueba_alcoholemia (
    id_prueba INT PRIMARY KEY,
    id_oficial INT,
    fecha_hora TIMESTAMP,
    placa_vehiculo VARCHAR(50),
    nivel_alcohol_bac DECIMAL(5,2),
    num_serie_alcoholimetro VARCHAR(100),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE despacho_grua (
    id_despacho_grua INT PRIMARY KEY,
    id_oficial INT,
    placa_vehiculo VARCHAR(50),
    compania_grua VARCHAR(255),
    corralon_destino VARCHAR(255),
    motivo_remolque TEXT,
    fecha_hora_llegada TIMESTAMP,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE reunion_comunitaria (
    id_reunion INT PRIMARY KEY,
    id_oficial INT,
    fecha_reunion DATE,
    ubicacion VARCHAR(255),
    temas_tratados TEXT,
    numero_asistentes INT,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE alerta_boton_panico (
    id_alerta INT PRIMARY KEY,
    id_oficial INT,
    fecha_hora_activacion TIMESTAMP,
    coordenadas_gps VARCHAR(255),
    estado_alerta VARCHAR(50),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);
