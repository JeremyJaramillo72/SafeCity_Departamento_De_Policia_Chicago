# ANÁLISIS DE OBJETIVOS TÁCTICOS Y ESTRATEGIA DE DATOS (ETL/ELT)

**Proyecto:** SafeCity Intelligence Ops
**Materia:** Base de Datos II
**Fecha:** Julio 2026

---

## 1. Contexto de la Empresa

- **Nombre de la Empresa:** SafeCity Solutions.
- **Actividad Comercial:** Desarrollo y comercialización B2G (Business-to-Government) de plataformas SaaS de misión crítica para el sector de la seguridad pública. Especializados en digitalizar y automatizar operaciones policiales para reducir costos logísticos, optimizar la gestión de flotas y agilizar el procesamiento de inteligencia criminal mediante análisis de datos.
- **Misión:** Maximizar la eficiencia operativa de las instituciones de seguridad pública a nivel global mediante tecnología de alto rendimiento que garantice rapidez en la respuesta a emergencias y una optimización absoluta de los recursos estatales asignados.
- **Visión:** Posicionarnos como la empresa GovTech más competitiva y rentable a nivel global en el desarrollo de software para Smart Cities, siendo reconocidos por entregar un alto retorno de inversión (ROI) a los gobiernos a través de plataformas escalables que aseguran operaciones rápidas, transparentes y sostenibles.
- **Sistema Propuesto:** SafeCity Intelligence Ops — Plataforma de Gestión de Operaciones e Inteligencia Policial.

---

## 2. Introducción al Análisis Táctico

Una vez terminada la fase operativa del sistema, donde se registran las transacciones del día a día (incidentes, patrullas, llamadas de emergencia, vehículos, personal, etc.), pasamos a la **parte táctica**. En esta fase, cada jefe departamental se convierte en un proveedor de **Objetivos Tácticos (OT)** que apuntan a la dirección y control de su departamento.

Para satisfacer estos objetivos, es necesario identificar qué informes pueden resolverse directamente desde la **Base de Datos Relacional (BDR)** y cuáles requieren un procesamiento más profundo mediante un pipeline **ETL (Extract, Transform, Load)** orquestado por **Apache Airflow**, depositando los resultados en una **Base de Datos Columnar (ClickHouse)**.

---

## 3. Definiciones

| Concepto | Definición | Ejemplo |
| :--- | :--- | :--- |
| **Informe Simple (BDR)** | Aquel que puede ser alcanzado de manera directa desde la Base de Datos Relacional. Son listados transaccionales u operativos que el nivel táctico necesita consultar sin transformaciones previas. | "Listar vehículos en mantenimiento", "Mostrar certificaciones vencidas este mes". |
| **Informe Compuesto (BDColumnar)** | Aquel que necesita agregaciones, cálculos matemáticos, cruces masivos de datos o series de tiempo. Requiere un tratamiento o transformación previa antes de poder ser consultado. | "Porcentaje de disponibilidad de flota por mes", "Mapa de calor de criminalidad por zona". |

---

## 4. Clasificación de Objetivos Tácticos por Departamento

### 4.1 Inteligencia Geográfica y Mapas Tácticos

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT1** | Analizar reportes mensuales de inteligencia y mapas de calor geoespaciales. | 🔶 Compuesto | Para generar un mapa de calor, el sistema necesita tomar miles de incidentes históricos, agruparlos por ubicación geográfica y tipo de delito, y calcular la densidad de crímenes en cada zona de la ciudad mes a mes. Esto no se puede hacer con una consulta simple a la BDR porque el volumen de datos es demasiado alto. | Analista de Inteligencia Criminal |

---

### 4.2 Departamento de Inteligencia y Análisis Criminal

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT2** | Visualizar tableros de estadísticas de reincidencia y conexiones criminales. | 🔶 Compuesto | Para saber qué sospechosos son reincidentes, el sistema necesita recorrer todo el historial de arrestos y contar cuántas veces un mismo individuo aparece vinculado a distintos casos a lo largo del tiempo. Es un cruce masivo de datos entre múltiples tablas que solo es eficiente en una base columnar. | Analista de Inteligencia Criminal |
| **OT13** | Consultar el directorio actualizado de sospechosos y sus vehículos vinculados. | 🟢 Simple | El jefe de inteligencia simplemente necesita ver un listado de sospechosos registrados con los vehículos que tienen asociados. Es una consulta directa a la base de datos sin necesidad de hacer cálculos ni agrupaciones. | Detective |

---

### 4.3 Unidad de Operaciones de Campo (Incidentes)

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT11** | Generar reportes comparativos de criminalidad por tipo de delito y período (mensual/trimestral). | 🔶 Compuesto | Para detectar si un tipo de delito está aumentando o disminuyendo, se deben contar todos los incidentes agrupándolos por categoría de crimen, zona geográfica y período de tiempo, comparando meses o trimestres entre sí. | Sheriff / Analista de Inteligencia Criminal |
| **OT12** | Consultar el listado de incidentes activos asignados a una patrulla específica. | 🟢 Simple | El jefe operativo necesita ver rápidamente qué incidentes tiene asignada una patrulla en particular. Es un filtro directo sobre la tabla de incidentes sin necesidad de cálculos ni transformaciones. | Operador de Emergencias |

---

### 4.4 Departamento de Logística Operativa y Flota

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT3** | Generar reportes del porcentaje histórico de disponibilidad de la flota (operativos vs mantenimiento vs baja) agrupados por mes. | 🔶 Compuesto | Para conocer la evolución de la salud de la flota a lo largo del tiempo, se necesita rastrear los cambios de estado de cada vehículo y calcular qué porcentaje estaba operativo, en mantenimiento o dado de baja en cada mes. Es una serie de tiempo que requiere procesamiento ETL. | Jefe de Logística |
| **OT8** | Planificar el mantenimiento preventivo rotativo de la flota vehicular. | 🟢 Simple | El jefe de logística simplemente necesita ver un listado de vehículos cuya fecha de revisión ya venció o que llevan demasiado tiempo sin mantenimiento. Es una consulta directa a la tabla de vehículos con un filtro por fecha. | Jefe de Logística |
| **OT14** | Analizar el promedio de kilometraje recorrido por las unidades policiales según el cuadrante asignado, para equilibrar el desgaste de la flota. | 🔶 Compuesto | Para conocer el nivel de desgaste, el sistema debe tomar los registros históricos de patrullaje, calcular las distancias recorridas y agruparlas por vehículo y zona. Esto requiere procesamiento ETL al cruzar datos de rastreo con el inventario de la flota. | Jefe de Logística |
| **OT15** | Consultar la planificación actual de turnos y rutas asignadas por cuadrante. | 🟢 Simple | El jefe de patrullaje simplemente necesita ver qué oficial cubre qué zona el día de hoy. Es una consulta directa al calendario de turnos activos, sin cálculos ni agregaciones históricas. | Jefe de Logística / Oficial de Patrulla |

---

### 4.5 Despacho y Gestión de Emergencias (911)

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT6** | Monitorear los indicadores de tiempos de respuesta de emergencias (SLA por sector). | 🔶 Compuesto | Para evaluar si las patrullas están llegando a tiempo, se necesita calcular el promedio de minutos entre que se registra la llamada de emergencia y el momento en que la patrulla llega al sitio. Esto se agrupa por sector y por mes, procesando cientos de llamadas para obtener un indicador confiable. | Sheriff / Operador de Emergencias |

---

### 4.6 División de Investigaciones Criminales

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT7** | Generar reportes de inteligencia procesando listados de testimonios e incautaciones. | 🟢 Simple | El detective a cargo de un caso necesita ver todas las evidencias físicas y testimonios asociados a una investigación específica. Es una extracción directa de la base de datos: "Dame todo lo relacionado al Caso #450". No requiere cálculos. | Detective |
| **OT10** | Revisar listados y auditorías de Cadena de Custodia Digital y órdenes judiciales activas. | 🟢 Simple | El responsable legal necesita consultar rápidamente el estado actual de una orden judicial o verificar quién tiene una evidencia en custodia en este momento. Es una consulta puntual y directa a la base de datos, sin necesidad de procesamiento histórico. | Detective / Administrador de Sistema |

---

### 4.7 Departamento de Gestión de Talento y Asuntos Internos (RRHH)

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT4** | Visualizar reportes de ausentismo y cobertura de cuadrantes de patrullaje. | 🔶 Compuesto | Para detectar qué zonas de la ciudad quedaron sin cobertura policial, se necesita cruzar los registros de asistencia diarios de los oficiales contra los cuadrantes geográficos que debían cubrir. Al hacerlo sobre semanas o meses completos, el volumen de datos crece y requiere procesamiento en la base columnar. | Sheriff / Jefe de Logística |
| **OT9** | Gestionar reportes de permisos, capacitación y disciplina del personal. | 🟢 Simple | El jefe de personal necesita un listado de oficiales cuyas certificaciones están por vencer este mes, o quiénes tienen permisos pendientes de aprobación. Es una consulta directa filtrada por fecha, sin necesidad de cálculos ni transformaciones. | Recursos Humanos |
| **OT16** | Generar reportes de rendimiento por oficial (incidentes atendidos, certificaciones vigentes y quejas ciudadanas recibidas). | 🔶 Compuesto | Para evaluar el rendimiento integral de cada oficial, se necesita cruzar información de tres fuentes distintas (incidentes atendidos, certificaciones y quejas ciudadanas) y consolidarlas en una sola ficha por oficial. Este cruce de múltiples tablas con conteos agregados requiere procesamiento ETL. | Recursos Humanos / Sheriff |

---

### 4.8 Departamento de Tecnología y Ciberseguridad (Sistemas/Auditoría)

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT5** | Auditar los tableros de logs de accesos del sistema y detección de anomalías. | 🔶 Compuesto | Los registros de acceso al sistema generan miles de entradas diarias. Para detectar comportamientos sospechosos (como un usuario que intenta ingresar varias veces fuera de horario) se necesita agrupar todos los logs por usuario, tipo de acción y hora del día. Ese volumen es inviable de analizar en una BDR tradicional. | Administrador de Sistema |

---

### 4.9 Laboratorio de Análisis Predictivo e IA

| Código | Objetivo Táctico | Tipo | Justificación | Consumidor |
| :---: | :--- | :---: | :--- | :--- |
| **OT17** | Consolidar los KPIs operativos del departamento en un tablero ejecutivo para el Sheriff. | 🔶 Compuesto | Este es el informe más pesado del sistema. El Sheriff necesita ver en una sola pantalla la tasa de resolución de casos, el tiempo promedio de respuesta a emergencias, la disponibilidad de la flota y la cobertura de cuadrantes. Para lograrlo, Airflow extrae datos de todos los módulos del sistema, los transforma en indicadores resumidos y los deposita en ClickHouse para que el tablero cargue en milisegundos. | Sheriff |

---

### 4.10 Unidad de Tránsito y Seguridad Vial

> Este departamento se encuentra en fase de desarrollo operativo. Sus objetivos tácticos serán definidos una vez que se complete la implementación de los módulos de infracciones de tránsito (e-Citation), reportes de accidentes y pruebas de alcoholemia (BAC).

---

## 5. Resumen Consolidado

| Tipo de Informe | Cantidad | Origen de Datos |
| :---: | :---: | :--- |
| 🟢 **Informes Simples** | 8 | Base de Datos Relacional (PocketBase / Django ORM) |
| 🔶 **Informes Compuestos** | 9 | Base de Datos Columnar (ClickHouse) vía pipeline ETL con Apache Airflow |
| **Total de Objetivos Tácticos** | **17** | — |

---

## 6. Frecuencia de Ejecución de los Pipelines ETL (Informes Compuestos)

La siguiente tabla define cada cuánto tiempo Apache Airflow ejecuta el DAG (proceso automatizado) de extracción y transformación para cada informe compuesto, asegurando que los datos del tablero táctico estén siempre actualizados.

| Código | Objetivo Táctico | Frecuencia del DAG | Justificación de la Frecuencia |
| :---: | :--- | :---: | :--- |
| **OT1** | Mapas de calor geoespaciales | 📅 Diaria | Los incidentes se registran constantemente. Un mapa de calor actualizado cada 24 horas permite al analista detectar brotes de criminalidad emergentes al día siguiente. |
| **OT2** | Estadísticas de reincidencia | 📅 Semanal | Los perfiles de reincidencia no cambian hora a hora. Una actualización semanal es suficiente para que el analista detecte patrones sin sobrecargar el sistema. |
| **OT3** | Disponibilidad histórica de flota (mensual) | 📅 Mensual | Es un reporte de tendencia a largo plazo. Se consolida al cierre de cada mes para comparar períodos. |
| **OT4** | Ausentismo y cobertura de cuadrantes | 📅 Diaria | La cobertura de zonas es crítica para la seguridad pública. El jefe necesita saber cada mañana si algún cuadrante quedó descubierto el día anterior. |
| **OT5** | Logs de accesos y anomalías | 📅 Diaria | Los intentos de acceso sospechosos deben detectarse lo antes posible. Un procesamiento diario permite identificar amenazas de seguridad en menos de 24 horas. |
| **OT6** | Tiempos de respuesta SLA | 📅 Semanal | Los indicadores de SLA se evalúan por período. Una consolidación semanal da suficiente muestra estadística sin generar ruido por días atípicos. |
| **OT11** | Comparativos de criminalidad por período | 📅 Mensual | Las tendencias de criminalidad se analizan mes a mes o trimestre a trimestre. No tiene sentido ejecutarlo diariamente porque las variaciones significativas se miden en períodos largos. |
| **OT14** | Desgaste y kilometraje por cuadrante | 📅 Semanal | Permite al jefe de logística rotar los vehículos semanalmente basándose en el nivel de uso intensivo de la semana anterior, evitando el desgaste prematuro. |
| **OT16** | Rendimiento por oficial | 📅 Mensual | El rendimiento de un oficial se evalúa en ciclos de evaluación mensuales. Procesarlo con mayor frecuencia no aportaría valor al proceso de recursos humanos. |
| **OT17** | KPIs ejecutivos del Sheriff | 📅 Diaria | El Sheriff necesita un panorama actualizado cada mañana para tomar decisiones estratégicas del día. Es el DAG más pesado pero también el más crítico. |

---

## 7. Arquitectura del Flujo ETL

```
┌─────────────────────┐       ┌──────────────────┐       ┌─────────────────────┐
│   BASE DE DATOS     │       │  APACHE AIRFLOW  │       │    CLICKHOUSE       │
│   RELACIONAL (BDR)  │──────▶│   (Orquestador)  │──────▶│  (BDColumnar/OLAP)  │
│                     │       │                  │       │                     │
│  • PocketBase       │  E    │  • Extrae datos  │  T/L  │  • Almacena datos   │
│  • Django ORM       │  x    │  • Limpia/valida │  r/o  │    pre-procesados   │
│                     │  t    │  • Calcula       │  a/a  │  • Consultas        │
│  Datos operativos   │  r    │    métricas      │  n/d  │    analíticas en    │
│  del día a día      │  a    │  • Agrega por    │  s/   │    milisegundos     │
│                     │  c    │    período       │  f    │                     │
│  ➜ Informes Simples │  t    │                  │       │  ➜ Informes         │
│    (8 OTs)          │       │  DAGs programados│       │    Compuestos       │
│                     │       │  (diarios/semanl)│       │    (9 OTs)          │
└─────────────────────┘       └──────────────────┘       └─────────────────────┘
```

**Extract (Extracción):** Apache Airflow se conecta a la BDR (PocketBase) y extrae los datos operativos crudos registrados por los usuarios del sistema.

**Transform (Transformación):** Los datos se limpian, se validan y se calculan las métricas agregadas (promedios, porcentajes, series de tiempo, cruces geoespaciales).

**Load (Carga):** Los resultados transformados se depositan en tablas optimizadas de ClickHouse, listas para ser consultadas por los tableros tácticos del sistema en milisegundos.

---

## 8. Conclusión

La arquitectura de datos híbrida adoptada por SafeCity Intelligence Ops demuestra que **no todos los informes que necesita un jefe departamental pueden resolverse de la misma manera**. Mientras que los informes simples (8 OTs) se resuelven eficientemente con consultas directas a la Base de Datos Relacional, los informes compuestos (9 OTs) requieren un tratamiento previo que solo es viable mediante un pipeline ETL orquestado por Apache Airflow y una Base de Datos Columnar como ClickHouse.

Esta separación no es arbitraria: responde a una necesidad real de rendimiento. Si intentáramos ejecutar las agregaciones de los 9 informes compuestos directamente sobre la BDR en tiempo real, el sistema se volvería lento e inutilizable para los operadores que están registrando emergencias en ese mismo momento. Al delegar el procesamiento pesado a Airflow (que se ejecuta en horarios programados) y depositar los resultados pre-calculados en ClickHouse (optimizado para lectura analítica), garantizamos que **la operación diaria nunca se vea afectada** por las consultas tácticas de los jefes departamentales.

En resumen, la combinación BDR + Airflow + ClickHouse permite que SafeCity opere simultáneamente en dos niveles: el **nivel operativo** (rápido, transaccional, en tiempo real) y el **nivel táctico** (analítico, agregado, orientado a la toma de decisiones), sin que uno interfiera con el otro.
