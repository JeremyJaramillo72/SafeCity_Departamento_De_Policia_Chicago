# 🎯 Guión y Análisis para Evaluación 01: SafeCity Intelligence Ops
Este documento está diseñado para ayudarte a estructurar tu video de 15 minutos. Hemos seleccionado las opciones más impresionantes desde el punto de vista de la **Ingeniería de Software** y **Bases de Datos** para garantizar que demuestres un dominio técnico completo y asegures ese 10/10.

---

## 1. WORKPANELS (Dashboards de Control)
*En esta sección demostrarás cómo el sistema centraliza la información táctica en tiempo real.*

### 🥇 1. Workpanel de Operaciones e Incidentes Criminales (DB1)
* **Por qué elegirlo:** Es el núcleo del sistema. Demuestra cómo se procesan grandes volúmenes de datos transaccionales para convertirlos en inteligencia viva.
* **Qué explicar en el video:** Menciona que este panel consolida los KPIs más críticos de la ciudad: conteo total de incidentes, tasa de resolución de arrestos y casos de alto riesgo pendientes. Explica que la interfaz gráfica permite al comandante tomar decisiones instantáneas sobre el despliegue de la fuerza policial.

> **🎤 Guion Sugerido:** "Para comenzar, este es nuestro Workpanel de Operaciones, el DB1. Aquí centralizamos los KPIs críticos de la ciudad: total de incidentes, arrestos y casos de alto riesgo. A nivel técnico, esto demuestra cómo procesamos altos volúmenes de datos transaccionales en tiempo real para que los comandantes tomen decisiones instantáneas de despliegue, sin depender de reportes en papel."

### 🥈 2. Workpanel de Despacho y Emergencias (DB2)
* **Por qué elegirlo:** Destaca la capacidad del sistema para operar en **tiempo real** bajo presión.
* **Qué explicar en el video:** Enfócate en el monitoreo en vivo de incidentes. Explica que este tablero permite visualizar la carga de cada unidad y gestionar eventos concurrentes de manera eficiente desde el centro de comando.

> **🎤 Guion Sugerido:** "El DB2 es nuestro Workpanel de Despacho de Emergencias. Su función principal es la gestión en vivo de incidentes. Aquí demostramos la capacidad de nuestro backend para manejar eventos concurrentes bajo extrema presión. Un operador de despacho puede ver exactamente qué patrulla está libre y asignarle un evento en milisegundos, optimizando los tiempos de respuesta de toda la ciudad."

### 🥉 3. Workpanel de Administración y Ciberseguridad (DB3)
* **Por qué elegirlo:** Le encantará al profesor porque muestra que pensaste en la **arquitectura e infraestructura**, no solo en el usuario final.
* **Qué explicar en el video:** Menciona que este panel monitorea la salud del sistema, el control de accesos, respaldos y logs, garantizando la alta disponibilidad y la ciberseguridad.

> **🎤 Guion Sugerido:** "Finalmente, el DB3 es el Workpanel de Administración. Esto demuestra que pensamos en la arquitectura global y no solo en la interfaz. Desde aquí el administrador de TI controla roles de acceso, audita actividades sospechosas y monitorea el estado del sistema, garantizando los principios de seguridad de la información."

---

## 2. INFORMES SIMPLES (Base de Datos Relacional / Django ORM)
*En esta sección demostrarás tu dominio sobre consultas transaccionales directas (OLTP), ideales para la operatividad diaria.*

### 🟢 1. Listado de Incidentes en Curso por Patrulla (OT12)
* **Objetivo Táctico Asociado (OT12):** *Consultar el listado de incidentes activos asignados a una patrulla específica.*
* **Toma de Decisiones:** Permite al comandante de campo redistribuir unidades dinámicamente si nota que una patrulla está saturada con múltiples incidentes críticos, evitando tiempos muertos.
* **Cómo ayuda al Objetivo Táctico:** Cumple directamente con el OT12 al otorgar visibilidad 100% real sobre la carga operativa de las unidades en el terreno, garantizando que ninguna emergencia se pierda en el sistema.
* **Por qué elegirlo / Qué explicar:** Es un informe "Simple" porque se obtiene directamente de la Base de Datos Relacional mediante el ORM, sin cálculos matemáticos pesados.

> **🎤 Guion Sugerido:** "Para nuestro primer Informe Simple, nos vamos a la sección de Incident Records. Este listado permite a un comandante ver qué incidentes están asignados a cada patrulla. Técnicamente, es un informe simple porque ejecutamos una consulta transaccional tradicional usando el ORM, un SELECT básico con filtros de estado. No hay cálculos matemáticos pesados, solo lectura directa y rápida de nuestra Base de Datos Relacional para gestionar recursos en la calle."

### 🟢 2. Directorio de Órdenes Judiciales y Cadena de Custodia (OT10)
* **Objetivo Táctico Asociado (OT10):** *Revisar listados y auditorías de Cadena de Custodia y órdenes judiciales activas.*
* **Toma de Decisiones:** Los comandantes priorizan la ejecución de redadas antes de que las órdenes expiren (warrants), mientras que los fiscales verifican que las armas incautadas no tengan saltos en su cadena de custodia para evitar que el caso se caiga en corte.
* **Cómo ayuda al Objetivo Táctico:** Centraliza la operatividad policial de prófugos e incluye un mapa táctico que geolocaliza el objetivo de arresto usando Leaflet, facilitando el despliegue del equipo SWAT.
* **Por qué elegirlo / Qué explicar:** Demuestra dominio en **Consultas Transaccionales (OLTP)** filtrando por estado, además de mostrar integración avanzada de APIs (OpenStreetMap) directamente conectada a los campos de la base de datos.

> **🎤 Guion Sugerido:** "Como segundo Informe Simple, tenemos el Directorio de Órdenes Judiciales (Warrants). Aquí los comandantes revisan qué órdenes están activas para priorizar redadas. A nivel de base de datos, demostramos consultas transaccionales (OLTP) filtrando por el estado de la orden. Además, enriquecemos los datos relacionales integrando una API de mapas con Leaflet para geolocalizar el objetivo exacto del arresto, lo cual facilita enormemente la logística del equipo SWAT."

### 🟢 3. Sistema de Ingreso y Control de Celdas (Booking System)
* **Objetivo Táctico Asociado (OT4):** *Administración de ingresos a celdas, traslados y pertenencias.*
* **Toma de Decisiones:** El oficial de guardia necesita saber instantáneamente en qué bloque hay celdas de máxima seguridad disponibles para aislar a sospechosos peligrosos del resto de la población carcelaria.
* **Cómo ayuda al Objetivo Táctico:** Proporciona un mapa visual de ocupación de celdas en tiempo real, conectando el perfil biométrico del criminal con la celda asignada y sus pertenencias decomisadas.
* **Por qué elegirlo / Qué explicar:** Es el ejemplo perfecto de una operación **Transaccional (OLTP) compleja**. Al ingresar un detenido, el sistema ejecuta múltiples `INSERT` y `UPDATE` casi en paralelo (Sospechoso, Celda, Pertenencias) asegurando la *integridad referencial* mediante llaves foráneas.

> **🎤 Guion Sugerido:** "Para cerrar con los Informes Simples, les muestro nuestro Módulo de Ingreso a Celdas (Booking System). Un oficial necesita saber al instante si hay celdas solitarias disponibles para sospechosos de alto riesgo. A nivel de base de datos, este es el ejemplo perfecto de una operación Transaccional (OLTP) robusta. Al ingresar un detenido, el sistema ejecuta múltiples sentencias INSERT y UPDATE casi en paralelo: vincula la identificación biométrica, ocupa la celda, y registra sus pertenencias, asegurando la integridad referencial mediante llaves foráneas sin provocar bloqueos."

---

## 3. INFORMES COMPLEJOS / COMPUESTOS (ClickHouse + Apache Airflow)
*¡Aquí es donde aseguras el 10! Demostrarás conocimientos avanzados de Arquitectura Analítica (OLAP), Pipelines ETL y Big Data.*

### 🔶 1. Mapa de Calor de Criminalidad por Zona (OT1)
* **Objetivo Táctico Asociado (OT1):** *Analizar reportes mensuales de inteligencia y mapas de calor geoespaciales.*
* **Toma de Decisiones:** Sirve a los altos mandos y alcaldes para rediseñar estratégicamente los cuadrantes de patrullaje para el mes siguiente, moviendo presupuesto y recursos policiales de las zonas frías hacia las nuevas zonas "calientes".
* **Cómo ayuda al Objetivo Táctico:** Resuelve el OT1 al consolidar cientos de miles de coordenadas GPS históricas en una vista geográfica de densidades unificada, algo imposible de procesar "en vivo".
* **Por qué elegirlo / Qué explicar:** Aclara que esto **no** se puede hacer en la base transaccional (BDR) porque tumbaría el sistema. Explica que **Apache Airflow** ejecuta un proceso ETL nocturno que extrae años de historia, calcula la densidad y lo inserta en **ClickHouse** (Base de Datos Columnar) para lectura ultrarrápida.

> **🎤 Guion Sugerido:** "Entrando a los Informes Complejos analíticos, tenemos el Mapa de Calor de Criminalidad Geospacial (OT1). Un Alcalde usa esto para decidir dónde mover patrullas el próximo trimestre. Pero el reto de ingeniería es enorme: dibujar esto requiere procesar cientos de miles de coordenadas. Si hiciéramos esto en la base relacional principal, colapsaríamos el sistema operativo. ¿Cómo lo resolvimos? Usamos Apache Airflow para un proceso ETL nocturno que extrae la historia y la inserta en ClickHouse, nuestra base columnar OLAP, permitiendo consultas masivas en milisegundos sin afectar a las patrullas en las calles."

### 🔶 2. Monitor de Trazabilidad y Auditoría Forense
* **Objetivo Táctico Asociado:** *Auditar accesos al sistema y rastrear cualquier alteración de registros (Trazabilidad).*
* **Toma de Decisiones:** Permite a la división de Asuntos Internos identificar inmediatamente si un oficial o administrador intentó borrar o alterar evidencia digital (ej. modificar el estado de un sospechoso o de una orden judicial) de manera indebida.
* **Cómo ayuda al Objetivo Táctico:** Proporciona un visor inmutable de logs donde cada evento del sistema (INSERT, UPDATE) queda registrado permanentemente con su Timestamp, IP de origen, y Oficial responsable, asegurando la transparencia total del departamento.
* **Por qué elegirlo / Qué explicar:** Demuestra un nivel avanzado de bases de datos. Debes explicar que este reporte complejo **no** depende de la aplicación web, sino que se alimenta automáticamente de **Triggers** (`AFTER UPDATE`, `AFTER INSERT`) configurados directamente en el motor de la base de datos transaccional, enviando los millones de logs históricos a **ClickHouse** para su análisis ultrarrápido.

> **🎤 Guion Sugerido:** "Para nuestro segundo Informe Complejo, me salgo de los dashboards operativos y paso al Monitor de Auditoría Forense. Esto le permite a Asuntos Internos saber si alguien alteró evidencia digital. Técnicamente, este reporte NO se genera desde el backend web. Se alimenta automáticamente de Triggers (Disparadores) configurados directamente en el motor de la base de datos (AFTER UPDATE, AFTER INSERT). Si un detective modifica un caso, el Trigger de la BD captura el valor viejo, el nuevo, la IP y lo manda a ClickHouse de manera inmutable, garantizando una seguridad que no se puede saltar ni borrando código del frontend."

### 🔶 3. Tasa de Reincidencia por Sospechoso (OT2)
* **Objetivo Táctico Asociado (OT2):** *Visualizar tableros de estadísticas de reincidencia y conexiones criminales.*
* **Toma de Decisiones:** Ayuda a los jueces a negar libertades condicionales o fijar fianzas altas, y a los perfiladores criminales a dirigir vigilancia encubierta hacia los individuos que representan el 80% de la actividad delictiva repetitiva en la ciudad.
* **Cómo ayuda al Objetivo Táctico:** Materializa el OT2 conectando el historial de arrestos de los últimos años con perfiles biométricos usando Big Data para revelar patrones ocultos que no saltan a la vista analizando un caso individualmente.
* **Por qué elegirlo / Qué explicar:** Menciona que los modelos de Machine Learning consumen muchísima CPU, por lo que usas una arquitectura de microservicios para delegar el cálculo a una API de Python externa.

> **🎤 Guion Sugerido:** "Y para finalizar nuestra demostración analítica, tenemos el Predictor de Tasa de Reincidencia por Sospechoso (OT2), ubicado en el módulo de Inteligencia Criminal. Jueces y fiscales usan este nivel de riesgo para decidir si otorgan libertad bajo fianza. A nivel de arquitectura, tiene un truco crítico: los algoritmos de Machine Learning consumen mucha CPU. Si hiciéramos ese cálculo en el servidor web principal, bloquearíamos el sistema. Por ello, usamos una arquitectura de Microservicios: el sistema empaqueta el perfil del sospechoso en un JSON, lo envía a una API externa en Python que hace el cálculo pesado y nos devuelve el riesgo, manteniendo nuestro servidor operativo ligero y rápido."

---

> [!TIP]
> **Consejo para el video (15 mins):** 
> * Usa **3 minutos** para la introducción del sistema (SafeCity).
> * Usa **3 minutos** mostrando los Workpanels (interfaces visuales).
> * Usa **4 minutos** para los Informes Simples (enfócate en la toma de decisiones rápidas de campo y el uso de la base relacional).
> * Usa **5 minutos** para los Informes Complejos (lucete hablando del "Por qué" usar ETL, Airflow y ClickHouse para no tumbar la operativa táctica).
