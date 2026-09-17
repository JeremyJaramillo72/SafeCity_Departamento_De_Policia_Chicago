# 📋 Plan de Implementación: Módulo Operativo - Inteligencia Criminal y BOLO

## 1. Visión Arquitectónica y Objetivos
El módulo de **Inteligencia Criminal y BOLO** proporciona a los detectives, analistas y oficiales de mando herramientas para la gestión de sospechosos, bandas criminales, alertas de búsqueda (BOLO), reportes de personas desaparecidas, trazabilidad de cadena de custodia de evidencias y análisis de reincidencia.
Se integra de forma desacoplada con **Django REST Framework** en `/api/criminal/` y `/api/investigacion/`, almacenamiento analítico en **ClickHouse** y evidencias multimedia en **Supabase S3 Storage**.

---

## 2. Arquitectura de Base de Datos (ClickHouse)

Tablas analíticas y forenses con motor `MergeTree`:

- **Tabla `sospechoso` (Perfiles Criminales):**
  - Campos: `id_sospechoso` (UInt32), `alias` (String), `nombre` (String), `apellido` (String), `dni` (String), `fecha_nacimiento` (Date), `genero` (String), `nivel_peligrosidad` (String: BAJO, MEDIO, ALTO, CRITICO), `estado` (String: LIBRE, DETENIDO, PROFUGO), `url_fotografia` (String), `descripcion_fisica` (String), `tatuajes_cicatrices` (String), `id_banda` (Nullable(UInt32)), `fecha_creacion` (DateTime), `creado_por` (String).

- **Tabla `banda_criminal` (Organizaciones):**
  - Campos: `id_banda` (UInt32), `nombre_banda` (String), `territorio_principal` (String), `tipo_actividad` (String), `nivel_amenaza` (String), `fecha_creacion` (DateTime).

- **Tabla `rrhh_bolo` (Be On the Lookout Alerts):**
  - Campos: `id_bolo` (String, UUID), `tipo_alerta` (String: PERSONA_BUSCADA, VEHICULO_ROBADO, PERSONA_DESAPARECIDA, ALERTA_GENERAL), `titulo` (String), `descripcion` (String), `nivel_peligro` (String: CRITICO, ALTO, MEDIO, BAJO), `foto_url` (Nullable(String)), `datos_vehiculo` (Nullable(String)), `id_incidente_ref` (Nullable(String)), `id_persona_desap` (Nullable(String)), `fecha_expiracion` (DateTime), `estado` (String: ACTIVA, EXPIRADA, RESUELTA), `creado_por` (String), `fecha_creacion` (DateTime).

- **Tabla `rrhh_persona_desaparecida` (Personas Desaparecidas):**
  - Campos: `id_reporte` (String, UUID), `nombre_completo` (String), `edad` (UInt8), `genero` (String), `descripcion_fisica` (String), `vestimenta` (String), `foto_url` (Nullable(String)), `ultima_ubicacion` (String), `fecha_desaparicion` (DateTime), `nivel_riesgo` (String: CRITICO, ALTO, MEDIO), `estado_caso` (String: BUSQUEDA_ACTIVA, LOCALIZADA_SEGURA, LOCALIZADA_FALLECIDA, CASO_FRIO), `reportante_nombre` (String), `reportante_telefono` (String), `id_bolo_generado` (Nullable(String)), `creado_por` (String), `fecha_creacion` (DateTime).

- **Tabla `evidencia` y `evidencia_transferencias` (Cadena de Custodia Inmutable):**
  - `evidencia`: `id_evidencia` (UInt32), `case_number` (String), `descripcion` (String), `tipo_evidencia` (String), `url_archivo` (String), `ubicacion_almacen` (String), `custodio_actual_id` (UInt32), `custodio_actual_nombre` (String), `codigo_qr_precinto` (String), `fecha_registro` (DateTime).
  - `evidencia_transferencias`: `id_transferencia` (String, UUID), `id_evidencia` (UInt32), `custodio_emisor` (String), `custodio_receptor` (String), `motivo_transferencia` (String), `fecha_transferencia` (DateTime), `registrado_por` (String).

- **Tabla `testigo` y `victima`:**
  - `testigo`: `id_testigo` (UInt32), `case_number` (String), `nombre` (String), `identificacion` (String), `genero` (String), `telefono` (String), `direccion` (String), `testimonio` (String), `es_anonimo` (UInt8).
  - `victima`: `id_victima` (UInt32), `case_number` (String), `nombre` (String), `identificacion` (String), `genero` (String), `edad` (UInt8), `condicion_medica` (String).

---

## 3. Arquitectura API (Django REST Framework)

Rutas base en `/api/criminal/` e `/api/investigacion/`:
- `GET/POST /api/criminal/suspects/`: CRUD de sospechosos con alias y fotos en Supabase S3.
- `GET /api/criminal/suspects/<id>/cases/`: Casos vinculados al sospechoso.
- `GET/POST /api/criminal/gangs/`: Gestión de bandas y territorios.
- `GET/POST /api/criminal/bolo/`: Emisión de alertas BOLO con expiración obligatoria.
- `PATCH /api/criminal/bolo/<id>/`: Resolver o cancelar alertas BOLO.
- `GET/POST /api/criminal/missing-persons/`: Registro de personas desaparecidas (con auto-generación de BOLO si edad < 12 años).
- `GET/POST /api/criminal/evidence/`: Registro y trazabilidad de indicios.
- `POST /api/criminal/evidence/<id>/transfer/`: Transferencia inmutable de custodia de evidencia.
- `POST /api/criminal/evidence/upload/`: Subida multipart de imágenes forenses hacia Supabase S3.
- `GET /api/criminal/recidivism-stats/`: Estadísticas analíticas de reincidencia por tipología delictiva.
- `GET /api/criminal/graph-network/`: Grafo de conexiones (bandas, vehículos, sospechosos y casos).

---

## 4. Arquitectura Frontend (Angular 17+)

- **Componentes Tácticos:**
  - `CriminalIntelComponent`: Hub de inteligencia con pestañas de Sospechosos, Bandas, Evidencias, Testigos y Víctimas.
  - `BoloAlertsComponent`: Muro táctico de alertas activas con contador de tiempo restante, fotos y filtros de riesgo.
  - `MyCasesComponent`: Bandeja de trabajo del detective para investigación de expedientes y solicitud de resoluciones.
  - `TacticalMapComponent`: Mapa interactivo con capas de calor delictivas y análisis espacial de criminalidad.
