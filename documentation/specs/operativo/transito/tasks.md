# 📋 Tareas de Desarrollo: Módulo Operativo - Tránsito, Accidentes y Detenciones

## Sprint 1: Infracciones Viales y Grúas
- `[x]` **Tablas de Tránsito:** Crear `infraccion_transito` y `despacho_grua` en ClickHouse.
- `[x]` **Registro de Multas:** Endpoint `/api/operativa/traffic-violations/` con foto en Supabase S3.
- `[x]` **Despacho de Grúas:** Vistas `/api/operativa/tow-dispatch/` y asignación de corralón.
- `[x]` **Componentes Angular:** Desarrollar `TrafficControlComponent` y `TowDispatchComponent`.

## Sprint 2: Accidentes de Tránsito
- `[x]` **Tabla de Siniestros:** Crear `accidente_transito` con tipos de accidente y conteo de víctimas.
- `[x]` **Vínculo con Grúa:** Flujo automático que permite solicitar grúa desde el registro del accidente.
- `[x]` **Componente Angular:** Desarrollar `TrafficAccidentsComponent` con filtros por gravedad y fecha.

## Sprint 3: Sistema de Celdas y Detenciones
- `[x]` **Tabla de Ingresos:** Crear `ingreso_celda` con número de celda e inventario de pertenencias.
- `[x]` **Bitácora de Eventos:** Crear tabla `bitacora_detenido` (*append-only*) para revisiones médicas y traslados.
- `[x]` **Liberación de Detenidos:** Endpoint `/bookings/<id>/release/` registrando hora y motivo de salida.
- `[x]` **Monitoreo de Celdas:** Endpoint `/api/operativa/cells/` y componente `BookingSystemComponent`.

## Sprint 4: Uso de Fuerza No Letal (Táser)
- `[x]` **Tabla de Descargas:** Crear `descarga_taser` con justificación táctica y segundos de descarga.
- `[x]` **Componente Angular:** Integrar formulario de reporte en `AuxiliaryReportsComponent`.
- `[x]` **RBAC Tránsito:** Rutas protegidas para `agente_transito`, `oficial` y `administrador`.
