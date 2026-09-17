# ✅ Lista de Verificación de Calidad (QA): Módulo Operativo - Logística y Flota

## 1. Pruebas Funcionales (Flujo Principal)
- `[x]` **Registro de Vehículo:** Se almacena en `vehicle_fleet` con placa única, kilometraje y estado.
- `[x]` **Asignación de Radio/Bodycam:** Un equipo disponible pasa a estado `ASIGNADO` y asocia el oficial.
- `[x]` **Devolución de Equipo:** Libera el equipo a estado `DISPONIBLE` y registra la entrada en la bitácora inmutable.
- `[x]` **Creación de Ticket de Falla:** Se crea en `maintenance_tickets` con categoría y nivel de gravedad.
- `[x]` **Inhabilitación Automática:** Ticket con gravedad `ALTA` actualiza el vehículo a `FUERA_DE_SERVICIO` de forma inmediata.

## 2. Pruebas de Casos Extremos (Casos Borde)
- `[x]` **Doble Asignación Bloqueada:** Intentar asignar un radio ya asignado retorna HTTP 400.
- `[x]` **Devolución por Oficial Distinto:** Solo el poseedor actual o el administrador pueden efectuar la devolución.
- `[x]` **Resolución por Oficial Raso:** Oficial sin rol de logística no puede marcar un ticket como `RESUELTO`.

## 3. Pruebas de Rendimiento y SLAs
- `[x]` **Carga de Inventario Táctico:** Listado de catálogo y bitácoras carga en **< 700ms**.
- `[x]` **Cálculo Predictivo:** Los algoritmos de mantenimiento predictivo y fatiga retornan en **< 1.0s**.

## 4. Pruebas de Seguridad y Control de Acceso (RBAC)
- `[x]` **Acceso Restringido en Sidebar:** La vista `EquipoTacticoComponent` solo es visible para `administrador`, `jefe_logistica`, `comandante` y `administrador_sistema`.
