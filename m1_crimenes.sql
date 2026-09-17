CREATE TABLE chicago_crimes (
    case_number VARCHAR(255) PRIMARY KEY,
    date TIMESTAMP,
    block VARCHAR(255),
    iucr VARCHAR(50),
    id_ubicacion INT,
    arrest BOOLEAN,
    domestic BOOLEAN,
    beat VARCHAR(50),
    district VARCHAR(50),
    ward VARCHAR(50),
    community_area VARCHAR(50),
    x_coordinate DECIMAL(15,2),
    y_coordinate DECIMAL(15,2),
    year INT,
    updated_on TIMESTAMP,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    FOREIGN KEY (iucr) REFERENCES codigo_penal(iucr),
    FOREIGN KEY (id_ubicacion) REFERENCES catalogo_ubicacion(id_ubicacion)
);

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

CREATE TABLE rol_oficial (
    id_rol INT PRIMARY KEY,
    nombre_rol VARCHAR(100),
    descripcion TEXT
);

CREATE TABLE estacion_policial (
    id_estacion INT PRIMARY KEY,
    nombre_estacion VARCHAR(255),
    direccion VARCHAR(255),
    numero_celdas INT,
    oficial_encargado INT,
    FOREIGN KEY (oficial_encargado) REFERENCES oficial_policia(id_oficial)
);
