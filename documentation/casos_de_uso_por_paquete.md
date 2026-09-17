# 📊 Diagrama de Casos de Uso por Paquete — SafeCity Intelligence Ops
**Versión consolidada:** 11 Paquetes / 52 Casos de Uso (CRUDs agrupados en 'Gestionar')  
**Fecha:** Junio 2026

---

## ACTORES DEL SISTEMA (Globales)

| Actor | Descripción |
|---|---|
| **Usuario** | Rol general/base del sistema, autenticado y auditado. Padre del Oficial de Patrulla y Sheriff |
| **Oficial de Patrulla** | Policía en campo, registra incidentes, patrulla y opera celdas/detenidos. Hereda de Usuario |
| **Sheriff** | Mando táctico, aprueba operaciones, expedientes y gestiona catálogo de bandas. Hereda de Usuario |
| **Operador 911** | Atiende llamadas de emergencia, clasifica triage y despacha unidades |
| **Detective** | Investiga casos complejos, gestiona expedientes, sospechosos y evidencias |
| **Analista de Inteligencia Criminal** | Realiza análisis predictivo de puntos calientes, análisis de vínculos en red y reportes estadísticos |
| **Jefe de Logística** | Administra flota, inventario y equipamiento |
| **Oficial de RRHH** | Gestiona asistencia, permisos y personal |
| **Administrador del Sistema** | Gestiona usuarios, roles, backups y configuración |
| **Agente de Tránsito** | Emite infracciones, gestiona alcoholemia y accidentes |
| **Sistema** | Actor no humano: ejecuta procesos y alertas automáticas |

---

## 📦 PAQUETE 1: Gestión Operativa de Incidentes
**Actores:** Oficial de Patrulla, Operador 911, Sheriff

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-01** | **Gestionar Incidentes** | ✅ Unificado | 4.1.1, 4.1.3, 4.1.4 (Registrar, Modificar, Eliminar) |
| **CU-02** | Consultar / Filtrar Incidentes | ✅ Standalone | 4.1.2 |
| **CU-03** | Registrar Tiempo de Llegada de Patrullas a Emergencias | 🆕 Nuevo | 4.1.6 |

---

## 📦 PAQUETE 2: Inteligencia Geográfica y Mapas Tácticos
**Actores:** Sheriff, Detective, Analista de Inteligencia Criminal

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-04** | Visualizar Mapa de Calor Táctico (Heatmap) | ✅ Existía | — |
| **CU-05** | Filtrar Crímenes por Calle / Zona | ✅ Existía | — |
| **CU-06** | Alternar Capas del Mapa | ✅ Existía | — |

---

## 📦 PAQUETE 3: Investigación Especial (Expedientes)
**Actores:** Detective, Sheriff

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-07** | Abrir Expediente de Investigación y Asignar Detective | ✅ Existía | 4.2.9 |
| **CU-08** | Consultar "Mis Casos" / Bandeja del Detective | ✅ Existía | 4.2.2 |
| **CU-09** | Registrar Arresto Relacionado al Expediente | 🆕 Nuevo | 4.2.4 |
| **CU-10** | Generar Reporte Conclusivo y Cerrar Caso | ✅ Existía | 4.2.8 |
| **CU-11** | Reabrir Caso Cerrado por Nueva Evidencia | ✅ Existía | 4.2.10 |
| **CU-12** | **Gestionar Búsqueda de Personas Desaparecidas** | 🆕 Unificado | 4.2.13, 4.2.14 (Registrar y Actualizar Estado) |

---

## 📦 PAQUETE 4: Hub de Inteligencia Criminal
**Actores:** Usuario (Base), Oficial de Patrulla (Heredado), Sheriff (Heredado), Detective

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-13** | **Gestionar Catálogo de Bandas** | ✅ Existía | — (Catálogo táctico de bandas criminales) |
| **CU-14** | **Gestionar y Vincular Sospechoso** | ✅ Unificado | 4.2.1, 4.2.2, 4.2.3, 4.2.4 (Registrar, Consultar, Modificar Sospechoso) |
| **CU-15** | **Registrar Declaración de Testigo** | ✅ Unificado | 4.2.7 (Agregar Testimonio y Notas Periciales) |
| **CU-16** | **Gestionar Custodia e Inventario** | ✅ Unificado | 4.2.5, 4.2.6 (Registrar y Consultar Evidencias) |
| **CU-17** | **Gestionar Alertas BOLO (Be On The Lookout)** | ✅ Unificado | 4.2.11, 4.2.12 (Crear y Consultar BOLO) |
| **CU-42** | **Gestionar Celdas y Detenidos** | ✅ Movido | 4.2.15, 4.2.16, 4.2.17 |

---

## 📦 PAQUETE 5: Logística y Gestión de Patrullas
**Actores:** Oficial de Patrulla, Jefe de Logística, Sheriff

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-18** | **Gestionar Check-in y Check-out de Patrullas** | ✅ Unificado | 4.3.1, 4.3.2 |
| **CU-19** | **Gestionar Asignación y Devolución de Equipo Táctico** | ✅ Unificado | 4.3.3, 4.3.7 |
| **CU-20** | Consultar Inventario de Flota y Equipamiento | ✅ Existía | 4.3.4 |
| **CU-21** | **Gestionar Tickets de Fallas Mecánicas** | 🆕 Unificado | 4.3.5 |
| **CU-22** | Registrar Uso de Fuerza | 🆕 Nuevo | 4.3.6 |
| **CU-23** | Dar de Baja Vehículo o Equipo del Inventario | 🆕 Nuevo | 4.3.8 |
| **CU-24** | Registrar Persecución Vehicular y Revisión Post-Evento | 🆕 Nuevo | 4.3.9 |
| **CU-25** | **Trazar Ruta Táctico-Logística** | ✅ Movido | 4.1.5 (Cálculo de ruta óptima y ETA) |
| **CU-31** | Asignar / Modificar Cuadrantes de Patrullaje | ✅ Movido | 4.3.10 |

---

## 📦 PAQUETE 6: Despacho y Gestión de Emergencias
**Actores:** Operador 911, Sistema

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-26** | Registrar Llamada de Emergencia | ✅ Existía | — |
| **CU-27** | Geolocalizar y Despachar Unidad | ✅ Existía | 4.1.5 |
| **CU-28** | Monitorear Tiempos de Respuesta | ✅ Existía | 4.1.6 |
| **CU-29** | Clasificar Nivel de Triage (Prioridad 911) | ✅ Existía | — |

---

## 📦 PAQUETE 7: Recursos Humanos y Personal Policial
**Actores:** Oficial de RRHH, Oficial de Patrulla, Sheriff, Sistema

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-30** | **Gestionar Asistencia de Personal** | 🆕 Unificado | 4.4.1, 4.4.2 |
| **CU-32** | **Gestionar Solicitudes de Permisos de Ausencia** | 🆕 Unificado | 4.4.4, 4.4.5 |
| **CU-33** | Registrar Briefing de Turno (Roll Call) | 🆕 Nuevo | 4.4.6 |
| **CU-34** | Registrar Traspaso de Turno | 🆕 Nuevo | 4.4.7 |
| **CU-35** | **Gestionar Capacitaciones y Certificaciones de Oficiales** | 🆕 Unificado | 4.4.8, 4.4.9 |
| **CU-36** | Registrar Queja Ciudadana contra Oficial | 🆕 Nuevo | 4.4.10 |
| **CU-37** | Consultar Perfil y Hoja de Vida del Oficial | 🆕 Nuevo | 4.4.11 |
| **CU-41** | Registrar Reunión Comunitaria | ✅ Movido | 4.4.12 |

---

## 📦 PAQUETE 8: Gestión de Tránsito
**Actores:** Agente de Tránsito, Oficial de Patrulla, Sistema

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-38** | **Gestionar Infracciones de Tránsito** | 🆕 Unificado | 4.6.1, 4.6.2 |
| **CU-39** | Registrar Prueba de Alcoholemia (BAC) | 🆕 Nuevo | 4.6.3 |
| **CU-40** | Coordinar Despacho de Grúa | 🆕 Nuevo | 4.6.4 |

| **CU-44** | Registrar Informe de Accidente de Tránsito | 🆕 Nuevo | 4.6.5 |
---

## 📦 PAQUETE 9: Órdenes Judiciales (Warrants)
**Actores:** Oficial de Patrulla, Detective, Sheriff, Sistema

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-43** | **Gestionar Órdenes Judiciales (Warrants)** | 🆕 Unificado | 4.7.1, 4.7.2, 4.7.3 |

---

## 📦 PAQUETE 10: Administración, Seguridad y Auditoría del Sistema
**Actores:** Administrador del Sistema, Sistema

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-45** | Iniciar / Cerrar Sesión | ✅ Existía | 4.5.1 |
| **CU-46** | **Gestionar Usuarios y Roles (RBAC)** | ✅ Unificado | 4.5.2, 4.5.3 |
| **CU-47** | Consultar Bitácora de Auditoría | ✅ Existía | 4.5.4 |
| **CU-48** | Ejecutar Respaldo de Base de Datos | ✅ Existía | 4.5.5 |
| **CU-49** | Recuperar o Restablecer Contraseña de Usuario | 🆕 Nuevo | 4.5.6 |

---

## 📦 PAQUETE 11: Analítica Avanzada, Reportes y Pronóstico de Delitos
**Actores:** Analista de Inteligencia Criminal, Sistema

| # | Caso de Uso Consolidado | Estado | Especificaciones Asociadas |
|---|---|---|---|
| **CU-50** | Generar Reportes Estadísticos Mensuales y Anuales | ✅ Existía | — |
| **CU-51** | Realizar Análisis Predictivo y Pronóstico de "Puntos Calientes" | ✅ Existía | — |
| **CU-52** | Ejecutar Análisis de Vínculos Criminales en forma de Red | ✅ Existía | — |

---

## 📊 RESUMEN CONSOLIDADO DE CASOS DE USO

| Métrica | Cantidad |
|---|---|
| **Total de Paquetes** | 11 |
| **Total de Casos de Uso Consolidados** | 52 |

---

## 🎭 TABLA DE ACTORES POR PAQUETE (para el diagrama)

| Actor | Paquetes donde aparece |
|---|---|
| Usuario | 4 |
| Oficial de Patrulla | 1, 4 (Heredado), 5, 7, 8, 9 |
| Sheriff | 1, 4 (Heredado), 5, 7, 9 |
| Operador 911 | 1, 6 |
| Detective | 2, 3, 4, 9 |
| Jefe de Logística | 5 |
| Oficial de RRHH | 7 |
| Agente de Tránsito | 8 |
| Administrador del Sistema | 10 |
| Analista de Inteligencia Criminal | 2, 11 |
| Sistema (actor automático) | 6, 7, 8, 9, 10, 11 |
