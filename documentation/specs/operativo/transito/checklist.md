# ✅ Lista de Verificación de Calidad (QA): Módulo Operativo - Tránsito y Detenciones

## 1. Pruebas Funcionales (Flujo Principal)
- `[x]` **Registro de Infracción:** Se almacena en `infraccion_transito` con cálculo de monto y placa.
- `[x]` **Ingreso a Celda:** El detenido se registra en `ingreso_celda` y la ocupación de celdas se actualiza en tiempo real.
- `[x]` **Bitácora Médica/Legal:** Las revisiones se agregan a `bitacora_detenido` sin alterar el ingreso original.
- `[x]` **Liberación Exitosa:** Se asienta la fecha de salida y la celda queda disponible.
- `[x]` **Reporte de Táser:** Se guarda la justificación táctica y asistencia médica brindada en `descarga_taser`.

## 2. Pruebas de Casos Extremos (Casos Borde)
- `[x]` **Celda Llena:** Si una celda alcanza su capacidad máxima, el selector visual la marca como no disponible.
- `[x]` **Liberación Duplicada:** Intentar liberar a un detenido ya liberado retorna HTTP 400.
- `[x]` **Multa sin Placa:** El formulario bloquea el guardado si no se ingresa la placa vehicular.

## 3. Pruebas de Rendimiento y SLAs
- `[x]` **Consulta de Ocupación de Celdas:** El endpoint `/api/operativa/cells/` responde en **< 300ms**.
- `[x]` **Búsqueda de Infracciones:** El filtro por placa resuelve sobre ClickHouse en **< 500ms**.

## 4. Pruebas de Seguridad y Control de Acceso (RBAC)
- `[x]` **Acceso de Tránsito:** La ruta `/traffic` y `/tow-dispatch` está restringida para `agente_transito` y `administrador`.
