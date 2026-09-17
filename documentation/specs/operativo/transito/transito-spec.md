# Especificaciones: Módulo Operativo Tránsito y Comunidad

## Especificación: Emitir Infracción de Tránsito (e-Citation)
### 1. Objetivo
Generar multas electrónicas desde el vehículo policial de forma estandarizada y legal.

### 2. Contexto
La letra ilegible de los oficiales en las multas de papel causa que los jueces desestimen los casos, perdiendo recaudación municipal.

### 3. Usuarios o actores
- Oficial de Tránsito

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe tener un formulario con campos para Licencia, Placa y Artículo Infringido. |
| **RF-002** | El sistema debe generar un archivo PDF con la multa estructurada. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Interfaz offline capaz de guardar la multa y enviarla cuando regrese la señal LTE. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | La multa requiere obligatoriamente una coordenada GPS inmutable para probar la jurisdicción. |
| **RN-002** | El monto de la multa se calcula automáticamente según el Artículo Infringido, el oficial no puede digitar dinero libremente. |

### 7. Entradas
- Datos del infractor y vehículo
- Código del artículo de tránsito.

### 8. Salidas
- Multa digital (PDF).
- Registro en base de datos fiscal.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial ingresa el Artículo de 'Exceso de velocidad' | Cuando guarda la citación | Entonces el sistema genera la multa por $150 con fecha, hora y ubicación |
| **Caso de Error** | Dado que el oficial intenta modificar el monto manualmente a $50 | Cuando escribe en el campo | Entonces el teclado es bloqueado porque el monto es de solo lectura (automático) |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Cálculo automático e infalible de montos tarifados. |
| **CA-002** | Validación GPS ineludible. |

### 11. Restricciones
- Catálogo de artículos de tránsito estatal debe actualizarse anualmente.

### 12. Fuera de alcance
- Pasarela de pagos en línea para que el civil pague inmediatamente.

---

## Especificación: Registrar Prueba de Alcoholemia (BAC)
### 1. Objetivo
Documentar numéricamente las pruebas de sobriedad en campo para sustentar arrestos por DUI (Driving Under Influence).

### 2. Contexto
Si el resultado numérico del alcoholímetro no se documenta exactamente en el momento, el abogado defensor argumentará calibración fallida.

### 3. Usuarios o actores
- Oficial de Tránsito

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe pedir el valor de Alcohol en Sangre (BAC) en formato decimal (ej. 0.08). |
| **RF-002** | El sistema debe pedir ingresar el Número de Serie del alcoholímetro usado. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Validación instantánea del campo decimal (no permite comas, solo punto decimal). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Si el valor BAC ingresado es >= 0.08, el sistema abre obligatoriamente la creación de un Incidente de Arresto DUI. |
| **RN-002** | Valores negativos no son permitidos. |

### 7. Entradas
- Decimal BAC
- ID del Alcoholímetro.

### 8. Salidas
- Registro asociado al contacto con el ciudadano.
- Alerta de arresto sugerido.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial ingresa 0.12 | Cuando presiona guardar | Entonces el sistema resalta el valor en rojo y abre el formulario de 'Arresto DUI' |
| **Caso de Error** | Dado que el oficial teclea accidentalmente 1.5 | Cuando intenta enviar | Entonces el sistema advierte 'Nivel biológicamente irreal, revise el valor' |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Activación correcta de flujos penales si BAC excede el límite. |
| **CA-002** | Validación de datos biológicamente posibles. |

### 11. Restricciones
- Depende de que el alcoholímetro físico esté calibrado.

### 12. Fuera de alcance
- Conexión Bluetooth directa entre el alcoholímetro y el teléfono para leer el dato.

---

## Especificación: Coordinar Despacho de Grúa
### 1. Objetivo
Registrar la solicitud y custodia de vehículos remolcados por infracción o accidente.

### 2. Contexto
Existen demandas por pertenencias robadas dentro de vehículos llevados al corralón. Se necesita trazabilidad desde la calle hasta el garaje.

### 3. Usuarios o actores
- Oficial de Tránsito
- Operador de Emergencias

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir solicitar remolque indicando si es de Policía o de una compañía Privada. |
| **RF-002** | Debe permitir agregar un inventario visual rápido (fotos de los 4 lados del auto). |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Integración rápida (formularios prellenados con los datos del incidente activo). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | El vehículo remolcado no cambia de estado a 'En Corralón' hasta que el operador del garaje confirme recepción. |
| **RN-002** | Obligatorio ingresar si las llaves fueron retenidas o entregadas al conductor. |

### 7. Entradas
- Tipo de Grúa
- Placa de vehículo
- Fotografías.

### 8. Salidas
- Orden de remolque.
- Estado de custodia vehicular actualizado.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial pide grúa y toma fotos del auto chocado | Cuando emite la orden | Entonces se genera un ticket para la empresa de remolque con las fotos adjuntas probando daños previos |
| **Caso de Error** | Dado que el oficial pide grúa pero no sube las 4 fotos reglamentarias | Cuando aprueba la orden | Entonces el sistema bloquea indicando 'Fotos obligatorias para exoneración de responsabilidad' |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Carga fotográfica estricta para mitigar demandas. |
| **CA-002** | Trazabilidad clara de responsabilidad de custodia. |

### 11. Restricciones
- Módulo no integrado con los sistemas de las empresas privadas de grúas.

### 12. Fuera de alcance
- Rastreo GPS de la grúa privada.

---

## Especificación: Documentar Reunión Comunitaria
### 1. Objetivo
Registrar la asistencia de oficiales a eventos de policía preventiva y acercamiento vecinal.

### 2. Contexto
Las estrategias de policía comunitaria requieren métricas. Si los oficiales asisten a reuniones pero no queda evidencia, los fondos federales se recortan.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir ingresar el Nombre del Evento y Número Estimado de Asistentes. |
| **RF-002** | Registrar una breve minuta o tema tratado. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Campos de texto libre optimizados para dictado por voz (Voice-to-Text del teclado del SO). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Un evento comunitario no genera incidentes criminales, se guarda en una base separada de prevención. |
| **RN-002** | Debe vincularse a la geocerca del barrio para mapa de calor preventivo. |

### 7. Entradas
- Texto descriptivo
- Asistencia entera
- Fotografía (Opcional).

### 8. Salidas
- Registro preventivo agregado al Dashboard Comunitario.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial da una charla en escuela | Cuando ingresa 'Charla Bullying', 50 alumnos y guarda | Entonces el mapa de calor táctico muestra un punto de 'Prevención' en la escuela |
| **Caso de Error** | Dado que el oficial olvida poner el tema tratado | Cuando intenta guardar el reporte rápido | Entonces el sistema exige la minuta breve |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Impacta positivamente las estadísticas operativas de prevención. |
| **CA-002** | Georreferenciación idéntica a la criminal pero clasificada distinto. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Gestión de redes sociales del departamento de policía.

---

## Especificación: Validar Alerta de Botón de Pánico
### 1. Objetivo
Recibir señales silenciosas automáticas desde negocios integrados (Bancos, Joyerías) para despachar sin llamada 911.

### 2. Contexto
En asaltos a mano armada, las víctimas no pueden llamar al 911. Apretar un botón oculto debe crear un incidente en el sistema inmediatamente.

### 3. Usuarios o actores
- Sistema (Automático) / API

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe contar con un endpoint API Webhook para recibir peticiones POST desde proveedores de alarmas. |
| **RF-002** | El sistema creará un Incidente de nivel Crítico automáticamente en la pantalla del Despachador. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Tiempo de procesamiento de la petición POST < 100ms. |
| **RNF-002** | Alta disponibilidad de la API REST. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Las alertas originadas por API se marcan con Triage Nivel 5 por defecto. |
| **RN-002** | Si la misma alarma dispara dos peticiones en menos de 1 minuto, el sistema asume que es el mismo incidente. |

### 7. Entradas
- Payload JSON (ID Negocio, Timestamp).

### 8. Salidas
- Incidente Triage 5 en pantalla principal.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que un cajero de banco presiona el botón físico oculto | Cuando el proveedor de alarmas envía el JSON al Webhook de SafeCity | Entonces suena una alarma en el centro de despacho con la dirección del banco precargada |
| **Caso de Error** | Dado que un bot malicioso envía JSON al webhook | Cuando la API lo recibe | Entonces la API rechaza el intento con 401 Unauthorized por falta de API Key válida |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Creación inmediata de incidente sin intervención humana inicial. |
| **CA-002** | Mecanismo Antispam (debouncing) para múltiples presiones de botón del pánico. |

### 11. Restricciones
- Depende de que el proveedor físico (Ej. ADT) configure el webhook correctamente.

### 12. Fuera de alcance
- Activación remota de cámaras de seguridad del banco privado.

---

## Especificación: Gestionar Celdas y Detenidos: Registrar Inventario de Celda (Booking)
### 1. Objetivo
Documentar exhaustivamente todas las pertenencias confiscadas al ingresar un individuo a los separos (celdas temporales).

### 2. Contexto
Las quejas más comunes tras un arresto son 'Me robaron el dinero o mi celular'. El registro cruzado evita robos internos.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir ingresar filas dinámicas de pertenencias (Tipo, Cantidad, Descripción). |
| **RF-002** | El sistema debe generar un recibo PDF e imprimir código QR para la bolsa plástica. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Soporte para firma manuscrita en pantallas táctiles o tablets de estación. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | El formulario debe ser firmado por el oficial y por el detenido (o marcar casilla 'Detenido incapaz de firmar'). |
| **RN-002** | No se pueden eliminar elementos de la lista una vez guardada, solo marcar como 'Devuelto' a la salida. |

### 7. Entradas
- Listado de objetos
- Cantidades
- Firmas manuscritas (Touch).

### 8. Salidas
- PDF formal de pertenencias.
- Etiqueta QR para bolsa de evidencia personal.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial de patrulla ingresa '1 Billetera, 50 Dólares, 1 Celular' | Cuando ambos firman en la tablet y guardan | Entonces se cierra el listado e imprime el recibo inmutable |
| **Caso de Error** | Dado que el oficial de patrulla omite la firma del detenido | Cuando intenta guardar el recibo | Entonces el sistema bloquea, exigiendo firma o el checkbox de incapacidad legal (ej. alcoholismo extremo) |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Bloqueo de edición del inventario post-guardado. |
| **CA-002** | Captura fluida de firmas táctiles en formato vector/imagen. |

### 11. Restricciones
- Uso exclusivo en estación policial (PC/Tablet).

### 12. Fuera de alcance
- Verificación de identidad facial del detenido.

---

## Especificación: Gestionar Celdas y Detenidos: Registrar Bitácora de Detenidos
### 1. Objetivo
Garantizar y evidenciar que se están cumpliendo los derechos humanos (comida, revisión médica) de las personas en celdas temporales.

### 2. Contexto
Si un detenido sufre un ataque de asma en la celda y muere, el departamento debe probar que los guardias hacían sus rondas de supervisión cada hora estipulada por ley.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe proveer una lista de detenidos activos y un botón rápido de 'Ronda de Seguridad OK'. |
| **RF-002** | Permitir registrar 'Alimentación' y 'Visita Médica' o 'Abogado'. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La inserción de los logs de ronda debe ser instantánea (1 tap). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Si pasan más de 60 minutos sin que se registre una ronda para una celda ocupada, suena una alerta administrativa en la oficina del Capitán. |
| **RN-002** | Los registros asumen automáticamente el timestamp inalterable del servidor. |

### 7. Entradas
- Botones de acción predefinidos (Comida, Visita, Ronda OK).

### 8. Salidas
- Bitácora vitalicia de la estadía del detenido.
- Alertas preventivas de negligencia.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial de patrulla pasa por las celdas y presiona 'Ronda OK' para la Celda 3 | Cuando presiona el botón | Entonces el sistema reinicia el contador de 60 minutos para evitar la alerta |
| **Caso de Error** | Dado que pasan 65 minutos y el guardia olvidó la ronda | Cuando se excede el límite del temporizador de seguridad | Entonces se gatilla una alerta roja en pantalla y se envía email a la gerencia por riesgo legal |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Temporizadores de cumplimiento legal funcionan en background. |
| **CA-002** | Registros de bitácora simples, con un solo toque (Tap & Go). |

### 11. Restricciones
- Depende de tareas programadas (Celery/Cron) corriendo sin interrupción.

### 12. Fuera de alcance
- Cámaras de vigilancia de las celdas integradas en el panel.

---

