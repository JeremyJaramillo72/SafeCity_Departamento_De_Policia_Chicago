# Especificaciones: Módulo Operativo Logística y Flota

## Especificación: Registrar Kilometraje
### 1. Objetivo
Registrar el odómetro al inicio y fin del turno para controlar el uso de la flota.

### 2. Contexto
El abuso de unidades para fines personales o el nulo registro de kilometraje impide programar cambios de aceite a tiempo.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe solicitar el ingreso numérico del odómetro durante el Check-In del vehículo. |
| **RF-002** | Lo mismo para el Check-Out. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La interfaz debe presentar el teclado numérico de forma predeterminada en móviles. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | El kilometraje inicial del turno debe ser mayor o igual al kilometraje final registrado en el turno anterior. |
| **RN-002** | El kilometraje final no puede ser menor al inicial del turno actual. |

### 7. Entradas
- Valor numérico del odómetro en kilómetros/millas.

### 8. Salidas
- Registro actualizado de la patrulla.
- Cálculo de recorrido del turno.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el kilometraje anterior era 10,000 | Cuando el oficial ingresa 10,010 al iniciar turno | Entonces el sistema lo acepta sin problemas |
| **Caso de Error** | Dado que el kilometraje anterior era 10,000 | Cuando el oficial ingresa 9,000 por error tipográfico | Entonces el sistema rechaza el valor indicando inconsistencia matemática |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Validaciones matemáticas bloquean datos erróneos. |
| **CA-002** | Almacena el recorrido total de cada oficial. |

### 11. Restricciones
- Depende de la honestidad de la lectura visual del tablero por parte del oficial.

### 12. Fuera de alcance
- Lectura automática vía OBD-II Bluetooth.

---

## Especificación: Reportar Daños en Carrocería
### 1. Objetivo
Documentar raspones o choques mediante un checklist visual antes de aceptar el vehículo.

### 2. Contexto
Nadie asume la responsabilidad por un retrovisor roto. Con el checklist inicial, se transfiere la responsabilidad al oficial que recibe la unidad.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe mostrar un esquema del vehículo con zonas seleccionables (Frontal, Lateral Izquierdo, etc.). |
| **RF-002** | Permitir tomar foto del daño. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Interfaz optimizada para uso con una sola mano en móvil. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Si se reporta un 'Daño Nuevo', es obligatorio adjuntar una fotografía. |
| **RN-002** | Los daños preexistentes aprobados no requieren nueva fotografía. |

### 7. Entradas
- Checklist por zonas.
- Fotografías.

### 8. Salidas
- Historial de estado de carrocería actualizado.
- Alerta a Logística si hay daño nuevo.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial nota un faro roto no reportado | Cuando marca 'Daño Nuevo Frontal' y sube la foto | Entonces el sistema lo registra y el oficial queda exento de responsabilidad por ese daño previo |
| **Caso de Error** | Dado que se marca daño nuevo | Cuando el oficial intenta finalizar sin subir foto | Entonces el sistema bloquea indicando 'Fotografía obligatoria' |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Evita que el oficial finalice Check-In si hay daños no documentados. |
| **CA-002** | Genera un reporte de diferencias contra el turno previo. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Cálculo de costos de reparación de carrocería.

---

## Especificación: Informar Nivel de Combustible
### 1. Objetivo
Garantizar que las patrullas se entreguen con suficiente combustible al siguiente turno.

### 2. Contexto
Es inaceptable que una patrulla atienda una emergencia y se quede sin gasolina por negligencia del turno previo.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe tener un slider (deslizador) del 0 al 100% para indicar nivel de tanque. |
| **RF-002** | Se registra tanto a la salida como a la llegada. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Componente visual intuitivo (como la aguja del tablero). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Para finalizar turno, el tanque debe registrar al menos un 50%. De lo contrario genera infracción administrativa. |
| **RN-002** | El nivel de llegada nunca puede ser mayor al que se cargó, a menos que se registre comprobante de gasolinera. |

### 7. Entradas
- Porcentaje del tanque en el slider.

### 8. Salidas
- Registro del nivel actual de la flota.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial selecciona 75% al finalizar | Cuando presiona guardar | Entonces el sistema aprueba el cierre de la revisión vehicular |
| **Caso de Error** | Dado que el oficial selecciona 25% al finalizar | Cuando intenta cerrar su turno | Entonces el sistema alerta 'Nivel de combustible bajo el límite del 50%' y notifica al sargento |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Slider captura valores válidos de 0 a 100. |
| **CA-002** | Regla del 50% de gasolina mínima funciona correctamente. |

### 11. Restricciones
- Cálculo estimado visualmente por el oficial.

### 12. Fuera de alcance
- Integración con tarjetas de flota de gasolineras (FleetCards).

---

## Especificación: Registrar Entrega de Radio
### 1. Objetivo
Vincular el ID único del radio de comunicaciones al oficial en turno.

### 2. Contexto
Los radios Motorola APX son costosos y contienen canales encriptados. Su pérdida es un riesgo de seguridad mayor.

### 3. Usuarios o actores
- Jefe de Logística
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | Permitir escanear el código de barras del radio usando la cámara del móvil o ingreso manual del ID. |
| **RF-002** | Asignar temporalmente el radio al oficial. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Respuesta del escáner de barras menor a 1 segundo. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Un radio no puede estar asignado a dos oficiales al mismo tiempo. |
| **RN-002** | Si el radio no se devuelve al finalizar el turno, el sistema lo marca como 'Extraviado'. |

### 7. Entradas
- Lectura de código de barras / ID Serial.

### 8. Salidas
- Actualización de inventario.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial escanea el código del radio | Cuando el sistema valida que existe | Entonces el radio pasa a estado 'Asignado a Oficial X' |
| **Caso de Error** | Dado que se escanea un radio que figura como asignado a otro | Cuando se procesa el código | Entonces el sistema rechaza e indica conflicto de inventario |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Control de concurrencia de equipos exclusivo. |
| **CA-002** | Lectura por cámara integrada funcional. |

### 11. Restricciones
- Depende de la correcta impresión de etiquetas de barras en los equipos.

### 12. Fuera de alcance
- Geolocalización satelital del radio de mano.

---

## Especificación: Escanear Bodycam
### 1. Objetivo
Asignar la cámara corporal correcta al oficial para asegurar que el video corresponda a su usuario.

### 2. Contexto
Si el oficial usa la cámara de otro compañero, las pruebas en video de un arresto pueden anularse por dudas en la cadena de custodia.

### 3. Usuarios o actores
- Jefe de Logística
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir escanear el código QR/Barras de la Axon Bodycam. |
| **RF-002** | El sistema cruza el ID de la cámara con el perfil del oficial. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Alta fiabilidad del escáner bajo luz artificial de la estación. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Obligatorio asignar una Bodycam antes de iniciar patrullaje de calle. |
| **RN-002** | Las Bodycams averiadas no pueden ser asignadas. |

### 7. Entradas
- Lectura del QR de la cámara.

### 8. Salidas
- Bodycam vinculada temporalmente al oficial.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que escanea una cámara operativa | Cuando confirma | Entonces el sistema la asigna exitosamente al turno |
| **Caso de Error** | Dado que escanea una cámara que está reportada con daño | Cuando lee el código | Entonces el sistema bloquea indicando 'Equipo en mantenimiento' |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Exige bodycam para oficiales de campo, pero no para personal de escritorio. |
| **CA-002** | Evita equipos averiados. |

### 11. Restricciones
- Depende de que el catálogo de Bodycams esté actualizado.

### 12. Fuera de alcance
- Sincronización del video de la Bodycam al sistema (esto lo hace el software del fabricante).

---

## Especificación: Reportar Munición Asignada
### 1. Objetivo
Llevar un control estricto de las municiones letales entregadas para prever desvíos.

### 2. Contexto
La venta ilegal de municiones o la pérdida de cargadores es un problema de asuntos internos común.

### 3. Usuarios o actores
- Jefe de Logística

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe registrar la cantidad de cargadores y tipo de calibre entregado (ej. 9mm, .223). |
| **RF-002** | Permitir conteo al devolver el equipo. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Tablas de base de datos optimizadas para alto volumen de transacciones de inventario. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | La diferencia de munición al regresar debe coincidir con los reportes de 'Uso de Arma' en Incidentes. |
| **RN-002** | Discrepancias generan alertas automáticas al Sheriff. |

### 7. Entradas
- Cantidades numéricas
- Calibre.

### 8. Salidas
- Descuento de bodega central.
- Asignación al oficial.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que se entregan 3 cargadores de 9mm (45 rondas) | Cuando se registra la transacción | Entonces el oficial figura como portador de esa cantidad |
| **Caso de Error** | Dado que el oficial devuelve 40 rondas y no reportó incidentes armados | Cuando se registra la devolución | Entonces el sistema alerta 'Faltante de 5 rondas sin justificar' |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Cruza datos de munición faltante con el módulo de incidentes. |
| **CA-002** | Reportes de inventario consistentes en bodega. |

### 11. Restricciones
- Conteo manual por parte del armero.

### 12. Fuera de alcance
- Trazabilidad balística de cada bala individual.

---

## Especificación: Ticket de Falla Mecánica
### 1. Objetivo
Digitalizar las solicitudes de reparación de la flota para acelerar el trabajo del taller mecánico.

### 2. Contexto
Una patrulla que necesita pastillas de freno puede quedar parada semanas si el reporte se pierde en papel.

### 3. Usuarios o actores
- Oficial de Patrulla
- Jefe de Logística

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir crear un ticket describiendo la falla mecánica. |
| **RF-002** | El sistema debe cambiar el estado del vehículo en el catálogo. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La interfaz debe permitir categorización rápida (Frenos, Motor, Eléctrico, Llantas). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Un vehículo con ticket de gravedad 'Alta' cambia a estado 'Fuera de Servicio' inmediatamente. |
| **RN-002** | Solo el taller/logística puede cerrar un ticket una vez reparado. |

### 7. Entradas
- Categoría de la falla
- Descripción textual
- Gravedad (Alta, Media, Baja).

### 8. Salidas
- Ticket generado en la cola del taller.
- Bloqueo de asignación de la patrulla.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que reportan ruido en el motor (Gravedad Alta) | Cuando se guarda el ticket | Entonces la patrulla desaparece de la lista de vehículos asignables |
| **Caso de Error** | Dado que un oficial raso intenta cerrar un ticket | Cuando presiona el botón 'Resolver' | Entonces el sistema niega la acción por permisos insuficientes |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Flujo de estados correcto (Abierto -> En Taller -> Resuelto). |
| **CA-002** | Integridad del catálogo de patrullas bloqueando vehículos inoperativos. |

### 11. Restricciones
- Depende de que el mecánico use el sistema para cerrar los tickets.

### 12. Fuera de alcance
- Control de inventario de repuestos del taller mecánico.

---

## Especificación: Registrar Descarga de Taser
### 1. Objetivo
Documentar e investigar obligatoriamente el uso de fuerza no letal (armas de electrochoque).

### 2. Contexto
El uso del Taser conlleva responsabilidades civiles. Cada descarga de cartucho debe estar fundamentada legalmente.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe proveer un formulario de justificación obligatoria al reportar el uso del taser. |
| **RF-002** | Registrar cantidad de cartuchos disparados. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Notificación instantánea vía WebSockets al supervisor en turno. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | El registro de descarga descuenta automáticamente el inventario de cartuchos del oficial. |
| **RN-002** | Este registro está exento de edición post-envío (inmutable). |

### 7. Entradas
- Cantidad de cartuchos
- Motivo de uso textual.

### 8. Salidas
- Actualización de inventario.
- Alerta crítica de revisión de fuerza.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial reporta 1 descarga por resistencia al arresto | Cuando envía el formulario | Entonces el cartucho se da de baja y se alerta al supervisor de turno |
| **Caso de Error** | Dado que intenta evadir llenar el campo de motivo | Cuando presiona enviar | Entonces el formulario no avanza, indicando motivo requerido |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Campo motivo con longitud mínima de 50 caracteres. |
| **CA-002** | Deducción automática de cartuchos en módulo logístico. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Lectura del log digital interno del Taser por cable USB.

---

## Especificación: Informar Presión Neumáticos
### 1. Objetivo
Prevenir accidentes a altas velocidades en persecuciones obligando a revisar las llantas antes del patrullaje.

### 2. Contexto
El estallido de un neumático a 150 km/h por baja presión es letal. El chequeo rutinario salva vidas policiales.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe solicitar 4 valores de presión (PSI), uno por cada neumático. |
| **RF-002** | Alertar si el valor sale del rango seguro (ej. 30-35 PSI). |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Interfaz gráfica intuitiva mostrando un coche desde arriba con 4 inputs. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Valores de PSI extremadamente bajos (<20) o altos (>45) impiden aceptar la patrulla obligando a inflar/revisar. |
| **RN-002** | Es obligatorio llenar los 4 campos en la inspección. |

### 7. Entradas
- Valores enteros numéricos (PSI).

### 8. Salidas
- Registro del estado de los neumáticos.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial ingresa 32 PSI en los cuatro neumáticos | Cuando guarda la revisión | Entonces el sistema lo acepta como óptimo |
| **Caso de Error** | Dado que el oficial ingresa 15 PSI en la rueda trasera izquierda | Cuando intenta guardar | Entonces el sistema arroja alerta roja 'Llanta desinflada, proceda a taller' y no permite usar la patrulla en persecución |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Validación de rangos (30-35 normal, bloqueo fuera de rango extremo). |
| **CA-002** | Captura individual de las 4 ruedas. |

### 11. Restricciones
- Chequeo manual con medidor de presión de aire por parte del oficial.

### 12. Fuera de alcance
- Sensores TPMS automáticos leídos inalámbricamente.

---

