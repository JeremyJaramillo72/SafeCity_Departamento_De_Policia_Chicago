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
