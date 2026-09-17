# 📋 Especificación Funcional OpenSpec: Módulo de Gestión de Incidentes y Despacho CAD

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

### 1.2 Paleta de Colores (Tokens Exactos de Tailwind)
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
| `secondary` | `#505f76` | Texto de hora, ubicación, patrulla |
| `secondary-container` | `#d0e1fb` | Badge "Arresto Efectuado" |
| `on-secondary-container` | `#54647a` | Texto sobre badge de arresto |
| `tertiary` | `#0d182a` | KPI de Investigaciones Activas |
| `tertiary-container` | `#222d3f` | Badge de severidad ALTA |
| `on-tertiary-container` | `#8994aa` | Texto sobre tertiary-container |
| `error` | `#ba1a1a` | KPI de "Tipo Predominante", alertas críticas |
| `error-container` | `#ffdad6` | Badge "En Investigación" |
| `on-error-container` | `#93000a` | Texto sobre badge de investigación |
| `outline-variant` | `#c4c6d1` | Bordes de tarjetas, tabla, inputs y filtros |

### 1.3 Layout y Espaciado
* **Spacing:** `xs: 4px`, `sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`.
* **Border Radius:** `0.125rem` (default), `lg: 0.25rem`, `xl: 0.5rem`, `full: 0.75rem`.
* **Iconografía:** Google Material Symbols (`material-symbols-outlined`).

---

## ⚙️ 2. Operaciones CRUD Completas

### ➕ 2.1 CREATE: Registro de Nuevo Incidente (`/incidents/new`)
**Componente:** `IncidentCreateComponent` (`incident-create.ts` / `incident-create.html`)

#### Campos del Formulario:
| Campo | Tipo | Obligatorio | Detalle |
|---|---|---|---|
| `case_number` | String | Auto | Se autogenera → formato `JB-XXXXXX` |
| `date` | DateTime | Sí | Selector de fecha y hora |
| `block` | String | Sí | Dirección física (autocompletada por geocodificación inversa) |
| `primary_type` | String | Sí | **Combobox buscable** con 20 tipos penales |
| `description` | String | No | Descripción del hecho criminal |
| `location_description` | String | Sí | **Combobox buscable** con 14 tipos de lugar |
| `district` | String | Sí | **Combobox buscable** de 22 distritos (001 al 025) |
| `ward` / `beat` / `community_area` | String | No | Datos de zonificación |
| `iucr` | String | Sí | **Buscador predictivo IUCR** con 23 códigos penales |
| `latitude` / `longitude` | Float64 | Sí | Desde el mapa Leaflet o GPS |
| `arrest` / `domestic` | Boolean | No | Checkboxes |
| `officers_assigned` | String[] | No | **Combobox multi-selección buscable** |
| `patrol_assigned` | String | No | **Combobox buscable** de patrullas |
| `police_report_file` | File | No | Archivo PDF del reporte |

#### Mapa Interactivo (Modal Leaflet):
* **Tile Layer:** OpenStreetMap tiles con tema oscuro.
* **Interacción:** Click en mapa → pin personalizado → geocodificación inversa vía Nominatim para autocompletar `block`.
* **Buscador de Calle:** Input con debounce de 300ms.

---

### 📋 2.2 READ: Listado Masivo con 4 KPI Cards, 5 Filtros y Paginación (`/incidents`)
**Componente:** `IncidentsComponent` (`incidents.ts` / `incidents.html`)

#### 4 Bento KPI Cards:
1. **Total Registrado** — `pagination.total` → icono `folder_open`.
2. **Investigaciones Activas** — `activeCount` → icono `pending_actions`.
3. **Cerrados (Con Arresto)** — `closedCount` → icono `check_circle`.
4. **Tipo Predominante** — `predominantType` → icono `warning`.

#### Barra de 5 Filtros Comboboxes Buscables:
1. **Buscador de Texto (`search`):** Input con debounce de 400ms.
2. **Unidad de Patrulla (`patrol`):** Combobox buscable dinámico.
3. **Estado (`status`):** Combobox (Todos, Activos, Cerrados, Alta Prioridad).
4. **Distrito (`district`):** Combobox buscable con 22 distritos.
5. **Tipo de Delito (`type`):** Combobox buscable con 18+ categorías penales.

#### Tabla de Datos (7 Columnas):
1. **ID:** `font-data-mono` (Ej. #CS-00001).
2. **Fecha y Hora:** Dos líneas (fecha bold, hora mono).
3. **Tipo Principal:** (Ej. BATTERY).
4. **Ubicación:** Texto truncado.
5. **Patrulla Asignada:** Icono auto + texto.
6. **Distrito:** (Ej. Distrito 012).
7. **Estado:** Badge color (`Arresto Efectuado` o `En Investigación`).

---

### 👁️ 2.3 READ: Expediente Detallado del Caso (`/incidents/:caseNumber`)
**Componente:** `IncidentDetailComponent` (`incident-detail.ts` / `incident-detail.html`)

#### Pestañas Forenses:
1. Bitácora de Seguimiento.
2. Evidencias (Visor lightbox).
3. Testigos.
4. Víctimas.
5. Sospechosos.
6. Personas Desaparecidas.
7. Vehículos Sospechosos.

#### Acciones de Expediente:
* Agregar Nota, Asignar Detective, Escalar, Cerrar Investigación, Reabrir, Descargar PDF.

---

### ✏️ 2.4 UPDATE / DELETE
* **Update:** Mismo formulario reactivo de CREATE pre-poblado vía caché.
* **Delete:** Soft delete lógico con modal de confirmación.

---

## 📡 3. Consola CAD 911 de Despacho de Emergencias
* **CRUD Llamadas:** Niveles de prioridad (1 a 5).
* **Despacho CAD:** Asignar patrulla convierte la llamada en un incidente registrado en `chicago_crimes` automáticamente.
* **KPIs y Tiempos:** Tiempos promedio de despacho y llegada al sitio.

---

## ⚡ 4. Criterios de Rendimiento (SLAs)
* **SLA Base de Datos:** Consultas a ClickHouse < 800ms.
* **Debounce de Interfaz:** 400ms para inputs de texto, 300ms para mapa.
* **Cache-First:** Navegación instantánea de tabla a detalle sin re-carga (0ms latencia percibida).
