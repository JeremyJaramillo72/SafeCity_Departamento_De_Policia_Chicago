# 📋 Plan de Implementación: Módulo Operativo - Recursos Humanos y Asistencia Policial

## 1. Visión Arquitectónica y Objetivos
El módulo de **Recursos Humanos Policial** gestiona el control de asistencia digital (reloj biométrico/marcas), solicitudes y aprobaciones de permisos, amonestaciones disciplinarias, certificaciones de armas y tácticas, minutas de pase de lista (*Roll Call Briefings*) y traspaso de guardia (*Shift Handover*).
Opera mediante **Django REST Framework** en `/api/rrhh/` y persistencia en **ClickHouse**.

---

## 2. Arquitectura de Base de Datos (ClickHouse)

Tablas en ClickHouse con motor `MergeTree`:

- **Tabla `oficial_policia` (Personal Policial):**
  - Campos: `id_oficial` (UInt32, PK), `placa_policial` (String), `nombres` (String), `apellidos` (String), `correo_electronico` (String), `telefono_contacto` (String), `fecha_ingreso` (Date), `id_rol` (UInt32), `url_fotografia` (String), `grupo_sanguineo` (String), `contacto_emergencia_nombre` (String), `contacto_emergencia_telefono` (String), `insignias` (String), `url_hoja_vida` (String).

- **Tabla `rrhh_asistencia_registro` (Marcaje de Jornada):**
  - Campos: `id_registro` (String, UUID), `id_oficial` (UInt32), `placa_policial` (String), `fecha_registro` (Date), `hora_entrada` (DateTime), `hora_salida` (Nullable(DateTime)), `horas_trabajadas` (Float32), `tipo_turno` (String: MANANA, TARDE, NOCHE), `estado_jornada` (String: PRESENTE, RETARDO, SALIDA_ANTICIPADA), `dispositivo_marcado` (String).

- **Tabla `rrhh_solicitud_permiso` (Licencias y Permisos):**
  - Campos: `id` (String, UUID), `id_oficial` (UInt32), `tipo_permiso` (String: MEDICO, PERSONAL, VACACIONES, CALAMIDAD), `fecha_inicio` (Date), `fecha_fin` (Date), `motivo` (String), `estado` (String: PENDIENTE, APROBADO, RECHAZADO), `aprobado_por` (Nullable(String)), `fecha_solicitud` (DateTime).

- **Tabla `rrhh_amonestacion` (Régimen Disciplinario):**
  - Campos: `id_amonestacion` (String, UUID), `id_oficial` (UInt32), `tipo_falta` (String: LEVE, GRAVE, MUY_GRAVE), `descripcion_hechos` (String), `sancion_impuesta` (String), `fecha_incidente` (Date), `impuesta_por` (String), `fecha_registro` (DateTime).

- **Tabla `rrhh_certificacion` (Acreditaciones Tácticas):**
  - Campos: `id_certificacion` (String, UUID), `id_oficial` (UInt32), `nombre_curso` (String: TIRO_TACTICO, PRIMEROS_AUXILIOS, NEGOCIACION_REHENES, CONDUCCION_DEFENSIVA), `institucion_emisora` (String), `fecha_emision` (Date), `fecha_vencimiento` (Date), `estado_certificacion` (String: VIGENTE, EXPIRADA).

- **Tabla `rrhh_roll_call_briefing` y `rrhh_shift_handover` (Minutas y Relevos):**
  - `rrhh_roll_call_briefing`: `id_briefing` (String), `fecha` (Date), `turno` (String), `supervisor_nombre` (String), `instrucciones_generales` (String), `alertas_seguridad` (String).
  - `rrhh_shift_handover`: `id_handover` (String), `fecha` (Date), `oficial_saliente` (String), `oficial_entrante` (String), `novedades_relevantes` (String), `estado_armamento` (String), `confirmado` (UInt8).

---

## 3. Arquitectura API (Django REST Framework)

Rutas bajo `/api/rrhh/`:
- `POST /api/rrhh/clock-in/`: Marcaje digital de entrada con hora del servidor.
- `POST /api/rrhh/clock-out/`: Marcaje de salida y cálculo automático de horas laboradas.
- `GET /api/rrhh/asistencias/`: Listado consolidado de asistencias con filtros de fecha y oficial.
- `GET/POST /api/rrhh/permiso/` y `GET /api/rrhh/permisos/`: Creación y listado de solicitudes de permiso.
- `POST /api/rrhh/permiso/<id>/aprobar/`: Aprobación/Rechazo formal de licencias por RRHH.
- `GET/POST /api/rrhh/amonestacion/`: Registro y consulta de sanciones disciplinarias.
- `GET/POST /api/rrhh/certificacion/`: Control de habilitaciones y vigencia de cursos.
- `GET/POST /api/rrhh/briefings/`: Registro del pase de lista de guardia.
- `GET/POST /api/rrhh/handovers/`: Minuta de entrega de turno y confirmación del relevo.
- `GET /api/rrhh/absenteeism-coverage/`: Cobertura operativa ante bajas y ausencias.
- `GET /api/rrhh/officer-performance/`: Evaluación de métricas de servicio policial.

---

## 4. Arquitectura Frontend (Angular 17+)

- **Componentes Tácticos:**
  - `RrhhDashboardComponent`: Panel central de RRHH con reloj biométrico digital, listado de solicitudes, gestión de permisos, alertas de certificaciones por vencer y minutas de entrega de turno.
