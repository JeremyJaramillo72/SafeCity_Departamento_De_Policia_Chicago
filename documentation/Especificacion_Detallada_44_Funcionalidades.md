# Especificación Detallada: 44 Funcionalidades Operativas
### Metodología Spec Driven Development (SDD)

Este documento contiene la especificación funcional detallada de los 44 Objetivos Operativos del sistema SafeCity Intelligence Ops, estructurada de acuerdo con la plantilla oficial de 12 puntos de requerimientos. Las funcionalidades se agrupan por Módulo Operativo.

---

## Índice de Funcionalidades

### Módulo Operativo Incidentes

1. Seleccionar Ubicación del Incidente en Mapa `(INC-UBI)`
2. Clasificar Tipo Penal (Catálogo IUCR) `(INC-TIP)`
3. Despachar Unidad y Trazar Ruta `(INC-DES)`
4. Registrar Tiempo de Llegada de Patrullas a Emergencias `(INC-TLL)`
5. Ingresar Número de Víctimas `(INC-VIC)`
6. Detallar Uso o Detonación de Armas `(INC-ARM)`
7. Adjuntar Fotografías de Evidencia `(INC-FOT)`
8. Registrar Estado Climático `(INC-CLI)`
9. Clasificar Nivel de Gravedad (Triage 911) `(INC-TRI)`
10. Registrar Descarga de Taser `(INC-TAS)`

### Módulo Operativo Inteligencia y Detectives

11. Ingresar Alias del Sospechoso `(INT-ALI)`
12. Describir Tatuajes y Señas `(INT-TAT)`
13. Registrar Placas de Vehículos `(INT-PLA)`
14. Testimonio Confidencial `(INT-TES)`
15. Subir Audios de Interrogatorios `(INT-AUD)`
16. Relacionar Arresto `(INT-ARR)`
17. Custodia de Evidencia `(INT-CUS)`
18. Ingresar Notas Periciales `(INT-PER)`
19. Reporte Conclusivo y Cerrar Caso `(INT-REP)`
20. Gestionar Celdas y Detenidos: Registrar Inventario de Celda (Booking) `(INT-CEL)`
21. Gestionar Celdas y Detenidos: Registrar Bitácora de Detenidos `(INT-BIT)`

### Módulo Operativo Logística y Flota

22. Registrar Kilometraje `(LOG-KIL)`
23. Reportar Daños en Carrocería `(LOG-DAN)`
24. Informar Nivel de Combustible `(LOG-COM)`
25. Registrar Entrega de Radio `(LOG-RAD)`
26. Reportar Munición Asignada `(LOG-MUN)`
27. Ticket de Falla Mecánica `(LOG-FAL)`
28. Informar Presión Neumáticos `(LOG-NEU)`

### Módulo Operativo Recursos Humanos

29. Registrar Clock-in / Clock-out `(RRH-CLK)`
30. Asignar Oficial a Cuadrante `(RRH-CUA)`
31. Ingresar Solicitud de Permisos `(RRH-PMI)`
32. Evaluar Desempeño del Oficial `(RRH-EVA)`
33. Registrar Expediente Disciplinario `(RRH-DIS)`
34. Consultar Historial de Capacitaciones `(RRH-CAP)`

### Módulo Operativo Ciberseguridad

35. Rastrear Inicio de Sesión `(CIB-SES)`
36. Modificar Permisos de Acceso RBAC `(CIB-RBA)`
37. Ejecutar Respaldo de Base de Datos `(CIB-BAK)`
38. Etiquetar Acceso a Evidencias (Auditoría Ciega) `(CIB-AUC)`
39. Bloquear Cuenta por Intentos Fallidos `(CIB-BLO)`

### Módulo Operativo Tránsito y Comunidad

40. Emitir Infracción de Tránsito (e-Citation) `(TRA-INF)`
41. Registrar Prueba de Alcoholemia (BAC) `(TRA-BAC)`
42. Coordinar Despacho de Grúa `(TRA-GRU)`
43. Documentar Reunión Comunitaria `(TRA-REU)`
44. Validar Alerta de Botón de Pánico `(TRA-PAN)`

---

# Especificaciones: Módulo Operativo Incidentes

## Especificación: Seleccionar Ubicación del Incidente en Mapa

### 1. Objetivo

Registrar con precisión las coordenadas geográficas de un incidente permitiendo al usuario seleccionar el punto exacto en un mapa interactivo.

### 2. Contexto

En lugar de depender exclusivamente del hardware GPS del dispositivo móvil (que puede fallar bajo techo o dar poca precisión), el usuario tiene el control visual para marcar en el mapa de la ciudad el lugar exacto del evento para que las patrullas lleguen sin desvíos.

### 3. Usuarios o actores

- Oficial de Patrulla

- Operador de Emergencias

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-UBI-001** | El sistema debe mostrar un mapa interactivo cargado centrado en la ciudad. |

| **RF-INC-UBI-002** | El sistema debe permitir colocar un pin o marcador al hacer clic o tocar sobre una calle. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-UBI-001** | El renderizado del mapa no debe superar 1.5 segundos de tiempo de carga. |

| **RNF-INC-UBI-002** | El mapa debe soportar gestos táctiles (zoom in/out, pan) de forma fluida. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-UBI-001** | Todo incidente debe tener obligatoriamente un punto marcado en el mapa para poder guardarse. |

| **RN-INC-UBI-002** | Las coordenadas generadas por el marcador seleccionado no son editables como texto libre, solo moviendo el pin visualmente. |

### 7. Entradas

- Interacción táctil o clic del ratón sobre el lienzo del mapa.

### 8. Salidas

- Coordenadas de Latitud y Longitud extraídas del marcador.

- Visualización del marcador en el dashboard.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el usuario visualiza el mapa del sector | Cuando hace tap en la esquina de la Calle 10 | Entonces aparece el pin y se guardan las coordenadas asociadas |

| **Caso de Error** | Dado que el usuario intenta guardar el formulario | Cuando no ha colocado el marcador en el mapa | Entonces el sistema resalta el mapa y lanza advertencia 'Ubicación requerida' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-UBI-001** | El sistema extrae correctamente latitud y longitud del mapa y las envía al backend. |

| **CA-INC-UBI-002** | Impide el guardado del incidente si la ubicación geográfica está vacía. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-UBI-001** | Depende de conexión a internet o caché local para visualizar las baldosas (tiles) del mapa. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-UBI-001** | Rastreo continuo del movimiento de la patrulla mientras se dirige al incidente. |

---

## Especificación: Clasificar Tipo Penal (Catálogo IUCR)

### 1. Objetivo

Estandarizar los delitos registrados utilizando la nomenclatura oficial IUCR/FBI.

### 2. Contexto

La policía ingresaba delitos en texto libre (ej. 'Robo', 'Hurto', 'Asalto'), lo cual arruinaba la analítica y reportes estadísticos.

### 3. Usuarios o actores

- Oficial de Patrulla

- Operador de Emergencias

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-TIP-001** | El sistema debe proveer una lista desplegable con códigos IUCR. |

| **RF-INC-TIP-002** | El sistema debe permitir búsqueda predictiva del delito. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-TIP-001** | La búsqueda predictiva debe reaccionar en menos de 500ms. |

| **RNF-INC-TIP-002** | El catálogo debe estar cacheado localmente. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-TIP-001** | Todo incidente debe tener obligatoriamente un código penal asociado. |

| **RN-INC-TIP-002** | Solo el administrador puede modificar los códigos del catálogo. |

### 7. Entradas

- Término de búsqueda ingresado por el usuario.

### 8. Salidas

- Código IUCR asignado al incidente.

- Mensaje de validación.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el oficial ingresa 'Homicidio' en el buscador | Cuando selecciona la opción '0110 - Homicidio Primer Grado' | Entonces el sistema debe vincular el código 0110 al incidente |

| **Caso de Error** | Dado que el oficial intenta guardar sin seleccionar un tipo penal | Cuando presiona guardar | Entonces el sistema debe resaltar el campo en rojo y mostrar 'Delito obligatorio' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-TIP-001** | El buscador autocompleta con resultados válidos. |

| **CA-INC-TIP-002** | Impide avanzar sin código. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-TIP-001** | La base de datos IUCR debe estar actualizada anualmente. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-TIP-001** | Sugerencia de penas carcelarias para el delito. |

---

## Especificación: Despachar Unidad y Trazar Ruta

### 1. Objetivo

Asignar la patrulla más cercana al incidente y mostrar el tiempo estimado de llegada.

### 2. Contexto

La asignación manual de patrullas depende de la intuición del despachador, generando retrasos críticos en emergencias.

### 3. Usuarios o actores

- Operador de Emergencias

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-DES-001** | El sistema debe calcular la distancia entre patrullas disponibles y el incidente. |

| **RF-INC-DES-002** | El sistema debe permitir al Operador confirmar el despacho. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-DES-001** | El cálculo de distancia debe ser en tiempo real usando algoritmos geoespaciales. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-DES-001** | Solo se pueden despachar unidades cuyo estado sea 'Disponible'. |

| **RN-INC-DES-002** | Si se rechaza el despacho, salta a la siguiente patrulla más cercana. |

### 7. Entradas

- Ubicación del incidente

- GPS de las patrullas.

### 8. Salidas

- Notificación PUSH al oficial de la patrulla.

- Ruta trazada en el mapa.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que hay una unidad disponible a 2 kilómetros | Cuando el Operador selecciona 'Despachar Unidad' | Entonces el sistema envía una alerta al oficial y cambia el estado de la unidad a 'En camino' |

| **Caso de Error** | Dado que no hay unidades disponibles en el cuadrante | Cuando ocurre el incidente | Entonces el sistema debe mostrar 'Sin unidades, despachando desde cuadrante adyacente' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-DES-001** | Muestra siempre la patrulla activa más cercana. |

| **CA-INC-DES-002** | Cambia estado a 'En camino' exitosamente. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-DES-001** | Depende de la API de Google Maps o Mapbox. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-DES-001** | Control remoto de las sirenas del vehículo. |

---

## Especificación: Registrar Tiempo de Llegada de Patrullas a Emergencias

### 1. Objetivo

Medir y auditar los tiempos exactos desde la llamada hasta la llegada a la escena.

### 2. Contexto

Las métricas de respuesta son manipuladas manualmente por los oficiales para evitar sanciones. Se necesita registro inmutable.

### 3. Usuarios o actores

- Sistema (Automático)

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-TLL-001** | El sistema debe registrar timestamp de Despacho. |

| **RF-INC-TLL-002** | El sistema debe registrar timestamp de Llegada cuando el GPS de la patrulla coincida con la escena. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-TLL-001** | Los timestamps deben usar el reloj del servidor (UTC) y no del móvil. |

| **RNF-INC-TLL-002** | Inmutabilidad estricta a nivel base de datos. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-TLL-001** | La hora de llegada nunca puede ser menor a la hora de despacho. |

| **RN-INC-TLL-002** | El tiempo de respuesta = Hora Llegada - Hora Despacho. |

### 7. Entradas

- GPS de la patrulla

- Coordenadas del incidente.

### 8. Salidas

- Timestamp de llegada

- Métrica de tiempo total en segundos.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que la patrulla ingresa a un radio de 50 metros del incidente | Cuando el sistema detecta la proximidad | Entonces registra automáticamente la hora de llegada y detiene el contador |

| **Caso de Error** | Dado que el reloj local del celular es manipulado | Cuando se registra la llegada | Entonces el sistema ignora la hora local y usa la del servidor seguro |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-TLL-001** | Registro de tiempos 100% automático basado en geocercas. |

| **CA-INC-TLL-002** | Uso exclusivo de reloj de servidor. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-TLL-001** | Las geocercas pueden variar según edificios altos. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-TLL-001** | Justificación manual de retrasos por tráfico. |

---

## Especificación: Ingresar Número de Víctimas

### 1. Objetivo

Registrar cuantitativamente el impacto civil y policial del incidente.

### 2. Contexto

Para solicitar ambulancias adicionales y para estadísticas criminalísticas, es crítico contabilizar heridos y fallecidos.

### 3. Usuarios o actores

- Oficial de Patrulla

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-VIC-001** | El sistema debe proporcionar campos numéricos para víctimas. |

| **RF-INC-VIC-002** | Clasificar en heridos y fallecidos (civiles/policías). |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-VIC-001** | El campo numérico debe impedir caracteres alfabéticos. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-VIC-001** | No se permiten números negativos. |

| **RN-INC-VIC-002** | Si hay víctimas, debe activarse el flag de 'Notificar Paramédicos'. |

### 7. Entradas

- Valores enteros ingresados por el oficial.

### 8. Salidas

- Registro cuantitativo del incidente.

- Alerta a paramédicos si > 0.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el oficial ingresa '2' en heridos civiles | Cuando guarda los datos | Entonces el sistema actualiza el registro y dispara alerta EMS |

| **Caso de Error** | Dado que el oficial intenta ingresar '-1' o 'A' en víctimas | Cuando digita el valor | Entonces el teclado numérico lo impide o arroja error de validación |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-VIC-001** | Permite guardar valores >= 0. |

| **CA-INC-VIC-002** | Dispara alerta EMS al haber heridos. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-VIC-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-VIC-001** | Triaje médico de las víctimas. |

---

## Especificación: Detallar Uso o Detonación de Armas

### 1. Objetivo

Auditar legalmente si el incidente involucró el uso de fuerza letal.

### 2. Contexto

El uso de armas de fuego desencadena investigaciones de Asuntos Internos inmediatas.

### 3. Usuarios o actores

- Oficial de Patrulla

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-ARM-001** | El sistema debe incluir un toggle 'Uso de Arma'. |

| **RF-INC-ARM-002** | Si es 'Sí', desplegar campo para 'Cantidad de detonaciones'. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-ARM-001** | Accesibilidad táctil rápida (Botones grandes). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-ARM-001** | Si se marca 'Sí', es obligatorio ingresar la cantidad de disparos. |

| **RN-INC-ARM-002** | Se bloquea el cierre rápido del incidente obligando a crear un Caso Mayor. |

### 7. Entradas

- Booleano (Sí/No)

- Entero (Cantidad de disparos).

### 8. Salidas

- Alerta a Asuntos Internos.

- Requisito de reporte extendido activado.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el oficial selecciona 'Sí' en uso de armas | Cuando guarda el incidente | Entonces el sistema notifica a Asuntos Internos y abre expediente extendido |

| **Caso de Error** | Dado que el oficial selecciona 'Sí' pero deja cantidad vacía | Cuando intenta guardar | Entonces el sistema exige la cantidad de disparos |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-ARM-001** | Toggle activa sub-campos correctamente. |

| **CA-INC-ARM-002** | Alerta generada automáticamente. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-ARM-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-ARM-001** | Descuento automático de munición del inventario (eso es módulo Logística). |

---

## Especificación: Adjuntar Fotografías de Evidencia

### 1. Objetivo

Preservar el estado inicial de la escena antes de su contaminación.

### 2. Contexto

Las fotos forenses suelen perderse o manipularse en redes sociales. Se requiere una vía cifrada directa.

### 3. Usuarios o actores

- Oficial de Patrulla

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-FOT-001** | El sistema debe abrir la cámara nativa dentro de la app. |

| **RF-INC-FOT-002** | El sistema debe subir la imagen comprimida y borrarla del carrete local. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-FOT-001** | Peso máximo de imagen 2MB. |

| **RNF-INC-FOT-002** | Compresión sin pérdida perceptible (JPEG 85%). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-FOT-001** | Las imágenes subidas no pueden ser borradas por el oficial. |

| **RN-INC-FOT-002** | Toda foto debe estamparse con fecha, hora y GPS (Marca de agua). |

### 7. Entradas

- Captura de la cámara.

### 8. Salidas

- Archivo de imagen cifrado en Supabase Storage.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el oficial toma una foto de la evidencia | Cuando acepta la previsualización | Entonces el sistema comprime, sube, sella y limpia el carrete |

| **Caso de Error** | Dado que el oficial intenta subir una foto de 15MB de su galería | Cuando selecciona el archivo | Entonces el sistema la comprime automáticamente antes de subirla o la rechaza si no es formato válido |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-FOT-001** | Foto sellada con metadatos. |

| **CA-INC-FOT-002** | Foto no queda en galería pública del teléfono. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-FOT-001** | Depende de los permisos de SO (iOS/Android) sobre la cámara. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-FOT-001** | Reconocimiento de objetos por IA en la foto. |

---

## Especificación: Registrar Estado Climático

### 1. Objetivo

Documentar las condiciones meteorológicas que pueden afectar las pruebas forenses o la conducción.

### 2. Contexto

Un piso mojado o niebla son factores clave en investigaciones de accidentes de tránsito.

### 3. Usuarios o actores

- Sistema (Automático)

- Oficial de Patrulla (Manual)

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-CLI-001** | El sistema debe consultar API externa según las coordenadas GPS. |

| **RF-INC-CLI-002** | El sistema debe permitir corrección manual si el clima cambia drásticamente. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-CLI-001** | La consulta a la API de clima debe durar menos de 1 segundo. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-CLI-001** | El clima se registra una sola vez al inicio del incidente. |

### 7. Entradas

- Coordenadas GPS (Automático)

- Selección manual (Soleado, Lluvia, Nieve).

### 8. Salidas

- Dato climático almacenado en el incidente.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el GPS captura una ubicación válida | Cuando se inicializa el formulario | Entonces el sistema extrae de la API que hay 'Lluvia Moderada' y lo pre-llena |

| **Caso de Error** | Dado que la API de clima está caída | Cuando el sistema intenta consultar | Entonces habilita el campo para que el oficial lo seleccione manualmente |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-CLI-001** | Autocompletado vía API exitoso. |

| **CA-INC-CLI-002** | Fallback manual funciona en caso de error API. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-CLI-001** | Depende de la disponibilidad de la API Meteorológica. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-CLI-001** | Pronóstico del clima a futuro. |

---

## Especificación: Clasificar Nivel de Gravedad (Triage 911)

### 1. Objetivo

Priorizar la atención y despacho de emergencias en base a su nivel de criticidad.

### 2. Contexto

Cuando entran 10 llamadas simultáneas, el operador necesita saber cuál enviar primero para salvar vidas.

### 3. Usuarios o actores

- Operador de Emergencias

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-INC-TRI-001** | El sistema debe obligar a seleccionar un nivel de 1 (Leve) a 5 (Crítico). |

| **RF-INC-TRI-002** | El sistema ordenará la cola de incidentes según este nivel. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-TRI-001** | Interfaz con código de colores (Rojo para 5, Verde para 1). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-TRI-001** | Triage 5 salta toda la cola de espera de despacho. |

| **RN-INC-TRI-002** | Incidentes de Triage 5 notifican al Sheriff de Turno de inmediato. |

### 7. Entradas

- Selección del operador (1,2,3,4,5).

### 8. Salidas

- Prioridad del incidente actualizada.

- Cola de despacho reordenada.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el operador marca Triage 5 por un asalto armado | Cuando guarda el nivel | Entonces el incidente sube al tope de la lista y suena alerta en pantalla del Sheriff |

| **Caso de Error** | Dado que el operador olvida seleccionar el Triage | Cuando intenta pasar al paso de despacho | Entonces el sistema bloquea el paso indicando 'Seleccione Triage' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INC-TRI-001** | Ordenamiento de cola respetando el nivel mayor primero. |

| **CA-INC-TRI-002** | Notificación al Sheriff operativa para nivel 5. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-TRI-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-TRI-001** | Evaluación psicológica del denunciante telefónico. |

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

| **RF-INC-TAS-001** | El sistema debe proveer un formulario de justificación obligatoria al reportar el uso del taser. |

| **RF-INC-TAS-002** | Registrar cantidad de cartuchos disparados. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INC-TAS-001** | Notificación instantánea vía WebSockets al supervisor en turno. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INC-TAS-001** | El registro de descarga descuenta automáticamente el inventario de cartuchos del oficial. |

| **RN-INC-TAS-002** | Este registro está exento de edición post-envío (inmutable). |

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

| **CA-INC-TAS-001** | Campo motivo con longitud mínima de 50 caracteres. |

| **CA-INC-TAS-002** | Deducción automática de cartuchos en módulo logístico. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INC-TAS-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INC-TAS-001** | Lectura del log digital interno del Taser por cable USB. |

---

# Especificaciones: Módulo Operativo Inteligencia y Detectives

---

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

| **RF-INT-ALI-001** | El sistema debe permitir guardar un perfil solo con el campo Alias. |

| **RF-INT-ALI-002** | El sistema debe sugerir coincidencias si el alias ya existe en la BD. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-ALI-001** | La búsqueda de coincidencias debe tardar menos de 800ms. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-ALI-001** | Si no hay Nombre ni Apellido, el campo Alias es obligatorio. |

| **RN-INT-ALI-002** | El alias se debe guardar siempre en mayúsculas para evitar duplicidades por formato. |

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

| **CA-INT-ALI-001** | Guarda exitosamente con solo el alias. |

| **CA-INT-ALI-002** | Transforma automáticamente el texto a mayúsculas. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-ALI-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-ALI-001** | Búsqueda facial para encontrar el nombre a partir de una foto. |

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

| **RF-INT-TAT-001** | El sistema debe tener un catálogo de ubicaciones corporales (Brazo derecho, Cuello, etc.). |

| **RF-INT-TAT-002** | El sistema debe permitir subir foto del tatuaje. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-TAT-001** | La interfaz debe presentar un modelo visual del cuerpo humano (opcional). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-TAT-001** | Cada tatuaje registrado debe tener obligatoriamente su 'Ubicación' en el cuerpo. |

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

| **CA-INT-TAT-001** | Evita guardado sin ubicación. |

| **CA-INT-TAT-002** | Permite múltiples tatuajes por persona. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-TAT-001** | Catálogo de zonas corporales predefinido. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-TAT-001** | Reconocimiento de patrones de tatuajes por IA. |

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

| **RF-INT-PLA-001** | El sistema debe permitir registrar número de placa, estado emisor y marca/modelo. |

| **RF-INT-PLA-002** | El sistema debe alertar si la placa está reportada como robada en la BD local. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-PLA-001** | El formato de placa debe permitir alfanuméricos sin espacios. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-PLA-001** | Toda placa registrada se convierte automáticamente en objeto de interés para patrullas. |

| **RN-INT-PLA-002** | El Estado Emisor es obligatorio si se ingresa la placa. |

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

| **CA-INT-PLA-001** | Normaliza el número de placa (sin espacios, mayúsculas). |

| **CA-INT-PLA-002** | Lanza advertencia si la placa es duplicada en otro caso. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-PLA-001** | No se conecta a la DMV nacional en esta fase. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-PLA-001** | Integración con cámaras de peajes. |

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

| **RF-INT-TES-001** | El sistema debe tener un checkbox de 'Testigo Protegido'. |

| **RF-INT-TES-002** | Si está activo, el sistema debe reemplazar el nombre en pantalla por un ID Hash (ej. WIT-9382). |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-TES-001** | El nombre real debe encriptarse a nivel de columna en la base de datos (AES-256). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-TES-001** | Solo el creador del testimonio y el Sheriff pueden desencriptar el nombre. |

| **RN-INT-TES-002** | Las exportaciones PDF nunca incluirán el nombre desencriptado. |

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

| **CA-INT-TES-001** | Enmascaramiento inmediato en la interfaz web. |

| **CA-INT-TES-002** | Imposibilidad de exportar el nombre real. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-TES-001** | Depende de la correcta implementación de AES-256. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-TES-001** | Modificación de la voz en archivos de audio. |

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

| **RF-INT-AUD-001** | El sistema debe permitir arrastrar y soltar archivos .mp3, .m4a o .wav. |

| **RF-INT-AUD-002** | El sistema debe incluir un reproductor de audio integrado en el navegador. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-AUD-001** | Peso máximo de carga 50 MB. |

| **RNF-INT-AUD-002** | Almacenamiento directo en Supabase Storage. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-AUD-001** | Una vez subido, el archivo no puede ser eliminado por el detective, solo inactivado. |

| **RN-INT-AUD-002** | El archivo asume el nivel de confidencialidad del testimonio asociado. |

### 7. Entradas

- Archivo de audio digital.

### 8. Salidas

- URL segura del archivo reproducible en el expediente.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que se arrastra un archivo MP3 de 15MB | Cuando finaliza la barra de carga | Entonces el sistema muestra el reproductor incrustado en el caso |

| **Caso de Error** | Dado que el usuario intenta subir un archivo de 100MB | Cuando se suelta el archivo | Entonces el sistema cancela la subida y muestra 'Límite 50MB excedido' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-INT-AUD-001** | Bloquea formatos no soportados (.exe, .zip). |

| **CA-INT-AUD-002** | Permite reproducción sin descargar el archivo localmente. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-AUD-001** | Velocidad de carga sujeta a la conexión a internet de la estación. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-AUD-001** | Transcripción automática a texto (Speech-to-text). |

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

| **RF-INT-ARR-001** | El sistema debe permitir buscar arrestos recientes por número de ticket o nombre. |

| **RF-INT-ARR-002** | El sistema debe vincular el ID del arresto como 'Resolución' o 'Avance' del caso. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-ARR-001** | La búsqueda debe mostrar sugerencias en tiempo real basadas en los alias del expediente. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-ARR-001** | Un arresto puede estar vinculado a múltiples expedientes simultáneamente. |

| **RN-INT-ARR-002** | Vincular un arresto del Sospechoso Principal permite proponer el cierre del caso. |

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

| **CA-INT-ARR-001** | Actualiza estado del sospechoso. |

| **CA-INT-ARR-002** | Enlace bidireccional (Desde el arresto también se ve el caso vinculado). |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-ARR-001** | Depende de que el módulo de Incidentes haya procesado el arresto. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-ARR-001** | Aprobación del fiscal de distrito. |

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

| **RF-INT-CUS-001** | El sistema debe permitir registrar 'Entrega' y 'Recepción' de un ítem. |

| **RF-INT-CUS-002** | El sistema debe generar un código de barras/QR para cada ítem de evidencia ingresado. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-CUS-001** | Registro de logs en tabla append-only de auditoría. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-CUS-001** | Un ítem solo puede ser recibido por un usuario a la vez. |

| **RN-INT-CUS-002** | No se puede transferir un ítem si su estado actual es 'Perdido' o 'Destruido'. |

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

| **CA-INT-CUS-001** | Bloquea transferencias de evidencia no poseída. |

| **CA-INT-CUS-002** | Log inmutable por cada paso. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-CUS-001** | Depende del escáner físico de código de barras conectado al PC. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-CUS-001** | Control ambiental (temperatura/humedad) del cuarto de evidencias. |

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

| **RF-INT-PER-001** | El sistema debe incluir un editor de texto enriquecido para reportes periciales. |

| **RF-INT-PER-002** | Permitir la subida de anexos PDF con los resultados formales de laboratorio. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-PER-001** | Formato PDF debe ser renderizado nativamente en el navegador. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-PER-001** | Las notas periciales solo pueden ser ingresadas por el rol 'Perito Forense' o el Detective asignado. |

| **RN-INT-PER-002** | Una vez subida, la nota no se borra, solo se emiten alcances (correcciones en nuevo registro). |

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

| **CA-INT-PER-001** | Solo usuarios autorizados ingresan peritajes. |

| **CA-INT-PER-002** | Los PDF adjuntos no pueden pesar más de 20MB. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-PER-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-PER-001** | Interconexión con máquinas de análisis de laboratorio. |

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

| **RF-INT-REP-001** | El sistema debe compilar todos los sospechosos, evidencias y testimonios en un formato PDF predefinido. |

| **RF-INT-REP-002** | El sistema debe permitir la aprobación del reporte. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-REP-001** | La generación del PDF no debe demorar más de 5 segundos. |

| **RNF-INT-REP-002** | El PDF generado es inalterable (Read-Only). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-REP-001** | Un caso no puede cambiar de estado a 'Cerrado' si no tiene este reporte generado. |

| **RN-INT-REP-002** | El reporte debe ser firmado por el Detective principal y aprobado por el Sheriff. |

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

| **CA-INT-REP-001** | PDF generado incluye el hash de los testigos, no sus nombres reales. |

| **CA-INT-REP-002** | El cambio de estado a cerrado requiere este hito. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-REP-001** | Formato PDF requerido por estándar de los juzgados. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-REP-001** | Envío automático por correo a la fiscalía del estado. |

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

| **RF-INT-CEL-001** | El sistema debe permitir ingresar filas dinámicas de pertenencias (Tipo, Cantidad, Descripción). |

| **RF-INT-CEL-002** | El sistema debe generar un recibo PDF e imprimir código QR para la bolsa plástica. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-CEL-001** | Soporte para firma manuscrita en pantallas táctiles o tablets de estación. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-CEL-001** | El formulario debe ser firmado por el oficial y por el detenido (o marcar casilla 'Detenido incapaz de firmar'). |

| **RN-INT-CEL-002** | No se pueden eliminar elementos de la lista una vez guardada, solo marcar como 'Devuelto' a la salida. |

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

| **CA-INT-CEL-001** | Bloqueo de edición del inventario post-guardado. |

| **CA-INT-CEL-002** | Captura fluida de firmas táctiles en formato vector/imagen. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-CEL-001** | Uso exclusivo en estación policial (PC/Tablet). |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-CEL-001** | Verificación de identidad facial del detenido. |

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

| **RF-INT-BIT-001** | El sistema debe proveer una lista de detenidos activos y un botón rápido de 'Ronda de Seguridad OK'. |

| **RF-INT-BIT-002** | Permitir registrar 'Alimentación' y 'Visita Médica' o 'Abogado'. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-INT-BIT-001** | La inserción de los logs de ronda debe ser instantánea (1 tap). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-INT-BIT-001** | Si pasan más de 60 minutos sin que se registre una ronda para una celda ocupada, suena una alerta administrativa en la oficina del Capitán. |

| **RN-INT-BIT-002** | Los registros asumen automáticamente el timestamp inalterable del servidor. |

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

| **CA-INT-BIT-001** | Temporizadores de cumplimiento legal funcionan en background. |

| **CA-INT-BIT-002** | Registros de bitácora simples, con un solo toque (Tap & Go). |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-INT-BIT-001** | Depende de tareas programadas (Celery/Cron) corriendo sin interrupción. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-INT-BIT-001** | Cámaras de vigilancia de las celdas integradas en el panel. |

---

# Especificaciones: Módulo Operativo Logística y Flota

---

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

| **RF-LOG-KIL-001** | El sistema debe solicitar el ingreso numérico del odómetro durante el Check-In del vehículo. |

| **RF-LOG-KIL-002** | Lo mismo para el Check-Out. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-LOG-KIL-001** | La interfaz debe presentar el teclado numérico de forma predeterminada en móviles. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-LOG-KIL-001** | El kilometraje inicial del turno debe ser mayor o igual al kilometraje final registrado en el turno anterior. |

| **RN-LOG-KIL-002** | El kilometraje final no puede ser menor al inicial del turno actual. |

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

| **CA-LOG-KIL-001** | Validaciones matemáticas bloquean datos erróneos. |

| **CA-LOG-KIL-002** | Almacena el recorrido total de cada oficial. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-LOG-KIL-001** | Depende de la honestidad de la lectura visual del tablero por parte del oficial. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-LOG-KIL-001** | Lectura automática vía OBD-II Bluetooth. |

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

| **RF-LOG-DAN-001** | El sistema debe mostrar un esquema del vehículo con zonas seleccionables (Frontal, Lateral Izquierdo, etc.). |

| **RF-LOG-DAN-002** | Permitir tomar foto del daño. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-LOG-DAN-001** | Interfaz optimizada para uso con una sola mano en móvil. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-LOG-DAN-001** | Si se reporta un 'Daño Nuevo', es obligatorio adjuntar una fotografía. |

| **RN-LOG-DAN-002** | Los daños preexistentes aprobados no requieren nueva fotografía. |

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

| **CA-LOG-DAN-001** | Evita que el oficial finalice Check-In si hay daños no documentados. |

| **CA-LOG-DAN-002** | Genera un reporte de diferencias contra el turno previo. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-LOG-DAN-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-LOG-DAN-001** | Cálculo de costos de reparación de carrocería. |

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

| **RF-LOG-COM-001** | El sistema debe tener un slider (deslizador) del 0 al 100% para indicar nivel de tanque. |

| **RF-LOG-COM-002** | Se registra tanto a la salida como a la llegada. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-LOG-COM-001** | Componente visual intuitivo (como la aguja del tablero). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-LOG-COM-001** | Para finalizar turno, el tanque debe registrar al menos un 50%. De lo contrario genera infracción administrativa. |

| **RN-LOG-COM-002** | El nivel de llegada nunca puede ser mayor al que se cargó, a menos que se registre comprobante de gasolinera. |

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

| **CA-LOG-COM-001** | Slider captura valores válidos de 0 a 100. |

| **CA-LOG-COM-002** | Regla del 50% de gasolina mínima funciona correctamente. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-LOG-COM-001** | Cálculo estimado visualmente por el oficial. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-LOG-COM-001** | Integración con tarjetas de flota de gasolineras (FleetCards). |

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

| **RF-LOG-RAD-001** | Permitir escanear el código de barras del radio usando la cámara del móvil o ingreso manual del ID. |

| **RF-LOG-RAD-002** | Asignar temporalmente el radio al oficial. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-LOG-RAD-001** | Respuesta del escáner de barras menor a 1 segundo. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-LOG-RAD-001** | Un radio no puede estar asignado a dos oficiales al mismo tiempo. |

| **RN-LOG-RAD-002** | Si el radio no se devuelve al finalizar el turno, el sistema lo marca como 'Extraviado'. |

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

| **CA-LOG-RAD-001** | Control de concurrencia de equipos exclusivo. |

| **CA-LOG-RAD-002** | Lectura por cámara integrada funcional. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-LOG-RAD-001** | Depende de la correcta impresión de etiquetas de barras en los equipos. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-LOG-RAD-001** | Geolocalización satelital del radio de mano. |

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

| **RF-LOG-MUN-001** | El sistema debe registrar la cantidad de cargadores y tipo de calibre entregado (ej. 9mm, .223). |

| **RF-LOG-MUN-002** | Permitir conteo al devolver el equipo. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-LOG-MUN-001** | Tablas de base de datos optimizadas para alto volumen de transacciones de inventario. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-LOG-MUN-001** | La diferencia de munición al regresar debe coincidir con los reportes de 'Uso de Arma' en Incidentes. |

| **RN-LOG-MUN-002** | Discrepancias generan alertas automáticas al Sheriff. |

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

| **CA-LOG-MUN-001** | Cruza datos de munición faltante con el módulo de incidentes. |

| **CA-LOG-MUN-002** | Reportes de inventario consistentes en bodega. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-LOG-MUN-001** | Conteo manual por parte del armero. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-LOG-MUN-001** | Trazabilidad balística de cada bala individual. |

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

| **RF-LOG-FAL-001** | El sistema debe permitir crear un ticket describiendo la falla mecánica. |

| **RF-LOG-FAL-002** | El sistema debe cambiar el estado del vehículo en el catálogo. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-LOG-FAL-001** | La interfaz debe permitir categorización rápida (Frenos, Motor, Eléctrico, Llantas). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-LOG-FAL-001** | Un vehículo con ticket de gravedad 'Alta' cambia a estado 'Fuera de Servicio' inmediatamente. |

| **RN-LOG-FAL-002** | Solo el taller/logística puede cerrar un ticket una vez reparado. |

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

| **CA-LOG-FAL-001** | Flujo de estados correcto (Abierto -> En Taller -> Resuelto). |

| **CA-LOG-FAL-002** | Integridad del catálogo de patrullas bloqueando vehículos inoperativos. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-LOG-FAL-001** | Depende de que el mecánico use el sistema para cerrar los tickets. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-LOG-FAL-001** | Control de inventario de repuestos del taller mecánico. |

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

| **RF-LOG-NEU-001** | El sistema debe solicitar 4 valores de presión (PSI), uno por cada neumático. |

| **RF-LOG-NEU-002** | Alertar si el valor sale del rango seguro (ej. 30-40 PSI). |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-LOG-NEU-001** | Interfaz gráfica intuitiva mostrando un coche desde arriba con 4 inputs. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-LOG-NEU-001** | Valores de PSI extremadamente bajos (<20) o altos (>45) impiden aceptar la patrulla obligando a inflar/revisar. |

| **RN-LOG-NEU-002** | Es obligatorio llenar los 4 campos en la inspección. |

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

| **CA-LOG-NEU-001** | Validación de rangos (30-40 normal, bloqueo fuera de rango extremo). |

| **CA-LOG-NEU-002** | Captura individual de las 4 ruedas. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-LOG-NEU-001** | Chequeo manual con medidor de presión de aire por parte del oficial. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-LOG-NEU-001** | Sensores TPMS automáticos leídos inalámbricamente. |

---

# Especificaciones: Módulo Operativo Recursos Humanos

---

# Especificaciones: Módulo Operativo Recursos Humanos

## Especificación: Registrar Clock-in / Clock-out

### 1. Objetivo

Llevar un control exacto y auditable de las horas trabajadas por los oficiales.

### 2. Contexto

El fraude en horas extras es común cuando los oficiales reportan sus turnos en hojas de papel al finalizar el día.

### 3. Usuarios o actores

- Oficial de Patrulla

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-RRH-CLK-001** | Permitir hacer Clock-in con un botón en la app. |

| **RF-RRH-CLK-002** | Capturar automáticamente la hora del servidor (UTC) y la geolocalización de la estación al presionar. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-RRH-CLK-001** | La interfaz debe impedir el doble toque del botón (Debounce). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-RRH-CLK-001** | No se permite hacer Clock-in si ya hay un turno activo. |

| **RN-RRH-CLK-002** | El Clock-out exige estar en el perímetro de la estación (Geocerca) o solicitar anulación por emergencia. |

### 7. Entradas

- Clic del usuario.

### 8. Salidas

- Registro en bitácora de asistencia.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el oficial no tiene turnos activos | Cuando presiona Clock-in al llegar a la estación | Entonces el sistema abre su turno de guardia con la hora de red |

| **Caso de Error** | Dado que el oficial olvidó hacer Clock-out ayer | Cuando intenta hacer Clock-in hoy | Entonces el sistema muestra error y exige cerrar el turno previo |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-RRH-CLK-001** | Uso exclusivo de hora de servidor, ignora reloj del teléfono. |

| **CA-RRH-CLK-002** | Valida geocerca de la estación policial. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-RRH-CLK-001** | Depende de la conexión al servidor NTP para la hora. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-RRH-CLK-001** | Cálculo del pago monetario por las horas extra. |

---

## Especificación: Asignar Oficial a Cuadrante

### 1. Objetivo

Distribuir estratégicamente a los patrulleros en las diferentes zonas de la ciudad.

### 2. Contexto

Si todos los oficiales patrullan el centro comercial, los barrios residenciales quedan vulnerables. El sheriff debe balancear el mapa.

### 3. Usuarios o actores

- Sheriff

- Sargento de Turno

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-RRH-CUA-001** | Mostrar un mapa interactivo con los cuadrantes de la ciudad. |

| **RF-RRH-CUA-002** | Permitir arrastrar y soltar (Drag and Drop) el perfil del oficial sobre un cuadrante libre. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-RRH-CUA-001** | El mapa debe actualizar la asignación en tiempo real (menos de 2 seg). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-RRH-CUA-001** | Un cuadrante de alto riesgo requiere mínimo 2 patrulleros asignados. |

| **RN-RRH-CUA-002** | Un oficial no puede ser asignado a dos cuadrantes al mismo tiempo en el mismo turno. |

### 7. Entradas

- Selección del cuadrante

- Perfil del oficial.

### 8. Salidas

- Actualización de la matriz operativa de despliegue.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el Sargento arrastra al Oficial Pérez al Cuadrante Norte | Cuando suelta el icono | Entonces el sistema lo registra y envía la notificación al móvil del oficial |

| **Caso de Error** | Dado que el Sargento asigna a Pérez al Sur, pero Pérez ya estaba en el Norte | Cuando suelta el icono | Entonces el sistema mueve a Pérez quitándolo del Norte automáticamente |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-RRH-CUA-001** | Funcionalidad Drag and Drop sin errores lógicos. |

| **CA-RRH-CUA-002** | Impide duplicidad de asignaciones en un mismo turno temporal. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-RRH-CUA-001** | Definición previa de los polígonos de los cuadrantes en BD. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-RRH-CUA-001** | Redibujo automático de cuadrantes según tráfico. |

---

## Especificación: Ingresar Solicitud de Permisos

### 1. Objetivo

Digitalizar el flujo de aprobación de días libres, vacaciones y licencias médicas.

### 2. Contexto

El papeleo de licencias se pierde, y los sargentos programan turnos a oficiales que oficialmente estaban de vacaciones.

### 3. Usuarios o actores

- Oficial de Patrulla

- Sheriff

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-RRH-PMI-001** | El oficial debe poder seleccionar fechas en un calendario. |

| **RF-RRH-PMI-002** | El Sheriff debe tener una bandeja de 'Solicitudes Pendientes' para Aprobar/Rechazar. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-RRH-PMI-001** | La interfaz de calendario debe bloquear la selección de fechas pasadas. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-RRH-PMI-001** | Las solicitudes aprobadas bloquean la asignación de turnos del oficial para esas fechas. |

| **RN-RRH-PMI-002** | Las licencias médicas requieren adjuntar obligatoriamente un archivo (certificado). |

### 7. Entradas

- Rango de fechas

- Motivo del permiso

- Archivo adjunto (opcional).

### 8. Salidas

- Estado del permiso actualizado.

- Bloqueo preventivo en el calendario de despliegue.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el oficial pide vacaciones para diciembre | Cuando el Sheriff aprueba la solicitud | Entonces el sistema marca esas fechas como 'Permiso' y no permite asignarle turnos |

| **Caso de Error** | Dado que el oficial intenta subir licencia médica sin adjuntar PDF | Cuando presiona Enviar | Entonces el sistema bloquea y dice 'Certificado Requerido' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-RRH-PMI-001** | Flujo de aprobación (Pendiente -> Aprobado/Rechazado) funcional. |

| **CA-RRH-PMI-002** | Bloqueo de cruce con turnos asignados. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-RRH-PMI-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-RRH-PMI-001** | Cálculo legal de días acumulados por antigüedad de ley. |

---

## Especificación: Evaluar Desempeño del Oficial

### 1. Objetivo

Permitir a los supervisores evaluar formalmente el rendimiento operativo de cada oficial de forma trimestral o anual.

### 2. Contexto

Sin evaluaciones sistemáticas, las promociones se basan en antigüedad en lugar de mérito, y los patrones de comportamiento problemático pasan desapercibidos hasta que escalan a incidentes graves.

### 3. Usuarios o actores

- Sheriff

- Sargento de Turno

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-RRH-EVA-001** | El sistema debe proveer una matriz de evaluación con puntuación de 1 a 10 para las categorías: Tiempo de Respuesta, Cumplimiento de Uso de Fuerza, Retroalimentación Comunitaria, Calidad de Reportes y Trabajo en Equipo. |

| **RF-RRH-EVA-002** | El sistema debe incluir un campo de texto enriquecido para la evaluación narrativa del supervisor. |

| **RF-RRH-EVA-003** | El sistema debe mostrar una comparativa histórica con las evaluaciones previas del oficial (gráfico de tendencia). |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-RRH-EVA-001** | La interfaz de evaluación debe ser completable en menos de 10 minutos por oficial. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-RRH-EVA-001** | La evaluación no puede marcarse como completada sin que el oficial evaluado la reconozca mediante firma digital. |

| **RN-RRH-EVA-002** | Una puntuación inferior a 4 en cualquier categoría debe generar automáticamente una solicitud de capacitación correctiva obligatoria. |

### 7. Entradas

- Puntuaciones numéricas por categoría (1-10).

- Texto narrativo del supervisor.

- Firma digital del oficial evaluado.

### 8. Salidas

- Registro de evaluación almacenado en el expediente del oficial.

- Alerta de capacitación correctiva si aplica.

- Reporte PDF de la evaluación para archivo físico.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el Sargento completa la evaluación del Oficial Martínez con un promedio de 8.5 | Cuando el oficial firma digitalmente el reconocimiento | Entonces el sistema archiva la evaluación y actualiza el historial del oficial |

| **Caso de Error** | Dado que el Sargento asigna un 3 en 'Cumplimiento de Uso de Fuerza' | Cuando guarda la evaluación | Entonces el sistema genera una alerta automática de capacitación correctiva obligatoria para el oficial |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-RRH-EVA-001** | La evaluación requiere firma digital para completarse. |

| **CA-RRH-EVA-002** | Se genera alerta correctiva automática para puntuaciones < 4. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-RRH-EVA-001** | Depende de que el oficial tenga acceso al sistema para firmar digitalmente. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-RRH-EVA-001** | Integración con evaluaciones psicológicas externas. |

---

## Especificación: Registrar Expediente Disciplinario

### 1. Objetivo

Formalizar y rastrear las quejas de asuntos internos y las acciones disciplinarias contra oficiales, creando un historial auditable e inmutable.

### 2. Contexto

Las amonestaciones verbales no dejan rastro documental. Cuando un patrón de mala conducta emerge años después, no existe documentación que respalde acciones correctivas previas, exponiendo al departamento a litigios.

### 3. Usuarios o actores

- Jefe de Asuntos Internos

- Sheriff

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-RRH-DIS-001** | El sistema debe permitir categorizar las infracciones: Mala Conducta, Fuerza Excesiva, Insubordinación, Violación de Protocolo. |

| **RF-RRH-DIS-002** | El sistema debe permitir vincular el expediente disciplinario con incidentes relacionados del módulo de Incidentes. |

| **RF-RRH-DIS-003** | El sistema debe rastrear el estado de resolución: Abierto, En Investigación, Resuelto, Apelado. |

| **RF-RRH-DIS-004** | El sistema debe permitir adjuntar documentos de soporte (declaraciones, videos de body cam). |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-RRH-DIS-001** | Los expedientes disciplinarios deben almacenarse con cifrado a nivel de registro por su naturaleza sensible. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-RRH-DIS-001** | El oficial involucrado debe ser notificado automáticamente cuando se crea un expediente a su nombre. |

| **RN-RRH-DIS-002** | Los registros disciplinarios son inmutables una vez archivados. Las correcciones requieren un documento de alcance separado. |

| **RN-RRH-DIS-003** | Solo el rol de 'Jefe de Asuntos Internos' o 'Sheriff' puede crear y gestionar estos expedientes. |

### 7. Entradas

- Categoría de infracción.

- Descripción detallada del incidente.

- ID del incidente vinculado (opcional).

- Documentos adjuntos.

### 8. Salidas

- Expediente disciplinario creado en el historial del oficial.

- Notificación al oficial involucrado.

- Actualización del estado de resolución.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el Jefe de Asuntos Internos documenta una queja por 'Fuerza Excesiva' contra el Oficial Torres | Cuando archiva el expediente | Entonces el sistema notifica al Oficial Torres, vincula el incidente y abre el caso como 'En Investigación' |

| **Caso de Error** | Dado que un Sargento de Turno intenta crear un expediente disciplinario | Cuando accede al módulo | Entonces el sistema deniega el acceso por permisos insuficientes (RBAC) |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-RRH-DIS-001** | Inmutabilidad de los registros una vez archivados. |

| **CA-RRH-DIS-002** | Notificación automática verificable al oficial involucrado. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-RRH-DIS-001** | Depende de la correcta configuración de roles RBAC para limitar el acceso. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-RRH-DIS-001** | Coordinación de defensa legal con el sindicato del oficial. |

---

## Especificación: Consultar Historial de Capacitaciones

### 1. Objetivo

Rastrear las certificaciones obligatorias y voluntarias de cada oficial, alertando sobre vencimientos próximos para garantizar el cumplimiento normativo.

### 2. Contexto

Los oficiales deben mantener certificaciones vigentes (armas de fuego, tácticas defensivas, primeros auxilios, intervención en crisis). Una certificación vencida genera responsabilidad legal si el oficial actúa en campo sin la acreditación válida.

### 3. Usuarios o actores

- Jefe de Logística

- Sheriff

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-RRH-CAP-001** | El sistema debe mantener un catálogo de tipos de capacitación con sus periodos de vigencia (ej. Armas de Fuego = 12 meses, Primeros Auxilios = 24 meses). |

| **RF-RRH-CAP-002** | El sistema debe mostrar un dashboard con oficiales cuyas certificaciones están por vencer en los próximos 30 días (alerta amarilla) o ya vencidas (alerta roja). |

| **RF-RRH-CAP-003** | El sistema debe permitir subir certificados digitales (PDF/imagen) como comprobante de capacitación completada. |

| **RF-RRH-CAP-004** | El sistema debe generar reportes de cumplimiento exportables en PDF para auditorías administrativas. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-RRH-CAP-001** | El dashboard de certificaciones debe cargar en menos de 2 segundos para facilitar la consulta rápida antes de asignar turnos. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-RRH-CAP-001** | Un oficial con una certificación crítica vencida (Armas de Fuego, Primeros Auxilios) no puede ser asignado a servicio de campo hasta renovarla. |

| **RN-RRH-CAP-002** | La finalización de una capacitación debe ser verificada mediante la firma digital del instructor responsable. |

### 7. Entradas

- Tipo de capacitación del catálogo.

- Fecha de completación.

- Certificado digital adjunto (PDF/imagen).

- Firma digital del instructor.

### 8. Salidas

- Actualización del perfil del oficial con la nueva certificación.

- Recálculo de fechas de vencimiento.

- Alertas de vencimiento en el dashboard.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el oficial García completó su recertificación de Armas de Fuego | Cuando el instructor sube el certificado y firma digitalmente | Entonces el sistema actualiza la vigencia por 12 meses y elimina la alerta roja del dashboard |

| **Caso de Error** | Dado que el Sargento intenta asignar al oficial López a patrullaje | Cuando el sistema detecta que su certificación de Primeros Auxilios venció hace 15 días | Entonces el sistema bloquea la asignación y muestra 'Certificación Primeros Auxilios vencida — No apto para servicio de campo' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-RRH-CAP-001** | Bloqueo efectivo de asignación de campo para certificaciones críticas vencidas. |

| **CA-RRH-CAP-002** | Alertas a 30 días visibles en el dashboard de recursos humanos. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-RRH-CAP-001** | Depende de que los instructores externos tengan acceso al sistema para firmar digitalmente. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-RRH-CAP-001** | Integración con plataformas de e-learning para capacitación en línea. |

---

# Especificaciones: Módulo Operativo Ciberseguridad

---

# Especificaciones: Módulo Operativo Ciberseguridad

## Especificación: Rastrear Inicio de Sesión

### 1. Objetivo

Mantener una bitácora forense de quién, cuándo y desde dónde accede a la plataforma.

### 2. Contexto

Si hay una filtración de información a la prensa, el departamento necesita auditar qué cuentas accedieron al expediente a esa hora.

### 3. Usuarios o actores

- Sistema (Automático)

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-CIB-SES-001** | El sistema debe registrar la IP, el User-Agent (navegador/dispositivo) y el Timestamp al intentar hacer login. |

| **RF-CIB-SES-002** | Debe registrar si el intento fue Exitoso o Fallido. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-CIB-SES-001** | La tabla de login_logs debe estar particionada por mes para no degradar el rendimiento. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-CIB-SES-001** | Esta tabla de rastreo no puede vaciarse mediante la interfaz de usuario. |

| **RN-CIB-SES-002** | Las IPs internas de la red policial deben marcarse automáticamente como 'Zona Segura'. |

### 7. Entradas

- Credenciales del usuario

- Metadatos HTTP.

### 8. Salidas

- Registro en base de datos.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el usuario inicia sesión correctamente desde Chrome en Windows | Cuando se genera el token de acceso | Entonces el sistema guarda la IP, 'Chrome/Win', y Estado 'Éxito' |

| **Caso de Error** | Dado que un atacante intenta login desde una IP extranjera y falla la clave | Cuando presiona entrar | Entonces el sistema guarda la IP rusa, y Estado 'Fallo Clave' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-CIB-SES-001** | Captura correcta de IP cliente detrás de balanceadores (X-Forwarded-For). |

| **CA-CIB-SES-002** | Diferenciación clara entre fallos de usuario y fallos de contraseña. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-CIB-SES-001** | Depende de la configuración del Firewall del servidor. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-CIB-SES-001** | Geolocalización a nivel de calle por IP. |

---

## Especificación: Modificar Permisos de Acceso RBAC

### 1. Objetivo

Controlar el acceso a los diferentes módulos de la plataforma utilizando matrices de roles.

### 2. Contexto

Un Operador 911 no debería tener acceso a modificar los perfiles de los detectives ni ver reportes administrativos de sueldos.

### 3. Usuarios o actores

- Administrador de Sistema

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-CIB-RBA-001** | El sistema debe proporcionar un dashboard de matriz: Filas (Roles), Columnas (Módulos/Permisos). |

| **RF-CIB-RBA-002** | Permitir activar/desactivar permisos de Lectura, Escritura, Borrado y Ejecución (CRUD). |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-CIB-RBA-001** | Los cambios en RBAC deben aplicarse en caché instantáneamente (máx 100ms) sin obligar a reiniciar sesión a los afectados. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-CIB-RBA-001** | El rol de 'Super Administrador' no puede perder sus propios permisos de editar RBAC. |

| **RN-CIB-RBA-002** | Un usuario hereda todos los permisos del rol asignado, sin excepciones granulares por usuario. |

### 7. Entradas

- Toggle On/Off en la matriz.

### 8. Salidas

- Matriz de acceso actualizada en caché de base de datos.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el Administrador quita permiso de 'Edición' en Incidentes al rol 'Operador 911' | Cuando guarda los cambios | Entonces el botón 'Editar' desaparece de inmediato para todos los Operadores conectados |

| **Caso de Error** | Dado que el Administrador intenta desactivar su propio permiso maestro | Cuando apaga el toggle | Entonces el sistema lo revierte e indica 'Violación de Seguridad: Rol Maestro Intocable' |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-CIB-RBA-001** | Efectividad inmediata del bloqueo de accesos. |

| **CA-CIB-RBA-002** | Restricciones a nivel backend (API), no solo ocultando botones visuales. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-CIB-RBA-001** | Arquitectura basada estrictamente en Roles, no en permisos aislados. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-CIB-RBA-001** | Integración LDAP local. |

---

## Especificación: Ejecutar Respaldo de Base de Datos

### 1. Objetivo

Prevenir la pérdida de información crítica operativa y garantizar la recuperación ante desastres (Disaster Recovery).

### 2. Contexto

Ataques de Ransomware a ayuntamientos han borrado décadas de información policial. Backups cifrados fuera de línea son mandatorios.

### 3. Usuarios o actores

- Sistema (Automático)

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-CIB-BAK-001** | El sistema debe realizar un respaldo completo de la base de datos ClickHouse. |

| **RF-CIB-BAK-002** | Enviar el archivo encriptado a un Supabase Storage. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-CIB-BAK-001** | El respaldo completo debe ocurrir todos los días a las 03:00 AM UTC para minimizar impacto operativo. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-CIB-BAK-001** | El archivo de backup debe ser comprimido e inyectarle un hash SHA-256 para validación futura. |

| **RN-CIB-BAK-002** | Mantener retención de los últimos 30 días, rotando y borrando el día 31. |

### 7. Entradas

- Cron Job programado.

### 8. Salidas

- Archivo SQL.GZ o Dump binario en nube.

- Alerta de éxito/fallo.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que son las 03:00 AM | Cuando se gatilla el proceso | Entonces el sistema comprime, encripta y envía a Supabase Storage, reportando 'Respaldo Exitoso' |

| **Caso de Error** | Dado que la conexión a Supabase Storage falla | Cuando intenta subir el archivo | Entonces reintenta 3 veces y si falla dispara alerta crítica SMS al Administrador |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-CIB-BAK-001** | Verificación del archivo mediante Hash SHA-256. |

| **CA-CIB-BAK-002** | Rotación cíclica correcta (Día 31 eliminado). |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-CIB-BAK-001** | Depende del ancho de banda hacia Supabase Storage. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-CIB-BAK-001** | Restauración automática de bases de datos con un clic. |

---

## Especificación: Etiquetar Acceso a Evidencias (Auditoría Ciega)

### 1. Objetivo

Auditar si se accede a información sensible sin modificarla, previniendo espionaje interno.

### 2. Contexto

Si un oficial busca en el sistema las fotos del caso de un amigo solo por curiosidad o para avisarle, esto contamina la investigación.

### 3. Usuarios o actores

- Sistema (Automático)

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-CIB-AUC-001** | El sistema debe crear un log cada vez que un usuario abra la pantalla de detalle de un Expediente o descargue una fotografía forense. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-CIB-AUC-001** | Inserciones asíncronas en base de datos para no ralentizar la visualización de la foto. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-CIB-AUC-001** | Los logs de 'Solo Lectura' (GET requests) sobre evidencias se guardan mínimo 5 años. |

| **RN-CIB-AUC-002** | Detectives asignados formalmente al caso no generan banderas sospechosas al consultar, pero su consulta igual se registra. |

### 7. Entradas

- Solicitud HTTP GET a archivos protegidos.

### 8. Salidas

- Registro en tabla `Fact_Access_Log`.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el Patrullero A abre las fotos de un caso que no le corresponde | Cuando el navegador descarga la imagen | Entonces se guarda un registro silencioso 'Acceso Lectura - Evidencia ID 993' a nombre del Patrullero A |

| **Caso de Error** | Dado que la inserción de log asíncrona falla por cola llena | Cuando intenta guardar el log | Entonces debe escribirse temporalmente en un archivo log del servidor para posterior conciliación |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-CIB-AUC-001** | Trazabilidad del 100% de consultas GET en rutas de evidencia. |

| **CA-CIB-AUC-002** | No penaliza el rendimiento de la aplicación móvil. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-CIB-AUC-001** | Altísimo volumen de escritura en base de datos. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-CIB-AUC-001** | Análisis del comportamiento del usuario (User Behavior Analytics) mediante IA. |

---

## Especificación: Bloquear Cuenta por Intentos Fallidos

### 1. Objetivo

Mitigar ataques de fuerza bruta o relleno de credenciales (credential stuffing).

### 2. Contexto

Las contraseñas débiles de algunos oficiales pueden ser adivinadas si no se limita el número de intentos que puede hacer un atacante.

### 3. Usuarios o actores

- Sistema (Automático)

### 4. Requisitos funcionales

| Código | Descripción |

| :--- | :--- |

| **RF-CIB-BLO-001** | El sistema debe llevar un contador temporal de contraseñas incorrectas por usuario y por IP. |

| **RF-CIB-BLO-002** | Desactivar cuenta y mostrar temporizador en pantalla. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-CIB-BLO-001** | El bloqueo debe ejecutarse de forma atómica en BD o Redis. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-CIB-BLO-001** | Al alcanzar 5 intentos fallidos consecutivos, la cuenta se bloquea por 15 minutos. |

| **RN-CIB-BLO-002** | Un inicio de sesión exitoso resetea el contador de fallos a cero. |

### 7. Entradas

- Intentos de Login fallidos.

### 8. Salidas

- Estado del usuario cambiado a 'Lockout'.

- Banner de rechazo de sesión.

### 9. Escenarios principales

| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |

| :--- | :--- | :--- | :--- |

| **Caso Exitoso** | Dado que el atacante falla la contraseña 5 veces seguidas | Cuando ingresa la correcta en el intento 6 | Entonces el sistema rechaza el login, dice 'Cuenta bloqueada' y no procesa la clave real |

| **Caso de Error** | Dado que el usuario intenta burlar el bloqueo cambiando su IP pero usando el mismo usuario | Cuando ataca de nuevo | Entonces el sistema mantiene el bloqueo porque es a nivel de usuario, no solo IP |

### 10. Criterios de aceptación

| Código | Criterio de Aceptación |

| :--- | :--- |

| **CA-CIB-BLO-001** | Bloqueo efectivo e impenetrable durante los 15 minutos exactos. |

| **CA-CIB-BLO-002** | Reseteo correcto del contador si ingresa bien a la segunda oportunidad. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-CIB-BLO-001** | Depende del caché Redis para alto rendimiento. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-CIB-BLO-001** | Notificación SMS de código de desbloqueo. |

---

# Especificaciones: Módulo Operativo Tránsito y Comunidad

---

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

| **RF-TRA-INF-001** | El sistema debe tener un formulario con campos para Licencia, Placa y Artículo Infringido. |

| **RF-TRA-INF-002** | El sistema debe generar un archivo PDF con la multa estructurada. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-TRA-INF-001** | Interfaz offline capaz de guardar la multa y enviarla cuando regrese la señal LTE. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-TRA-INF-001** | La multa requiere obligatoriamente una coordenada GPS inmutable para probar la jurisdicción. |

| **RN-TRA-INF-002** | El monto de la multa se calcula automáticamente según el Artículo Infringido, el oficial no puede digitar dinero libremente. |

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

| **CA-TRA-INF-001** | Cálculo automático e infalible de montos tarifados. |

| **CA-TRA-INF-002** | Validación GPS ineludible. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-TRA-INF-001** | Catálogo de artículos de tránsito estatal debe actualizarse anualmente. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-TRA-INF-001** | Pasarela de pagos en línea para que el civil pague inmediatamente. |

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

| **RF-TRA-BAC-001** | El sistema debe pedir el valor de Alcohol en Sangre (BAC) en formato decimal (ej. 0.08). |

| **RF-TRA-BAC-002** | El sistema debe pedir ingresar el Número de Serie del alcoholímetro usado. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-TRA-BAC-001** | Validación instantánea del campo decimal (no permite comas, solo punto decimal). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-TRA-BAC-001** | Si el valor BAC ingresado es >= 0.08, el sistema abre obligatoriamente la creación de un Incidente de Arresto DUI. |

| **RN-TRA-BAC-002** | Valores negativos no son permitidos. |

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

| **CA-TRA-BAC-001** | Activación correcta de flujos penales si BAC excede el límite. |

| **CA-TRA-BAC-002** | Validación de datos biológicamente posibles. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-TRA-BAC-001** | Depende de que el alcoholímetro físico esté calibrado. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-TRA-BAC-001** | Conexión Bluetooth directa entre el alcoholímetro y el teléfono para leer el dato. |

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

| **RF-TRA-GRU-001** | El sistema debe permitir solicitar remolque indicando si es de Policía o de una compañía Privada. |

| **RF-TRA-GRU-002** | Debe permitir agregar un inventario visual rápido (fotos de los 4 lados del auto). |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-TRA-GRU-001** | Integración rápida (formularios prellenados con los datos del incidente activo). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-TRA-GRU-001** | El vehículo remolcado no cambia de estado a 'En Corralón' hasta que el operador del garaje confirme recepción. |

| **RN-TRA-GRU-002** | Obligatorio ingresar si las llaves fueron retenidas o entregadas al conductor. |

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

| **CA-TRA-GRU-001** | Carga fotográfica estricta para mitigar demandas. |

| **CA-TRA-GRU-002** | Trazabilidad clara de responsabilidad de custodia. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-TRA-GRU-001** | Módulo no integrado con los sistemas de las empresas privadas de grúas. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-TRA-GRU-001** | Rastreo GPS de la grúa privada. |

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

| **RF-TRA-REU-001** | El sistema debe permitir ingresar el Nombre del Evento y Número Estimado de Asistentes. |

| **RF-TRA-REU-002** | Registrar una breve minuta o tema tratado. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-TRA-REU-001** | Campos de texto libre optimizados para dictado por voz (Voice-to-Text del teclado del SO). |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-TRA-REU-001** | Un evento comunitario no genera incidentes criminales, se guarda en una base separada de prevención. |

| **RN-TRA-REU-002** | Debe vincularse a la geocerca del barrio para mapa de calor preventivo. |

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

| **CA-TRA-REU-001** | Impacta positivamente las estadísticas operativas de prevención. |

| **CA-TRA-REU-002** | Georreferenciación idéntica a la criminal pero clasificada distinto. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-TRA-REU-001** | Ninguna. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-TRA-REU-001** | Gestión de redes sociales del departamento de policía. |

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

| **RF-TRA-PAN-001** | El sistema debe contar con un endpoint API Webhook para recibir peticiones POST desde proveedores de alarmas. |

| **RF-TRA-PAN-002** | El sistema creará un Incidente de nivel Crítico automáticamente en la pantalla del Despachador. |

### 5. Requisitos no funcionales

| Código | Descripción |

| :--- | :--- |

| **RNF-TRA-PAN-001** | Tiempo de procesamiento de la petición POST < 100ms. |

| **RNF-TRA-PAN-002** | Alta disponibilidad de la API REST. |

### 6. Reglas de negocio

| Código | Regla de Negocio |

| :--- | :--- |

| **RN-TRA-PAN-001** | Las alertas originadas por API se marcan con Triage Nivel 5 por defecto. |

| **RN-TRA-PAN-002** | Si la misma alarma dispara dos peticiones en menos de 1 minuto, el sistema asume que es el mismo incidente. |

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

| **CA-TRA-PAN-001** | Creación inmediata de incidente sin intervención humana inicial. |

| **CA-TRA-PAN-002** | Mecanismo Antispam (debouncing) para múltiples presiones de botón del pánico. |

### 11. Restricciones

| Código | Restricción |

| :--- | :--- |

| **RES-TRA-PAN-001** | Depende de que el proveedor físico (Ej. ADT) configure el webhook correctamente. |

### 12. Fuera de alcance

| Código | Fuera de alcance |

| :--- | :--- |

| **FA-TRA-PAN-001** | Activación remota de cámaras de seguridad del banco privado. |

---

