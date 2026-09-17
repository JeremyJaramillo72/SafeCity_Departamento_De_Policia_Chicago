CREATE TABLE oficial_policia (
    id_oficial INT PRIMARY KEY,
    placa_policial VARCHAR(50),
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    correo_electronico VARCHAR(100),
    telefono_contacto VARCHAR(50),
    fecha_ingreso DATE,
    id_rol INT,
    fotografia VARCHAR(255)
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

CREATE TABLE equipamiento_oficial (
    id_equipo INT PRIMARY KEY,
    id_oficial INT,
    tipo_equipo VARCHAR(100),
    numero_serie VARCHAR(100),
    fecha_asignacion DATE,
    estado VARCHAR(50),
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE descarga_taser (
    id_descarga INT PRIMARY KEY,
    id_oficial INT,
    case_number VARCHAR(255),
    fecha_descarga TIMESTAMP,
    voltaje VARCHAR(50),
    cartuchos_usados INT,
    motivo TEXT,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
);

CREATE TABLE evidencia (
    id_evidencia INT PRIMARY KEY,
    case_number VARCHAR(255),
    tipo_evidencia VARCHAR(100),
    fecha_recoleccion TIMESTAMP,
    id_oficial INT,
    FOREIGN KEY (id_oficial) REFERENCES oficial_policia(id_oficial)
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

CREATE TABLE fotografia_evidencia (
    id_foto INT PRIMARY KEY,
    id_evidencia INT,
    ruta_supabase_url VARCHAR(255),
    fecha_captura TIMESTAMP,
    resolucion VARCHAR(50),
    metadata_gps VARCHAR(255),
    FOREIGN KEY (id_evidencia) REFERENCES evidencia(id_evidencia)
);
