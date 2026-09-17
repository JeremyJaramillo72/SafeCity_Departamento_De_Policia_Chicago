<div align="right">
  <strong>Alumno:</strong> [Tu Nombre Aquí] <br>
  <strong>Asignatura:</strong> Base de Datos II <br>
  <strong>Fecha:</strong> Julio 2026
</div>

<br>

# ANÁLISIS DE OBJETIVOS TÁCTICOS Y ESTRATEGIA DE DATOS (ETL/ELT)
**Proyecto:** SafeCity Intelligence Ops

## 1. Contexto de la Empresa
- **Nombre de la Empresa:** SafeCity Solutions.
- **Actividad Comercial:** Desarrollo y comercialización B2G (Business-to-Government) de plataformas SaaS de misión crítica para el sector de la seguridad pública. Especializados en digitalizar y automatizar operaciones policiales para reducir costos logísticos, optimizar la gestión de flotas y agilizar el procesamiento de inteligencia criminal mediante análisis de datos.
- **Misión:** Maximizar la eficiencia operativa de las instituciones de seguridad pública a nivel global mediante tecnología de alto rendimiento que garantice rapidez en la respuesta a emergencias y una optimización absoluta de los recursos estatales asignados.
- **Visión:** Posicionarnos como la empresa GovTech más competitiva y rentable a nivel global en el desarrollo de software para Smart Cities, siendo reconocidos por entregar un alto retorno de inversión (ROI) a los gobiernos a través de plataformas escalables que aseguran operaciones rápidas, transparentes y sostenibles.
- **Sistema Propuesto:** SafeCity Intelligence Ops — Plataforma de Gestión de Operaciones e Inteligencia Policial.

---

## 2. Clasificación de Objetivos Tácticos y Vistas por Departamento

Los 26 objetivos tácticos del sistema se desglosan en 57 informes/vistas específicos: 39 informes simples (alcanzados desde la BDR) y 18 informes compuestos (procesados vía pipeline ETL/ELT con Apache Airflow sobre ClickHouse). A continuación se presenta el **Directorio Consolidado de los 10 Departamentos y Unidades Operativas** que componen la estructura organizacional de SafeCity:

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-top: 15px; margin-bottom: 25px;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th style="width: 10%;">#</th>
      <th style="width: 65%;">Departamento / Unidad Operativa</th>
      <th style="width: 25%;">Objetivos Tácticos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><b>2.1</b></td>
      <td>Inteligencia Geográfica y Mapas Tácticos</td>
      <td align="center">OT1</td>
    </tr>
    <tr>
      <td align="center"><b>2.2</b></td>
      <td>Departamento de Inteligencia y Análisis Criminal</td>
      <td align="center">OT13, OT18, OT19</td>
    </tr>
    <tr>
      <td align="center"><b>2.3</b></td>
      <td>Unidad de Operaciones de Campo (Incidentes)</td>
      <td align="center">OT2, OT3, OT23, OT24</td>
    </tr>
    <tr>
      <td align="center"><b>2.4</b></td>
      <td>Departamento de Logística Operativa y Flota</td>
      <td align="center">OT4, OT5, OT21</td>
    </tr>
    <tr>
      <td align="center"><b>2.5</b></td>
      <td>Despacho y Gestión de Emergencias (911)</td>
      <td align="center">OT6, OT7, OT22</td>
    </tr>
    <tr>
      <td align="center"><b>2.6</b></td>
      <td>División de Investigaciones Criminales</td>
      <td align="center">OT8, OT9, OT20</td>
    </tr>
    <tr>
      <td align="center"><b>2.7</b></td>
      <td>Departamento de Gestión de Talento y Asuntos Internos (RRHH)</td>
      <td align="center">OT10, OT11, OT25</td>
    </tr>
    <tr>
      <td align="center"><b>2.8</b></td>
      <td>Departamento de Tecnología y Ciberseguridad (Sistemas/Auditoría)</td>
      <td align="center">OT12, OT26</td>
    </tr>
    <tr>
      <td align="center"><b>2.9</b></td>
      <td>Laboratorio de Análisis Predictivo e IA</td>
      <td align="center">OT14, OT15</td>
    </tr>
    <tr>
      <td align="center"><b>2.10</b></td>
      <td>Unidad de Tránsito y Seguridad Vial</td>
      <td align="center">OT16, OT17</td>
    </tr>
  </tbody>
</table>

A continuación, se detalla la clasificación completa de cada uno de los departamentos y unidades operativas listados previamente. Dentro de cada apartado se especifican sus Objetivos Tácticos asignados, el nombre de cada informe/vista y su nivel de procesamiento, ordenados presentando primero los **Informes Simples (🟢)** y posteriormente los **Informes Compuestos (🔶)**:

---

### 2.1 Inteligencia Geográfica y Mapas Tácticos

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT1</b></td>
      <td rowspan="2" style="vertical-align: middle;">Analizar reportes mensuales de inteligencia y mapas de calor geoespaciales.</td>
      <td>Mapa de calor de criminalidad por zona</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td>Evolución mensual de delitos violentos</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
  </tbody>
</table>

---

### 2.2 Departamento de Inteligencia y Análisis Criminal

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- SIMPLES PRIMERO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT13</b></td>
      <td rowspan="2" style="vertical-align: middle;">Consultar el directorio actualizado de sospechosos y sus vehículos vinculados.</td>
      <td>Directorio general de sospechosos</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Vehículos vinculados a sospechosos</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td rowspan="4" align="center" style="vertical-align: middle;"><b>OT18</b></td>
      <td rowspan="4" style="vertical-align: middle;">Gestionar el registro de bandas criminales, víctimas, personas desaparecidas y alertas BOLO.</td>
      <td>Listado de bandas criminales registradas</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Registro de víctimas por caso</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Registro de personas desaparecidas</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Alertas BOLO activas (Be On the Look Out)</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <!-- COMPUESTOS DEBAJO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT2</b></td>
      <td rowspan="2" style="vertical-align: middle;">Visualizar tableros de estadísticas de reincidencia y conexiones criminales.</td>
      <td>Red de vínculos criminales</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td>Tasa de reincidencia por sospechoso</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
  </tbody>
</table>

---

### 2.3 Unidad de Operaciones de Campo (Incidentes)

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- SIMPLES PRIMERO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT12</b></td>
      <td rowspan="2" style="vertical-align: middle;">Consultar el listado de incidentes activos asignados a una patrulla específica.</td>
      <td>Listado de incidentes en curso por patrulla</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Incidentes de alta prioridad sin resolver</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td rowspan="3" align="center" style="vertical-align: middle;"><b>OT19</b></td>
      <td rowspan="3" style="vertical-align: middle;">Gestionar el registro de arrestos, custodia de detenidos y estado de celdas de retención.</td>
      <td>Registro de arrestos realizados</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Estado de celdas de retención</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Bitácora de movimientos en celdas</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td rowspan="3" align="center" style="vertical-align: middle;"><b>OT20</b></td>
      <td rowspan="3" style="vertical-align: middle;">Consultar los reportes auxiliares de operaciones de campo.</td>
      <td>Reportes de uso de Taser</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Despacho y registro de grúas</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Registro de reuniones comunitarias</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <!-- COMPUESTOS DEBAJO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT11</b></td>
      <td rowspan="2" style="vertical-align: middle;">Generar reportes comparativos de criminalidad por tipo de delito y período.</td>
      <td>Comparativo mensual de criminalidad</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td>Incidentes agrupados por tipo de delito</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
  </tbody>
</table>

---

### 2.4 Departamento de Logística Operativa y Flota

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- SIMPLES PRIMERO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT8</b></td>
      <td rowspan="2" style="vertical-align: middle;">Planificar el mantenimiento preventivo rotativo de la flota vehicular.</td>
      <td>Alertas de mantenimiento preventivo</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Historial de mantenimiento realizado</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT15</b></td>
      <td rowspan="2" style="vertical-align: middle;">Consultar la planificación actual de turnos y rutas asignadas por cuadrante.</td>
      <td>Planificación diaria de turnos por cuadrante</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Listado de oficiales asignados hoy</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td rowspan="4" align="center" style="vertical-align: middle;"><b>OT21</b></td>
      <td rowspan="4" style="vertical-align: middle;">Gestionar el inventario de equipo táctico, asignaciones a oficiales y consumo de combustible de la flota.</td>
      <td>Inventario de equipo táctico</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Asignaciones de equipo a oficiales y vehículos</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Registro de consumo de combustible</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Vista general del estado de la flota</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <!-- COMPUESTOS DEBAJO -->
    <tr>
      <td align="center" style="vertical-align: middle;"><b>OT3</b></td>
      <td style="vertical-align: middle;">Generar reportes del porcentaje histórico de disponibilidad de la flota.</td>
      <td>Porcentaje mensual de disponibilidad vehicular</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td align="center" style="vertical-align: middle;"><b>OT14</b></td>
      <td style="vertical-align: middle;">Analizar el promedio de kilometraje recorrido por las unidades policiales.</td>
      <td>Desgaste y kilometraje promedio por cuadrante</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
  </tbody>
</table>

---

### 2.5 Despacho y Gestión de Emergencias (911)

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- SIMPLES PRIMERO -->
    <tr>
      <td align="center" style="vertical-align: middle;"><b>OT22</b></td>
      <td style="vertical-align: middle;">Consultar el historial de llamadas de emergencia recibidas por la central.</td>
      <td>Historial de llamadas de emergencia</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <!-- COMPUESTOS DEBAJO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT6</b></td>
      <td rowspan="2" style="vertical-align: middle;">Monitorear los indicadores de tiempos de respuesta de emergencias (SLA por sector).</td>
      <td>Promedio de tiempo de respuesta por sector</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td>Porcentaje de cumplimiento del SLA</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
  </tbody>
</table>

---

### 2.6 División de Investigaciones Criminales

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- SOLO SIMPLES -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT7</b></td>
      <td rowspan="2" style="vertical-align: middle;">Consultar reportes con listados de testimonios e incautaciones por caso.</td>
      <td>Listado de testimonios por caso</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Registro de evidencias incautadas</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT10</b></td>
      <td rowspan="2" style="vertical-align: middle;">Revisar listados y auditorías de Cadena de Custodia y órdenes judiciales activas.</td>
      <td>Historial de cadena de custodia activa</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Listado de órdenes judiciales pendientes</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT23</b></td>
      <td rowspan="2" style="vertical-align: middle;">Gestionar los casos asignados al detective y las solicitudes de investigación especial.</td>
      <td>Casos asignados al detective</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Solicitudes de investigación especial</td>
      <td align="center">🟢 Simple</td>
    </tr>
  </tbody>
</table>

---

### 2.7 Departamento de Gestión de Talento y Asuntos Internos (RRHH)

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- SIMPLES PRIMERO -->
    <tr>
      <td rowspan="3" align="center" style="vertical-align: middle;"><b>OT9</b></td>
      <td rowspan="3" style="vertical-align: middle;">Gestionar reportes de permisos, capacitación y disciplina del personal.</td>
      <td>Listado de certificaciones próximas a vencer</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Registro de permisos solicitados</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Historial disciplinario y quejas ciudadanas</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td rowspan="3" align="center" style="vertical-align: middle;"><b>OT24</b></td>
      <td rowspan="3" style="vertical-align: middle;">Gestionar el control de asistencia, briefings de turno y entregas de turno del personal.</td>
      <td>Registro de asistencia de oficiales</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Briefings de inicio de turno (Roll Call)</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Entregas de turno (Shift Handovers)</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <!-- COMPUESTOS DEBAJO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT4</b></td>
      <td rowspan="2" style="vertical-align: middle;">Visualizar reportes de ausentismo y cobertura de cuadrantes de patrullaje.</td>
      <td>Índice de ausentismo mensual</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td>Nivel de cobertura de patrullaje por sector</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td align="center" style="vertical-align: middle;"><b>OT16</b></td>
      <td style="vertical-align: middle;">Generar reportes de rendimiento por oficial.</td>
      <td>Evaluación integral de desempeño por oficial</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
  </tbody>
</table>

---

### 2.8 Departamento de Tecnología y Ciberseguridad (Sistemas/Auditoría)

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- SIMPLES PRIMERO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT25</b></td>
      <td rowspan="2" style="vertical-align: middle;">Gestionar el directorio de usuarios del sistema y catálogos de configuración.</td>
      <td>Gestión de usuarios del sistema</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Catálogos del sistema</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <!-- COMPUESTOS DEBAJO -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT5</b></td>
      <td rowspan="2" style="vertical-align: middle;">Auditar los tableros de logs de accesos del sistema y detección de anomalías.</td>
      <td>Accesos al sistema fuera de horario</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td>Intentos de inicio de sesión fallidos masivos</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
  </tbody>
</table>

---

### 2.9 Laboratorio de Análisis Predictivo e IA

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- COMPUESTOS -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT17</b></td>
      <td rowspan="2" style="vertical-align: middle;">Consolidar los KPIs operativos del departamento en un tablero ejecutivo para el Sheriff.</td>
      <td>Tasa de resolución de casos</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
    <tr>
      <td>Resumen global de SLA y disponibilidad operativa</td>
      <td align="center">🔶 Compuesto</td>
    </tr>
  </tbody>
</table>

---

### 2.10 Unidad de Tránsito y Seguridad Vial

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Código</th>
      <th>Objetivo Táctico</th>
      <th>Informe / Vista</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <!-- SIMPLES -->
    <tr>
      <td rowspan="2" align="center" style="vertical-align: middle;"><b>OT26</b></td>
      <td rowspan="2" style="vertical-align: middle;">Gestionar el registro de infracciones de tránsito y accidentes vehiculares.</td>
      <td>Listado de infracciones de tránsito (e-Citations)</td>
      <td align="center">🟢 Simple</td>
    </tr>
    <tr>
      <td>Registro de accidentes de tránsito</td>
      <td align="center">🟢 Simple</td>
    </tr>
  </tbody>
</table>

---

## 3. Resumen Consolidado

| Tipo de Informe | Cantidad | Origen de Datos |
| :---: | :---: | :--- |
| 🟢 **Informes Simples** | 39 | Base de Datos Relacional (Django ORM / ClickHouse directo) |
| 🔶 **Informes Compuestos** | 18 | Base de Datos Columnar (ClickHouse) vía pipeline ETL con Apache Airflow |
| **Total de Objetivos Tácticos** | **26** | Distribuidos en 10 departamentos |

---

## 4. Dashboards Analíticos e Indicadores Tácticos del Sistema (Borradores de Diseño)

> [!NOTE]
> **Nota de Borrador:** Los siguientes tableros analíticos corresponden a las maquetas visuales y **propuestas de diseño preliminares** integradas en el frontend de la plataforma. Su propósito es presentar al docente las vistas ejecutivas de Inteligencia de Negocios (BI) que consumirán los datos agregados y procesados por el pipeline ETL.

---

### 4.1 Dashboard de Operaciones e Incidentes Criminales

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th style="width: 12%;">Código</th>
      <th style="width: 33%;">Dashboard / Tema</th>
      <th style="width: 55%;">Indicadores y KPIs (Datos Reales del Sistema)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" style="vertical-align: middle;"><b>DB1</b></td>
      <td style="vertical-align: middle;">Operaciones e Incidentes Criminales<br><small>(Ruta: <code>/dashboard</code>)</small></td>
      <td>• <b>TOTAL INCIDENTS:</b> Conteo total de eventos delictivos registrados (900,011 Total Recorded).<br><br>• <b>ACTIVE ARRESTS:</b> Total de arrestos y tasa de resolución (263,440 - 29.3% rate).<br><br>• <b>DOMESTIC CASES:</b> Total de incidentes de violencia doméstica (148,308 Domestic cases).<br><br>• <b>HIGH-RISK THREATS:</b> Casos pendientes de resolución (636,571 UNRESOLVED).</td>
    </tr>
  </tbody>
</table>

<br>

![Dashboard de Operaciones e Incidentes Criminales](C:\Users\ASUS\.gemini\antigravity\brain\692c5030-0ee3-47dc-a1c5-487768e0d9b0\media__1785206729135.png)

<br>

---

### 4.2 Dashboard de Despacho y Emergencias 911

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th style="width: 12%;">Código</th>
      <th style="width: 33%;">Dashboard / Tema</th>
      <th style="width: 55%;">Indicadores y KPIs (Datos Reales del Sistema)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" style="vertical-align: middle;"><b>DB2</b></td>
      <td style="vertical-align: middle;">Despacho y Emergencias 911<br><small>(Ruta: <code>/dispatch</code>)</small></td>
      <td>• <b>LLAMADAS 911:</b> Monitoreo de llamadas de emergencia entrantes en tiempo real.<br><br>• <b>TIEMPO DE RESPUESTA (SLA):</b> Minutos promedio de arribo de patrulla por sector.<br><br>• <b>UNIDADES DESPACHADAS:</b> Patrullas asignadas a emergencias activas.</td>
    </tr>
  </tbody>
</table>

<br>

> *[ Espacio reservado para captura de pantalla del Dashboard de Despacho 911 ]*

<br>

---

### 4.3 Dashboard de Administración y Ciberseguridad del Sistema

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th style="width: 12%;">Código</th>
      <th style="width: 33%;">Dashboard / Tema</th>
      <th style="width: 55%;">Indicadores y KPIs (Datos Reales del Sistema)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" style="vertical-align: middle;"><b>DB3</b></td>
      <td style="vertical-align: middle;">Administración y Ciberseguridad del Sistema<br><small>(Ruta: <code>/dashboard</code> - Consola Administrador)</small></td>
      <td>• <b>DATABASE CLUSTER:</b> Monitoreo de salud del clúster ClickHouse/SQLite y latencia de consultas.<br><br>• <b>SECURITY SESSIONS:</b> Control de sesiones activas en tiempo real y cuentas registradas.<br><br>• <b>AUDIT LOGS & BACKUPS:</b> Eventos de auditoría en vivo y estado de respaldos automatizados.</td>
    </tr>
  </tbody>
</table>

<br>

> *[ Espacio reservado para captura de pantalla del Dashboard de Administración del Sistema ]*

<br>

---

### 4.4 Dashboard de Recursos Humanos y Control de Personal

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th style="width: 12%;">Código</th>
      <th style="width: 33%;">Dashboard / Tema</th>
      <th style="width: 55%;">Indicadores y KPIs (Datos Reales del Sistema)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" style="vertical-align: middle;"><b>DB4</b></td>
      <td style="vertical-align: middle;">Gestión de Talento y Recursos Humanos<br><small>(Ruta: <code>/rrhh</code>)</small></td>
      <td>• <b>TOTAL ACTIVE FORCE:</b> Fuerza policial total activa (1,248 Officers - +3.4% YoY).<br><br>• <b>DEPLOYED ON SHIFT:</b> Oficiales desplegados en turno activo (842 Deployed - 67.5% Active).<br><br>• <b>MEDICAL & TEMP LEAVE:</b> Ausentismo e incidencias médicas (24 Leave Cases - 1.9% Absence Rate).<br><br>• <b>TACTICAL ACCREDITATIONS:</b> Tasa de acreditaciones y certificaciones de tiro/crisis (98.4% Compliance Rate).</td>
    </tr>
  </tbody>
</table>

<br>

> *[ Espacio reservado para captura de pantalla del Dashboard de Recursos Humanos ]*





