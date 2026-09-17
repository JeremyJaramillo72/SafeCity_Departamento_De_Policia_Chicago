# 📋 Plan de Implementación: Módulo Operativo - Logística, Flota y Equipamiento Táctico

## 1. Visión Arquitectónica y Objetivos
El módulo de **Logística y Flota Policial** gestiona el inventario de patrullas, equipamiento táctico individual (radios, bodycams, chalecos, táser), tickets de reparación mecánica, planes de mantenimiento preventivo y modelos analíticos de mantenimiento predictivo y fatiga operativa (*burnout*).
El sistema opera sobre **Django REST Framework** en `/api/logistica/`, con almacenamiento columnar en **ClickHouse** y control estricto de exclusividad de asignación.

---

## 2. Arquitectura de Base de Datos (ClickHouse)

Tablas en ClickHouse con motor `MergeTree`:

- **Tabla `vehicle_fleet` / `vehiculo_patrulla` (Flota Vehicular):**
  - Campos: `id_vehiculo` (String, UUID), `placa` (String, PK de negocio), `marca_modelo` (String), `anio` (UInt16), `tipo_vehiculo` (String: SEDAN, SUV, MOTO, BLINDADO), `estado_vehiculo` (String: DISPONIBLE, PATRULLANDO, EN_TALLER, FUERA_DE_SERVICIO, DE_BAJA), `kilometraje_actual` (Float32), `nivel_combustible_pct` (UInt8), `cuadrante_asignado` (String), `id_oficial_asignado` (Nullable(UInt32)), `fecha_creacion` (DateTime).

- **Tabla `equipment_catalog` (Catálogo de Equipamiento Táctico):**
  - Campos: `id_equipo` (String, UUID), `codigo_serial` (String, único), `tipo_equipo` (String: RADIO, BODYCAM, CHALECO, TASER, ESPOSAS, OTRO), `marca_modelo` (String), `estado_equipo` (String: DISPONIBLE, ASIGNADO, EN_MANTENIMIENTO, EXTRAVIADO, DE_BAJA), `id_oficial_actual` (Nullable(String)), `nombre_oficial_actual` (Nullable(String)), `notas` (Nullable(String)), `creado_por` (String), `fecha_creacion` (DateTime), `fecha_modificacion` (DateTime).

- **Tabla `equipment_assignments` (Bitácora Inmutable de Asignaciones):**
  - Campos: `id_asignacion` (String, UUID), `id_equipo` (String), `codigo_serial` (String), `tipo_equipo` (String), `id_oficial` (String), `nombre_oficial` (String), `tipo_accion` (String: ASIGNACION, DEVOLUCION), `turno_referencia` (Nullable(String)), `observaciones` (Nullable(String)), `registrado_por` (String), `fecha_registro` (DateTime).

- **Tabla `maintenance_tickets` (Tickets de Mantenimiento Mecánico):**
  - Campos: `id_ticket` (String, UUID), `id_vehiculo` (String), `placa_vehiculo` (String), `categoria_falla` (String: FRENOS, MOTOR, ELECTRICO, LLANTAS, CARROCERIA, OTRO), `descripcion` (String), `gravedad` (String: ALTA, MEDIA, BAJA), `estado_ticket` (String: ABIERTO, EN_TALLER, RESUELTO), `fecha_resolucion` (Nullable(DateTime)), `resuelto_por` (Nullable(String)), `reportado_por` (String), `fecha_creacion` (DateTime), `fecha_modificacion` (DateTime).

- **Tabla `turno_patrullaje` (Turnos y Cuadrantes):**
  - Campos: `id_turno` (UInt32), `id_oficial` (UInt32), `placa_vehiculo` (String), `cuadrante` (String), `fecha_inicio` (DateTime), `fecha_fin` (Nullable(DateTime)), `kilometraje_inicial` (Float32), `kilometraje_final` (Nullable(Float32)).

---

## 3. Arquitectura API (Django REST Framework)

Rutas montadas bajo `/api/logistica/`:
- `GET /api/logistica/dashboard/`: KPIs generales de flota (vehículos operativos, en taller, equipos asignados, tickets abiertos).
- `GET/POST /api/logistica/vehicles/`: CRUD de unidades de patrulla.
- `POST /api/logistica/vehicles/<id>/decommission/`: Baja formal de unidad vehicular.
- `GET /api/logistica/patrol-shifts/today-by-quadrant/`: Despliegue de patrullas activas por cuadrante hoy.
- `GET/POST /api/logistica/equipment/`: Listado y registro de equipos tácticos.
- `GET /api/logistica/equipment/next-serial/`: Autogeneración de código de serie por tipo de equipo.
- `POST /api/logistica/equipment/<id>/assign/`: Asignación exclusiva a un oficial (valida que esté `DISPONIBLE`).
- `POST /api/logistica/equipment/<id>/return/`: Devolución y liberación de equipo.
- `GET /api/logistica/equipment-assignments/`: Historial inmutable de entregas y recepciones.
- `GET/POST /api/logistica/maintenance/`: Creación de tickets de falla (Gravedad `ALTA` pasa el auto a `FUERA_DE_SERVICIO`).
- `PATCH /api/logistica/maintenance/<id>/`: Cierre de ticket (solo permitido para rol `jefe_logistica` o `administrador`).
- `GET /api/logistica/predict-maintenance/`: Estimación predictiva de probabilidad de falla mecánica.
- `GET /api/logistica/predict-burnout/`: Modelo analítico de fatiga operativa por horas de patrullaje.

---

## 4. Arquitectura Frontend (Angular 17+)

- **Componentes Tácticos:**
  - `LogisticsComponent`: Tablero de control de flota con indicadores de combustible, kilometraje y disponibilidad.
  - `EquipoTacticoComponent`: Centro integral de inventario táctico, bitácora inmutable de asignaciones y tickets de taller.
  - Modales reactivos: `ModalAsignarEquipo`, `ModalDevolverEquipo`, `ModalNuevoTicketFalla`, `ModalResolverTicket`.
