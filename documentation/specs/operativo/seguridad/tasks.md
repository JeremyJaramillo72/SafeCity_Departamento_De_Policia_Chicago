# 📋 Tareas de Desarrollo: Módulo Operativo - Administración y Ciberseguridad

## Sprint 1: Autenticación JWT y Usuarios
- `[x]` **Esquema de Usuarios:** Tablas `usuario_sistema` y `historial_sesion` en ClickHouse y SQLite.
- `[x]` **Autenticación JWT:** Implementar `SafeCityJWTAuthentication` y endpoint `/api/auth/login/`.
- `[x]` **Logout Forzado:** Endpoint `/api/auth/force-logout/` para invalidar sesiones remotas.
- `[x]` **Panel de Usuarios Angular:** Desarrollar `AdminUsersComponent` con gestión de estados de cuenta.

## Sprint 2: Auditoría Forense y Bitácoras
- `[x]` **Tabla de Auditoría:** Crear `auditoria_sistema` con motor `MergeTree` inmutable.
- `[x]` **Middleware de Auditoría:** `CurrentRequestMiddleware` para registrar IPs, usuarios y endpoints accedidos.
- `[x]` **Exportación Forense:** Endpoint `/api/auth/logs/export/` para descarga en formato CSV.
- `[x]` **Visor de Logs:** Desarrollar `AdminLogsComponent` con filtros avanzados y badges de criticidad.

## Sprint 3: Respaldos y Restauración
- `[x]` **Tabla de Respaldos:** Crear `registro_respaldo` en ClickHouse.
- `[x]` **Generador de Snapshots:** Endpoint `/api/auth/backups/` para compresión y archivado.
- `[x]` **Descarga y Restauración:** Endpoints `/download/` y `/restore/`.
- `[x]` **Consola de Backups Angular:** Desarrollar `AdminBackupsComponent` con tamaño de archivo y fecha.

## Sprint 4: Recuperación de Claves y Catálogos
- `[x]` **Servicio SMTP:** Configuración de Gmail SMTP para envío de correos con tokens temporales de recuperación.
- `[x]` **Endpoints de Reset:** Vistas `/password-reset/request/` y `/password-reset/confirm/`.
- `[x]` **Catálogos del Sistema:** Vistas `/api/auth/categories/` para administración de tablas maestras.
- `[x]` **Perfil de Usuario:** `ProfileComponent` para actualización de credenciales personales.
