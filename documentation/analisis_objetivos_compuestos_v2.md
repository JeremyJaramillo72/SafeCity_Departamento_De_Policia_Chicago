# Análisis Integral de Objetivos Tácticos Compuestos (ETL/Airflow)

**Fecha de Análisis:** Agosto 2026
**Módulo:** Análisis de Sistemas - SafeCity Intelligence Ops

Este documento presenta el resultado de una auditoría profunda sobre el código fuente actual del sistema (`django_app`) para contrastarlo con el diseño teórico establecido en `analisis_etl_tactico.md`. 

Se han descubierto implementaciones implícitas de **Objetivos Compuestos (🔶)** que el equipo ya había desarrollado de forma orgánica, así como vacíos y **Nuevos Objetivos Compuestos** que no habían sido mapeados originalmente pero que son vitales gracias a los nuevos módulos desarrollados.

---

## 1. Objetivos Compuestos Ya Implementados (Parcial o Totalmente)

Durante el desarrollo de los módulos operativos, se han programado *endpoints* y *queries* analíticos que resuelven parcial o totalmente algunos de los Objetivos Tácticos Compuestos sin necesidad de esperar a Apache Airflow. 

| Código | Objetivo Original | ¿Dónde se descubrió? | Estado Actual de Implementación |
| :---: | :--- | :--- | :--- |
| **OT5** | Auditar los tableros de logs de accesos del sistema y detección de anomalías. | `administracion_seguridad/views.py` (`AuditLogListView`) | **Implementado.** Realiza un procesamiento de los logs en `auditoria_sistema`, mapeando severidad e interpretando anomalías (`DELETE`, `LOGIN_FAILED`) dinámicamente mediante la función `make_human_readable`. |
| **OT11** | Reportes comparativos de criminalidad por tipo de delito y período. | `gestion_operativa/views.py` (`CommandDashboardView`) | **Parcial.** Contiene sentencias `GROUP BY year` y `GROUP BY district` con `ORDER BY count DESC` directamente en ClickHouse, ofreciendo el análisis analítico de tendencias anuales y por zona. |
| **OT2** | Estadísticas de reincidencia y conexiones criminales. | `inteligencia_criminal/views.py` (`SuspectCasesView` / `SuspectVehiclesDirectoryView`) | **Parcial.** Aunque no es un tablero masivo, el sistema ya cruza múltiples incidentes (chicago_crimes) con sospechosos, sus vehículos y bandas criminales mediante JOINs analíticos. |

---

## 2. Objetivos Compuestos Pendientes (Por Implementar)

Estos son los objetivos compuestos críticos definidos en la estrategia original que aún **no** tienen código que los respalde en el sistema y requerirán los DAGs de Airflow puros:

- **OT1:** Mapas de calor geoespaciales (Módulo `inteligencia_geografica` se encuentra vacío).
- **OT3:** Porcentaje histórico de disponibilidad de la flota mensual.
- **OT4:** Reportes de ausentismo y cobertura de cuadrantes de patrullaje.
- **OT6:** Monitoreo de indicadores SLA de tiempos de respuesta de emergencias 911.
- **OT14:** Desgaste y promedio de kilometraje recorrido por cuadrante.
- **OT16:** Rendimiento integral por oficial (Cruce de incidentes, quejas y certificaciones).
- **OT17:** Tablero de KPIs ejecutivos del Sheriff.

---

## 3. NUEVOS Objetivos Compuestos Identificados (Oportunidades Inéditas)

Tras auditar las tablas y datos que se están capturando activamente (como transferencias de evidencia, handovers de turnos, y reportes de desaparecidos), se han identificado **4 Nuevos Objetivos Compuestos** que aportarán un inmenso valor táctico a la policía y no estaban en el radar original.

### 🔶 Nuevo OT-A: Analítica de Cuellos de Botella en Cadena de Custodia (División Forense)
- **Justificación:** Tenemos un log detallado en `evidencia_transferencias`. Se puede crear un pipeline ETL que mida el tiempo promedio que cada oficial retiene una pieza de evidencia (Time-to-Transfer) antes de devolverla a la bodega central o a la corte.
- **Valor Táctico:** Permitirá al Jefe de Investigaciones saber qué detectives o laboratorios están tardando más del SLA permitido para procesar las evidencias físicas.

### 🔶 Nuevo OT-B: Matriz de Riesgo en Persecuciones Policiales (Operaciones Especiales)
- **Justificación:** Se están capturando datos ricos en la tabla `pursuits`. Un pipeline puede cruzar la velocidad promedio de la persecución, el clima y el distrito con la cantidad de accidentes/daños vehiculares reportados en `vehiculo_patrulla`.
- **Valor Táctico:** El Comandante de Operaciones podrá ajustar las "Reglas de Persecución" en base a datos (Ej: "Las persecuciones en el Distrito 4 durante lluvia tienen un 80% de probabilidad de colisión de patrulla").

### 🔶 Nuevo OT-C: Efectividad del Relevo Operativo vs. Incidencias (RRHH / Logística)
- **Justificación:** Gracias al módulo de `ShiftHandover`, sabemos si el oficial saliente completó o ignoró los *checklists* de equipos y novedades. Podemos cruzar esto con daños reportados en vehículos o equipos perdidos durante el turno del oficial entrante.
- **Valor Táctico:** Encontrar correlaciones de negligencia (Ej: "El 60% de los daños no reportados ocurren cuando no se hace el checklist de relevo adecuado").

### 🔶 Nuevo OT-D: Análisis Predictivo de Resolución de Desaparecidos (Investigaciones)
- **Justificación:** Usando los datos de `rrhh_persona_desaparecida` y las alertas `BOLO`, se puede analizar la correlación estadística entre el tiempo de resolución, el nivel de riesgo (Crítico/Alto) y la edad de la víctima.
- **Valor Táctico:** Permitirá al Sheriff predecir cuántos recursos y patrullas asignar cuando se reporta un niño menor de 12 años vs. un adulto, basándose en la probabilidad histórica de resolución segura en las primeras 24 horas.
