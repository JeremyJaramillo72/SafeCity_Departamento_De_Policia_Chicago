# 📜 Constitución del Sistema: SafeCity Intelligence Ops

Este documento representa la **"Constitución del Sistema"**: el conjunto supremo de leyes, directrices arquitectónicas, estándares de ingeniería y reglas de negocio inquebrantables que rigen el diseño, desarrollo, despliegue y mantenimiento de la plataforma **SafeCity Intelligence Ops**. Ningún desarrollador, arquitecto o administrador está exento de cumplir estas directrices.

---

## 🏛️ TÍTULO I: DE LA ARQUITECTURA GENERAL Y TECNOLOGÍAS

**Artículo 1.** El sistema adoptará una arquitectura cliente-servidor estrictamente desacoplada, con comunicación exclusiva a través de APIs RESTful seguras bajo formato JSON.

**Artículo 2.** El desarrollo del lado del servidor (Backend) se realizará exclusivamente utilizando el framework **Django (Python)** y **Django REST Framework**, modularizado en aplicaciones independientes según el dominio operativo (`gestion_operativa`, `inteligencia_criminal`, `inteligencia_geografica`, `logistica_patrullaje`, `investigacion_especial`, `operativo_rrhh`, `ordenes_judiciales`, `policia_comunitaria`, `administracion_seguridad`).

**Artículo 3.** El desarrollo del lado del cliente (Frontend) se realizará exclusivamente utilizando el framework **Angular 17+ (TypeScript)** con componentes independientes (*Standalone Components*), Tailwind CSS para estilos utilitarios, Material Symbols para iconografía y Leaflet / OpenStreetMap para renderizado geoespacial táctico.

**Artículo 4.** El motor de base de datos primario será **ClickHouse**, un sistema de gestión columnar de alto rendimiento optimizado para consultas analíticas masivas sobre más de 300,000 registros policiales. Su motor `MergeTree` con ordenamiento por fecha y cuadrante garantiza tiempos de respuesta instantáneos.

**Artículo 5.** El almacenamiento persistente de archivos multimedia (fotografías de evidencia, grabaciones de audio forense y reportes PDF) se gestionará en **Supabase Storage (API compatible con S3)** bajo el bucket `Documentos-PDF` mediante adaptadores personalizados de almacenamiento (`AlmacenamientoSafeCity`).

**Artículo 6.** La infraestructura de servicios persistentes (ClickHouse, PocketBase, Apache Airflow) se ejecutará mediante contenedores **Docker** con políticas de reinicio automático (`restart: always`), mientras que los entornos de desarrollo backend y frontend correrán localmente para garantizar *Hot Module Replacement* (HMR).

---

## 🛡️ TÍTULO II: DE LA INTEGRIDAD DE LOS DATOS Y ALMACENAMIENTO FORENSE

**Artículo 7.** **Prohibición Absoluta del Borrado Físico (Hard Delete):** Ningún registro transaccional u operativo (incidentes, evidencias, oficiales, órdenes, inspecciones) podrá ser eliminado físicamente de la base de datos bajo ninguna circunstancia. Toda eliminación será un "Borrado Lógico" (*Soft Delete*) cambiando el estado a inactivo, anulado o archivado.

**Artículo 8.** **Inmutabilidad Forense de Bitácoras:** Todos los registros relacionados con Cadena de Custodia (`evidencia_transferencias`), Bitácora de Detenidos (`bitacora_detenido`), Uso de Fuerza (`descarga_taser`), Asignaciones de Equipo (`equipment_assignments`) y Auditoría de Accesos (`auditoria_sistema`) son estrictamente inmutables (*append-only*). Se prohíbe cualquier operación de `UPDATE` o `DELETE` sobre estas tablas.

**Artículo 9.** **Cuádruple Campo de Auditoría Obligatorio:** Toda tabla transaccional debe incluir por defecto los campos de auditoría: `fecha_creacion` (DateTime), `fecha_modificacion` (DateTime), `creado_por` (String) y `modificado_por` (Nullable String).

**Artículo 10.** **Protección de Integridad Referencial:** Todas las relaciones foráneas (claves foráneas e identificadores de vinculación) deben validarse a nivel de lógica de aplicación y backend para prevenir registros huérfanos.

---

## 🔐 TÍTULO III: DE LA CIBERSEGURIDAD, CONTROL DE ACCESO (RBAC) Y SESIONES

**Artículo 11.** **Control de Acceso Basado en Roles (RBAC):** Toda acción dentro del sistema debe verificar los permisos del usuario activo. Los roles oficiales autorizados son:
1. `administrador` / `comandante`: Mando global, analítica ejecutiva, aprobación y despacho.
2. `administrador_sistema`: Gestión técnica de usuarios, bitácoras de auditoría, categorías y copias de seguridad.
3. `detective`: Gestión e investigación de expedientes, vinculación de pruebas y solicitudes de re-apertura.
4. `oficial`: Registro de incidentes en campo, celdas de detención y reportes de patrulla.
5. `operador_emergencias`: Consola CAD de despacho 911, priorización y asignación de unidades.
6. `recursos_humanos`: Control de asistencia, reloj biométrico, permisos, amonestaciones y certificaciones.
7. `agente_transito`: Infracciones viales, accidentes de tránsito y solicitud de grúas.
8. `jefe_logistica`: Gestión de flota vehicular, asignación exclusiva de equipo táctico y cierre de mantenimiento.

**Artículo 12.** **Autenticación mediante JWT:** La autenticación se efectuará exclusivamente mediante *JSON Web Tokens* (JWT) validados a través de `SafeCityJWTAuthentication`. Los tokens de acceso poseen expiración controlada y contienen los claims de identidad y rol.

**Artículo 13.** **Cierre Forzado de Sesiones Concurrentes:** El sistema implementará el mecanismo `force-logout` para cerrar remotamente sesiones concurrentes o comprometidas, registrando cada inicio y cierre en `historial_sesion`.

**Artículo 14.** **Protección de Contraseñas y Recuperación Segura:** Las contraseñas se almacenarán utilizando algoritmos de derivación de claves criptográficas (*PBKDF2/Bcrypt/Argon2*). La recuperación de claves se gestionará mediante tokens temporales enviados a través del servicio de correo corporativo SMTP con cifrado TLS.

**Artículo 15.** **Protección de Testigos e Información Confidencial (PII):** Los datos personales de testigos protegidos, menores de edad o informantes clasificados deben protegerse mediante pseudonimización o encriptación AES-256 a nivel de aplicación.

---

## ✍️ TÍTULO IV: DE LOS ESTÁNDARES DE ESCRITURA Y CÓDIGO LIMPIO

**Artículo 16.** **Idioma Oficial del Sistema:**
- **Frontend / Interfaz de Usuario:** Absolutamente todo el texto visible para el usuario (etiquetas, botones, tablas, formularios, modales, alertas y reportes) debe estar redactado estrictamente en **ESPAÑOL**.
- **Backend y Esquemas:** Nombres de tablas, columnas, modelos, funciones, variables y comentarios deben escribirse en **ESPAÑOL** (ej. `infraccion_transito`, `ingreso_celda`, `nombre_detenido`).

**Artículo 17.** **Estándares de Codificación:** El código backend en Python debe cumplir con el estándar **PEP 8**. El código frontend en TypeScript debe adherirse a las guías de estilo oficiales de Angular, utilizando tipado estricto y componentes declarativos.

**Artículo 18.** **Principio de Responsabilidad Única y Controladores Delgados:** Las vistas de Django REST Framework deben delegar la lógica compleja a capas de servicio, clientes de base de datos o utilitarios específicos, manteniendo las vistas legibles y enfocadas en la validación HTTP y respuesta de datos.

---

## 🎨 TÍTULO V: DEL SISTEMA DE DISEÑO TÁCTICO E INTERFAZ DE USUARIO (UI/UX)

**Artículo 19.** **Paleta de Colores Táctica Corporativa (Modo Oscuro Obligatorio):**
- **Fondo Principal:** Azul Marino Profundo / Navy Dark (`#0A1128` / `bg-surface-container-lowest`).
- **Acentos Primarios:** Azul Eléctrico Táctico (`#0066FF` / `bg-primary`) para botones de acción y elementos clave.
- **Alertas Críticas y Emergencias:** Rojo Sangre Táctico (`#D32F2F` / `bg-error`) para incidentes graves, BOLO y uso de fuerza.
- **Éxito y Operatividad Normal:** Verde Táctico (`#2E7D32` / `bg-success`) para unidades disponibles y tareas concluidas.
- **Advertencias y Mantenimiento:** Ámbar Táctico (`#F59E0B` / `bg-warning`) para fallas y riesgos medios.

**Artículo 20.** **Tipografía y Legibilidad:** La tipografía corporativa obligatoria será **'Inter'** (sans-serif), garantizando máxima legibilidad tanto en terminales fijas como en tablets de patrulla bajo luz solar.

**Artículo 21.** **Dimensiones de Interacción Táctil:** Los botones y campos de entrada interactivos deben tener un alto mínimo de `48px` para facilitar su uso por oficiales con guantes tácticos o en movimiento.

**Artículo 22.** **Retroalimentación Visual Inmediata:** Toda operación asíncrona (guardado, filtrado, carga masiva o despacho) debe mostrar indicadores de carga (*spinners* o *skeletons*) para evitar dobles envíos.

---

## 🔄 TÍTULO VI: DEL PIPELINE DE DATOS, ETL Y PROCESAMIENTO ANALÍTICO

**Artículo 23.** **Orquestación mediante Apache Airflow:** Los procesos de extracción, transformación y carga (ETL) periódicos serán orquestados por Apache Airflow a través del DAG `safecity_carga_incremental_semanal`.

**Artículo 24.** **Tránsito de Datos en Apache Parquet:** Todo lote de datos masivo extraído de fuentes externas o transaccionales debe comprimirse en formato columnar **Apache Parquet** con motor **PyArrow** antes de su inyección por lotes (*batch insert*) en ClickHouse.

**Artículo 25.** **Telemetría y Control de Ingesta:** El pipeline ETL debe auditar el volumen de registros procesados, tiempo de ejecución y tipificado estricto de columnas (coordenadas geográficas, fechas ISO y valores booleanos).

---

## 🚨 TÍTULO VII: DE LA GESTIÓN DE INCIDENTES Y DESPACHO CAD 911

**Artículo 26.** **Consola CAD de Emergencias 911:** Las llamadas de auxilio recibidas deben registrarse en la tabla `llamada_emergencia` con tipificación de prioridad (1 a 5), geocodificación automática y estado de llamada (`PENDIENTE`, `DESPACHADA`, `ATENDIDA`, `CANCELADA`).

**Artículo 27.** **Trazabilidad de Despacho de Unidades:** El despacho de patrullas hacia un incidente debe registrar la hora de despacho, tiempo de respuesta y vínculo directo entre la llamada 911 y el número de caso del incidente criminal (`chicago_crimes`).

**Artículo 28.** **Geolocalización Automática:** Todo nuevo incidente creado en campo debe registrar obligatoriamente las coordenadas satelitales (latitud y longitud en formato decimal) y la dirección textual (*block/calle*).

---

## 🚔 TÍTULO VIII: DEL TRÁNSITO, DETENCIONES Y CELDAS DE SEGURIDAD

**Artículo 29.** **Control Vial e Infracciones:** Las multas e infracciones de tránsito se registrarán en `infraccion_transito`, vinculando placa vehicular, tipo de sanción, oficial interviniente y evidencia fotográfica en Supabase S3.

**Artículo 30.** **Accidentes Viales y Grúas:** Todo siniestro de tránsito (`accidente_transito`) que requiera remoción de vehículos debe generar un registro en `despacho_grua` con asignación de corralón y estado de servicio.

**Artículo 31.** **Ingreso a Celdas y Custodia de Pertenencias:** Toda persona aprehendida debe registrarse en `ingreso_celda` con número de celda asignado, estado de salud, inventario detallado de pertenencias incautadas y bitácora médica o legal inmutable en `bitacora_detenido`.

**Artículo 32.** **Monitoreo de Ocupación de Celdas:** El sistema debe proveer en tiempo real el porcentaje de ocupación y disponibilidad del pabellón de celdas (`CellStatusView`).

---

## 🕵️‍♂️ TÍTULO IX: DE LA INTELIGENCIA CRIMINAL, BOLO Y CADENA DE CUSTODIA

**Artículo 33.** **Alertas B.O.L.O. (Be On the Lookout):** Las alertas de búsqueda y captura (`rrhh_bolo`) deben emitirse con nivel de peligro (`CRITICO`, `ALTO`, `MEDIO`, `BAJO`), fecha obligatoria de expiración y vinculación a sospechosos o vehículos reportados.

**Artículo 34.** **Protocolo de Personas Desaparecidas:** El registro de un reporte en `rrhh_persona_desaparecida` de una persona menor de 12 años o en situación de vulnerabilidad extrema activará automáticamente el nivel de riesgo `CRITICO` y generará de forma inmediata una alerta BOLO en el sistema.

**Artículo 35.** **Cadena de Custodia Inviolable:** Cada indicio o evidencia física o digital (`evidencia`) debe rastrear su custodia completa a través de `evidencia_transferencias`, registrando el oficial emisor, receptor, motivo del traspaso, fecha y número de precinto o código QR.

---

## 📦 TÍTULO X: DE LA LOGÍSTICA, FLOTA Y EQUIPAMIENTO TÁCTICO

**Artículo 36.** **Exclusividad en Asignación de Equipamiento:** Un ítem de equipamiento táctico (radio policial, bodycam, chaleco antibalas, táser) registrado en `equipment_catalog` no podrá ser asignado a más de un oficial simultáneamente. Toda entrega y devolución debe asentarse en `equipment_assignments`.

**Artículo 37.** **Inhabilitación Automática por Falla Crítica:** Al registrar un ticket de mantenimiento (`maintenance_tickets`) con gravedad `ALTA`, el vehículo en cuestión pasará automáticamente a estado `FUERA_DE_SERVICIO` en `vehicle_fleet`, bloqueando su asignación en patrullajes activos.

**Artículo 38.** **Cierre Reservado de Mantenimiento:** Únicamente el usuario con rol de `jefe_logistica` o `administrador` tiene atribuciones para marcar un ticket de mantenimiento como `RESUELTO`.

**Artículo 39.** **Modelos de Inteligencia Predictiva:** El módulo de logística incorporará algoritmos predictivos para:
1. Estimación de fallas mecánicas y mantenimiento preventivo por kilometraje.
2. Predicción de desgaste y fatiga operativa (*burnout*) de oficiales según horas de patrullaje acumuladas.

---

## ⚖️ TÍTULO XI: DE LA INVESTIGACIÓN ESPECIAL Y ÓRDENES JUDICIALES

**Artículo 40.** **Flujo de Asignación de Expedientes:** Los casos criminales asignados a detectives (`investigacion_especial`) requerirán seguimiento documentado, escalamiento de prioridad y aprobación del Comandante/Sheriff para reaperturas o solicitudes de cierre formal.

**Artículo 41.** **Emisión y Ejecución de Órdenes Judiciales:** Toda orden de captura, orden de allanamiento o medida cautelar registrada en `orden_judicial` debe contar con número de juzgado, juez emisor, fecha límite y registro inmutable de resultado en `ejecucion_orden`.

---

## 👥 TÍTULO XII: DEL TALENTO HUMANO Y DISCIPLINA OPERATIVA

**Artículo 42.** **Control de Asistencia Digital:** El personal policial debe marcar sus jornadas de servicio mediante `ClockInView` y `ClockOutView`, almacenando marcas temporales y geolocalización en `rrhh_asistencia_registro`.

**Artículo 43.** **Gestión de Permisos y Licencias:** Toda solicitud de permiso o licencia médica (`rrhh_solicitud_permiso`) debe ser revisada y aprobada exclusivamente por el departamento de Recursos Humanos o el Comandante.

**Artículo 44.** **Régimen Disciplinario y Certificaciones:** Las sanciones administrativas se asentarán en `rrhh_amonestacion`, mientras que las habilitaciones en tiro, tácticas urbanas y manejo defensivo se certificarán en `rrhh_certificacion`.

**Artículo 45.** **Entrega de Guardia y Minuta de Servicio:** Al finalizar cada turno, se debe completar la minuta de traspaso (`rrhh_shift_handover`) y el pase de lista de novedades operativas (`rrhh_roll_call_briefing`).

---

## 🤝 TÍTULO XIII: DE LA POLICÍA COMUNITARIA, TRANSPARENCIA Y USO DE FUERZA

**Artículo 46.** **Portal de Transparencia Ciudadana:** El sistema pondrá a disposición ciudadana indicadores consolidados de gestión, incidentes públicos y mapas de prevención sin revelar datos personales de víctimas ni oficiales.

**Artículo 47.** **Trámite de Quejas Ciudadanas:** Las quejas interpuestas por ciudadanos contra el accionar policial se registrarán en `queja_ciudadana` con número de folio único y asignación a investigación de asuntos internos.

**Artículo 48.** **Auditoría Estricta de Uso de la Fuerza:** Todo incidente donde un oficial emplee armamento letal o dispositivo de control electrónico no letal (`descarga_taser`) deberá ser reportado con justificación circunstanciada, número de disparos/segundos de descarga y evaluación médica inmediata.

---

## ⚡ TÍTULO XIV: DEL RENDIMIENTO, DISPONIBILIDAD Y SLAs

**Artículo 49.** **Acuerdos de Nivel de Servicio (SLA):**
- Las consultas y filtros sobre el mapa táctico y despacho CAD deben resolver en un tiempo inferior a **800 milisegundos**.
- Las consultas analíticas masivas sobre ClickHouse no deben superar los **2.0 segundos**.
- La disponibilidad global del sistema en producción debe alcanzar un SLA mínimo del **99.5%**.

**Artículo 50.** **Límites de Almacenamiento y Optimización:** El tamaño máximo para evidencias fotográficas y reportes PDF adjuntos será de **50 MB**. Las imágenes serán optimizadas en el frontend antes de su transmisión hacia Supabase S3.

---

## 💾 TÍTULO XV: DE LA COPIA DE SEGURIDAD Y RECUPERACIÓN ANTE DESASTRES

**Artículo 51.** **Políticas de Respaldo:** El sistema contará con herramientas automáticas (`BackupListCreateView`) para generar instantáneas comprimidas de los metadatos y bases de datos, almacenándolas de forma segura y permitiendo la restauración asistida (`BackupRestoreView`).

**Artículo 52.** **Objetivos de Recuperación (DRP):** El Tiempo Objetivo de Recuperación (*RTO*) no superará las **4 horas**, y el Punto Objetivo de Recuperación (*RPO*) no excederá **1 hora** ante fallas de infraestructura.

---

## 🚀 TÍTULO XVI: DEL CONTROL DE VERSIONES Y GOBERNANZA

**Artículo 53.** **Versionado de APIs:** Toda interfaz de programación expuesta por el backend debe incluir prefijos de versión formal (ej. `/api/v1/` o rutas funcionales `/api/operativa/`, `/api/criminal/`), evitando modificaciones destructivas que comprometan a los clientes activos.

**Artículo 54.** **Flujo de Integración Continua:** Se prohíbe el despliegue directo a ramas principales sin pasar previamente por pruebas automatizadas de regresión (QA), auditoría de esquemas y verificación de cumplimiento constitucional.
