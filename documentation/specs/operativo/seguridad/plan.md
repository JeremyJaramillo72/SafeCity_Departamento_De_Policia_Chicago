# 📋 Plan de Implementación: Módulo Operativo - Administración, Ciberseguridad y Auditoría

## 1. Visión Arquitectónica y Objetivos
El módulo de **Administración y Ciberseguridad** es la capa base del sistema que garantiza la integridad, confidencialidad, autenticación estricta (JWT), auditoría inmutable de accesos, recuperación de claves por correo SMTP, gestión de copias de seguridad (*backups*) y catálogos maestros del sistema.
Opera sobre **Django REST Framework** en `/api/auth/` con validación personalizada `SafeCityJWTAuthentication` y almacenamiento en **ClickHouse** y SQLite.

---

## 2. Arquitectura de Base de Datos (ClickHouse & SQLite)

- **Tabla `usuario_sistema` (Cuentas de Usuario):**
  - Campos: `id_usuario` (UInt32, PK), `id_oficial` (UInt32), `username` (String, único), `password_hash` (String, Bcrypt/Argon2), `estado_cuenta` (String: activo, inactivo, bloqueado), `ultimo_acceso` (DateTime).

- **Tabla `historial_sesion` (Control de Sesiones y Logout Forzado):**
  - Campos: `id_sesion` (String, UUID), `id_usuario` (UInt32), `username` (String), `ip_origen` (String), `user_agent` (String), `hora_inicio` (DateTime), `hora_cierre` (Nullable(DateTime)), `estado_sesion` (String: ACTIVA, CERRADA, EXPIRADA, FORZADA_LOGOUT).

- **Tabla `auditoria_sistema` (Bitácora Forense Inmutable):**
  - Campos: `id_auditoria` (String, UUID), `timestamp` (DateTime), `id_usuario` (UInt32), `username` (String), `rol` (String), `accion` (String: LOGIN, LOGOUT, CREACION, MODIFICACION, ANULACION, EXPORTACION, CONSULTA), `modulo` (String), `ip_origen` (String), `detalle` (String).
  - Motor: `ENGINE = MergeTree() ORDER BY (timestamp, id_usuario)` (Estrictamente inmutable *append-only*).

- **Tabla `registro_respaldo` (Copias de Seguridad):**
  - Campos: `id_respaldo` (String, UUID), `nombre_archivo` (String), `ruta_almacenamiento` (String), `tamanio_bytes` (UInt64), `tipo_respaldo` (String: COMPLETO, INCREMENTAL, METADATOS), `fecha_generacion` (DateTime), `generado_por` (String), `estado` (String: EXITOSO, FALLIDO, RESTAURADO).

- **Tabla `catalogo_sistema` (Catálogos Maestros Paramétricos):**
  - Campos: `id_catalogo` (UInt32), `grupo_catalogo` (String), `codigo_clave` (String), `valor_texto` (String), `descripcion` (String), `activo` (UInt8).

---

## 3. Arquitectura API (Django REST Framework)

Rutas bajo `/api/auth/`:
- `POST /api/auth/login/`: Autenticación con verificación de credenciales y emisión de token JWT con rol.
- `POST /api/auth/logout/`: Cierre de sesión voluntario del usuario.
- `POST /api/auth/force-logout/<id_usuario>/`: Cierre forzado de sesiones concurrentes o comprometidas.
- `GET /api/auth/users/`: Listado y administración de cuentas policiales.
- `GET /api/auth/logs/` y `/api/auth/logs/export/`: Consulta y exportación forense en CSV de auditoría.
- `GET/POST /api/auth/backups/`: Generación y listado de copias de seguridad.
- `GET /api/auth/backups/<name>/download/`: Descarga segura de archivos de respaldo comprimidos.
- `POST /api/auth/backups/<name>/restore/`: Restauración asistida de instantáneas del sistema.
- `POST /api/auth/password-reset/request/`: Solicitud de restablecimiento vía token enviado por SMTP (Gmail).
- `POST /api/auth/password-reset/confirm/`: Confirmación y cambio de clave criptográfica.
- `GET/POST /api/auth/categories/`: Gestión de tablas maestras y catálogos paramétricos.

---

## 4. Arquitectura Frontend (Angular 17+)

- **Componentes Tácticos:**
  - `LoginComponent` y `ResetPasswordComponent`: Pantallas tácticas de acceso y recuperación de contraseña.
  - `AdminUsersComponent`: Panel de usuarios, roles, bloqueo y forzado de cierre de sesión.
  - `AdminLogsComponent`: Visor de eventos de auditoría con filtros por acción, usuario y exportador CSV.
  - `AdminBackupsComponent`: Consola de respaldos con monitoreo de tamaño y botones de descarga/restauración.
  - `AdminSettingsComponent` y `AdminCategoriesComponent`: Configuración general y catálogos del sistema.
  - `ProfileComponent`: Perfil de oficial en sesión con cambio de contraseña y detalles de servicio.
