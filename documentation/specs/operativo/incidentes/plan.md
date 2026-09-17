# 🏗️ Plan de Arquitectura Técnica: Módulo de Incidentes Policiales

---

## 1. Esquema Completo de Base de Datos (ClickHouse)

```sql
-- 1. Tabla Principal de Incidentes (MergeTree Columnar)
CREATE TABLE IF NOT EXISTS chicago_crimes (
    id UInt64,
    case_number String,
    date DateTime,
    block String,
    description String,
    iucr String,
    arrest UInt8,
    domestic UInt8,
    beat String,
    district String,
    ward String,
    community_area String,
    latitude Float64,
    longitude Float64,
    x_coordinate Float64,
    y_coordinate Float64,
    year UInt16,
    officers_assigned String,
    patrol_assigned String,
    police_report_text String,
    police_report_file String
) ENGINE = MergeTree()
ORDER BY (date, case_number);

-- 2. Detalle Delictivo y Factores Contextuales
CREATE TABLE IF NOT EXISTS incidente_delito (
    id_incidente_delito UInt32,
    case_number String,
    es_delito_primario UInt8,
    estado_climatico String,
    detonacion_armas UInt8
) ENGINE = MergeTree()
ORDER BY id_incidente_delito;

-- 3. Bitácora Forense Inmutable de Seguimiento (Append-Only)
CREATE TABLE IF NOT EXISTS seguimiento_incidente (
    id_seguimiento UInt32,
    case_number String,
    fecha_registro DateTime,
    estado_caso String,
    descripcion_avance String,
    id_oficial UInt32
) ENGINE = MergeTree()
ORDER BY (fecha_registro, case_number);

-- 4. Catálogos Normalizados de Soporte
CREATE TABLE IF NOT EXISTS codigo_penal (
    id_codigo UInt32,
    codigo_iucr String,
    codigo_fbi String,
    gravedad_delito String
) ENGINE = MergeTree()
ORDER BY id_codigo;

CREATE TABLE IF NOT EXISTS catalogo_ubicacion (
    id_ubicacion UInt32,
    descripcion_lugar String,
    es_espacio_publico UInt8
) ENGINE = MergeTree()
ORDER BY id_ubicacion;

CREATE TABLE IF NOT EXISTS estacion_policial (
    id_estacion UInt32,
    nombre_estacion String,
    numero_distrito UInt32,
    direccion String
) ENGINE = MergeTree()
ORDER BY id_estacion;

-- 5. Consola CAD de Emergencias 911
CREATE TABLE IF NOT EXISTS llamada_emergencia (
    id_llamada UInt32,
    nombre_informante String,
    telefono_informante String,
    tipo_incidente String,
    direccion String,
    descripcion_inicial String,
    nivel_prioridad UInt8,
    latitud Float64,
    longitud Float64,
    estado String,
    patrulla_asignada Nullable(String),
    fecha_hora_llamada DateTime,
    tiempo_despacho Nullable(DateTime),
    tiempo_llegada Nullable(DateTime),
    numero_caso_vinculado Nullable(String)
) ENGINE = MergeTree()
ORDER BY (fecha_hora_llamada, nivel_prioridad);
```

---

## 2. Especificación de Endpoints REST (Django Backend)

Rutas bajo `/api/operativa/`:
1. `GET /api/operativa/dashboard/kpis/`: KPIs ejecutivos del Sheriff.
2. `GET /api/operativa/incidents/`: 
   * Parámetros de consulta: `page`, `limit`, `search`, `district`, `type`, `patrol`, `status`.
   * Retorna: `{ "total": N, "page": 1, "total_pages": N, "data": [...] }`.
3. `POST /api/operativa/incidents/create/`:
   * Ejecuta: Inserción atómica en `chicago_crimes` e `incidente_delito`.
4. `GET /api/operativa/incidents/next-case-number/`:
   * Genera el siguiente folio atómico `JB-XXXXXX`.
5. `GET /api/operativa/incidents/<case_number>/`:
   * Retorna el expediente forense unificado con testigos, evidencias y bitácora.
6. `PUT /api/operativa/incidents/<case_number>/`:
   * Actualiza un expediente existente.
7. `DELETE /api/operativa/incidents/<case_number>/`:
   * Realiza un soft delete lógico.
8. `POST /api/operativa/incidents/<case_number>/logs/`:
   * Agrega un registro inmutable a `seguimiento_incidente`.
9. `GET /api/operativa/incidents/geocode/?address=<texto>`:
   * Proxy a Nominatim / OpenStreetMap con caché de resultados.
10. `GET /api/operativa/emergency-calls/` (y demás CRUD):
    * Gestión de llamadas 911 y despacho.

---

## 3. Especificación de Componentes y Tokens de Diseño (Angular Frontend)

* **Tokens de Color Tailwind CSS (Reales):**
  - `primary`: `#00173d`
  - `primary-container`: `#0b2b5e`
  - `surface-bright`: `#f7f9fb`
  - `surface-container-lowest`: `#ffffff`
  - `error`: `#ba1a1a`
  - `error-container`: `#ffdad6`
  - `secondary-container`: `#d0e1fb`
* **Tipografía:**
  - Principal: `Inter`
  - Datos Tabulares: `JetBrains Mono`
* **Componentes del Módulo:**
  1. `IncidentsComponent`: Tabla con Bento Cards, paginación, y barra de 5 filtros combobox.
  2. `IncidentCreateComponent`: Formulario reactivo con mapa Leaflet interactivo.
  3. `IncidentDetailComponent`: Expediente completo con 7 pestañas, bitácora y asignación de casos.
  4. `IncidentEditComponent`: Formulario de edición pre-cargado.
  5. `EmergencyDispatchComponent`: Consola CAD 911 en tiempo real.
