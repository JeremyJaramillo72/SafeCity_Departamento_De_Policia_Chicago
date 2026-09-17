# SafeCity Intelligence Ops - Diagramas de Casos de Uso por Módulo

Diagramas PlantUML generados para cada módulo funcional del sistema.

---

## Índice de Módulos

| # | Módulo | Diagrama | Actor Principal |
|---|--------|----------|-----------------|
| 1 | Gestión Operativa de Incidentes | ![](Module%2001%20-%20Gesti%C3%B3n%20Operativa%20de%20Incidentes.png) | Oficial de Patrulla |
| 2 | Inteligencia Geográfica y Mapeo Táctico | ![](Module%2002%20-%20Inteligencia%20Geogr%C3%A1fica%20y%20Mapeo%20T%C3%A1ctico.png) | Analista de Inteligencia |
| 3 | Inteligencia Criminal y Archivo | ![](Module%2003%20-%20Inteligencia%20Criminal%20y%20Archivo.png) | Detective |
| 4 | Gestión de Logística y Flota Vehicular | ![](Module%2004%20-%20Gesti%C3%B3n%20de%20Log%C3%ADstica%20y%20Flota%20Vehicular.png) | Jefe de Logística |
| 5 | Gestión de Turnos y Patrullaje | ![](Module%2005%20-%20Gesti%C3%B3n%20de%20Turnos%20y%20Patrullaje.png) | Jefe de Logística |
| 6 | Gestión de Investigación Especial | ![](Module%2006%20-%20Gesti%C3%B3n%20de%20Investigaci%C3%B3n%20Especial.png) | Detective |
| 7 | Gestión de Personal Policial y Accesos | ![](Module%2007%20-%20Gesti%C3%B3n%20de%20Personal%20Policial%20y%20Accesos.png) | Administrador |
| 8 | Auditoría, Seguridad y Backups | ![](Module%2008%20-%20Auditor%C3%ADa.png) | Administrador |
| 9 | Reportes e Indicadores BSC | ![](Module%2009%20-%20Reportes%20e%20Indicadores%20BSC.png) | Sheriff |

---

## Detalle por Módulo

### 1. Gestión Operativa de Incidentes
- **Casos de uso:** CU-O01 a CU-O08, CU-O03, CU-O09
- **Actores:** Oficial de Patrulla, Operador de Emergencias
- **Tablas Fact:** Fact_Chicago_Crimes, Fact_Llamada_Emergencia
- **Tablas Dim:** Dim_Catalogo_Ubicacion, Dim_Codigo_Penal

### 2. Inteligencia Geográfica y Mapeo Táctico
- **Casos de uso:** CU-E02, CU-T03, CU-T04, CU-T11
- **Actores:** Sheriff, Analista de Inteligencia
- **Técnicas:** KDE, Clustering Espacial, GIS
- **Tablas Fact:** Fact_Chicago_Crimes

### 3. Inteligencia Criminal y Archivo
- **Casos de uso:** CU-O10 a CU-O14, CU-O16, CU-T05, CU-T12
- **Actores:** Detective, Oficial de Patrulla
- **Técnicas:** Teoría de Grafos, Análisis de Enlaces, NLP
- **Tablas Fact:** Fact_Evidencia, Fact_Investigacion_Especial
- **Tablas Dim:** Dim_Sospechoso, Dim_Banda_Criminal, Dim_Testigo

### 4. Gestión de Logística y Flota Vehicular
- **Casos de uso:** CU-O19 a CU-O27, CU-T06
- **Actores:** Jefe de Logística, Oficial de Patrulla
- **Tablas Fact:** Fact_Turno_Patrullaje
- **Tablas Dim:** Dim_Vehiculo_Patrulla, Dim_Equipamiento_Oficial

### 5. Gestión de Turnos y Patrullaje
- **Casos de uso:** CU-O28 a CU-O32, CU-T07
- **Actores:** Jefe de Logística, Oficial de Patrulla, Sheriff
- **Técnicas:** Forecasting, Optimización de cuadrantes
- **Tablas Fact:** Fact_Turno_Patrullaje
- **Tablas Dim:** Dim_Oficial_Policia, Dim_Catalogo_Ubicacion

### 6. Gestión de Investigación Especial
- **Casos de uso:** CU-T09, CU-T10, CU-O15, CU-O17, CU-O18
- **Actores:** Detective, Sheriff
- **Tablas Fact:** Fact_Investigacion_Especial, Fact_Seguimiento_Incidente
- **Tablas Dim:** Dim_Sospechoso, Dim_Caso_Judicial

### 7. Gestión de Personal Policial y Accesos
- **Casos de uso:** CU-O32 a CU-O34, CU-O37, CU-T08
- **Actores:** Administrador de Sistema
- **Técnicas:** RBAC, Monitoreo de seguridad
- **Tablas Dim:** Dim_Oficial_Policia, Dim_Rol_Oficial, Dim_Usuario_Sistema

### 8. Auditoría, Seguridad y Backups
- **Casos de uso:** CU-O33, CU-O35 a CU-O37
- **Actores:** Administrador de Sistema
- **Tablas Fact:** Fact_Historial_Sesion, Fact_Auditoria_Sistema, Fact_Registro_Respaldo
- **Cumplimiento:** ISO 27001, CJIS

### 9. Reportes e Indicadores BSC
- **Casos de uso:** CU-E01, CU-E03, CU-T01, CU-T02, CU-T06, CU-T13
- **Actores:** Sheriff, Analista de Inteligencia
- **Técnicas:** BI, Agregaciones OLAP, ML Predictivo

---

## Regenerar Diagramas

Para regenerar los diagramas PNG después de modificar los archivos `.puml`:

```bash
java -jar plantuml.jar -tpng documentation/use-case-diagrams-by-module/*.puml
```

---

*Generado automáticamente por SafeCity Intelligence Ops - 2026*
