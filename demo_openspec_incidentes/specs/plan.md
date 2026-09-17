# 🏗️ Plan de Arquitectura Técnica: Módulo de Incidentes Policiales

---

## 1. Esquema Completo de Base de Datos (ClickHouse)

### 1.1 Tablas Core del Módulo
```sql
CREATE TABLE IF NOT EXISTS chicago_crimes (
    id UInt64, case_number String, date DateTime, block String, description String,
    iucr String, arrest UInt8, domestic UInt8, beat String, district String,
    ward String, community_area String, latitude Float64, longitude Float64,
    x_coordinate Float64, y_coordinate Float64, year UInt16,
    officers_assigned String, patrol_assigned String,
    police_report_text String, police_report_file String
) ENGINE = MergeTree() ORDER BY (date, case_number);

CREATE TABLE IF NOT EXISTS incidente_delito (
    id_incidente_delito UInt32, case_number String,
    es_delito_primario UInt8, estado_climatico String, detonacion_armas UInt8
) ENGINE = MergeTree() ORDER BY id_incidente_delito;

CREATE TABLE IF NOT EXISTS seguimiento_incidente (
    id_seguimiento UInt32, case_number String, fecha_registro DateTime,
    estado_caso String, descripcion_avance String, id_oficial UInt32
) ENGINE = MergeTree() ORDER BY (fecha_registro, case_number);

CREATE TABLE IF NOT EXISTS llamada_emergencia (
    id_llamada UInt32, nombre_informante String, telefono_informante String,
    tipo_incidente String, direccion String, descripcion_inicial String,
    nivel_prioridad UInt8, latitud Float64, longitud Float64, estado String,
    patrulla_asignada Nullable(String), fecha_hora_llamada DateTime,
    tiempo_despacho Nullable(DateTime), tiempo_llegada Nullable(DateTime),
    numero_caso_vinculado Nullable(String)
) ENGINE = MergeTree() ORDER BY (fecha_hora_llamada, nivel_prioridad);
```

### 1.2 Tablas de Catálogo (Normalización)
```sql
CREATE TABLE IF NOT EXISTS codigo_penal (
    id_codigo UInt32, codigo_iucr String, codigo_fbi String, gravedad_delito String
) ENGINE = MergeTree() ORDER BY id_codigo;

CREATE TABLE IF NOT EXISTS catalogo_ubicacion (
    id_ubicacion UInt32, descripcion_lugar String, es_espacio_publico UInt8
) ENGINE = MergeTree() ORDER BY id_ubicacion;

CREATE TABLE IF NOT EXISTS estacion_policial (
    id_estacion UInt32, nombre_estacion String, numero_distrito UInt32, direccion String
) ENGINE = MergeTree() ORDER BY id_estacion;
```

---

## 2. Especificación de Endpoints REST (Django Backend)

| Método | Ruta | Vista | Descripción |
|---|---|---|---|
| GET | `/api/operativa/dashboard/kpis/` | `DashboardKPIView` | KPIs ejecutivos del Sheriff |
| GET | `/api/operativa/incidents/` | `IncidentListView` | Listado paginado con filtros |
| POST | `/api/operativa/incidents/create/` | `IncidentCreateView` | Creación atómica |
| GET | `/api/operativa/incidents/next-case-number/` | `NextCaseNumberView` | Folio correlativo `JB-XXXXXX` |
| GET | `/api/operativa/incidents/geocode/` | `GeocodeProxyView` | Geocodificación inversa |
| GET | `/api/operativa/incidents/patrol/` | `PatrolIncidentsReportView` | Reporte por patrulla |
| GET | `/api/operativa/incidents/:cn/` | `IncidentDetailView` | Expediente completo (forense) |
| PUT | `/api/operativa/incidents/:cn/` | `IncidentDetailView` | Actualizar expediente |
| DELETE | `/api/operativa/incidents/:cn/` | `IncidentDetailView` | Soft delete |
| POST | `/api/operativa/incidents/:cn/logs/` | `IncidentLogCreateView` | Agregar nota a la bitácora |
| GET | `/api/operativa/emergency-calls/` | `EmergencyCallCRUDView` | Listado llamadas 911 |
| POST | `/api/operativa/emergency-calls/` | `EmergencyCallCRUDView` | Crear llamada CAD |
| GET | `/api/operativa/emergency-calls/history/` | `EmergencyCallHistoryView` | Historial CAD |
| GET | `/api/operativa/emergency-calls/kpis/` | `EmergencyCallKPIsView` | KPIs de despacho |
| POST | `/api/operativa/emergency-calls/:id/dispatch/` | `EmergencyCallDispatchView` | Despachar patrulla |
| POST | `/api/operativa/emergency-calls/:id/status/` | `EmergencyCallStatusUpdateView` | Cambiar estado |
| POST | `/api/operativa/emergency-calls/:id/link/` | `EmergencyCallLinkIncidentView` | Vincular caso |

---

## 3. Servicios Angular y Dependencias (Frontend)

| Servicio | Archivo | Uso en el Módulo |
|---|---|---|
| `IncidentService` | `incident.service.ts` | CRUD de incidentes (API `localhost:8000`) |
| `IncidentCacheService` | `incident-cache.service.ts` | Caché en memoria para navegación rápida entre listado y detalle |
| `CategoryService` | `category.service.ts` | Carga dinámica de catálogos (distritos, tipos penales) |
| `LogisticsService` | `logistics.service.ts` | Carga de patrullas/vehículos y oficiales disponibles |
| `InvestigacionEspecialService` | `investigacion-especial.service.ts` | Asignación de casos, escalamiento, cierre, reapertura, reporte PDF |
| `EmergencyService` | `emergency.service.ts` | CRUD de llamadas 911 y despacho CAD |
| `AuthService` | `auth.service.ts` | JWT, roles, ID y nombre del oficial autenticado |

---

## 4. Componentes de UI Core

1. `IncidentsComponent` (`incidents.ts` / `incidents.html`): Tabla con Bento Cards y barra de 5 filtros.
2. `IncidentCreateComponent` (`incident-create.ts` / `incident-create.html`): Formulario reactivo con mapa Leaflet.
3. `IncidentDetailComponent` (`incident-detail.ts` / `incident-detail.html`): Expediente con pestañas forenses y bitácora.
4. `IncidentEditComponent` (`incident-edit.ts` / `incident-edit.html`): Edición controlada con caché.
5. `EmergencyDispatchComponent` (`emergency-dispatch.ts` / `emergency-dispatch.html`): Consola CAD 911 en tiempo real.
