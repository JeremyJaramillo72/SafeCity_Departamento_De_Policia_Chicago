# Especificaciones: Módulo Operativo Inteligencia y Detectives

## Especificación: Ingresar Alias del Sospechoso
### 1. Objetivo
Permitir registrar el alias y características físicas sin conocer su nombre legal.

### 2. Contexto
En investigaciones tempranas, el nombre real del delincuente es desconocido, pero su alias (ej. 'El Flaco') es clave para cruzar datos con otros casos.

### 3. Usuarios o actores
- Detective

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir guardar un perfil solo con el campo Alias. |
| **RF-002** | El sistema debe sugerir coincidencias si el alias ya existe en la BD. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La búsqueda de coincidencias debe tardar menos de 800ms. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Si no hay Nombre ni Apellido, el campo Alias es obligatorio. |
| **RN-002** | El alias se debe guardar siempre en mayúsculas para evitar duplicidades por formato. |

### 7. Entradas
- Cadena de texto (Alias)
- Características físicas.

### 8. Salidas
- Perfil temporal del sospechoso creado.
- Sugerencias de perfiles existentes.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el detective ingresa 'EL FLACO' en el campo alias | Cuando presiona guardar | Entonces el sistema crea un perfil asociado al expediente actual |
| **Caso de Error** | Dado que el detective deja en blanco el Nombre, Apellido y el Alias | Cuando intenta guardar el perfil | Entonces el sistema muestra error requiriendo al menos uno de los tres campos |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Guarda exitosamente con solo el alias. |
| **CA-002** | Transforma automáticamente el texto a mayúsculas. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Búsqueda facial para encontrar el nombre a partir de una foto.

---

## Especificación: Describir Tatuajes y Señas
### 1. Objetivo
Proporcionar campos específicos para documentar tatuajes o marcas distintivas vinculadas a pandillas.

### 2. Contexto
Los tatuajes son frecuentemente la única forma de vincular a un sospechoso con una organización criminal (ej. MS-13, Latin Kings).

### 3. Usuarios o actores
- Detective

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe tener un catálogo de ubicaciones corporales (Brazo derecho, Cuello, etc.). |
| **RF-002** | El sistema debe permitir subir foto del tatuaje. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La interfaz debe presentar un modelo visual del cuerpo humano (opcional). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Cada tatuaje registrado debe tener obligatoriamente su 'Ubicación' en el cuerpo. |

### 7. Entradas
- Texto descriptivo.
- Selección de ubicación.
- Fotografía del tatuaje.

### 8. Salidas
- Registro del tatuaje vinculado al perfil del sospechoso.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el detective selecciona 'Cuello' e ingresa 'Telaraña' | Cuando sube la foto y guarda | Entonces el sistema asocia la marca al sospechoso |
| **Caso de Error** | Dado que se ingresa la descripción pero no se selecciona ubicación corporal | Cuando se intenta guardar | Entonces el sistema bloquea el guardado pidiendo la ubicación |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Evita guardado sin ubicación. |
| **CA-002** | Permite múltiples tatuajes por persona. |

### 11. Restricciones
- Catálogo de zonas corporales predefinido.

### 12. Fuera de alcance
- Reconocimiento de patrones de tatuajes por IA.

---

## Especificación: Registrar Placas de Vehículos
### 1. Objetivo
Vincular matrículas y modelos de vehículos sospechosos a un expediente de investigación.

### 2. Contexto
Los vehículos son la herramienta principal en crímenes mayores (secuestros, robos de banco). Su seguimiento cruza casos.

### 3. Usuarios o actores
- Detective

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir registrar número de placa, estado emisor y marca/modelo. |
| **RF-002** | El sistema debe alertar si la placa está reportada como robada en la BD local. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | El formato de placa debe permitir alfanuméricos sin espacios. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Toda placa registrada se convierte automáticamente en objeto de interés para patrullas. |
| **RN-002** | El Estado Emisor es obligatorio si se ingresa la placa. |

### 7. Entradas
- Número de Placa
- Estado Emisor
- Color
- Marca

### 8. Salidas
- Vehículo asociado al caso.
- Alerta cruzada si el vehículo aparece en otro caso.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que se ingresa una placa válida | Cuando se asocia al caso | Entonces el sistema verifica su historial y lo vincula al expediente |
| **Caso de Error** | Dado que se ingresa la placa pero no el Estado | Cuando se intenta guardar | Entonces el sistema arroja error de validación |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Normaliza el número de placa (sin espacios, mayúsculas). |
| **CA-002** | Lanza advertencia si la placa es duplicada en otro caso. |

### 11. Restricciones
- No se conecta a la DMV nacional en esta fase.

### 12. Fuera de alcance
- Integración con cámaras de peajes.

---

## Especificación: Testimonio Confidencial
### 1. Objetivo
Registrar declaraciones de testigos enmascarando automáticamente su identidad para protegerlos de represalias.

### 2. Contexto
Los testigos de crímenes de pandillas se niegan a declarar si su nombre aparece en el expediente que luego ven los abogados defensores.

### 3. Usuarios o actores
- Detective

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe tener un checkbox de 'Testigo Protegido'. |
| **RF-002** | Si está activo, el sistema debe reemplazar el nombre en pantalla por un ID Hash (ej. WIT-9382). |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | El nombre real debe encriptarse a nivel de columna en la base de datos (AES-256). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Solo el creador del testimonio y el Sheriff pueden desencriptar el nombre. |
| **RN-002** | Las exportaciones PDF nunca incluirán el nombre desencriptado. |

### 7. Entradas
- Nombre real del testigo
- Declaración
- Checkbox de confidencialidad.

### 8. Salidas
- Testimonio con ID anónimo visible en el expediente.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el detective marca la casilla de Testigo Protegido | Cuando guarda el testimonio | Entonces el sistema genera un ID 'WIT-XYZ' y oculta el nombre real |
| **Caso de Error** | Dado que un usuario sin permisos intenta exportar el caso | Cuando genera el PDF | Entonces el PDF solo muestra 'WIT-XYZ' y no el nombre real |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Enmascaramiento inmediato en la interfaz web. |
| **CA-002** | Imposibilidad de exportar el nombre real. |

### 11. Restricciones
- Depende de la correcta implementación de AES-256.

### 12. Fuera de alcance
- Modificación de la voz en archivos de audio.

---

## Especificación: Subir Audios de Interrogatorios
### 1. Objetivo
Adjuntar archivos de audio vinculándolos directamente a la declaración o al expediente del caso.

### 2. Contexto
Las grabaciones en casetes o grabadoras de voz digitales se pierden. Subirlas al sistema garantiza su preservación en la nube.

### 3. Usuarios o actores
- Detective

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir arrastrar y soltar archivos .mp3, .m4a o .wav. |
| **RF-002** | El sistema debe incluir un reproductor de audio integrado en el navegador. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Peso máximo de carga 50 MB. |
| **RNF-002** | Almacenamiento directo en Azure Blob Storage. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Una vez subido, el archivo no puede ser eliminado por el detective, solo inactivado. |
| **RN-002** | El archivo asume el nivel de confidencialidad del testimonio asociado. |

### 7. Entradas
- Archivo de audio digital.

### 8. Salidas
- URL segura del archivo reproducibible en el expediente.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que se arrastra un archivo MP3 de 15MB | Cuando finaliza la barra de carga | Entonces el sistema muestra el reproductor incrustado en el caso |
| **Caso de Error** | Dado que el usuario intenta subir un archivo de 100MB | Cuando se suelta el archivo | Entonces el sistema cancela la subida y muestra 'Límite 50MB excedido' |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Bloquea formatos no soportados (.exe, .zip). |
| **CA-002** | Permite reproducción sin descargar el archivo localmente. |

### 11. Restricciones
- Velocidad de carga sujeta a la conexión a internet de la estación.

### 12. Fuera de alcance
- Transcripción automática a texto (Speech-to-text).

---

## Especificación: Relacionar Arresto
### 1. Objetivo
Vincular formalmente un arresto ocurrido en calle con el expediente investigativo abierto.

### 2. Contexto
A menudo, patrulleros arrestan a alguien por infracciones menores sin saber que el individuo es objetivo de un Caso Mayor. Esto cierra el ciclo.

### 3. Usuarios o actores
- Detective

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir buscar arrestos recientes por número de ticket o nombre. |
| **RF-002** | El sistema debe vincular el ID del arresto como 'Resolución' o 'Avance' del caso. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La búsqueda debe mostrar sugerencias en tiempo real basadas en los alias del expediente. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Un arresto puede estar vinculado a múltiples expedientes simultáneamente. |
| **RN-002** | Vincular un arresto del Sospechoso Principal permite proponer el cierre del caso. |

### 7. Entradas
- ID del Arresto o búsqueda de nombre.

### 8. Salidas
- Vínculo relacional en la base de datos.
- Estado del sospechoso actualizado a 'Detenido'.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el detective encuentra el arresto número 99281 | Cuando presiona 'Vincular a Expediente' | Entonces el arresto aparece en la pestaña de Resoluciones del caso |
| **Caso de Error** | Dado que se intenta vincular un ID de arresto inexistente | Cuando se ejecuta la búsqueda | Entonces el sistema muestra 'Arresto no encontrado' |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Actualiza estado del sospechoso. |
| **CA-002** | Enlace bidireccional (Desde el arresto también se ve el caso vinculado). |

### 11. Restricciones
- Depende de que el módulo de Incidentes haya procesado el arresto.

### 12. Fuera de alcance
- Aprobación del fiscal de distrito.

---

## Especificación: Custodia de Evidencia
### 1. Objetivo
Registrar de manera inmutable el movimiento y responsabilidad sobre las pruebas físicas.

### 2. Contexto
Si se rompe la cadena de custodia (no se sabe quién tuvo el arma entre el martes y el jueves), la evidencia pierde todo peso legal en juicio.

### 3. Usuarios o actores
- Detective
- Administrador de Evidencias

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir registrar 'Entrega' y 'Recepción' de un ítem. |
| **RF-002** | El sistema debe generar un código de barras/QR para cada ítem de evidencia ingresado. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Registro de logs en tabla append-only de auditoría. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Un ítem solo puede ser recibido por un usuario a la vez. |
| **RN-002** | No se puede transferir un ítem si su estado actual es 'Perdido' o 'Destruido'. |

### 7. Entradas
- Lectura de código QR o ingreso manual del ID del ítem.
- Selección del destinatario.

### 8. Salidas
- Actualización de la bitácora de custodia.
- Impresión de etiqueta (opcional).

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el Custodio escanea el QR del ítem y selecciona al Detective Smith | Cuando confirma la transferencia | Entonces el sistema registra que el Detective Smith es el nuevo portador con fecha y hora |
| **Caso de Error** | Dado que el Detective Smith intenta transferir un ítem que el sistema marca que lo tiene el Detective Jones | Cuando intenta la transferencia | Entonces el sistema bloquea indicando que no posee el ítem actualmente |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Bloquea transferencias de evidencia no poseída. |
| **CA-002** | Log inmutable por cada paso. |

### 11. Restricciones
- Depende del escáner físico de código de barras conectado al PC.

### 12. Fuera de alcance
- Control ambiental (temperatura/humedad) del cuarto de evidencias.

---

## Especificación: Ingresar Notas Periciales
### 1. Objetivo
Permitir a los laboratorios forenses agregar observaciones y reportes técnicos al expediente.

### 2. Contexto
Los resultados de balística, ADN y toxicología suelen llegar días después en papel. Digitalizarlos permite que los detectives actúen rápido.

### 3. Usuarios o actores
- Perito Forense
- Detective

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe incluir un editor de texto enriquecido para reportes periciales. |
| **RF-002** | Permitir la subida de anexos PDF con los resultados formales de laboratorio. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Formato PDF debe ser renderizado nativamente en el navegador. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Las notas periciales solo pueden ser ingresadas por el rol 'Perito Forense' o el Detective asignado. |
| **RN-002** | Una vez subida, la nota no se borra, solo se emiten alcances (correcciones en nuevo registro). |

### 7. Entradas
- Texto enriquecido
- Archivo PDF del laboratorio.

### 8. Salidas
- Nota pericial adjunta a la bitácora del expediente.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el perito termina su análisis de ADN | Cuando sube el PDF y escribe un resumen | Entonces el sistema adjunta el documento y notifica al detective a cargo |
| **Caso de Error** | Dado que un oficial de patrulla intenta agregar una nota pericial | Cuando accede al módulo | Entonces el sistema oculta el botón por falta de permisos (RBAC) |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Solo usuarios autorizados ingresan peritajes. |
| **CA-002** | Los PDF adjuntos no pueden pesar más de 20MB. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Interconexión con máquinas de análisis de laboratorio.

---

## Especificación: Reporte Conclusivo y Cerrar Caso
### 1. Objetivo
Generar el documento formal de cierre de investigación para ser entregado a la fiscalía.

### 2. Contexto
Un caso abierto consume recursos. Cuando se resuelve o se agotan las pistas, debe compilarse toda la información en un formato legalmente válido.

### 3. Usuarios o actores
- Detective
- Sheriff

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe compilar todos los sospechosos, evidencias y testimonios en un formato PDF predefinido. |
| **RF-002** | El sistema debe permitir la aprobación del reporte. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La generación del PDF no debe demorar más de 5 segundos. |
| **RNF-002** | El PDF generado es inalterable (Read-Only). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Un caso no puede cambiar de estado a 'Cerrado' si no tiene este reporte generado. |
| **RN-002** | El reporte debe ser firmado por el Detective principal y aprobado por el Sheriff. |

### 7. Entradas
- Aprobación de la generación del reporte.

### 8. Salidas
- Archivo PDF del Reporte Conclusivo.
- Estado del expediente cambia a 'Cerrado' o 'Pendiente de Juicio'.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el caso tiene toda la información completa | Cuando el Detective presiona 'Generar Reporte Conclusivo' | Entonces el sistema arma el PDF, lo guarda y permite cerrar el caso |
| **Caso de Error** | Dado que el Detective intenta cerrar el caso sin generar el reporte | Cuando cambia el estado a Cerrado | Entonces el sistema lo impide exigiendo la firma del documento |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | PDF generado incluye el hash de los testigos, no sus nombres reales. |
| **CA-002** | El cambio de estado a cerrado requiere este hito. |

### 11. Restricciones
- Formato PDF requerido por estándar de los juzgados.

### 12. Fuera de alcance
- Envío automático por correo a la fiscalía del estado.

---

