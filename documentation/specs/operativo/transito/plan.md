# 📋 Plan de Implementación: Módulo Operativo - Tránsito, Accidentes y Detenciones

## 1. Visión Arquitectónica y Objetivos
El módulo de **Tránsito, Accidentes y Detenciones** cubre el control de infracciones viales, siniestros de tránsito, despacho de grúas, y el sistema de celdas de detención temporal con registro de pertenencias, bitácora de salud y monitoreo de celdas.
Opera sobre **Django REST Framework** en `/api/operativa/`, con persistencia en **ClickHouse** y evidencias en **Supabase S3 Storage**.

---

## 2. Arquitectura de Base de Datos (ClickHouse)

Tablas en ClickHouse con motor `MergeTree`:

- **Tabla `infraccion_transito` (Multas e Infracciones):**
  - Campos: `id_infraccion` (String, UUID), `placa_vehiculo` (String), `tipo_infraccion` (String), `monto_multa` (Float32), `fecha_infraccion` (DateTime), `ubicacion` (String), `id_oficial` (UInt32), `nombre_infractor` (String), `licencia_conducir` (String), `foto_evidencia_url` (Nullable(String)), `estado_pago` (String: PENDIENTE, PAGADA, ANULADA), `creado_por` (String), `fecha_creacion` (DateTime).

- **Tabla `accidente_transito` (Siniestros Viales):**
  - Campos: `id_accidente` (String, UUID), `fecha_accidente` (DateTime), `ubicacion` (String), `tipo_accidente` (String: COLISION, ATROPELLO, VOLCADURA), `vehiculos_involucrados` (String), `heridos_count` (UInt16), `fallecidos_count` (UInt16), `requiere_grua` (UInt8), `id_oficial_responsable` (UInt32), `descripcion` (String), `fecha_creacion` (DateTime).

- **Tabla `despacho_grua` (Servicio de Remolque):**
  - Campos: `id_despacho` (String, UUID), `placa_vehiculo` (String), `id_accidente_ref` (Nullable(String)), `motivo_remolque` (String), `empresa_grua` (String), `corralon_destino` (String), `estado_servicio` (String: SOLICITADA, EN_CAMINO, COMPLETADA, CANCELADA), `fecha_solicitud` (DateTime), `fecha_completado` (Nullable(DateTime)), `solicitado_por` (String).

- **Tabla `ingreso_celda` (Detenciones Temporales):**
  - Campos: `id_ingreso` (String, UUID), `nombre_detenido` (String), `documento_identidad` (String), `numero_celda` (String), `fecha_ingreso` (DateTime), `fecha_liberacion` (Nullable(DateTime)), `motivo_detencion` (String), `case_number_ref` (Nullable(String)), `oficial_aprehensor` (String), `pertenencias_inventario` (String), `estado_salud_ingreso` (String), `estado_detencion` (String: EN_CUSTODIA, LIBERADO, TRASLADADO_PENAL), `creado_por` (String).

- **Tabla `bitacora_detenido` (Eventos Inmutables de Custodia):**
  - Campos: `id_evento` (String, UUID), `id_ingreso` (String), `fecha_evento` (DateTime), `tipo_evento` (String: REVISION_MEDICA, ALIMENTACION, VISITA_LEGAL, TRASLADO, LLAMADA_TELEFONICA, INCIDENTE_DISCIPLINARIO), `observaciones` (String), `registrado_por` (String).

- **Tabla `descarga_taser` (Uso de Fuerza No Letal):**
  - Campos: `id_descarga` (String, UUID), `id_oficial` (UInt32), `serial_taser` (String), `fecha_evento` (DateTime), `duracion_segundos` (Float32), `numero_dardos` (UInt8), `justificacion_tactica` (String), `sujeto_afectado` (String), `asistencia_medica_brindada` (UInt8), `aprobado_supervisor` (UInt8).

---

## 3. Arquitectura API (Django REST Framework)

Rutas bajo `/api/operativa/`:
- `GET/POST /api/operativa/traffic-violations/`: Registro y consulta de infracciones viales.
- `GET/POST /api/operativa/traffic-accidents/`: Gestión de siniestros y solicitud de peritaje.
- `GET/POST /api/operativa/tow-dispatch/`: Despacho y seguimiento de grúas de remolque.
- `GET/POST /api/operativa/bookings/`: Registro y consulta de detenidos en celdas.
- `POST /api/operativa/bookings/<id>/release/`: Liberación o traslado legal de detenidos.
- `GET/POST /api/operativa/bookings/<id>/logs/`: Bitácora inmutable de eventos del detenido.
- `GET /api/operativa/cells/`: Estado de ocupación y capacidad en tiempo real de celdas.
- `GET/POST /api/operativa/taser-discharges/`: Reporte mandatorio de descargas de táser.

---

## 4. Arquitectura Frontend (Angular 17+)

- **Componentes Tácticos:**
  - `TrafficControlComponent`: Listado de multas, radar de infracciones y exportador.
  - `TowDispatchComponent`: Consola de remolque de vehículos con asignación de corralones.
  - `TrafficAccidentsComponent`: Registro de colisiones y solicitud de grúa integrada.
  - `BookingSystemComponent`: Muro de celdas con indicador de capacidad, modales de ingreso y liberación.
  - `ArrestsLogComponent`: Libro de arrestos con historial inmutable de eventos.
  - `AuxiliaryReportsComponent`: Informes auxiliares de campo y uso de fuerza.
