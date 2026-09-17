# 📋 Tareas de Desarrollo: Módulo de Incidentes (Con Detalle Real)

## Sprint 1: Base de Datos ClickHouse y API Core
- `[x]` Crear tablas `chicago_crimes`, `incidente_delito`, `seguimiento_incidente` con motor MergeTree.
- `[x]` Crear tablas de catálogo: `codigo_penal` (IUCR/FBI), `catalogo_ubicacion`, `estacion_policial`.
- `[x]` Implementar función `get_clickhouse_client()` con conexión nativa (`localhost:9000`, user `default`, password `password12345`).
- `[x]` Implementar funciones auxiliares: `resolve_location_id()`, `resolve_district_id()`, `resolve_and_link_crime_code()`.
- `[x]` Endpoint `GET /api/operativa/incidents/next-case-number/` — generador de folio correlativo `JB-XXXXXX`.
- `[x]` Endpoint `POST /api/operativa/incidents/create/` — inserción atómica en `chicago_crimes` + `incidente_delito`.
- `[x]` Endpoint `GET /api/operativa/incidents/` — listado paginado con filtros: `search`, `district`, `type`, `patrol`, `status`, `date_range`.
- `[x]` Endpoint `GET /api/operativa/incidents/:caseNumber/` — expediente completo con evidencias, testigos, víctimas, sospechosos y bitácora.
- `[x]` Endpoint `PUT /api/operativa/incidents/:caseNumber/` — actualización de expediente existente.
- `[x]` Endpoint `DELETE /api/operativa/incidents/:caseNumber/` — soft delete.
- `[x]` Endpoint `POST /api/operativa/incidents/:caseNumber/logs/` — agregar nota inmutable a `seguimiento_incidente`.
- `[x]` Endpoint `GET /api/operativa/incidents/geocode/` — proxy a Nominatim/OpenStreetMap.

## Sprint 2: Frontend Angular — Listado y Filtros
- `[x]` Componente `IncidentsComponent` con 4 Bento KPI Cards (Total, Activos, Cerrados, Tipo Predominante).
- `[x]` Barra de 5 filtros como Comboboxes buscables: Patrulla, Estado, Distrito, Tipo, Buscador con debounce 400ms.
- `[x]` Tabla de 7 columnas (ID, Fecha/Hora, Tipo, Ubicación, Patrulla, Distrito, Estado) con thead sticky y paginación.
- `[x]` Navegación a detalle con caché previa (`IncidentCacheService`).
- `[x]` Modal de solicitudes de asignación pendientes (solo perfil `administrador`).
- `[x]` Carga dinámica de catálogos de distrito y tipo penal desde `CategoryService`.
- `[x]` Carga dinámica de patrullas desde `LogisticsService.getVehicles()` y `getPatrolShifts()`.

## Sprint 3: Frontend Angular — Formulario de Creación con Mapa Leaflet
- `[x]` Componente `IncidentCreateComponent` con formulario reactivo y CSS compartido (`incident-form.css`).
- `[x]` Modal de mapa Leaflet con tile layer OpenStreetMap, click para capturar GPS, buscador de calles con debounce 300ms.
- `[x]` Buscador predictivo de códigos IUCR con 23 registros precargados.
- `[x]` Comboboxes buscables para: Distrito, Tipo Principal, Vehículo de patrulla y Oficiales asignados (multi-selección).
- `[x]` Upload de reporte policial PDF a Supabase S3.
- `[x]` Geocodificación inversa para autocompletar dirección.

## Sprint 4: Frontend Angular — Expediente Detallado y Acciones
- `[x]` Componente `IncidentDetailComponent` con cache-first loading.
- `[x]` Clasificación de severidad automática (CRITICAL / HIGH / MODERATE) con badges.
- `[x]` Tabla de traducción de códigos FBI al español (17 códigos).
- `[x]` Timeline de bitácora con formulario de notas (prepend instantáneo).
- `[x]` Pestañas forenses: Bitácora, Evidencias (con lightbox), Testigos, Víctimas, Sospechosos, Personas Desaparecidas, Vehículos Sospechosos.
- `[x]` Acciones: Asignar detective (combobox), Solicitar asignación, Escalar, Cerrar (con informe final), Reabrir (con motivo), Descargar PDF.
- `[x]` Modal de eliminación con confirmación y manejo de errores.
- `[x]` Sistema de toast notifications (success/error, 4 segundos).

## Sprint 5: Frontend Angular — Edición y CAD 911
- `[x]` Componente `IncidentEditComponent` con precarga de datos y mismo mapa Leaflet.
- `[x]` Tabla `llamada_emergencia` en ClickHouse con 5 niveles de prioridad.
- `[x]` Componente `EmergencyDispatchComponent` con consola de despacho en tiempo real.
- `[x]` Componente `EmergencyHistoryComponent` con historial de llamadas.
- `[x]` KPIs de despacho: total, pendientes, despachadas, en sitio, resueltas, tiempos promedio.
