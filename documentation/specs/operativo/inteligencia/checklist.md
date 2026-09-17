# ✅ Lista de Verificación de Calidad (QA): Módulo Operativo - Inteligencia Criminal y BOLO

## 1. Pruebas Funcionales (Flujo Principal)
- `[x]` **Registro de Sospechoso:** Se guarda correctamente en `sospechoso` con alias en mayúsculas y niveles de peligrosidad.
- `[x]` **Emisión BOLO:** Las alertas creadas contienen fecha obligatoria de expiración y badge visual de riesgo.
- `[x]` **BOLO Automático por Desaparecido:** Al ingresar un menor de edad en `missing-persons`, se genera la alerta BOLO vinculada.
- `[x]` **Transferencia de Evidencia:** El traspaso en `evidencia_transferencias` registra emisor, receptor y motivo sin modificar registros previos.
- `[x]` **Anonimato de Testigos:** El campo `es_anonimo` oculta datos sensibles en vistas generales.

## 2. Pruebas de Casos Extremos (Casos Borde)
- `[x]` **Transferencia Inválida:** Un oficial que no posee la custodia de la evidencia no puede transferirla a un tercero.
- `[x]` **Expiración de BOLO:** Las alertas expiradas cambian de estado y dejan de mostrarse como activas en el panel operativo.
- `[x]` **Formatos de Imagen en Evidencias:** Se rechazan archivos no soportados y se validan extensiones JPG, PNG y PDF en Supabase S3.

## 3. Pruebas de Rendimiento y SLAs
- `[x]` **Carga del Grafo de Vínculos:** El grafo de relaciones criminales se construye y renderiza en **< 1.0s**.
- `[x]` **Estadísticas de Reincidencia:** El cálculo analítico sobre ClickHouse responde en **< 600ms**.
- `[x]` **Subida Multipart:** La subida de fotografías de evidencias completa en **< 2.5s** sobre Supabase S3.

## 4. Pruebas de Seguridad y Control de Acceso (RBAC)
- `[x]` **Permisos de Detective / Comandante:** Solo roles `detective` y `administrador` pueden cerrar casos o solicitar órdenes judiciales.
- `[x]` **Inmutabilidad Forense:** Se comprueba que no existen endpoints que permitan `DELETE` sobre `evidencia_transferencias`.
