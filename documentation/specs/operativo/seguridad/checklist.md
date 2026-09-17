# ✅ Lista de Verificación de Calidad (QA): Módulo Operativo - Seguridad y Administración

## 1. Pruebas Funcionales (Flujo Principal)
- `[x]` **Autenticación Exitosa:** Retorna token JWT válido con usuario, nombres y rol.
- `[x]` **Cierre Forzado de Sesión:** `force-logout` actualiza `historial_sesion` e invalida la sesión remota.
- `[x]` **Registro de Auditoría:** Cada acción relevante (Login, Modificación, Exportación) genera un registro inmutable en `auditoria_sistema`.
- `[x]` **Generación de Respaldo:** El sistema crea y archiva instantáneas comprimidas.
- `[x]` **Recuperación de Contraseña:** Envía correo real con enlace firmado y valida expiración del token.

## 2. Pruebas de Casos Extremos (Casos Borde)
- `[x]` **Intentos Fallidos de Login:** Credenciales inválidas devuelven error sin revelar si el usuario existe.
- `[x]` **Inmutabilidad de Auditoría:** Bloqueo absoluto de operaciones de borrado o edición en `auditoria_sistema`.
- `[x]` **Restauración Fallida:** Si el archivo de respaldo está corrupto, revierte el estado y arroja log de alerta.

## 3. Pruebas de Rendimiento y Ciberseguridad
- `[x]` **Validación JWT:** El middleware de autenticación valida el token en **< 5ms** por petición.
- `[x]` **Exportación de Logs:** Genera reportes CSV de miles de eventos en **< 2.0s**.
- `[x]` **RBAC Estricto:** Rutas de administración (`/admin/*`) accesibles únicamente por el rol `administrador_sistema`.
