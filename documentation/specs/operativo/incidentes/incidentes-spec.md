# 📋 Especificación OpenSpec Completa: Módulo de Gestión de Incidentes Policiales y Despacho CAD

---

## 🎨 1. Sistema de Diseño e Identidad Visual Exacta (UI/UX)

### 1.1 Tipografía
* **Tipografía Principal:** `'Inter'` (sans-serif) para todos los textos, encabezados y etiquetas.
* **Tipografía Monoespaciada:** `'JetBrains Mono'` para datos tabulares, folios y códigos (clase `font-data-mono`).
* **Escalas de Tamaño Tipográfico:**
  - `text-display-lg`: `32px`, `font-weight: 700`, `letter-spacing: -0.02em`
  - `text-headline-md`: `24px`, `font-weight: 600`
  - `text-headline-sm`: `18px`, `font-weight: 600`
  - `text-body-lg`: `16px`, `font-weight: 400`
  - `text-body-md`: `14px`, `font-weight: 400`
  - `text-body-sm`: `13px`, `font-weight: 400`
  - `text-label-caps`: `11px`, `font-weight: 700`, `letter-spacing: 0.05em`, `uppercase`
  - `text-data-mono`: `12px`, `font-weight: 500`

### 1.2 Paleta de Colores (Tokens Exactos de Tailwind `tailwind.config.js`)
| Token CSS / Tailwind | Hex | Uso |
|---|---|---|
| `primary` | `#00173d` | Color primario, botón de crear, badges activos, paginación activa |
| `primary-container` | `#0b2b5e` | Botón destacado "Registrar Nuevo Incidente", fondo del sidebar |
| `on-primary` | `#ffffff` | Texto sobre fondo primario |
| `on-primary-container` | `#7b94cd` | Texto sobre primary-container |
| `background` / `surface` | `#f7f9fb` | Fondo general de la aplicación |
| `surface-bright` | `#f7f9fb` | Fondo de inputs |
| `surface-container-lowest` | `#ffffff` | Fondo de tarjetas KPI y tabla de datos |
| `surface-container-low` | `#f2f4f6` | Fondo del encabezado de tabla (thead sticky) |
| `surface-container` | `#eceef0` | Fondo de contenedores intermedios |
| `surface-variant` | `#e0e3e5` | Hover sobre filas de tabla |
| `on-surface` | `#191c1e` | Texto principal sobre fondo claro |
| `on-surface-variant` | `#44474f` | Texto secundario, subtítulos, labels de filtros |
| `on-background` | `#191c1e` | Texto sobre el fondo base |
| `secondary` | `#505f76` | Texto de hora, ubicación, patrulla |
| `secondary-container` | `#d0e1fb` | Badge "Arresto Efectuado" |
| `on-secondary-container` | `#54647a` | Texto sobre badge de arresto |
| `tertiary` | `#0d182a` | KPI de Investigaciones Activas |
| `tertiary-container` | `#222d3f` | Badge de severidad ALTA |
| `on-tertiary-container` | `#8994aa` | Texto sobre tertiary-container |
| `error` | `#ba1a1a` | KPI de "Tipo Predominante", alertas críticas |
| `error-container` | `#ffdad6` | Badge "En Investigación" |
| `on-error-container` | `#93000a` | Texto sobre badge de investigación |
| `outline` | `#747780` | Bordes intermedios |
| `outline-variant` | `#c4c6d1` | Bordes de tarjetas, tabla, inputs y filtros |

### 1.3 Layout y Espaciado
* **Spacing:** `xs: 4px`, `sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`.
* **Border Radius:** `0.125rem` (default), `lg: 0.25rem`, `xl: 0.5rem`, `full: 0.75rem`.
* **Iconografía:** Google Material Symbols (`material-symbols-outlined`), no Material Icons.

---

## ⚙️ 2. Operaciones CRUD Completas

### ➕ 2.1 CREATE: Registro de Nuevo Incidente (`/incidents/new`)
**Componente:** `IncidentCreateComponent` (`incident-create.ts` / `incident-create.html`)
**CSS compartido:** `incident-form.css`

#### Campos del Formulario:
| Campo | Tipo | Obligatorio | Detalle |
|---|---|---|---|
| `case_number` | String | Auto | Se autogenera con `NextCaseNumberView` → formato `JB-XXXXXX` |
| `date` | DateTime | Sí | Selector de fecha y hora |
| `block` | String | Sí | Dirección física (autocompletada por geocodificación inversa) |
| `primary_type` | String | Sí | **Combobox buscable** con 20 tipos penales (BATTERY, THEFT, HOMICIDE, etc.) |
| `description` | String | No | Descripción del hecho criminal |
| `location_description` | String | Sí | **Combobox buscable** con 14 tipos de lugar (STREET, APARTMENT, RESIDENCE, etc.) |
| `district` | String | Sí | **Combobox buscable** de 22 distritos (001 al 025, sin 013, 021, 023) |
| `ward` | String | No | Ward / Barrio |
| `beat` | String | No | Cuadrante policial |
| `community_area` | String | No | Zona comunitaria |
| `iucr` | String | Sí | **Buscador predictivo IUCR** con 23 códigos penales precargados (ej. `0110` → HOMICIDE FIRST DEGREE MURDER → FBI 01A) |
| `fbi_code` | String | Auto | Se autocompleta al seleccionar el código IUCR |
| `latitude` | Float64 | Sí | Se captura al hacer clic en el mapa Leaflet o por GPS del navegador |
| `longitude` | Float64 | Sí | Se captura al hacer clic en el mapa Leaflet o por GPS del navegador |
| `arrest` | Boolean | No | Checkbox: ¿Hubo arresto inmediato? |
| `domestic` | Boolean | No | Checkbox: ¿Fue violencia doméstica? |
| `officers_assigned` | String[] | No | **Combobox multi-selección buscable** de oficiales disponibles (nombre + placa) |
| `patrol_assigned` | String | No | **Combobox buscable** de vehículos/patrullas de flota (ej. `CPD-001 (SUV Patrol)`) |
| `police_report_text` | String | No | Textarea del reporte policial narrativo |
| `police_report_file` | File | No | Archivo PDF del reporte (se sube a Supabase S3 bucket `Documentos-PDF`) |

#### Mapa Interactivo (Modal Leaflet):
* **Tile Layer:** OpenStreetMap tiles con tema oscuro.
* **Centro Inicial:** Chicago (lat: `41.8781`, lng: `-87.6298`), zoom 11.
* **Interacción:** Click en mapa → pin azul personalizado → geocodificación inversa via Nominatim para completar `block`.
* **Buscador de Calle:** Input con debounce de 300ms → query a `nominatim.openstreetmap.org` → lista de sugerencias → flyTo con zoom 17.
* **Marcador Personalizado:** `L.divIcon` con icono `location_on` en azul primario con sombra CSS `box-shadow`.

#### Persistencia Atómica (Backend):
1. Resuelve `catalogo_ubicacion` → obtiene o crea `id_ubicacion`.
2. Resuelve `estacion_policial` → obtiene o crea `id_estacion`.
3. Resuelve `codigo_penal` → obtiene o crea `id_codigo` con IUCR y FBI.
4. `INSERT INTO chicago_crimes` con nuevo `id` autoincremental.
5. `INSERT INTO incidente_delito` vinculando `case_number` con clasificación.

---

### 📋 2.2 READ: Listado Masivo con 4 KPI Cards, 5 Filtros y Paginación (`/incidents`)
**Componente:** `IncidentsComponent` (`incidents.ts` / `incidents.html`)

#### Encabezado de Página:
* **Título:** "Registros de Incidentes" (clase `font-display-lg text-display-lg text-primary`).
* **Subtítulo:** "Gestione y revise todas las bitácoras y registros de eventos policiales." (clase `font-body-md text-body-md text-secondary`).
* **Botón Registrar Nuevo:** "Registrar Nuevo Incidente" → navega a `/incidents/new` (clase `bg-primary-container text-on-primary`).
* **Botón Solicitudes (Solo Sheriff/Administrador):** "Solicitudes de Asignación" con badge numérico animado (`animate-pulse`) de solicitudes pendientes.

#### 4 Bento KPI Cards (Grid `grid-cols-2 lg:grid-cols-4`):
1. **Total Registrado** — `pagination.total` → icono `folder_open`, color `text-primary`.
2. **Investigaciones Activas** — `activeCount` (incidentes sin arresto) → icono `pending_actions`, color `text-tertiary`.
3. **Cerrados (Con Arresto)** — `closedCount` (incidentes con `arrest=1`) → icono `check_circle`, color `text-secondary`.
4. **Tipo Predominante** — Tipo penal con mayor frecuencia en la página → icono `warning`, color `text-error`.

#### Barra de 5 Filtros + Buscador (Comboboxes Buscables):
1. **Buscador de Texto (`search`):** Input con icono de lupa, con debounce de 400ms vía `Subject` de RxJS (`debounceTime(400), distinctUntilChanged()`). Busca por case_number, block o tipo.
2. **Unidad de Patrulla (`patrol`):** Combobox buscable que carga dinámicamente las patrullas desde `LogisticsService.getVehicles()` y `getPatrolShifts()`. Default: "Todas las Patrullas". Cada opción muestra placa + tipo vehículo.
3. **Estado (`status`):** Combobox buscable con 4 opciones: `Todos los Estados`, `Solo Activos (En Investigación)`, `Solo Cerrados (Arresto Efectuado)`, `Alta Prioridad Sin Resolver`.
4. **Distrito (`district`):** Combobox buscable con 22 distritos de Chicago (cargados dinámicamente desde `CategoryService.getCategories('district')`). Default: "Todos los Distritos".
5. **Tipo de Delito (`type`):** Combobox buscable con 18+ categorías penales (cargadas desde `CategoryService.getCategories('primary_type')`). Default: "Todos los Tipos". Incluye: HOMICIDE, BATTERY, THEFT, CRIMINAL DAMAGE, NARCOTICS, ASSAULT, BURGLARY, MOTOR VEHICLE THEFT, ROBBERY, DECEPTIVE PRACTICE, WEAPONS VIOLATION, CRIMINAL TRESPASS, PROSTITUTION, SEX OFFENSE, PUBLIC PEACE VIOLATION, KIDNAPPING, ARSON.

**Comportamiento de cada Combobox:** Input con placeholder → `(focus)` abre dropdown → `(input)` filtra en tiempo real → click en opción la selecciona y cierra dropdown → botón "X" limpia la selección → backdrop invisible cierra el dropdown al hacer clic fuera.

#### Tabla de Datos (7 Columnas):
| Columna | Clase CSS | Contenido |
|---|---|---|
| **ID** | `font-data-mono text-xs text-primary font-semibold` | `#{{ case_number }}` |
| **Fecha y Hora** | Dos líneas: fecha `font-body-sm text-xs font-semibold` + hora `text-[11px] text-secondary font-mono` | `{{ date | date:'d MMM, y' }}` / `{{ date | date:'HH:mm' }} hrs` |
| **Tipo Principal** | `font-body-sm text-xs text-on-surface font-semibold tracking-wide` | `{{ primary_type }}` |
| **Ubicación** | `font-body-sm text-xs text-secondary truncate max-w-[170px]` | `{{ block }}` |
| **Patrulla Asignada** | Con icono `directions_car` + texto truncado | `{{ patrol_assigned || 'Sin Asignar' }}` |
| **Distrito** | `text-xs text-on-surface` | `Distrito {{ district }}` |
| **Estado** | Badge `rounded-md text-[10px] uppercase font-bold tracking-wider` | Si `arrest` → `bg-secondary-container text-on-secondary-container` "Arresto Efectuado" / Si no → `bg-error-container text-on-error-container` "En Investigación" |

* **Fila interactiva:** `(click)="viewIncident(case_number)"` → navega a detalle con caché previa vía `IncidentCacheService`.
* **Thead sticky:** `sticky top-0 bg-surface-container-low z-10`.

#### Paginación:
* **Texto inferior:** "Mostrando X a Y de Z resultados".
* **Navegación:** Botones Anterior / Número de Página / Siguiente con botón activo en `bg-primary text-on-primary`. 10 registros por página.

#### Modal de Solicitudes de Asignación (Solo Administrador/Sheriff):
* **Trigger:** Botón "Solicitudes de Asignación" con badge rojo `bg-error animate-pulse`.
* **Modal:** Backdrop blur (`bg-black/60 backdrop-blur-md`), tabla con columnas: Número de Caso, Solicitado Por, Fecha, Acciones (Aprobar/Rechazar).
* **Servicio:** `InvestigacionEspecialService.obtenerSolicitudes('Pendiente')`.

---

### 👁️ 2.3 READ: Expediente Detallado del Caso (`/incidents/:caseNumber`)
**Componente:** `IncidentDetailComponent` (`incident-detail.ts` / `incident-detail.html`)

#### Funcionalidades:
* **Cache-first loading:** Usa `IncidentCacheService` para mostrar datos instantáneamente y luego enriquece con llamada a la API en segundo plano (`fetchFullDetail()`).
* **Clasificación de Severidad Automática:**
  - `CRITICAL`: HOMICIDE, ASSAULT, ROBBERY, KIDNAPPING, ARSON, BATTERY → badge `bg-error-container text-on-error-container`.
  - `HIGH`: BURGLARY, MOTOR VEHICLE THEFT, WEAPONS VIOLATION, SEX OFFENSE → badge `bg-tertiary-container text-on-tertiary-container`.
  - `MODERATE`: Resto → badge `bg-secondary-container text-on-secondary-container`.
* **Tabla de Códigos FBI:** Mapa de 17 códigos FBI con traducciones al español (ej. `01A` → "Homicidio / Asesinato No Negligente").
* **Lightbox Modal:** Visor de imágenes de evidencia a pantalla completa.
* **Toast Notifications:** Sistema de notificaciones temporales (4 segundos) con tipos `success` y `error`.

#### Acciones del Expediente:
1. **Agregar Nota de Seguimiento:** Textarea + botón → `POST /incidents/:caseNumber/logs/` → se agrega al timeline local instantáneamente (prepend).
2. **Editar Expediente:** Navega a `/incidents/:caseNumber/edit` con caché.
3. **Eliminar / Anular Expediente:** Modal de confirmación → `DELETE /incidents/:caseNumber/` (soft delete en backend).
4. **Asignar Detective:** Modal con combobox buscable de oficiales (filtra por nombre, apellido o placa). Solo asigna oficiales con `current_status === 'Available'`.
5. **Solicitar Asignación (Detective):** Envía solicitud a la jefatura para que el Sheriff apruebe.
6. **Escalar Investigación:** Promueve el caso a investigación especial.
7. **Cerrar Investigación:** Requiere informe final obligatorio (textarea).
8. **Reabrir Investigación:** Requiere motivo o nueva evidencia.
9. **Descargar Reporte PDF:** Genera y descarga `Reporte_Caso_{caseNumber}.pdf` vía `InvestigacionEspecialService.downloadCaseReport()`.

#### Pestañas del Expediente:
1. **Bitácora de Seguimiento (`seguimiento_incidente`):** Timeline cronológico inmutable con fecha, oficial y acción.
2. **Evidencias (`evidencia`):** Fotos forenses en Supabase S3 con visor lightbox.
3. **Testigos (`testigo`):** Declaraciones con soporte de testigos anónimos.
4. **Víctimas (`victima`):** Fichas de personas afectadas.
5. **Sospechosos (`sospechoso`):** Perfiles de imputados.
6. **Personas Desaparecidas (`rrhh_persona_desaparecida`):** Fichas vinculadas.
7. **Vehículos Sospechosos (`vehiculo_sospechoso`):** Placas y descripciones.

---

### ✏️ 2.4 UPDATE: Edición de Expedientes (`/incidents/:caseNumber/edit`)
**Componente:** `IncidentEditComponent` (`incident-edit.ts` / `incident-edit.html`)
**CSS compartido:** `incident-form.css`

* Misma estructura de formulario que CREATE pero con datos precargados desde `IncidentCacheService` o API.
* Incluye el mismo mapa Leaflet para reubicar coordenadas.
* `PUT /api/operativa/incidents/:caseNumber/` para persistir cambios.

---

### 🗑️ 2.5 DELETE: Anulación Lógica (Soft Delete)
* **Modal de Confirmación:** Pregunta "¿Está seguro de que desea eliminar este expediente?"
* **Backend:** `DELETE /api/operativa/incidents/:caseNumber/` ejecuta borrado lógico, nunca `DELETE FROM chicago_crimes` físico.
* **En caso de error:** Se muestra `deleteError` en el modal.

---

## 📡 3. Consola CAD 911 de Despacho de Emergencias
**Componentes:** `EmergencyDispatchComponent`, `EmergencyHistoryComponent`
**Tabla:** `llamada_emergencia`

* **CRUD de Llamadas:** `GET /api/operativa/emergency-calls/`, `POST`, estado, despacho.
* **Despacho:** `POST /api/operativa/emergency-calls/:call_id/dispatch/` — asigna patrulla y crea incidente vinculado automáticamente en `chicago_crimes`.
* **KPIs:** Total llamadas hoy, pendientes, despachadas, en sitio, resueltas, tiempos promedio de despacho y llegada.
* **Cambio de Estado:** `POST /api/operativa/emergency-calls/:call_id/status/` → pendiente, despachado, en_sitio, resuelto.
* **Enlace a Caso:** `POST /api/operativa/emergency-calls/:call_id/link/`.
* **Historial:** `GET /api/operativa/emergency-calls/history/` con paginación y filtros.

---

## 🗄️ 4. Esquema Completo de Base de Datos ClickHouse

### 4.1 Tablas Core del Módulo
```sql
CREATE TABLE chicago_crimes (
    id UInt64, case_number String, date DateTime, block String, description String,
    iucr String, arrest UInt8, domestic UInt8, beat String, district String,
    ward String, community_area String, latitude Float64, longitude Float64,
    x_coordinate Float64, y_coordinate Float64, year UInt16,
    officers_assigned String, patrol_assigned String,
    police_report_text String, police_report_file String
) ENGINE = MergeTree() ORDER BY (date, case_number);

CREATE TABLE incidente_delito (
    id_incidente_delito UInt32, case_number String,
    es_delito_primario UInt8, estado_climatico String, detonacion_armas UInt8
) ENGINE = MergeTree() ORDER BY id_incidente_delito;

CREATE TABLE seguimiento_incidente (
    id_seguimiento UInt32, case_number String, fecha_registro DateTime,
    estado_caso String, descripcion_avance String, id_oficial UInt32
) ENGINE = MergeTree() ORDER BY (fecha_registro, case_number);

CREATE TABLE llamada_emergencia (
    id_llamada UInt32, nombre_informante String, telefono_informante String,
    tipo_incidente String, direccion String, descripcion_inicial String,
    nivel_prioridad UInt8, latitud Float64, longitud Float64, estado String,
    patrulla_asignada Nullable(String), fecha_hora_llamada DateTime,
    tiempo_despacho Nullable(DateTime), tiempo_llegada Nullable(DateTime),
    numero_caso_vinculado Nullable(String)
) ENGINE = MergeTree() ORDER BY (fecha_hora_llamada, nivel_prioridad);
```

### 4.2 Tablas de Catálogo (Normalización)
```sql
CREATE TABLE codigo_penal (
    id_codigo UInt32, codigo_iucr String, codigo_fbi String, gravedad_delito String
) ENGINE = MergeTree() ORDER BY id_codigo;

CREATE TABLE catalogo_ubicacion (
    id_ubicacion UInt32, descripcion_lugar String, es_espacio_publico UInt8
) ENGINE = MergeTree() ORDER BY id_ubicacion;

CREATE TABLE estacion_policial (
    id_estacion UInt32, nombre_estacion String, numero_distrito UInt32, direccion String
) ENGINE = MergeTree() ORDER BY id_estacion;
```

### 4.3 Tablas de Expediente Forense (Vista de Detalle)
```sql
-- Consultadas en IncidentDetailView para el expediente:
-- evidencia, testigo, victima, sospechoso,
-- rrhh_persona_desaparecida, vehiculo_sospechoso,
-- investigacion_especial, solicitud_asignacion_caso
```

---

## 🔌 5. Endpoints REST Completos (Django Backend)

| Método | Ruta | Vista | Descripción |
|---|---|---|---|
| GET | `/api/operativa/dashboard/kpis/` | `DashboardKPIView` | KPIs ejecutivos del Sheriff |
| GET | `/api/operativa/incidents/` | `IncidentListView` | Listado paginado con filtros |
| POST | `/api/operativa/incidents/create/` | `IncidentCreateView` | Creación atómica |
| GET | `/api/operativa/incidents/next-case-number/` | `NextCaseNumberView` | Folio correlativo |
| GET | `/api/operativa/incidents/geocode/` | `GeocodeProxyView` | Geocodificación inversa |
| GET | `/api/operativa/incidents/patrol/` | `PatrolIncidentsReportView` | Reporte por patrulla |
| GET | `/api/operativa/incidents/:cn/` | `IncidentDetailView` | Expediente completo |
| PUT | `/api/operativa/incidents/:cn/` | `IncidentDetailView` | Actualizar expediente |
| DELETE | `/api/operativa/incidents/:cn/` | `IncidentDetailView` | Soft delete |
| POST | `/api/operativa/incidents/:cn/logs/` | `IncidentLogCreateView` | Agregar nota bitácora |
| GET | `/api/operativa/emergency-calls/` | `EmergencyCallCRUDView` | Listado llamadas 911 |
| POST | `/api/operativa/emergency-calls/` | `EmergencyCallCRUDView` | Crear llamada |
| GET | `/api/operativa/emergency-calls/history/` | `EmergencyCallHistoryView` | Historial |
| GET | `/api/operativa/emergency-calls/kpis/` | `EmergencyCallKPIsView` | KPIs despacho |
| POST | `/api/operativa/emergency-calls/:id/dispatch/` | `EmergencyCallDispatchView` | Despachar patrulla |
| POST | `/api/operativa/emergency-calls/:id/status/` | `EmergencyCallStatusUpdateView` | Cambiar estado |
| POST | `/api/operativa/emergency-calls/:id/link/` | `EmergencyCallLinkIncidentView` | Vincular caso |

---

## 🔐 6. Servicios Angular y Dependencias

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

## ⚡ 7. Criterios de Rendimiento y Calidad (SLAs)
* **SLA de Consulta Analítica ClickHouse:** < 800ms sobre +300,000 registros.
* **Debounce de Búsqueda:** 400ms para evitar sobrecargar el backend con tecleo rápido.
* **Cache-First Loading:** El detalle del incidente se muestra instantáneamente desde la caché del listado.
* **Autenticación:** JWT (`SafeCityJWTAuthentication`) + control RBAC (`oficial`, `detective`, `operador_emergencias`, `administrador`).
* **Conexión ClickHouse:** `localhost:9000` (nativo), user `default`, password `password12345`.
