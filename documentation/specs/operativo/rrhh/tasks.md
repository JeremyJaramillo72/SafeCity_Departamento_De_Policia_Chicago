# 📋 Tareas de Desarrollo: Módulo Operativo - Recursos Humanos

## Sprint 1: Oficiales y Marcaje de Jornada
- `[x]` **Catálogo de Oficiales:** Tablas `oficial_policia` y `rol_oficial` en ClickHouse.
- `[x]` **Marcas Entrada/Salida:** Endpoints `/api/rrhh/clock-in/` y `/api/rrhh/clock-out/`.
- `[x]` **Historial de Asistencia:** Vista `/api/rrhh/asistencias/` con cálculo de horas laboradas.
- `[x]` **Reloj Digital Angular:** Widget en tiempo real con botón de entrada y salida.

## Sprint 2: Permisos y Régimen Disciplinario
- `[x]` **Tabla de Permisos:** Crear `rrhh_solicitud_permiso` en ClickHouse.
- `[x]` **Flujo de Aprobación:** Endpoint `/api/rrhh/permiso/<id>/aprobar/` reservado para RRHH.
- `[x]` **Tabla de Amonestaciones:** Crear `rrhh_amonestacion` y vistas de registro.
- `[x]` **Certificaciones:** Tabla `rrhh_certificacion` para control de vigencia de cursos de tiro y rescate.

## Sprint 3: Novedades de Guardia y Relevos
- `[x]` **Roll Call Briefing:** Vistas `/api/rrhh/briefings/` para minutas de inicio de servicio.
- `[x]` **Traspaso de Turno:** Endpoints `/api/rrhh/handovers/` y confirmación de recepción.
- `[x]` **Cobertura de Ausentismo:** Analítica en `/api/rrhh/absenteeism-coverage/`.
- `[x]` **Rutas y Guardias Angular:** Componente `RrhhDashboardComponent` protegido por `RoleGuard` (`recursos_humanos`).
