# Documento de Especificación — SafeCity Intelligence Ops
### Módulos Operativos (Metodología Spec Driven Development)

---

## Índice General
1. [Especificación: Módulo Operativo — Incidentes y Emergencias 911](#especificación-módulo-operativo--incidentes-y-emergencias-911)
2. [Especificación: Módulo Operativo — Inteligencia Criminal y Detectives](#especificación-módulo-operativo--inteligencia-criminal-y-detectives)
3. [Especificación: Módulo Operativo — Logística y Flota](#especificación-módulo-operativo--logística-y-flota)
4. [Especificación: Módulo Operativo — Recursos Humanos y Personal](#especificación-módulo-operativo--recursos-humanos-y-personal)
5. [Especificación: Módulo Operativo — Ciberseguridad y Auditoría](#especificación-módulo-operativo--ciberseguridad-y-auditoría)
6. [Especificación: Módulo Operativo — Gestión de Tránsito](#especificación-módulo-operativo--tránsito-comunidad-y-celdas)

---

<br>

# Especificación: Módulo Operativo — Incidentes y Emergencias 911

## 1. Objetivo
Permitir que los Oficiales de Patrulla y los Operadores de Emergencias registren con máxima precisión, velocidad y trazabilidad legal todos los datos de un incidente delictivo, desde la recepción de la llamada al 911 hasta el cierre de la escena del crimen.

## 2. Contexto
Cada incidente criminal que no se registra de forma correcta pierde su valor judicial. Los Oficiales en campo necesitan una interfaz rápida para documentar desde su móvil. El Operador necesita clasificar la gravedad (Triage) y despachar la unidad correcta en segundos para cumplir con los SLAs.

## 3. Actores
- Oficial de Patrulla
- Operador de Emergencias (911)
- Sheriff (Solo lectura)

## 4. Requisitos funcionales
| Código | Nombre | Descripción |
| :--- | :--- | :--- |
| **RF-INC-001** | Registrar Ubicación GPS del Incidente | El sistema debe capturar automáticamente las coordenadas GPS del dispositivo del Oficial al crear el incidente. |
| **RF-INC-002** | Clasificar Tipo Penal | El sistema debe permitir seleccionar el tipo de delito desde un catálogo estandarizado IUCR/FBI. |
| **RF-INC-003** | Despachar Unidad y Trazar Ruta | El sistema debe permitir seleccionar la unidad más cercana y calcular la ruta de llegada óptima con ETA. |
| **RF-INC-004** | Registrar Tiempo de Llegada de Patrullas a Emergencias | El sistema debe registrar automáticamente los timestamps de despacho y de llegada a la escena. |
| **RF-INC-005** | Ingresar Número de Víctimas | El sistema debe permitir registrar la cantidad de víctimas civiles y policiales afectadas. |
| **RF-INC-006** | Detallar Uso o Detonación de Armas | El sistema debe registrar mediante un campo booleano si hubo uso de armas de fuego. |
| **RF-INC-007** | Adjuntar Fotografías de Evidencia | El sistema debe permitir subir fotografías comprimidas a máximo 2 MB con metadatos inmutables. |
| **RF-INC-008** | Registrar Estado Climático | El sistema debe registrar las condiciones climáticas al momento del incidente. |
| **RF-INC-009** | Clasificar Nivel de Gravedad — Triage 911 | El sistema debe permitir clasificar la llamada de emergencia en una escala de 1 a 5 obligatoriamente. |

## 5. Requisitos no funcionales
| Código | Categoría | Descripción |
| :--- | :--- | :--- |
| **RNF-INC-001** | Usabilidad | El formulario de registro debe completarse en máximo 3 pasos desde la aplicación móvil. |
| **RNF-INC-002** | Rendimiento | La captura del GPS y la apertura del formulario no deben tardar más de 3 segundos. |
| **RNF-INC-003** | Disponibilidad Offline | El formulario debe funcionar en modo offline y sincronizarse automáticamente. |

## 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-INC-001** | Un incidente no puede guardarse sin coordenadas GPS válidas y sin un tipo de delito. |
| **RN-INC-002** | El ID único del incidente es generado automáticamente y no puede ser modificado. |
| **RN-INC-003** | El Triage 911 debe completarse antes de ejecutar el despacho de la unidad. |
| **RN-INC-004** | Si el nivel de Triage es 5 (Crítico), el sistema genera una alerta al Sheriff. |

## 7. Entradas
- Coordenadas GPS
- Código de tipo penal IUCR
- Número de víctimas heridas y fallecidas
- Uso de arma de fuego
- Fotografías de la escena
- Condición climática
- Nivel de Triage
- ID de la unidad despachada

## 8. Salidas
- ID único del incidente
- Marcador en el Mapa Táctico
- Bitácora del despacho 911
- Tiempo de respuesta calculado
- Carpeta de evidencias fotográficas
- Notificación de alerta (Triage 5)

## 9. Estados posibles
Los incidentes pueden tener los siguientes estados:
- Abierto
- En Investigación
- Cerrado
- Archivado

## 10. Escenarios
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Registro exitoso de incidente** | El Oficial de Patrulla tiene señal GPS activa y completa los datos obligatorios. | Guarda la información. | El sistema debe registrar el incidente, mostrar un mensaje de confirmación y el ID generado. |
| **Registro sin GPS** | El dispositivo no tiene señal GPS y el oficial no ingresa coordenadas manualmente. | Intenta guardar la información. | El sistema debe mostrar un mensaje de error solicitando ubicación y no debe registrar el incidente. |
| **Despacho 911 con Triage Crítico** | El Operador recibe una llamada de tiroteo activo. | Asigna nivel de Triage 5 y confirma el despacho. | El sistema debe registrar la hora de despacho y debe enviar una notificación de alerta al Sheriff. |

## 11. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-INC-001** | El sistema impide guardar un incidente sin ubicación GPS válida. |
| **CA-INC-002** | El sistema impide modificar el ID único del incidente una vez creado. |
| **CA-INC-003** | El sistema rechaza niveles de Triage que no estén entre 1 y 5. |
| **CA-INC-004** | El sistema calcula el tiempo de respuesta usando la diferencia entre hora de despacho y hora de llegada. |

## 12. Dependencias
Este módulo puede depender de:
- Módulo de Autenticación y Roles
- Módulo Táctico (Mapas)
- API Meteorológica Externa

## 13. Fuera de alcance
En esta versión no se incluye:
- Transmisión de video en vivo desde bodycams.
- Reconocimiento facial en fotografías forenses.
- Integración con sistemas CAD externos.

---

<br>

# Especificación: Módulo Operativo — Inteligencia Criminal y Detectives

## 1. Objetivo
Dotar a los Detectives e Investigadores Especiales de herramientas digitales para estructurar y gestionar expedientes complejos, registrando sospechosos, custodia de evidencia y testimonios, asegurando la trazabilidad legal del caso.

## 2. Contexto
Las investigaciones mayores requieren centralizar piezas dispersas de información. El registro inmutable de la cadena de custodia de evidencias y el enmascaramiento de testigos confidenciales son requerimientos críticos para evitar que los casos se caigan en tribunales.

## 3. Actores
- Detective
- Oficial de Patrulla
- Sheriff

## 4. Requisitos funcionales
| Código | Nombre | Descripción |
| :--- | :--- | :--- |
| **RF-INT-001** | Ingresar Alias del Sospechoso | El sistema debe permitir registrar el alias y características físicas sin conocer su nombre legal. |
| **RF-INT-002** | Describir Tatuajes y Señas | El sistema debe proporcionar campos para documentar tatuajes o marcas distintivas. |
| **RF-INT-003** | Registrar Placas de Vehículos | El sistema debe permitir vincular matrículas y modelos de vehículos al expediente. |
| **RF-INT-004** | Testimonio Confidencial | El sistema debe permitir registrar declaraciones enmascarando automáticamente la identidad del testigo. |
| **RF-INT-005** | Subir Audios de Interrogatorios| El sistema debe permitir adjuntar archivos de audio (.mp3 o .wav) vinculándolos al caso. |
| **RF-INT-006** | Relacionar Arresto | El sistema debe permitir asociar un arresto nuevo a un expediente activo. |
| **RF-INT-007** | Custodia de Evidencia | El sistema debe registrar la trazabilidad de la evidencia física (Cadena de Custodia). |
| **RF-INT-008** | Ingresar Notas Periciales | El sistema debe permitir agregar observaciones forenses a la bitácora. |
| **RF-INT-009** | Reporte Conclusivo y Cerrar Caso | El sistema debe generar un reporte final consolidado en formato PDF aprobado y firmado. |

## 5. Requisitos no funcionales
| Código | Categoría | Descripción |
| :--- | :--- | :--- |
| **RNF-INT-001** | Seguridad de Testigos | La identidad real de un testigo confidencial debe estar cifrada en la base de datos. |
| **RNF-INT-002** | Trazabilidad | Toda modificación a los registros del expediente debe registrar el timestamp y el ID del autor. |
| **RNF-INT-003** | Almacenamiento | Los archivos de audio no deben superar los 50 MB de peso por carga. |

## 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-INT-001** | Un expediente no puede cerrarse si no cuenta con un Reporte Conclusivo generado y aprobado. |
| **RN-INT-002** | Los testimonios confidenciales se mostrarán en reportes con un ID hash anónimo. |
| **RN-INT-003** | Cada evento en la cadena de custodia registra inmutablemente el timestamp y el hash del usuario. |

## 7. Entradas
- Alias y descripciones físicas
- Matrículas vehiculares
- Textos de testimonios
- Archivos de audio (.mp3)
- Códigos QR de evidencia
- Notas periciales

## 8. Salidas
- Perfil de sospechoso consolidado
- Expediente de Caso Mayor actualizado
- ID Hash anónimo para testigos
- Reporte Conclusivo en formato PDF
- Bitácora inmutable de cadena de custodia

## 9. Estados posibles
Los expedientes pueden tener los siguientes estados:
- Aperturado
- En Investigación Activa
- Pendiente de Juicio
- Cerrado

## 10. Escenarios
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Registro de Testimonio Confidencial** | El Detective entrevista a un testigo protegido y marca la casilla de confidencialidad. | Guarda el testimonio. | El sistema debe cifrar el nombre real y generar un ID Hash anónimo para la vista del expediente. |
| **Cierre de Expediente inválido** | El Detective intenta cerrar un caso y no ha generado el Reporte Conclusivo. | Intenta cambiar el estado a Cerrado. | El sistema debe bloquear la acción y mostrar un mensaje requiriendo el reporte final. |

## 11. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-INT-001** | El sistema permite registrar sospechosos solo con su alias y descripción. |
| **CA-INT-002** | El nombre real de testigos protegidos nunca aparece en las exportaciones PDF estándar. |
| **CA-INT-003** | El log de cadena de custodia siempre incluye usuario, fecha, hora y acción realizada. |

## 12. Dependencias
Este módulo puede depender de:
- Módulo Operativo de Incidentes (origen de investigaciones)
- Azure Blob Storage (almacenamiento de audios)

## 13. Fuera de alcance
En esta versión no se incluye:
- Transcripción automática de audio a texto mediante IA.
- Interfaz directa con bases de datos nacionales (NCIC).

---

<br>

# Especificación: Módulo Operativo — Logística y Flota

## 1. Objetivo
Gestionar y auditar la asignación y estado del equipamiento policial y la flota vehicular, asegurando el control estricto sobre patrullas, armamento y herramientas entregadas en cada turno.

## 2. Contexto
El extravío de equipo táctico y el uso de patrullas con fallas mecánicas generan altos costos. El módulo digitaliza los inventarios y obliga al registro de entrega/recepción en cada cambio de guardia.

## 3. Actores
- Jefe de Logística
- Oficial de Patrulla

## 4. Requisitos funcionales
| Código | Nombre | Descripción |
| :--- | :--- | :--- |
| **RF-LOG-001** | Registrar Kilometraje | El sistema debe permitir registrar el odómetro al inicio y fin del turno. |
| **RF-LOG-002** | Reportar Daños en Carrocería | El sistema debe permitir reportar daños visuales mediante checklist. |
| **RF-LOG-003** | Informar Nivel de Combustible | El sistema debe registrar el porcentaje del tanque asignado. |
| **RF-LOG-004** | Registrar Entrega de Radio | El sistema debe asignar un radio de comunicación por Número de Serie. |
| **RF-LOG-005** | Escanear Bodycam | El sistema debe registrar la asignación de cámara corporal mediante código de barras. |
| **RF-LOG-006** | Reportar Munición Asignada | El sistema debe llevar el conteo exacto de munición entregada. |
| **RF-LOG-007** | Ticket de Falla Mecánica | El sistema debe permitir crear solicitudes de mantenimiento para la flota. |
| **RF-LOG-008** | Registrar Descarga de Taser | El sistema debe generar un reporte obligatorio cuando un oficial acciona su taser. |
| **RF-LOG-009** | Informar Presión Neumáticos | El sistema debe registrar el estado de neumáticos en la revisión pre-turno. |

## 5. Requisitos no funcionales
| Código | Categoría | Descripción |
| :--- | :--- | :--- |
| **RNF-LOG-001** | Eficiencia | El proceso de check-out/check-in debe tomar menos de 2 minutos por oficial. |
| **RNF-LOG-002** | Auditoría Crítica | El uso del taser debe generar alertas automáticas de alta prioridad. |

## 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-LOG-001** | Un vehículo con ticket de falla en estado "Abierto" cambia a "En Mantenimiento" y no puede asignarse. |
| **RN-LOG-002** | El registro de una Descarga de Taser alerta automáticamente a Asuntos Internos. |
| **RN-LOG-003** | El kilometraje de final de turno no puede ser inferior al inicial. |

## 7. Entradas
- Valores de odómetro
- Porcentaje de combustible
- Números de serie de Bodycams y Radios
- Detalles de fallas mecánicas

## 8. Salidas
- Estado actualizado del vehículo
- Inventario de equipo asignado
- Tickets de mantenimiento
- Alertas de auditoría (Taser)

## 9. Estados posibles
Los vehículos de flota pueden tener los siguientes estados:
- Disponible
- Asignado a Turno
- En Mantenimiento
- Fuera de Servicio

## 10. Escenarios
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Patrulla con Falla Mecánica** | El Oficial detecta una falla pre-turno y levanta un ticket de mantenimiento. | Guarda el reporte. | El sistema debe cambiar el estado a "En Mantenimiento" y el vehículo no debe aparecer disponible para el siguiente turno. |
| **Uso de Taser en campo** | El Oficial detona su Taser. | Registra el uso en la aplicación. | El sistema debe generar un log inmutable y debe enviar una alerta a Asuntos Internos. |

## 11. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-LOG-001** | El sistema bloquea la asignación de patrullas averiadas. |
| **CA-LOG-002** | El sistema exige que el número de serie de equipos asignados exista en el catálogo. |

## 12. Dependencias
Este módulo puede depender de:
- Base de datos institucional de inventarios.
- Módulo de Roles y Permisos.

## 13. Fuera de alcance
En esta versión no se incluye:
- Telemetría vehicular en tiempo real (OBD-II).
- Descarga automática de video desde bodycams por WiFi.

---

<br>

# Especificación: Módulo Operativo — Recursos Humanos y Personal

## 1. Objetivo
Gestionar la asignación de turnos, cuadrantes y el expediente laboral del personal, permitiendo registrar la asistencia, permisos, y amonestaciones disciplinarias.

## 2. Contexto
La planificación manual de turnos conduce a solapamientos y horas extra injustificadas. Un sistema unificado permite optimizar el despliegue del personal y la cobertura operativa.

## 3. Actores
- Sheriff
- Oficial de Patrulla
- Administrador del sistema

## 4. Requisitos funcionales
| Código | Nombre | Descripción |
| :--- | :--- | :--- |
| **RF-RRH-001** | Registrar Clock-in / Clock-out | El sistema debe permitir a los oficiales registrar entrada y salida con hora del servidor. |
| **RF-RRH-002** | Asignar Oficial a Cuadrante | El sistema debe permitir asignar oficiales a zonas de patrullaje por turno. |
| **RF-RRH-003** | Solicitud de Permisos | El sistema debe permitir solicitar días libres o médicas mediante flujo de aprobación. |
| **RF-RRH-004** | Amonestación en Hoja de Vida | El sistema debe permitir registrar sanciones disciplinarias inmutables. |
| **RF-RRH-005** | Actualizar Certificaciones | El sistema debe mantener un catálogo de entrenamientos aprobados por el oficial. |

## 5. Requisitos no funcionales
| Código | Categoría | Descripción |
| :--- | :--- | :--- |
| **RNF-RRH-001** | Consistencia Horaria | El reloj de asistencia debe usar estrictamente la hora UTC del servidor central para evitar fraudes. |
| **RNF-RRH-002** | Accesibilidad | Los oficiales deben poder visualizar sus turnos asignados desde cualquier dispositivo móvil. |

## 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-RRH-001** | Un oficial no puede realizar Clock-in si ya tiene un turno abierto sin cerrar (falta de Clock-out). |
| **RN-RRH-002** | Las solicitudes de permiso nacen como "Pendientes" y no afectan la asistencia hasta ser aprobadas. |
| **RN-RRH-003** | Las amonestaciones registradas son inmutables para garantizar transparencia. |

## 7. Entradas
- Timestamps de asistencia
- Fechas de solicitud de permisos
- Texto de amonestaciones
- Nombres de certificaciones

## 8. Salidas
- Registro de horas trabajadas
- Estado de permisos
- Expediente laboral actualizado
- Calendario de turnos del cuadrante

## 9. Estados posibles
Las solicitudes de permisos pueden tener los siguientes estados:
- Pendiente
- Aprobada
- Rechazada
- Cancelada por el usuario

## 10. Escenarios
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Prevención de Doble Clock-in** | Un oficial olvidó hacer Clock-out ayer. | Intenta hacer Clock-in hoy. | El sistema debe bloquear el registro y debe exigir el cierre del turno anterior. |
| **Aprobación de vacaciones** | Un oficial solicita vacaciones para la próxima semana y el Sheriff lo aprueba. | El sistema programa los turnos semanales. | El sistema no debe asignar al oficial en esa semana y debe marcar esos días como Permiso Aprobado. |

## 11. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-RRH-001** | El sistema debe ignorar la hora local del dispositivo móvil para el Clock-in. |
| **CA-RRH-002** | El sistema debe advertir visualmente si se intenta asignar un oficial a un turno superpuesto con un permiso aprobado. |
| **CA-RRH-003** | El sistema genera el cálculo total de horas de la semana basándose en las diferencias de Clock-in y Clock-out. |

## 12. Dependencias
Este módulo puede depender de:
- Módulo de Autenticación (Listado de Oficiales).
- Base de datos institucional.

## 13. Fuera de alcance
En esta versión no se incluye:
- Cálculo automático de nómina y pagos salariales.
- Integración biométrica física (huelleros de estación).

---

<br>

# Especificación: Módulo Operativo — Ciberseguridad y Auditoría

## 1. Objetivo
Garantizar la integridad, confidencialidad y disponibilidad de la plataforma mediante auditoría inmutable de accesos para cumplir la normativa federal CJIS.

## 2. Contexto
Por la sensibilidad de los datos policiales, el sistema requiere control estricto sobre quién accede y registrar la huella de cada operación para prevenir la corrupción de evidencias y asegurar que los expedientes sigan siendo válidos ante la ley.

## 3. Actores
- Administrador del Sistema
- Sistema (Rutinas automáticas)

## 4. Requisitos funcionales
| Código | Nombre | Descripción |
| :--- | :--- | :--- |
| **RF-SEG-001** | Rastrear Inicio de Sesión | El sistema debe registrar cada intento de login, capturando IP, dispositivo y timestamp. |
| **RF-SEG-002** | Modificar Permisos RBAC | El sistema debe permitir gestionar qué roles acceden a qué módulos. |
| **RF-SEG-003** | Ejecutar Respaldo de BD | El sistema debe ejecutar respaldos completos de la base de datos y registrar resultado. |
| **RF-SEG-004** | Etiquetar Acceso Evidencias | El sistema debe generar log inmutable cuando un usuario visualiza o descarga evidencia. |
| **RF-SEG-005** | Bloquear Cuenta (Fuerza Bruta)| El sistema debe deshabilitar cuentas automáticamente tras contraseñas incorrectas múltiples. |

## 5. Requisitos no funcionales
| Código | Categoría | Descripción |
| :--- | :--- | :--- |
| **RNF-SEG-001** | Seguridad de Contraseñas | Las contraseñas deben estar hasheadas (bcrypt) y nunca almacenarse en texto plano. |
| **RNF-SEG-002** | Rendimiento de Escritura | La grabación de logs de auditoría no debe sumar más de 500 ms de latencia a las transacciones. |

## 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-SEG-001** | Los logs de `Fact_Auditoria_Sistema` son estrictamente append-only (inmutables). |
| **RN-SEG-002** | El umbral de bloqueo automático de cuenta es de 3 intentos fallidos por 15 minutos. |
| **RN-SEG-003** | Todo cambio en permisos RBAC registra automáticamente al administrador responsable. |

## 7. Entradas
- Credenciales de acceso (Usuario/Contraseña)
- Configuración de roles y permisos
- Políticas de backup

## 8. Salidas
- Logs de acceso (IP, User-Agent, Timestamp)
- Alertas críticas de seguridad
- Archivos de respaldo SQL o Dumps

## 9. Estados posibles
Las cuentas de usuario en el contexto de seguridad pueden estar en los siguientes estados:
- Activa
- Bloqueada Temporalmente (Fuerza Bruta)
- Inactiva (Suspendida)

## 10. Escenarios
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Bloqueo por Fuerza Bruta** | Un usuario ingresa contraseña incorrecta 3 veces. | Intenta un 4to acceso. | El sistema debe rechazar el intento, bloquear la cuenta temporalmente y generar una alerta. |
| **Auditoría de Caso Mayor** | Un Detective abre el reporte de un Caso Mayor. | El documento se carga en pantalla. | El sistema debe insertar un registro en auditoría indicando quién vio el documento y a qué hora. |

## 11. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-SEG-001** | Todo UPDATE o DELETE ejecutado en la base de datos genera un registro previo en auditoría. |
| **CA-SEG-002** | El sistema impide acceder a un módulo si el rol en la matriz RBAC no tiene el permiso explícito. |
| **CA-SEG-003** | El bloqueo por 3 intentos fallidos se levanta automáticamente transcurridos los 15 minutos. |

## 12. Dependencias
Este módulo puede depender de:
- Todos los módulos operativos (que envían sus logs hacia aquí).
- Azure Storage (para guardar los archivos de respaldo).

## 13. Fuera de alcance
En esta versión no se incluye:
- Autenticación Biométrica nativa a nivel de aplicación (se usará SSO externo).
- Cortafuegos de aplicaciones web (WAF) en capa de aplicación (se manejará a nivel de red).

---

<br>

# Especificación: Módulo Operativo — Gestión de Tránsito

## 1. Objetivo
Digitalizar multas viales, registrar interacción comunitaria preventiva y gestionar el inventario seguro de pertenencias de detenidos (booking) en estaciones de policía.

## 2. Contexto
Las infracciones de tránsito en papel son lentas de procesar y auditar. Además, la falta de control digital estricto sobre las celdas y las pertenencias genera riesgos de demandas civiles contra el departamento de policía.

## 3. Actores
- Oficial de Patrulla / Oficial de Patrulla
- Operador de Emergencias / Despachador

## 4. Requisitos funcionales
| Código | Nombre | Descripción |
| :--- | :--- | :--- |
| **RF-TRA-001** | Emitir Infracción de Tránsito | El sistema debe generar multas electrónicas capturando datos, GPS y artículo infringido. |
| **RF-TRA-002** | Registrar Prueba de Alcoholemia| El sistema debe registrar el nivel numérico de alcohol en sangre (BAC). |
| **RF-TRA-003** | Coordinar Despacho de Grúa | El sistema debe registrar solicitudes de remolque vehicular hacia corralones. |
| **RF-TRA-004** | Documentar Reunión Comunitaria | El sistema debe registrar minutas y asistencia a eventos preventivos vecinales. |
| **RF-TRA-005** | Validar Botón de Pánico | El sistema debe recibir alertas integradas de comercios y generar incidentes urgentes. |
| **RF-TRA-006** | Inventario Booking | El sistema debe listar detalladamente las pertenencias retiradas al detenido. |
| **RF-TRA-007** | Registrar Bitácora Detenidos | El sistema debe controlar alimentación, rondas médicas y visitas en celdas. |

## 5. Requisitos no funcionales
| Código | Categoría | Descripción |
| :--- | :--- | :--- |
| **RNF-TRA-001** | Exactitud de Infracciones | Las multas (e-Citations) deben contar con marca de tiempo inalterable y GPS estricto. |
| **RNF-TRA-002** | Auditoría Legal | Los registros de inventario de celdas deben estar disponibles en menos de 1 segundo. |

## 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-TRA-001** | Si el valor de alcoholemia (BAC) es mayor o igual a 0.08%, el sistema sugiere arresto por DUI. |
| **RN-TRA-002** | Alertas de Botón de Pánico se clasifican como Triage Crítico (Nivel 5) saltando validación manual. |
| **RN-TRA-003** | El inventario de celda debe ser firmado por el oficial de patrulla y el detenido. |

## 7. Entradas
- Datos de licencia y vehículo (placa)
- Valores decimales numéricos de BAC
- Texto de minutas
- Listado de objetos retenidos (dinero, joyas, llaves)

## 8. Salidas
- Multa digital en PDF (e-Citation)
- Incidente Triage 5 automático (Pánico)
- Inventario de pertenencias en formato PDF
- Bitácora de custodia actualizada

## 9. Estados posibles
Las multas de tránsito (e-Citation) pueden tener el siguiente estado:
- Emitida
- Pagada
- Apelada (En Corte)
- Cancelada

## 10. Escenarios
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Prueba Alcoholemia Positiva** | El Oficial registra una prueba con BAC de 0.12. | Guarda el registro. | El sistema debe registrar el valor excedido y activar el protocolo de Arresto DUI. |
| **Alerta Botón de Pánico** | Un comercio integrado activa su botón de pánico. | El sistema recibe la señal. | El sistema debe crear un incidente de inmediato, clasificarlo Triage 5 y notificar al Operador. |

## 11. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-TRA-001** | El sistema impide registrar e-Citations si el servicio GPS no proporciona coordenadas. |
| **CA-TRA-002** | El sistema rechaza de inmediato valores de alcoholemia negativos o irreales (ej. > 1.0). |
| **CA-TRA-003** | El inventario de celdas no permite borrar un ítem una vez que el reporte inicial ha sido guardado. |

## 12. Dependencias
Este módulo puede depender de:
- Módulo Operativo de Incidentes (MOD-003).
- Integraciones API de terceros (botones de pánico comerciales).

## 13. Fuera de alcance
En esta versión no se incluye:
- Conexión con cámaras LPR en vivo para lectura de placas automáticas.
- Impresión térmica Bluetooth desde patrullas.
- Cobro en línea de la multa de tránsito dentro de la aplicación.
