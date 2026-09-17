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
    longitude DECIMAL(10,6)
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

CREATE TABLE banda_criminal (
    id_banda INT PRIMARY KEY,
    nombre_banda VARCHAR(255),
    zona_operacion VARCHAR(255),
    nivel_peligrosidad VARCHAR(50)
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

CREATE TABLE estacion_policial (
    id_estacion INT PRIMARY KEY,
    nombre_estacion VARCHAR(255),
    direccion VARCHAR(255),
    numero_celdas INT,
    oficial_encargado INT,
    FOREIGN KEY (oficial_encargado) REFERENCES oficial_policia(id_oficial)
);
