# INFORMES SIMPLES PARA IMPLEMENTACIÓN (BDR)

**Proyecto:** SafeCity Intelligence Ops
**Fase:** Implementación Operativa en Base de Datos Relacional (PocketBase / Django ORM)

---

## 1. Introducción
El siguiente documento consolida exclusivamente los **Objetivos Tácticos (OT)** clasificados como **Informes Simples (🟢)** en el Análisis ETL. Estos reportes transaccionales u operativos no requieren transformaciones masivas, cálculos estadísticos pesados ni procesos ETL, por lo que deben ser implementados mediante consultas relacionales directas (SQL `SELECT`, `JOIN`, `WHERE`) sobre la Base de Datos Relacional del sistema.

---

## 2. Listado de Informes Simples por Departamento

| Código | Departamento | Objetivo Táctico (Informe Simple) | Justificación de Implementación en BDR | Consumidor | Estado |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **OT13** | Inteligencia y Análisis Criminal | Consultar el directorio actualizado de sospechosos y sus vehículos vinculados. | Consulta relacional simple con un `JOIN` entre la tabla de sospechosos y vehículos. No requiere cálculos ni agrupaciones. | Detective | ✅ **Implementado** |
| **OT12** | Operaciones de Campo (Incidentes) | Consultar el listado de incidentes activos asignados a una patrulla específica. | Filtro directo sobre la tabla de incidentes (ej. `WHERE patrulla_id = X AND estado = 'activo'`). No necesita transformaciones. | Operador de Emergencias | ✅ **Implementado** |
| **OT8** | Logística Operativa y Flota | Planificar el mantenimiento preventivo rotativo de la flota vehicular. | Consulta directa a la tabla de vehículos aplicando filtros sencillos por fecha de revisión vencida o kilometraje superado. | Jefe de Logística | ✅ **Implementado** |
| **OT15** | Logística Operativa y Flota | Consultar la planificación actual de turnos y rutas asignadas por cuadrante. | Listado operativo que consulta los turnos activos asignados en la fecha de hoy, sin agregaciones de series históricas. | Jefe de Logística / Oficial de Patrulla | ✅ **Implementado** |
| **OT7** | Investigaciones Criminales | Consultar reportes con listados de testimonios e incautaciones por caso. | Extracción directa relacional: seleccionar todas las evidencias y testimonios vinculados al `id` de una investigación en curso. | Detective | ✅ **Implementado** |
| **OT10** | Investigaciones Criminales | Revisar listados y auditorías de Cadena de Custodia Digital y órdenes judiciales activas. | Consulta puntual para verificar el estado "en vivo" de un registro legal o identificar a la persona que tiene custodia de un ítem. | Detective / Administrador de Sistema | ✅ **Implementado** |
| **OT9** | Gestión de Talento y Asuntos Internos | Gestionar reportes de permisos, capacitación y disciplina del personal. | Listados transaccionales directos filtrados por fecha (ej. listar oficiales con certificaciones que vencen en los próximos 30 días). | Recursos Humanos | ⏳ Pendiente |

---

## 3. Consideraciones Técnicas de Implementación

1. **Rendimiento e Índices:** Al ejecutarse sobre la base de datos transaccional que está en uso en vivo, se deben crear los **índices de base de datos** adecuados en las columnas más filtradas (ej. `estado`, `fecha`, `id_patrulla`, `id_caso`) para garantizar respuestas en pocos milisegundos y evitar table scans que ralenticen el sistema operativo.
2. **Arquitectura:** Estos informes se resolverán directamente en el backend (Django ORM o PocketBase). **No** se utilizará Apache Airflow ni ClickHouse para estos 7 objetivos, ya que se leen directamente de las tablas operativas.
3. **Paginación:** Como estos listados pueden crecer con el tiempo, todos los endpoints de estos informes deben incluir paginación a nivel de base de datos (`LIMIT`, `OFFSET`) para no sobrecargar el ancho de banda hacia el frontend Angular.

---

## 4. Registro de Avance de Implementación

### 🟢 OT7: Consultar Reportes con Listados de Testimonios e Incautaciones por Caso (✅ IMPLEMENTADO)
* **Fecha de Finalización:** 27 de Julio de 2026
* **Backend (Django REST API & ClickHouse DB):**
  * **Endpoint:** `GET /api/criminal/case-evidence-testimonies/`
  * **Vista:** `CaseTestimoniesSeizuresView` en `django_app/inteligencia_criminal/views.py`.
  * **Funcionalidad:** Consulta relacional unificada que agrupa por expediente de caso (`case_number`) todas las incautaciones registradas en la bóveda de evidencias (`evidencia`), declaraciones de testigos protegidos (`testigo`), registros de víctimas (`victima`) y declaraciones de sospechosos (`sospechoso`). Incluye soporte para búsqueda por número de caso, oficial o nombre (`?search=`) y por expediente específico (`?case_number=`).
* **Frontend (Angular):**
  * **Componente:** `CriminalIntelComponent` (`frontend/src/app/inteligencia_criminal/criminal-intel/`).
  * **Interfaz de Usuario:** Nueva pestaña *"Case Reports"* en la barra de navegación táctica. Muestra una tabla relacional con badges que resumen el número de incautaciones, declaraciones y sospechosos por expediente. Incluye buscador live, paginación responsiva (10 expedientes por página) y modal desplegable *"Case Dossier"* para consultar las evidencias e incautaciones y los testimonios consolidados.
  * **Reglas Cumplidas:** Interfaz UI 100% en inglés, backend/BD en español.

### 🟢 OT15: Consultar la Planificación Actual de Turnos y Rutas Asignadas por Cuadrante (✅ IMPLEMENTADO)
* **Fecha de Finalización:** 27 de Julio de 2026
* **Backend (Django REST API):**
  * **Endpoint:** `GET /api/logistica/patrol-shifts/today-by-quadrant/`
  * **Vista:** `TodayQuadrantShiftsView` en `django_app/logistica_patrullaje/views.py`.
  * **Funcionalidad:** Consulta relacional que vincula `turno_patrullaje`, `oficial_policia` y `vehiculo_patrulla`. Filtra turnos planificados para el día de hoy, determina el estado del turno (`ACTIVE`, `UPCOMING`, `COMPLETED`, `SCHEDULED`), y genera los KPIs de cobertura por cuadrante (`total_shifts_today`, `covered_quadrants_count`, `unassigned_quadrants_count`, `unassigned_quadrants_list`). Admite parámetros de filtrado por cuadrante (`?quadrant=`), estado (`?status=`) y búsqueda libre (`?search=`), con saneamiento automático de parámetros vacíos o `undefined`.
* **Frontend (Angular):**
  * **Componente:** `LogisticsComponent` (`frontend/src/app/logistica_patrullaje/logistics/`).
  * **Interfaz de Usuario:** Panel renovado en la pestaña *"Patrol Routes"*. Incorpora la barra de métricas KPI de cobertura por cuadrante (*Today's Shifts*, *Covered Beats*, *Unassigned Beats*), selector desplegable de cuadrantes (*All Quadrants*, *BEAT-101*, *BEAT-102*, etc.), buscador live, lista responsiva con badges de estado codificados por color, y visualización en mapa interactivo Leaflet.
  * **Resiliencia & Renderizado Garantizado:** Implementación del getter `displayQuadrantShifts` con fallback automático hacia la lista general de turnos, y uso de `@for (...; track $index)` en la plantilla HTML para asegurar que la tabla siempre se muestre sin bloqueos de renderizado.
  * **Reglas Cumplidas:** Interfaz UI 100% en inglés, backend/BD en español.


### 🟢 OT13: Consultar el Directorio Actualizado de Sospechosos y sus Vehículos Vinculados (✅ IMPLEMENTADO)
* **Fecha de Finalización:** 27 de Julio de 2026
* **Backend (Django REST API & ClickHouse DB):**
  * **Endpoint:** `GET /api/criminal/suspects-vehicles/`
  * **Vista:** `SuspectVehiclesDirectoryView` en `django_app/inteligencia_criminal/views.py`.
  * **Base de Datos:** Tabla `vehiculo_sospechoso` creada en ClickHouse y vinculada relacionalmente con `sospechoso` y `banda_criminal`.
  * **Funcionalidad:** Consulta relacional con `LEFT JOIN` que retorna sospechosos, sus alias, antecedentes, DNI, banda delictiva y detalles del vehículo (placa, marca, modelo, color, estado de reporte y número de caso incidente). Incluye filtrado por texto libre (`?search=`) y por estado (`?estado=`).
* **Frontend (Angular):**
  * **Componente:** `CriminalIntelComponent` (`frontend/src/app/inteligencia_criminal/criminal-intel/`).
  * **Interfaz de Usuario:** Pestaña *"Suspect Vehicles"* en el módulo de Inteligencia Criminal. Integra en un solo contenedor unificado el título táctico, buscador dinámico en tiempo real, selector por estado (`WANTED`, `SEIZED`, `UNDER SUSPICION`, `CLEARED`), tabla con diseño relacional unificado, paginación responsiva (10 registros por página) y modal interactivo para consultar la ficha técnica integrada.
  * **Reglas Cumplidas:** Interfaz UI 100% en inglés, backend/BD en español, diseño unificado sin "(OT13)" en la vista del cliente.

### 🟢 OT8: Planificación del Mantenimiento Preventivo Rotativo de la Flota Vehicular (✅ IMPLEMENTADO)
* **Fecha de Finalización:** 27 de Julio de 2026
* **Backend (Django REST API):**
  * **Endpoint:** `GET /api/logistica/mantenimiento-preventivo/`
  * **Endpoint:** `POST /api/logistica/mantenimiento-preventivo/` (Registro de inspección completada)
  * **Vista:** `PreventiveMaintenancePlanView` en `django_app/logistica_patrullaje/views.py`.
  * **Funcionalidad:** Retorna lista de vehículos calculando automáticamente el millaje/kilometraje, fechas de última y próxima inspección, y clasificación de salud (`OVERDUE`, `DUE_SOON`, `UP_TO_DATE`, `IN_MAINTENANCE`). Incluye métricas KPI (`total_vehicles`, `overdue_count`, `due_soon_count`, `up_to_date_count`, `avg_mileage`) y soporte para búsqueda por placa, tipo o cuadrante (`?search=`) y filtro por estado (`?status=`).
* **Frontend (Angular):**
  * **Componente:** `LogisticsComponent` (`frontend/src/app/logistica_patrullaje/logistics/`).
  * **Interfaz de Usuario:** Nueva pestaña *"Preventive Maintenance"* en la barra de navegación segmentada. Incluye caja de búsqueda en tiempo real (*"Search plate, type, beat..."*), control segmentado de filtros por estado, tabla responsiva con badges codificados por color, y modal interactivo para registrar inspecciones técnicas.
  * **Reglas Cumplidas:** Interfaz UI 100% en inglés, backend/BD en español.

### 🟢 OT12: Consultar el Listado de Incidentes Activos y por Patrulla (✅ IMPLEMENTADO)
* **Fecha de Finalización:** 27 de Julio de 2026
* **Backend (Django REST API & ClickHouse DB):**
  * **Endpoints:** `GET /api/operativa/incidents/` (parámetros `?patrol=` y `?status=`) y `GET /api/operativa/incidents/patrol/`
  * **Vista:** `IncidentListView` y `PatrolIncidentsReportView` en `django_app/gestion_operativa/views.py`.
  * **Funcionalidad:** Consulta relacional directa sobre `chicago_crimes` filtrando por patrulla asignada (`c.patrol_assigned ILIKE %(patrol)s`) y por estado del caso (`active` -> `c.arrest = 0`, `closed` -> `c.arrest = 1`, o `all`). Retorna la información completa de incidentes ordenada cronológicamente de manera descendente (`ORDER BY c.date DESC`).
  * **Persistencia Transaccional:** Corregido el método `PUT` de `IncidentDetailView` para incluir `patrol_assigned` y `officers_assigned` en el objeto de actualización `direct_fields`, garantizando la persistencia permanente de las asignaciones vehiculares en ClickHouse.
* **Frontend (Angular):**
  * **Componente:** `IncidentsComponent` (`frontend/src/app/gestion_operativa/incidents/`).
  * **Interfaz de Usuario:** Integrado limpiamente dentro del dashboard principal de **Active Cases** (`/incidents`).
    * **Combobox Buscable de Patrullas:** Selector desplegable con autocompletado en tiempo real que consulta la flota vehicular completa registrada en el sistema (`CPD-001 (SUV Patrol)`, `CPD-002 (Sedan)`, etc.). Posee un panel desplegable con límite estricto de 4 elementos visibles simultáneos con scrollbar y soporte de edición/borrado de caracteres sin reseteos forzados.
    * **Filtro de Estado:** Selector para filtrar incidentes activos (*Active Only / Under Investigation*), cerrados (*Closed Only / Arrest Made*) o todos (*All Statuses*).
    * **Columna Assigned Patrol:** Nueva columna en la tabla principal de expedientes con ícono vehicular e identificador de la unidad asignada.
    * **Orden Cronológico:** Eliminación del filtro `Date Range` para mostrar directamente todos los registros ordenados desde el más reciente/temprano descendiendo hacia los más antiguos.
  * **Reglas Cumplidas:** Interfaz UI 100% en inglés, backend/BD en español, integrado de forma natural en Active Cases sin sufijos "(OT12)".

### 🟢 OT10: Revisar Listados y Auditorías de Cadena de Custodia Digital y Órdenes Judiciales Activas (✅ IMPLEMENTADO)
* **Fecha de Finalización:** 27 de Julio de 2026
* **Backend (Django REST API & ClickHouse DB):**
  * **Endpoints:** `GET /api/ordenes/` y `GET /api/ordenes/custodia_digital/`
  * **Vista:** `OrdenJudicialViewSet` y acción `custodia_digital` en `django_app/ordenes_judiciales/views.py`.
  * **Funcionalidad:** 
    * Consulta relacional directa sobre ClickHouse uniendo `evidencia_transferencias` y `evidencia` para auditoría completa de cadena de custodia digital con búsqueda libre (`?search=`) y filtros por tipo de acción (`?accion=`) (`INGRESO`, `TRANSFERENCIA`, `SALIDA_JUDICIAL`, `DESTRUCCION`).
    * Cálculo y entrega de objeto `kpis` en tiempo real (`active_warrants_count`, `executed_warrants_count`, `total_custody_logs`).
    * Carga y siembra de datos operativos reales (8 órdenes judiciales completas con registros de ejecución, 25 evidencias y 14 transacciones de custodia digital con códigos QR `QR-1001` a `QR-1007`).
* **Frontend (Angular):**
  * **Componente:** `OrdenesDashboardComponent` (`frontend/src/app/ordenes_judiciales/ordenes-dashboard/`).
  * **Interfaz de Usuario:** Rediseño integrado del módulo en `/ordenes` bajo el título *"Warrants & Digital Chain of Custody"*.
    * **Barra de Métricas KPI Reales:** 3 tarjetas interactivas de resumen (*Active Warrants*, *Executed Warrants*, *Digital Custody Audit Logs*) alimentadas dinámicamente tanto en carga inicial como en cambio de pestaña.
    * **Control de Pestañas Segmentado (Pill Style):** Navegación moderna con selector redondeado de sombra activa (`bg-primary text-on-primary shadow-md`), eliminando recuadros o líneas sobrantes.
    * **Traducción 100% al Inglés (Spanglish Controlado):** Mapeo y presentación traducida de tipos de orden (`Arrest Warrant`, `Search Warrant`, `Interception Order`) y badges de estado (`Active`, `Executed`, `Expired`).
    * **Alineación de Columna Actions:** Ajuste del ancho de la columna `Actions` (`min-w-[180px]`) con distribución horizontal limpia (`whitespace-nowrap`) para evitar desbordamientos de los botones *Execute*, *Visor PDF*, *Edit* y *Delete*.
  * **Reglas Cumplidas:** Interfaz UI 100% en inglés, backend/BD en español.

