# 📋 Tareas de Desarrollo: Módulo Operativo - Inteligencia Criminal y BOLO

## Sprint 1: Perfilamiento Criminal y Bandas
- `[x]` **Modelos en ClickHouse:** Crear tablas `sospechoso`, `banda_criminal` y `vehiculo_sospechoso`.
- `[x]` **CRUD de Sospechosos:** Endpoints `/api/criminal/suspects/` con soporte de alias en mayúsculas y niveles de peligrosidad.
- `[x]` **Subida de Fotografías:** Integración de carga de fotos hacia Supabase Storage.
- `[x]` **Mapeo de Bandas:** Vistas `/api/criminal/gangs/` para asociar integrantes a territorios y actividades ilícitas.

## Sprint 2: Alertas BOLO y Personas Desaparecidas
- `[x]` **Tablas de BOLO y Desaparecidos:** Crear `rrhh_bolo` y `rrhh_persona_desaparecida` en ClickHouse.
- `[x]` **Lógica de Generación Automática:** Al registrar desaparecido menor de 12 años, clasificar como `CRITICO` y crear registro BOLO automáticamente.
- `[x]` **Panel de Alertas BOLO:** Desarrollar `BoloAlertsComponent` con temporizador de caducidad y filtros por tipo de alerta.
- `[x]` **Resolución de Alertas:** Endpoint para marcar alertas como `RESUELTA` o `EXPIRADA`.

## Sprint 3: Cadena de Custodia y Evidencias Forenses
- `[x]` **Tablas de Evidencia:** Crear `evidencia` y `evidencia_transferencias` (inmutable *append-only*).
- `[x]` **Transferencia de Custodia:** Endpoint `/api/criminal/evidence/<id>/transfer/` validando que el emisor sea el custodio actual.
- `[x]` **Subida de Archivos:** Endpoint `/api/criminal/evidence/upload/` con optimización y persistencia en Supabase S3.
- `[x]` **Gestión de Testigos y Víctimas:** Vistas `/api/criminal/witnesses/` y `/api/criminal/victims/` con soporte de testigos anónimos.

## Sprint 4: Red de Vínculos y Estadísticas de Reincidencia
- `[x]` **Grafo de Conexiones:** Endpoint `/api/criminal/graph-network/` para relacionar casos, vehículos y sospechosos.
- `[x]` **Analítica de Reincidencia:** Endpoint `/api/criminal/recidivism-stats/` con métricas de reincidencia por tipología penal.
- `[x]` **Bandeja de Casos de Detective:** Desarrollar `MyCasesComponent` para seguimiento y reporte formal en PDF.
