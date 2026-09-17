# 📋 Tareas de Desarrollo: Módulo Operativo - Logística, Flota y Equipamiento

## Sprint 1: Flota Vehicular y Cuadrantes
- `[x]` **Tablas de Flota:** Crear `vehicle_fleet` y `vehiculo_patrulla` en ClickHouse.
- `[x]` **Dashboard de Flota:** Vistas `/api/logistica/dashboard/` y `/api/logistica/vehicles/`.
- `[x]` **Despliegue por Cuadrantes:** Endpoint `/api/logistica/patrol-shifts/today-by-quadrant/` para monitoreo de patrullaje en tiempo real.
- `[x]` **Baja de Vehículos:** Endpoint `/api/logistica/vehicles/<id>/decommission/` para marcar retiro formal de unidades.

## Sprint 2: Equipamiento Táctico y Asignación Exclusiva
- `[x]` **Catálogo de Equipos:** Crear tabla `equipment_catalog` con radios, bodycams, chalecos y táser.
- `[x]` **Generador de Seriales:** Endpoint `/api/logistica/equipment/next-serial/` por tipo de dispositivo.
- `[x]` **Asignación y Devolución:** Endpoints `/assign/` y `/return/` validando exclusividad y estado `DISPONIBLE`.
- `[x]` **Bitácora Inmutable:** Tabla `equipment_assignments` que almacena cada movimiento de equipamiento sin posibilidad de edición.

## Sprint 3: Tickets de Falla Mecánica y Taller
- `[x]` **Tabla de Mantenimiento:** Crear `maintenance_tickets` en ClickHouse.
- `[x]` **Regla de Fuera de Servicio:** Si un ticket se registra con gravedad `ALTA`, actualizar el estado del vehículo en `vehicle_fleet` a `FUERA_DE_SERVICIO`.
- `[x]` **Permisos de Cierre:** Restringir el cambio de estado a `RESUELTO` exclusivamente para `jefe_logistica` y `administrador`.
- `[x]` **UI de Tickets:** Tabla con badges visuales por gravedad (rojo, amarillo, verde) y modal de resolución.

## Sprint 4: Modelos Predictivos (Mantenimiento & Burnout)
- `[x]` **Mantenimiento Predictivo:** Endpoint `/api/logistica/predict-maintenance/` estimando fallas por kilometraje y antigüedad.
- `[x]` **Predicción de Fatiga (*Burnout*):** Endpoint `/api/logistica/predict-burnout/` correlacionando turnos consecutivos con fatiga.
- `[x]` **Componente Angular:** Desarrollar `EquipoTacticoComponent` con tabs de Inventario, Tickets y Bitácora.
