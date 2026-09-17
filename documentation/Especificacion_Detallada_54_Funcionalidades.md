# Documento Maestro: Especificación, Arquitectura y UML
### Sistema: SafeCity Intelligence Ops
**Empresa:** SafeCity Solutions  
**Versión:** 2.0  
**Fecha:** Junio 2026

Este documento maestro unifica toda la documentación técnica exigida para la Fase 5 del proyecto, incluyendo la planificación estratégica (Parte I), las normativas constitucionales de desarrollo (Parte II), la arquitectura del sistema en UML (Parte III) y la especificación detallada basada en Operaciones CRUD de los 54 Objetivos Operativos (Parte IV).

---

## ÍNDICE GENERAL

*   [1. PARTE I: PLANIFICACIÓN ESTRATÉGICA E IDENTIDAD ORGANIZACIONAL](#1-parte-i-planificación-estratégica-e-identidad-organizacional)
    *   [1.1 Identidad Organizacional (SafeCity Solutions)](#11-identidad-organizacional-safecity-solutions)
*   [2. PARTE II: ARCHIVO DE CONSTITUCIÓN DEL SISTEMA](#2-parte-ii-archivo-de-constitución-del-sistema)
    *   [2.1 TÍTULO I: DE LA ARQUITECTURA GENERAL Y TECNOLOGÍAS](#21-título-i-de-la-arquitectura-general-y-tecnologías)
    *   [2.2 TÍTULO II: DE LA INTEGRIDAD DE LOS DATOS Y ALMACENAMIENTO](#22-título-ii-de-la-integridad-de-los-datos-y-almacenamiento)
    *   [2.3 TÍTULO III: DE LA CIBERSEGURIDAD Y PROTECCIÓN DE LA INFORMACIÓN](#23-título-iii-de-la-ciberseguridad-y-protección-de-la-información)
    *   [2.4 TÍTULO IV: DE LOS ESTÁNDARES DE ESCRITURA DE CÓDIGO](#24-título-iv-de-los-estándares-de-escritura-de-código)
    *   [2.5 TÍTULO V: DEL CONTROL DE VERSIONES Y FLUJO DE TRABAJO](#25-título-v-del-control-de-versiones-y-flujo-de-trabajo)
    *   [2.6 TÍTULO VI: DEL SISTEMA DE DISEÑO E INTERFAZ DE USUARIO (UI/UX)](#26-título-vi-del-sistema-de-diseño-e-interfaz-de-usuario-uiux)
    *   [2.7 TÍTULO VII: DEL RENDIMIENTO, DISPONIBILIDAD Y LÍMITES (SLAs)](#27-título-vii-del-rendimiento-disponibilidad-y-límites-slas)
    *   [2.8 TÍTULO VIII: DEL MANEJO DE ERRORES Y TELEMETRÍA](#28-título-viii-del-manejo-de-errores-y-telemetría)
    *   [2.9 TÍTULO IX: DE LA EVOLUCIÓN Y VERSIONADO DE APIS](#29-título-ix-de-la-evolución-y-versionado-de-apis)
*   [3. PARTE III: MODELADO DEL SISTEMA (UML)](#3-parte-iii-modelado-del-sistema-uml)
    *   [3.1 Diagrama de Casos de Uso por Paquete](#31-diagrama-de-casos-de-uso-por-paquete)
    *   [3.2 Diagrama de Base de Datos (Entidad-Relación)](#32-diagrama-de-base-de-datos-entidad-relación)
    *   [3.3 Diagrama de Componentes](#33-diagrama-de-componentes)
    *   [3.4 Diagrama de Despliegue (Deployment)](#34-diagrama-de-despliegue-deployment)
*   [4. PARTE IV: ESPECIFICACIÓN DE CASOS DE USO E HISTORIAS DE USUARIO](#4-parte-iv-especificación-de-casos-de-uso-e-historias-de-usuario)
    *   [4.1 Módulo Unidad de Operaciones de Campo](#4.1-modulo-gestion-operativa-de-incidentes)
        *   [4.1.1 CU-01: Gestionar Incidentes](#4.1.1-cu-01-gestionar-incidentes)
        *   [4.1.2 CU-02: Consultar / Filtrar Incidentes](#4.1.2-cu-02-consultar-filtrar-incidentes)
        *   [4.1.3 CU-03: Registrar Tiempo de Llegada de Patrullas a Emergencias](#4.1.3-cu-03-registrar-tiempo-de-llegada-de-patrullas-a-emergencias)
    *   [4.2 Módulo Inteligencia Geográfica y Mapas Tácticos](#4.2-modulo-inteligencia-geografica-y-mapas-tacticos)
        *   [4.2.1 CU-04: Visualizar Mapa de Calor Táctico (Heatmap)](#4.2.1-cu-04-visualizar-mapa-de-calor-tactico-heatmap)
        *   [4.2.2 CU-05: Filtrar Crímenes por Calle / Zona](#4.2.2-cu-05-filtrar-crimenes-por-calle-zona)
        *   [4.2.3 CU-06: Alternar Capas del Mapa](#4.2.3-cu-06-alternar-capas-del-mapa)
    *   [4.3 Módulo División de Investigaciones Criminales](#4.3-modulo-investigacion-especial-expedientes)
        *   [4.3.1 CU-07: Abrir Expediente de Investigación y Asignar Detective](#4.3.1-cu-07-abrir-expediente-de-investigacion-y-asignar-detective)
        *   [4.3.2 CU-08: Consultar 'Mis Casos' / Bandeja del Detective](#4.3.2-cu-08-consultar-mis-casos-bandeja-del-detective)
        *   [4.3.3 CU-09: Registrar Arresto Relacionado al Expediente](#4.3.3-cu-09-registrar-arresto-relacionado-al-expediente)
        *   [4.3.4 CU-10: Generar Reporte Conclusivo y Cerrar Caso](#4.3.4-cu-10-generar-reporte-conclusivo-y-cerrar-caso)
        *   [4.3.5 CU-11: Reabrir Caso Cerrado por Nueva Evidencia](#4.3.5-cu-11-reabrir-caso-cerrado-por-nueva-evidencia)
        *   [4.3.6 CU-12: Gestionar Búsqueda de Personas Desaparecidas](#4.3.6-cu-12-gestionar-búsqueda-de-personas-desaparecidas)        *   [4.3.6 CU-43: Gestionar Órdenes Judiciales (Warrants)](#4.3.6-cu-43-gestionar-ordenes-judiciales-warrants)

    *   [4.4 Módulo Departamento de Inteligencia y Análisis Criminal](#4.4-modulo-hub-de-inteligencia-criminal)
        *   [4.4.1 CU-13: Gestionar Catálogo de Bandas](#4.4.1-cu-13-gestionar-catalogo-de-bandas)
        *   [4.4.2 CU-14: Gestionar y Vincular Sospechoso](#4.4.2-cu-14-gestionar-y-vincular-sospechoso)
        *   [4.4.3 CU-15: Registrar Declaración de Testigo](#4.4.3-cu-15-registrar-declaracion-de-testigo)
        *   [4.4.4 CU-16: Gestionar Custodia e Inventario](#4.4.4-cu-16-gestionar-custodia-e-inventario)
        *   [4.4.5 CU-17: Gestionar Alertas BOLO (Be On The Lookout)](#4.4.5-cu-17-gestionar-alertas-bolo-be-on-the-lookout)
        *   [4.4.6 CU-42: Gestionar Celdas y Detenidos](#4.4.6-cu-42-gestionar-celdas-y-detenidos)
    *   [4.5 Módulo Departamento de Logística Operativa y Flota](#4.5-modulo-logistica-y-gestion-de-patrullas)
        *   [4.5.1 CU-18: Gestionar Check-in y Check-out de Patrullas](#4.5.1-cu-18-gestionar-check-in-y-check-out-de-patrullas)
        *   [4.5.2 CU-19: Gestionar Asignación y Devolución de Equipo Táctico](#4.5.2-cu-19-gestionar-asignacion-y-devolucion-de-equipo-tactico)
        *   [4.5.3 CU-20: Consultar Inventario de Flota y Equipamiento](#4.5.3-cu-20-consultar-inventario-de-flota-y-equipamiento)
        *   [4.5.4 CU-21: Gestionar Tickets de Fallas Mecánicas](#4.5.4-cu-21-gestionar-tickets-de-fallas-mecanicas)
        *   [4.5.5 CU-22: Registrar Uso de Fuerza](#4.5.5-cu-22-registrar-uso-de-fuerza)
        *   [4.5.6 CU-23: Dar de Baja Vehículo o Equipo del Inventario](#4.5.6-cu-23-dar-de-baja-vehiculo-o-equipo-del-inventario)
        *   [4.5.7 CU-24: Registrar Persecución Vehicular y Revisión Post-Evento](#4.5.7-cu-24-registrar-persecucion-vehicular-y-revision-post-evento)
        *   [4.5.8 CU-25: Trazar Ruta Táctico-Logística](#4.5.8-cu-25-trazar-ruta-tactico-logistica)
        *   [4.5.9 CU-31: Asignar / Modificar Cuadrantes de Patrullaje](#4.5.9-cu-31-asignar-modificar-cuadrantes-de-patrullaje)
    *   [4.6 Módulo Despacho y Gestión de Emergencias](#4.6-modulo-despacho-y-gestion-de-emergencias)
        *   [4.6.1 CU-26: Registrar Llamada de Emergencia](#4.6.1-cu-26-registrar-llamada-de-emergencia)
        *   [4.6.2 CU-27: Geolocalizar y Despachar Unidad](#4.6.2-cu-27-geolocalizar-y-despachar-unidad)
        *   [4.6.3 CU-28: Monitorear Tiempos de Respuesta](#4.6.3-cu-28-monitorear-tiempos-de-respuesta)
        *   [4.6.4 CU-29: Clasificar Nivel de Triage (Prioridad 911)](#4.6.4-cu-29-clasificar-nivel-de-triage-prioridad-911)
    *   [4.7 Módulo Departamento de Gestión de Talento y Asuntos Internos](#4.7-modulo-recursos-humanos-y-personal-policial)
        *   [4.7.1 CU-30: Gestionar Asistencia de Personal](#4.7.1-cu-30-gestionar-asistencia-de-personal)
        *   [4.7.2 CU-32: Gestionar Solicitudes de Permisos de Ausencia](#4.7.2-cu-32-gestionar-solicitudes-de-permisos-de-ausencia)
        *   [4.7.3 CU-33: Registrar Briefing de Turno (Roll Call)](#4.7.3-cu-33-registrar-briefing-de-turno-roll-call)
        *   [4.7.4 CU-34: Registrar Traspaso de Turno](#4.7.4-cu-34-registrar-traspaso-de-turno)
        *   [4.7.5 CU-35: Gestionar Capacitaciones y Certificaciones](#4.7.5-cu-35-gestionar-capacitaciones-y-certificaciones)
        *   [4.7.6 CU-36: Registrar Queja Ciudadana contra Oficial](#4.7.6-cu-36-registrar-queja-ciudadana-contra-oficial)
        *   [4.7.7 CU-37: Consultar Perfil y Hoja de Vida del Oficial](#4.7.7-cu-37-consultar-perfil-y-hoja-de-vida-del-oficial)
        *   [4.7.8 CU-41: Registrar Reunión Comunitaria](#4.7.8-cu-41-registrar-reunion-comunitaria)
    *   [4.8 Módulo Unidad de Tránsito y Seguridad Vial](#4.8-modulo-gestion-de-transito)
        *   [4.8.1 CU-38: Gestionar Infracciones de Tránsito](#4.8.1-cu-38-gestionar-infracciones-de-transito)
        *   [4.8.2 CU-39: Registrar Prueba de Alcoholemia (BAC)](#4.8.2-cu-39-registrar-prueba-de-alcoholemia-bac)
        *   [4.8.3 CU-40: Coordinar Despacho de Grúa](#4.8.3-cu-40-coordinar-despacho-de-grúa)
        *   [4.8.4 CU-44: Registrar Informe de Accidente de Tránsito](#4.8.4-cu-44-registrar-informe-de-accidente-de-transito)    *   [4.10 Módulo Departamento de Tecnología y Ciberseguridad](#4.10-modulo-administracion-seguridad-y-auditoria-del-sistema)
        *   [4.9.1 CU-45: Iniciar / Cerrar Sesión](#4.10.1-cu-45-iniciar-cerrar-sesion)
        *   [4.9.2 CU-46: Gestionar Usuarios y Roles (RBAC)](#4.10.2-cu-46-gestionar-usuarios-y-roles-rbac)
        *   [4.9.3 CU-47: Consultar Bitácora de Auditoría](#4.10.3-cu-47-consultar-bitacora-de-auditoria)
        *   [4.9.4 CU-48: Ejecutar Respaldo de Base de Datos](#4.10.4-cu-48-ejecutar-respaldo-de-base-de-datos)
        *   [4.9.5 CU-49: Recuperar o Restablecer Contraseña de Usuario](#4.10.5-cu-49-recuperar-o-restablecer-contraseña-de-usuario)
    *   [4.11 Módulo Laboratorio de Análisis Predictivo e IA](#4.11-modulo-analitica-avanzada-reportes-y-pronostico-de-delitos)
        *   [4.10.1 CU-50: Generar Reportes Estadísticos Mensuales y Anuales](#4.11.1-cu-50-generar-reportes-estadisticos-mensuales-y-anuales)
        *   [4.10.2 CU-51: Realizar Análisis Predictivo y Pronóstico de Puntos Calientes](#4.11.2-cu-51-realizar-analisis-predictivo-y-pronostico-de-puntos-calientes)
        *   [4.10.3 CU-52: Ejecutar Análisis de Vínculos Criminales en forma de Red](#4.11.3-cu-52-ejecutar-analisis-de-vinculos-criminales-en-forma-de-red)

---

# 1. PARTE I: PLANIFICACIÓN ESTRATÉGICA E IDENTIDAD ORGANIZACIONAL

## 1.1 Identidad Organizacional (SafeCity Solutions)

*   **Nombre de la Empresa:** SafeCity Solutions.
*   **Actividad Comercial:** Desarrollo y comercialización B2G (Business-to-Government) de plataformas SaaS de misión crítica para el sector de la seguridad pública. Especializados en digitalizar y automatizar operaciones policiales para reducir costos logísticos, optimizar la gestión de flotas y agilizar el procesamiento de inteligencia criminal mediante análisis de datos.
*   **Misión:** Maximizar la eficiencia operativa de las instituciones de seguridad pública a nivel global mediante tecnología de alto rendimiento que garantice rapidez en la respuesta a emergencias y una optimización absoluta de los recursos estatales asignados. Transformar la gestión policial en un proceso medible, ágil and altamente rentable para la administración pública.
*   **Visión:** Posicionarnos como la empresa GovTech más competitiva y rentable a nivel global en el desarrollo de software para Smart Cities, siendo reconocidos por entregar un alto retorno de inversión (ROI) a los gobiernos de Chicago, Nueva York, Los Ángeles y ciudades de Latinoamérica, a través de plataformas escalables que aseguran operaciones rápidas, transparentes y sostenibles.
*   **Objetivo Estratégico General:** Expandir la presencia comercial internacional de SafeCity Solutions mediante la captación digital automatizada de clientes gubernamentales, la escalabilidad exponencial a través de ecosistemas de APIs y marketplaces, una infraestructura en la nube de alta disponibilidad global, y una inteligencia de negocio centralizada que garantice ventaja competitiva en cada mercado.

---

# 2. PARTE II: ARCHIVO DE CONSTITUCIÓN DEL SISTEMA

*Este apartado define las leyes, directrices arquitectónicas, estándares de codificación y reglas de negocio inquebrantables.*

Este documento representa la **"Constitución del Sistema"**: un conjunto de leyes, directrices arquitectónicas, estándares de codificación y reglas de negocio inquebrantables que regirán el ciclo de vida completo de construcción, despliegue y mantenimiento de la plataforma **SafeCity Intelligence Ops**. Ningún desarrollador, arquitecto o administrador está exento de cumplir estas directrices.

---

## 2.1 TÍTULO I: DE LA ARQUITECTURA GENERAL Y TECNOLOGÍAS
**Artículo 1.** El sistema adoptará una arquitectura cliente-servidor estrictamente desacoplada.
**Artículo 2.** El desarrollo del lado del servidor (Backend) se realizará exclusivamente utilizando el framework **Django (Python)**, exponiendo la lógica de negocio a través de una API RESTful (Django REST Framework).
**Artículo 3.** El desarrollo del lado del cliente (Frontend) se realizará exclusivamente utilizando el framework **Angular 17+ (TypeScript)**.
**Artículo 4.** El motor de base de datos relacional principal será **PostgreSQL**, garantizando el cumplimiento estricto de las propiedades ACID para todas las transacciones policiales.
**Artículo 5.** La infraestructura debe estar preparada para el despliegue en contenedores (Docker) y orquestación en la nube (Kubernetes).

## 2.2 TÍTULO II: DE LA INTEGRIDAD DE LOS DATOS Y ALMACENAMIENTO
**Artículo 6.** **Prohibición del Borrado Físico (Hard Delete):** Ningún registro transaccional (incidentes, evidencias, oficiales) podrá ser eliminado físicamente de la base de datos bajo ninguna circunstancia. Toda eliminación será un "Borrado Lógico" (Soft Delete) cambiando el estado a inactivo o anulado.
**Artículo 7.** **Inmutabilidad Forense:** Todos los registros relacionados con Cadena de Custodia, Uso de Fuerza y Testimonios se consideran inmutables una vez guardados. Cualquier corrección requiere emitir un documento de "Alcance" o "Fe de Erratas", manteniendo el registro original intacto.
**Artículo 8.** Toda tabla transaccional debe incluir por defecto los campos de auditoría: `fecha_creacion`, `fecha_modificacion`, `creado_por` y `modificado_por`.
**Artículo 9.** Todas las dependencias foráneas (Foreign Keys) deben estar protegidas a nivel de base de datos para evitar registros huérfanos.

## 2.3 TÍTULO III: DE LA CIBERSEGURIDAD Y PROTECCIÓN DE LA INFORMACIÓN
**Artículo 10.** Las contraseñas de los usuarios nunca se almacenarán en texto plano. Es obligatorio el uso de algoritmos de hashing fuertes (bcrypt/Argon2) con *salt* aleatorio.
**Artículo 11.** Todas las comunicaciones entre el cliente (Angular) y el servidor (Django) deben viajar obligatoriamente sobre canales cifrados (HTTPS / TLS 1.3).
**Artículo 12.** **Control de Acceso Basado en Roles (RBAC):** Toda acción dentro del sistema (CRUD) debe verificar los permisos del usuario activo. Ninguna vista o endpoint puede estar sin protección de decoradores de permisos.
**Artículo 13.** Información de Identificación Personal (PII) crítica, como nombres de Testigos Protegidos, debe ser encriptada a nivel de columna en la base de datos usando AES-256.

## 2.4 TÍTULO IV: DE LOS ESTÁNDARES DE ESCRITURA DE CÓDIGO
**Artículo 14.** El código backend en Python debe adherirse estrictamente al estándar **PEP 8**. El código frontend en TypeScript debe seguir la guía de estilo oficial de Angular.
**Artículo 15.** El idioma oficial para el nombramiento de variables, clases, funciones y tablas en la base de datos será el **Inglés** (ej. `Incident`, `Evidence`, `Officer`), aunque la interfaz gráfica final se presente en Español.
**Artículo 16.** Principio de "Fat Models, Skinny Views" en Django: La lógica de negocio y las validaciones deben residir en los Modelos o en capas de Servicio, manteniendo las Vistas o ViewSets lo más ligeras posible.

## 2.5 TÍTULO V: DEL CONTROL DE VERSIONES Y FLUJO DE TRABAJO
**Artículo 17.** El control de versiones se gestionará exclusivamente con **Git** utilizando el modelo de trabajo **GitFlow**.
**Artículo 18.** Está prohibido hacer *commits* directamente a las ramas `main` o `production`. Todo código nuevo debe desarrollarse en ramas de tipo `feature/` o `bugfix/` e integrarse mediante Pull Requests (PR).
**Artículo 19.** Ningún Pull Request podrá ser fusionado sin haber pasado exitosamente las pruebas automatizadas (Tests Unitarios) y contar con al menos la revisión de código (Code Review) de un desarrollador par.

## 2.6 TÍTULO VI: DEL SISTEMA DE DISEÑO E INTERFAZ DE USUARIO (UI/UX)
**Artículo 20.** **Paleta de Colores Corporativa:** Todo el diseño del sistema debe alinearse a una estética de "Inteligencia Policial Táctica" predominando en **Modo Oscuro** (Dark Mode). Los colores base serán:
- **Fondo Principal:** Azul Marino Profundo (Navy Dark `#0A1128`).
- **Acentos Primarios:** Azul Eléctrico (`#0066FF`) para botones de acción principal y llamadas de atención.
- **Alertas Críticas:** Rojo Sangre (`#D32F2F`) exclusivamente para eliminación, emergencias 911 y uso de fuerza.
- **Prevención / Éxito:** Verde Táctico (`#2E7D32`) para notificaciones de éxito y operaciones completadas.
**Artículo 21.** **Tipografía:** Se prohíbe el uso de fuentes Serif. La fuente principal y obligatoria para todo el sistema será **'Inter'** (o en su defecto 'Roboto'), garantizando la máxima legibilidad en dispositivos móviles bajo la luz del sol y en pantallas tácticas.
**Artículo 22.** **Escalabilidad y Tamaños:**
- Los botones y campos de formulario en móviles deben tener un alto mínimo de `48px` para asegurar la usabilidad de oficiales usando guantes tácticos.
**Artículo 23.** **Micro-interacciones:** Los cambios de estado (guardando, eliminando) deben mostrar obligatoriamente un *spinner* de carga para asegurar retroalimentación visual inmediata.

## 2.7 TÍTULO VII: DEL RENDIMIENTO, DISPONIBILIDAD Y LÍMITES (SLAs)
**Artículo 24.** **Tiempos de Respuesta (SLA):** Ninguna consulta a la base de datos para listados operativos debe superar los **2.0 segundos**. Las búsquedas críticas (búsqueda de sospechosos o vehículos) deben resolver en menos de 800 milisegundos. Consultas pesadas deben usar paginación obligatoria u operaciones asíncronas (ej. Celery).
**Artículo 25.** **Límites de Carga:** El sistema restringirá la subida de archivos adjuntos (fotografías de evidencia, reportes PDF) a un máximo de **50 MB** por archivo, para prevenir la saturación del almacenamiento y ancho de banda.
**Artículo 26.** **Respaldos Automáticos:** Es obligación del sistema ejecutar un respaldo (backup) transaccional en frío hacia la nube (Cold Storage) cada 24 horas a las 03:00 AM UTC.

## 2.8 TÍTULO VIII: DEL MANEJO DE ERRORES Y TELEMETRÍA
**Artículo 27.** **Ocultamiento de Stack Traces:** Bajo ninguna circunstancia el servidor enviará detalles técnicos de errores (stack traces o errores de SQL) al cliente en el entorno de producción. Los errores no controlados deben retornar un mensaje genérico (Ej. "HTTP 500 - Error Interno del Servidor").
**Artículo 28.** **Centralización de Logs:** Todos los errores críticos del backend deben registrarse silenciosamente en un sistema de telemetría externo (ej. Sentry, ELK Stack) incluyendo el ID del usuario afectado, el endpoint y el timestamp para su depuración posterior.

## 2.9 TÍTULO IX: DE LA EVOLUCIÓN Y VERSIONADO DE APIS
**Artículo 29.** **Versionado Estricto:** Todos los endpoints expuestos en el backend deben incluir el número de versión de la API en la URL (ej. `/api/v1/incidentes/`). Esto garantiza que, si se cambia la estructura de la base de datos en el futuro, las aplicaciones móviles de las patrullas no se rompan y dejen de funcionar de imprevisto.


---

# 3. PARTE III: MODELADO DEL SISTEMA (UML)

*Este apartado contiene los espacios reservados para los modelos visuales en UML generados para la arquitectura, base de datos, módulos y despliegue del sistema.*

Este documento contiene los modelos visuales en UML (Unified Modeling Language) generados para la arquitectura, base de datos, módulos y despliegue del sistema. Se utiliza la sintaxis **Mermaid** para su renderizado nativo.

---

## 3.1 Diagrama de Casos de Uso por Paquete

> [!NOTE]
> **[ESPACIO PARA IMAGEN]** Reemplaza este bloque con la imagen de tu diagrama usando la sintaxis: `![Nombre del Diagrama](ruta/a/la/imagen.png)`

*Este diagrama de casos de uso por paquete organiza y separa todos los casos de uso del sistema según sus respectivos módulos operativos, facilitando una visión integral y estructurada de las funcionalidades.*



---

## 3.2 Diagrama de Base de Datos (Entidad-Relación)
Modelo lógico relacional core para el sistema (simplificado para los módulos principales).

> [!NOTE]
> **[ESPACIO PARA IMAGEN]** Reemplaza este bloque con la imagen de tu diagrama usando la sintaxis: `![Nombre del Diagrama](ruta/a/la/imagen.png)`



---


## 3.3 Diagrama de Clases (Dominio)

*Este diagrama de clases ilustra la estructura estática del sistema, mostrando las clases principales (ej. Incidente, Oficial, Evidencia), sus atributos, métodos y las relaciones (asociación, herencia, composición) entre ellas.*

> [!NOTE]
> **[ESPACIO PARA IMAGEN: Insertar aquí el Diagrama de Clases exportado de StarUML o draw.io]**

## 3.4 Diagrama de Componentes
Arquitectura de software desacoplada utilizando Angular para el Frontend y Django para el Backend.

> [!NOTE]
> **[ESPACIO PARA IMAGEN]** Reemplaza este bloque con la imagen de tu diagrama usando la sintaxis: `![Nombre del Diagrama](ruta/a/la/imagen.png)`



---

## 3.5 Diagrama de Despliegue (Deployment)
Arquitectura de infraestructura cloud para alta disponibilidad.

> [!NOTE]
> **[ESPACIO PARA IMAGEN]** Reemplaza este bloque con la imagen de tu diagrama usando la sintaxis: `![Nombre del Diagrama](ruta/a/la/imagen.png)`




---


---

## 3.6 Jerarquía y Trazabilidad de Objetivos (Estratégicos, Tácticos y Operativos)

| Nivel Estratégico (Empresarial) | Nivel Táctico (Objetivo Táctico) | Departamento Policial | Nivel Operativo (Especificación) | Trazabilidad (Caso de Uso) |
| :--- | :--- | :--- | :--- | :--- |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT1 (Táctico): Analizar reportes mensuales de inteligencia y mapas de calor geoespaciales. | Central de Comunicaciones (911) | **OP1:** Registrar información de nuevas emergencias policiales. | **CU-26:** Registrar Llamada de Emergencia |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT1 (Táctico): Analizar reportes mensuales de inteligencia y mapas de calor geoespaciales. | Unidad de Respuesta y Patrullaje | **OP2:** Consultar el historial de incidentes activos y pasados. | **CU-02:** Consultar / Filtrar Incidentes |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT1 (Táctico): Analizar reportes mensuales de inteligencia y mapas de calor geoespaciales. | Unidad de Respuesta y Patrullaje | **OP3:** Actualizar datos y estado de los incidentes en curso. | **CU-01:** Gestionar Incidentes |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT1 (Táctico): Analizar reportes mensuales de inteligencia y mapas de calor geoespaciales. | Unidad de Respuesta y Patrullaje | **OP4:** Anular incidentes inválidos o falsos positivos. | **CU-01:** Gestionar Incidentes |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT6 (Táctico): Monitorear los indicadores de tiempos de respuesta del 911 (SLA). | Central de Comunicaciones (911) | **OP5:** Asignar unidades de patrulla a escenas de crimen. | **CU-27:** Geolocalizar y Despachar Unidad |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT6 (Táctico): Monitorear los indicadores de tiempos de respuesta del 911 (SLA). | Unidad de Respuesta y Patrullaje | **OP6:** Registrar automáticamente los tiempos de respuesta policial. | **CU-03:** Registrar Tiempo de Llegada de Patrullas a Emergencias |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT6 (Táctico): Monitorear los indicadores de tiempos de respuesta del 911 (SLA). | Departamento de Tránsito | **OP44:** Emitir y actualizar infracciones de tránsito e-Citation. | **CU-38:** Gestionar Infracciones de Tránsito |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT6 (Táctico): Monitorear los indicadores de tiempos de respuesta del 911 (SLA). | Departamento de Tránsito | **OP45:** Registrar pruebas de alcoholemia BAC en intervenciones. | **CU-39:** Registrar Prueba de Alcoholemia (BAC) |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT6 (Táctico): Monitorear los indicadores de tiempos de respuesta del 911 (SLA). | Departamento de RRHH y Asuntos Internos | **OP47:** Registrar reuniones y actividades de policía comunitaria. | **CU-41:** Registrar Reunión Comunitaria |
| OE1 (Estratégico): Predecir tendencias de criminalidad a largo plazo mediante modelos de Machine Learning. | OT6 (Táctico): Monitorear los indicadores de tiempos de respuesta del 911 (SLA). | Departamento de Tránsito | **OP54:** Registrar informe de accidente de tránsito. | **CU-44:** Registrar Informe de Accidente de Tránsito |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT2 (Táctico): Visualizar tableros de estadísticas de reincidencia y conexiones criminales. | División de Inteligencia Criminal | **OP7:** Registrar perfiles iniciales de individuos sospechosos. | **CU-14:** Gestionar y Vincular Sospechoso |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT2 (Táctico): Visualizar tableros de estadísticas de reincidencia y conexiones criminales. | División de Inteligencia Criminal | **OP8:** Consultar antecedentes y cruce de datos criminales. | **CU-14:** Gestionar y Vincular Sospechoso |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT2 (Táctico): Visualizar tableros de estadísticas de reincidencia y conexiones criminales. | División de Inteligencia Criminal | **OP9:** Actualizar expedientes con nuevos indicios y vehículos. | **CU-14:** Gestionar y Vincular Sospechoso |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT2 (Táctico): Visualizar tableros de estadísticas de reincidencia y conexiones criminales. | Departamento de Investigaciones (CID) | **OP10:** Vincular arrestos operativos a investigaciones formales. | **CU-09:** Registrar Arresto Relacionado al Expediente |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | División de Inteligencia Criminal | **OP11:** Registrar evidencia física y su cadena de custodia. | **CU-16:** Gestionar Custodia e Inventario |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | División de Inteligencia Criminal | **OP12:** Ejecutar transferencias de custodia de evidencia. | **CU-16:** Gestionar Custodia e Inventario |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | División de Inteligencia Criminal | **OP13:** Registrar testimonios protegidos y notas periciales. | **CU-15:** Registrar Declaración de Testigo |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | Departamento de Investigaciones (CID) | **OP14:** Emitir reportes conclusivos de cierre de investigación. | **CU-10:** Generar Reporte Conclusivo y Cerrar Caso |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT2 (Táctico): Visualizar tableros de estadísticas de reincidencia y conexiones criminales. | Departamento de Investigaciones (CID) | **OP15:** Abrir expediente de investigación y asignar detective. | **CU-07:** Abrir Expediente de Investigación y Asignar Detective |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT2 (Táctico): Visualizar tableros de estadísticas de reincidencia y conexiones criminales. | Departamento de Investigaciones (CID) | **OP16:** Reabrir caso cerrado por nueva evidencia. | **CU-11:** Reabrir Caso Cerrado por Nueva Evidencia |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | División de Inteligencia Criminal | **OP17:** Crear alerta BOLO (Be On The Lookout). | **CU-17:** Gestionar Alertas BOLO (Be On The Lookout) |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | División de Inteligencia Criminal | **OP18:** Consultar alertas BOLO activas. | **CU-17:** Gestionar Alertas BOLO (Be On The Lookout) |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | Departamento de Investigaciones (CID) | **OP19:** Registrar reporte de persona desaparecida. | **CU-12:** Gestionar Búsqueda de Personas Desaparecidas |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | Departamento de Investigaciones (CID) | **OP20:** Actualizar estado de persona desaparecida. | **CU-12:** Gestionar Búsqueda de Personas Desaparecidas |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | División de Inteligencia Criminal | **OP48:** Registrar inventario de pertenencias de detenidos en separos. | **CU-42:** Gestionar Celdas y Detenidos |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | División de Inteligencia Criminal | **OP49:** Registrar bitácora de rondas y visitas médicas en celdas. | **CU-42:** Gestionar Celdas y Detenidos |
| OE2 (Estratégico): Desmantelar organizaciones criminales utilizando algoritmos de grafos y detección de anomalías. | OT7 (Táctico): Generar reportes de inteligencia procesando testimonios e incautaciones. | División de Inteligencia Criminal | **OP50:** Procesar liberación, fianza o traslado de detenido. | **CU-42:** Gestionar Celdas y Detenidos |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT8 (Táctico): Planificar el mantenimiento preventivo rotativo de la flota vehicular. | Departamento de Logística y Flota | **OP21:** Registrar la salida y retorno (Check-in/Out) de patrullas. | **CU-18:** Gestionar Check-in y Check-out de Patrullas |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT3 (Táctico): Extraer reportes semestrales sobre uso de fuerza y desgaste de equipamiento. | Departamento de Logística y Flota | **OP22:** Asignar equipo táctico y radios a los oficiales. | **CU-19:** Gestionar Asignación y Devolución de Equipo Táctico |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT8 (Táctico): Planificar el mantenimiento preventivo rotativo de la flota vehicular. | Departamento de Logística y Flota | **OP23:** Consultar inventario global de la flota vehicular. | **CU-20:** Consultar Inventario de Flota y Equipamiento |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT8 (Táctico): Planificar el mantenimiento preventivo rotativo de la flota vehicular. | Departamento de Logística y Flota | **OP24:** Registrar tickets de reparaciones mecánicas de patrullas. | **CU-21:** Gestionar Tickets de Fallas Mecánicas |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT3 (Táctico): Extraer reportes semestrales sobre uso de fuerza y desgaste de equipamiento. | Departamento de Logística y Flota | **OP25:** Registrar y documentar el uso de fuerza letal o no letal. | **CU-22:** Registrar Uso de Fuerza |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT3 (Táctico): Extraer reportes semestrales sobre uso de fuerza y desgaste de equipamiento. | Departamento de Logística y Flota | **OP26:** Registrar devolución de equipo táctico al final de turno. | **CU-19:** Gestionar Asignación y Devolución de Equipo Táctico |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT8 (Táctico): Planificar el mantenimiento preventivo rotativo de la flota vehicular. | Departamento de Logística y Flota | **OP27:** Dar de baja vehículos o equipos del inventario. | **CU-23:** Dar de Baja Vehículo o Equipo del Inventario |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT3 (Táctico): Extraer reportes semestrales sobre uso de fuerza y desgaste de equipamiento. | Departamento de Logística y Flota | **OP28:** Registrar persecución vehicular y revisión post-evento. | **CU-24:** Registrar Persecución Vehicular y Revisión Post-Evento |
| OE3 (Estratégico): Minimizar el gasto público mediante el mantenimiento predictivo (IA) sobre la flota vehicular. | OT8 (Táctico): Planificar el mantenimiento preventivo rotativo de la flota vehicular. | Departamento de Tránsito | **OP46:** Coordinar despacho de grúas y custodia de vehículos. | **CU-40:** Coordinar Despacho de Grúa |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT4 (Táctico): Visualizar reportes de ausentismo y cobertura de cuadrantes. | Departamento de RRHH y Asuntos Internos | **OP29:** Registrar asistencia y turnos del personal en estación. | **CU-30:** Gestionar Asistencia de Personal |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT4 (Táctico): Visualizar reportes de ausentismo y cobertura de cuadrantes. | Departamento de RRHH y Asuntos Internos | **OP30:** Generar reportes de horas trabajadas y overtime. | **CU-30:** Gestionar Asistencia de Personal |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT4 (Táctico): Visualizar reportes de ausentismo y cobertura de cuadrantes. | Departamento de Logística y Flota | **OP31:** Asignar cobertura de cuadrantes de patrullaje en el mapa. | **CU-31:** Asignar / Modificar Cuadrantes de Patrullaje |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT9 (Táctico): Gestionar permisos, capacitación y disciplina del personal. | Departamento de RRHH y Asuntos Internos | **OP32:** Procesar solicitudes y aprobaciones de permisos del personal. | **CU-32:** Gestionar Solicitudes de Permisos de Ausencia |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT4 (Táctico): Visualizar reportes de ausentismo y cobertura de cuadrantes. | Departamento de RRHH y Asuntos Internos | **OP33:** Registrar briefing de turno (Roll Call). | **CU-33:** Registrar Briefing de Turno (Roll Call) |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT4 (Táctico): Visualizar reportes de ausentismo y cobertura de cuadrantes. | Departamento de RRHH y Asuntos Internos | **OP34:** Registrar traspaso de turno entre oficiales. | **CU-34:** Registrar Traspaso de Turno |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT9 (Táctico): Gestionar permisos, capacitación y disciplina del personal. | Departamento de RRHH y Asuntos Internos | **OP35:** Registrar capacitación y certificación de oficial. | **CU-35:** Gestionar Capacitaciones y Certificaciones |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT9 (Táctico): Gestionar permisos, capacitación y disciplina del personal. | Departamento de RRHH y Asuntos Internos | **OP36:** Consultar vencimiento de certificaciones. | **CU-35:** Gestionar Capacitaciones y Certificaciones |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT9 (Táctico): Gestionar permisos, capacitación y disciplina del personal. | Departamento de RRHH y Asuntos Internos | **OP37:** Registrar queja ciudadana contra oficial. | **CU-36:** Registrar Queja Ciudadana contra Oficial |
| OE4 (Estratégico): Optimizar la fuerza laboral policial y predecir el desgaste del personal (burnout) mediante IA. | OT9 (Táctico): Gestionar permisos, capacitación y disciplina del personal. | Departamento de RRHH y Asuntos Internos | **OP38:** Consultar perfil y hoja de vida del oficial. | **CU-37:** Consultar Perfil y Hoja de Vida del Oficial |
| OE5 (Estratégico): Garantizar la admisibilidad legal de toda la evidencia en cortes penales. | OT5 (Táctico): Auditar los tableros de logs de accesos del sistema. | Departamento de TI y Ciberseguridad | **OP39:** Registrar accesos e inicios de sesión de usuarios. | **CU-45:** Iniciar / Cerrar Sesión |
| OE5 (Estratégico): Garantizar la admisibilidad legal de toda la evidencia en cortes penales. | OT5 (Táctico): Auditar los tableros de logs de accesos del sistema. | Departamento de TI y Ciberseguridad | **OP40:** Crear usuarios y asignar roles de acceso. | **CU-46:** Gestionar Usuarios y Roles (RBAC) |
| OE5 (Estratégico): Garantizar la admisibilidad legal de toda la evidencia en cortes penales. | OT5 (Táctico): Auditar los tableros de logs de accesos del sistema. | Departamento de TI y Ciberseguridad | **OP41:** Consultar bitácora de auditoría de seguridad del sistema. | **CU-47:** Consultar Bitácora de Auditoría |
| OE5 (Estratégico): Garantizar la admisibilidad legal de toda la evidencia en cortes penales. | OT10 (Táctico): Revisar auditorías de Cadena de Custodia Digital, respaldos y órdenes judiciales. | Departamento de TI y Ciberseguridad | **OP42:** Ejecutar respaldos cifrados de la base de datos. | **CU-48:** Ejecutar Respaldo de Base de Datos |
| OE5 (Estratégico): Garantizar la admisibilidad legal de toda la evidencia en cortes penales. | OT5 (Táctico): Auditar los tableros de logs de accesos del sistema. | Departamento de TI y Ciberseguridad | **OP43:** Recuperar o restablecer contraseña de usuario. | **CU-49:** Recuperar o Restablecer Contraseña de Usuario |
| OE5 (Estratégico): Garantizar la admisibilidad legal de toda la evidencia en cortes penales. | OT10 (Táctico): Revisar auditorías de Cadena de Custodia Digital, respaldos y órdenes judiciales. | División de Investigaciones Criminales | **OP51:** Registrar orden judicial (warrant). | **CU-43:** Gestionar Órdenes Judiciales (Warrants) |
| OE5 (Estratégico): Garantizar la admisibilidad legal de toda la evidencia en cortes penales. | OT10 (Táctico): Revisar auditorías de Cadena de Custodia Digital, respaldos y órdenes judiciales. | División de Investigaciones Criminales | **OP52:** Consultar y verificar órdenes judiciales activas. | **CU-43:** Gestionar Órdenes Judiciales (Warrants) |
| OE5 (Estratégico): Garantizar la admisibilidad legal de toda la evidencia en cortes penales. | OT10 (Táctico): Revisar auditorías de Cadena de Custodia Digital, respaldos y órdenes judiciales. | División de Investigaciones Criminales | **OP53:** Registrar ejecución de orden judicial. | **CU-43:** Gestionar Órdenes Judiciales (Warrants) |



## 3.7 Especificación de Requisitos de Software (SRS)

*Esta sección detalla los Requisitos Funcionales (acciones que el sistema debe realizar) y No Funcionales (atributos de calidad y restricciones), asegurando cobertura completa y trazabilidad con los módulos.* 

### 3.7.1 Requisitos Funcionales (RF)

| ID | Descripción del Requisito Funcional | Módulo Asociado | Trazabilidad | Ruta en Repositorio (BDD) |
| :--- | :--- | :--- | :--- | :--- |
| **RF-INC-01** | El sistema debe permitir a los usuarios autorizados gestionar incidentes. | Unidad de Operaciones de Campo | **CU-01** | `/specs/operativo/incidentes/incidentes-spec.md` |
| **RF-INC-02** | El sistema debe permitir a los usuarios autorizados consultar / filtrar incidentes. | Unidad de Operaciones de Campo | **CU-02** | `/specs/operativo/incidentes/incidentes-spec.md` |
| **RF-INC-03** | El sistema debe permitir a los usuarios autorizados registrar tiempo de llegada de patrullas a emergencias. | Unidad de Operaciones de Campo | **CU-03** | `/specs/operativo/incidentes/incidentes-spec.md` |
| **RF-GEO-04** | El sistema debe permitir a los usuarios autorizados visualizar mapa de calor táctico (heatmap). | Inteligencia Geográfica y Mapas Tácticos | **CU-04** | `/specs/operativo/mapas/mapas-spec.md` |
| **RF-GEO-05** | El sistema debe permitir a los usuarios autorizados filtrar crímenes por calle / zona. | Inteligencia Geográfica y Mapas Tácticos | **CU-05** | `/specs/operativo/mapas/mapas-spec.md` |
| **RF-GEO-06** | El sistema debe permitir a los usuarios autorizados alternar capas del mapa. | Inteligencia Geográfica y Mapas Tácticos | **CU-06** | `/specs/operativo/mapas/mapas-spec.md` |
| **RF-INV-07** | El sistema debe permitir a los usuarios autorizados abrir expediente de investigación y asignar detective. | División de Investigaciones Criminales | **CU-07** | `/specs/operativo/investigacion/investigacion-spec.md` |
| **RF-INV-08** | El sistema debe permitir a los usuarios autorizados consultar 'mis casos' / bandeja del detective. | División de Investigaciones Criminales | **CU-08** | `/specs/operativo/investigacion/investigacion-spec.md` |
| **RF-INV-09** | El sistema debe permitir a los usuarios autorizados registrar arresto relacionado al expediente. | División de Investigaciones Criminales | **CU-09** | `/specs/operativo/investigacion/investigacion-spec.md` |
| **RF-INV-10** | El sistema debe permitir a los usuarios autorizados generar reporte conclusivo y cerrar caso. | División de Investigaciones Criminales | **CU-10** | `/specs/operativo/investigacion/investigacion-spec.md` |
| **RF-INV-11** | El sistema debe permitir a los usuarios autorizados reabrir caso cerrado por nueva evidencia. | División de Investigaciones Criminales | **CU-11** | `/specs/operativo/investigacion/investigacion-spec.md` |
| **RF-INV-12** | El sistema debe permitir a los usuarios autorizados gestionar búsqueda de personas desaparecidas. | División de Investigaciones Criminales | **CU-12** | `/specs/operativo/investigacion/investigacion-spec.md` |
| **RF-INT-13** | El sistema debe permitir a los usuarios autorizados gestionar catálogo de bandas. | Departamento de Inteligencia y Análisis Criminal | **CU-13** | `/specs/operativo/inteligencia/inteligencia-spec.md` |
| **RF-INT-14** | El sistema debe permitir a los usuarios autorizados gestionar y vincular sospechoso. | Departamento de Inteligencia y Análisis Criminal | **CU-14** | `/specs/operativo/inteligencia/inteligencia-spec.md` |
| **RF-INT-15** | El sistema debe permitir a los usuarios autorizados registrar declaración de testigo. | Departamento de Inteligencia y Análisis Criminal | **CU-15** | `/specs/operativo/inteligencia/inteligencia-spec.md` |
| **RF-INT-16** | El sistema debe permitir a los usuarios autorizados gestionar custodia e inventario. | Departamento de Inteligencia y Análisis Criminal | **CU-16** | `/specs/operativo/inteligencia/inteligencia-spec.md` |
| **RF-INT-17** | El sistema debe permitir a los usuarios autorizados gestionar alertas bolo (be on the lookout). | Departamento de Inteligencia y Análisis Criminal | **CU-17** | `/specs/operativo/inteligencia/inteligencia-spec.md` |
| **RF-LOG-18** | El sistema debe permitir a los usuarios autorizados gestionar check-in y check-out de patrullas. | Departamento de Logística Operativa y Flota | **CU-18** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-LOG-19** | El sistema debe permitir a los usuarios autorizados gestionar asignación y devolución de equipo táctico. | Departamento de Logística Operativa y Flota | **CU-19** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-LOG-20** | El sistema debe permitir a los usuarios autorizados consultar inventario de flota y equipamiento. | Departamento de Logística Operativa y Flota | **CU-20** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-LOG-21** | El sistema debe permitir a los usuarios autorizados gestionar tickets de fallas mecánicas. | Departamento de Logística Operativa y Flota | **CU-21** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-LOG-22** | El sistema debe permitir a los usuarios autorizados registrar uso de fuerza. | Departamento de Logística Operativa y Flota | **CU-22** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-LOG-23** | El sistema debe permitir a los usuarios autorizados dar de baja vehículo o equipo del inventario. | Departamento de Logística Operativa y Flota | **CU-23** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-LOG-24** | El sistema debe permitir a los usuarios autorizados registrar persecución vehicular y revisión post-evento. | Departamento de Logística Operativa y Flota | **CU-24** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-LOG-25** | El sistema debe permitir a los usuarios autorizados trazar ruta táctico-logística. | Departamento de Logística Operativa y Flota | **CU-25** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-911-26** | El sistema debe permitir a los usuarios autorizados registrar llamada de emergencia. | Despacho y Gestión de Emergencias | **CU-26** | `/specs/operativo/despacho/despacho-spec.md` |
| **RF-911-27** | El sistema debe permitir a los usuarios autorizados geolocalizar y despachar unidad. | Despacho y Gestión de Emergencias | **CU-27** | `/specs/operativo/despacho/despacho-spec.md` |
| **RF-911-28** | El sistema debe permitir a los usuarios autorizados monitorear tiempos de respuesta. | Despacho y Gestión de Emergencias | **CU-28** | `/specs/operativo/despacho/despacho-spec.md` |
| **RF-911-29** | El sistema debe permitir a los usuarios autorizados clasificar nivel de triage (prioridad 911). | Despacho y Gestión de Emergencias | **CU-29** | `/specs/operativo/despacho/despacho-spec.md` |
| **RF-RRHH-30** | El sistema debe permitir a los usuarios autorizados gestionar asistencia de personal. | Departamento de Gestión de Talento y Asuntos Internos | **CU-30** | `/specs/operativo/rrhh/rrhh-spec.md` |
| **RF-LOG-31** | El sistema debe permitir a los usuarios autorizados asignar / modificar cuadrantes de patrullaje. | Departamento de Logística Operativa y Flota | **CU-31** | `/specs/operativo/logistica/logistica-spec.md` |
| **RF-RRHH-32** | El sistema debe permitir a los usuarios autorizados gestionar solicitudes de permisos de ausencia. | Departamento de Gestión de Talento y Asuntos Internos | **CU-32** | `/specs/operativo/rrhh/rrhh-spec.md` |
| **RF-RRHH-33** | El sistema debe permitir a los usuarios autorizados registrar briefing de turno (roll call). | Departamento de Gestión de Talento y Asuntos Internos | **CU-33** | `/specs/operativo/rrhh/rrhh-spec.md` |
| **RF-RRHH-34** | El sistema debe permitir a los usuarios autorizados registrar traspaso de turno. | Departamento de Gestión de Talento y Asuntos Internos | **CU-34** | `/specs/operativo/rrhh/rrhh-spec.md` |
| **RF-RRHH-35** | El sistema debe permitir a los usuarios autorizados gestionar capacitaciones y certificaciones. | Departamento de Gestión de Talento y Asuntos Internos | **CU-35** | `/specs/operativo/rrhh/rrhh-spec.md` |
| **RF-RRHH-36** | El sistema debe permitir a los usuarios autorizados registrar queja ciudadana contra oficial. | Departamento de Gestión de Talento y Asuntos Internos | **CU-36** | `/specs/operativo/rrhh/rrhh-spec.md` |
| **RF-RRHH-37** | El sistema debe permitir a los usuarios autorizados consultar perfil y hoja de vida del oficial. | Departamento de Gestión de Talento y Asuntos Internos | **CU-37** | `/specs/operativo/rrhh/rrhh-spec.md` |
| **RF-TRA-38** | El sistema debe permitir a los usuarios autorizados gestionar infracciones de tránsito. | Unidad de Tránsito y Seguridad Vial | **CU-38** | `/specs/operativo/transito/transito-spec.md` |
| **RF-TRA-39** | El sistema debe permitir a los usuarios autorizados registrar prueba de alcoholemia (bac). | Unidad de Tránsito y Seguridad Vial | **CU-39** | `/specs/operativo/transito/transito-spec.md` |
| **RF-TRA-40** | El sistema debe permitir a los usuarios autorizados coordinar despacho de grúa. | Unidad de Tránsito y Seguridad Vial | **CU-40** | `/specs/operativo/transito/transito-spec.md` |
| **RF-RRHH-41** | El sistema debe permitir a los usuarios autorizados registrar reunión comunitaria. | Departamento de Gestión de Talento y Asuntos Internos | **CU-41** | `/specs/operativo/rrhh/rrhh-spec.md` |
| **RF-INT-42** | El sistema debe permitir a los usuarios autorizados gestionar celdas y detenidos. | Departamento de Inteligencia y Análisis Criminal | **CU-42** | `/specs/operativo/inteligencia/inteligencia-spec.md` |
| **RF-INV-43** | El sistema debe permitir a los usuarios autorizados gestionar órdenes judiciales (warrants). | División de Investigaciones Criminales | **CU-43** | `/specs/operativo/investigacion/investigacion-spec.md` |
| **RF-TRA-44** | El sistema debe permitir a los usuarios autorizados registrar informe de accidente de tránsito. | Unidad de Tránsito y Seguridad Vial | **CU-44** | `/specs/operativo/transito/transito-spec.md` |
| **RF-SEG-45** | El sistema debe permitir a los usuarios autorizados iniciar / cerrar sesión. | Departamento de Tecnología y Ciberseguridad | **CU-45** | `/specs/operativo/seguridad/seguridad-spec.md` |
| **RF-SEG-46** | El sistema debe permitir a los usuarios autorizados gestionar usuarios y roles (rbac). | Departamento de Tecnología y Ciberseguridad | **CU-46** | `/specs/operativo/seguridad/seguridad-spec.md` |
| **RF-SEG-47** | El sistema debe permitir a los usuarios autorizados consultar bitácora de auditoría. | Departamento de Tecnología y Ciberseguridad | **CU-47** | `/specs/operativo/seguridad/seguridad-spec.md` |
| **RF-SEG-48** | El sistema debe permitir a los usuarios autorizados ejecutar respaldo de base de datos. | Departamento de Tecnología y Ciberseguridad | **CU-48** | `/specs/operativo/seguridad/seguridad-spec.md` |
| **RF-SEG-49** | El sistema debe permitir a los usuarios autorizados recuperar o restablecer contraseña de usuario. | Departamento de Tecnología y Ciberseguridad | **CU-49** | `/specs/operativo/seguridad/seguridad-spec.md` |
| **RF-ANA-50** | El sistema debe permitir a los usuarios autorizados generar reportes estadísticos mensuales y anuales. | Laboratorio de Análisis Predictivo e IA | **CU-50** | `/specs/operativo/analitica/analitica-spec.md` |
| **RF-ANA-51** | El sistema debe permitir a los usuarios autorizados realizar análisis predictivo y pronóstico de puntos calientes. | Laboratorio de Análisis Predictivo e IA | **CU-51** | `/specs/operativo/analitica/analitica-spec.md` |
| **RF-ANA-52** | El sistema debe permitir a los usuarios autorizados ejecutar análisis de vínculos criminales en forma de red. | Laboratorio de Análisis Predictivo e IA | **CU-52** | `/specs/operativo/analitica/analitica-spec.md` |

### 3.7.2 Requisitos No Funcionales (RNF)

| ID | Categoría | Descripción del Requisito No Funcional | Módulo Asociado |
| :--- | :--- | :--- | :--- |
| **RNF-GEN-01** | Rendimiento | El sistema debe procesar y renderizar el mapa de calor criminal (10k+ incidentes) en menos de 2.0 segundos. | Analítica Avanzada / Mapas |
| **RNF-GEN-02** | Rendimiento | Las búsquedas de antecedentes y cruce de datos en la base de datos deben resolverse en menos de 800 milisegundos. | Investigación / Hub de Inteligencia |
| **RNF-GEN-03** | Disponibilidad | La plataforma debe garantizar una disponibilidad continua (Uptime) del 99.99% anual, dado su carácter de misión crítica. | Global (Todo el Sistema) |
| **RNF-GEN-04** | Seguridad | Las contraseñas de todos los oficiales deben almacenarse utilizando el algoritmo de hashing Bcrypt o Argon2. | Administración y Seguridad |
| **RNF-GEN-05** | Seguridad | Toda conexión cliente-servidor debe estar cifrada bajo el protocolo TLS 1.3 (HTTPS). | Global (Todo el Sistema) |
| **RNF-GEN-06** | Seguridad (PII) | Los datos sensibles, como nombres de testigos protegidos, deben ser cifrados en la base de datos a nivel de columna (AES-256). | Investigación Especial |
| **RNF-GEN-07** | Auditoría | El sistema no debe permitir el borrado físico (Hard Delete) de registros transaccionales; solo se permite borrado lógico (Soft Delete). | Global (Todo el Sistema) |
| **RNF-GEN-08** | Usabilidad | La interfaz de usuario debe estar diseñada en 'Modo Oscuro' nativo para reducir la fatiga visual de los despachadores. | Global (UI/UX) |
| **RNF-GEN-09** | Usabilidad | Los botones de acción crítica en dispositivos móviles deben tener un área táctil mínima de 48x48 píxeles. | Logística / RRHH (Mobile) |
| **RNF-GEN-10** | Interoperabilidad | El sistema debe exponer sus funcionalidades a través de una API RESTful documentada (Swagger/OpenAPI). | Global (Todo el Sistema) |
| **RNF-GEN-11** | Capacidad | El sistema debe restringir la carga de archivos adjuntos (fotografías, reportes) a un tamaño máximo de 50 MB por archivo. | Investigación Especial / Hub |
| **RNF-GEN-12** | Resiliencia | El sistema debe ejecutar automáticamente respaldos (backups) incrementales de la base de datos cada 24 horas a las 03:00 AM UTC. | Administración y Seguridad |


# 4. PARTE IV: ESPECIFICACIONES TÉCNICAS DETALLADAS (BDD)

> [!NOTE]
> **Nota de Ingeniería Técnica:** Esta PARTE IV contiene la especificación técnica profunda (Escenarios BDD, Entradas/Salidas y flujos alternos) de cada módulo para el equipo de desarrollo. Si desea consultar el **Resumen Ejecutivo** de los 52 casos de uso con sus respectivas Historias de Usuario y matrices de QA, diríjase a la **PARTE V** al final de este documento.

*Esta sección contiene el detalle exhaustivo a nivel de desarrollo para los Casos de Uso operativos clave, incluyendo reglas de negocio, escenarios BDD (Dado que / Cuando / Entonces) y criterios de aceptación técnicos.*

## 4.1 Módulo Operativo Incidentes

### Especificación: Registrar Ubicación GPS del Incidente
### 1. Objetivo
Capturar automáticamente las coordenadas exactas donde ocurre un incidente.

### 2. Contexto
Los despachos de patrullas fallan a menudo porque la dirección provista por la víctima es inexacta. Con el GPS del dispositivo del oficial se logra precisión absoluta.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe leer el sensor GPS del dispositivo móvil. |
| **RF-002** | El sistema debe guardar la latitud y longitud en formato decimal. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La captura debe tomar menos de 2 segundos. |
| **RNF-002** | Debe funcionar incluso si hay baja cobertura de red (offline mode). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Las coordenadas no pueden editarse manualmente para evitar fraude. |
| **RN-002** | Si el margen de error del GPS es mayor a 50 metros, debe alertar al usuario. |

### 7. Entradas
- Señal satelital GPS del dispositivo.

### 8. Salidas
- Latitud y longitud registradas en la base de datos.
- Marcador visual en el mapa táctico.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el dispositivo tiene los servicios de ubicación activados | Cuando el oficial presiona 'Crear Incidente' | Entonces el sistema debe guardar la ubicación y mostrarla en pantalla |
| **Caso de Error** | Dado que el dispositivo tiene el GPS desactivado | Cuando el oficial presiona 'Crear Incidente' | Entonces el sistema debe mostrar el mensaje 'Habilite el GPS para continuar' y detener el proceso |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | El sistema extrae latitud y longitud correctas. |
| **CA-002** | El sistema bloquea el guardado si no hay lectura válida. |

### 11. Restricciones
- Depende de la calidad de hardware del dispositivo móvil.

### 12. Fuera de alcance
- Navegación paso a paso hacia el incidente.

---

### Especificación: Clasificar Tipo Penal (Catálogo IUCR)
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
| **RF-001** | El sistema debe proveer una lista desplegable con códigos IUCR. |
| **RF-002** | El sistema debe permitir búsqueda predictiva del delito. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La búsqueda predictiva debe reaccionar en menos de 500ms. |
| **RNF-002** | El catálogo debe estar cacheado localmente. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Todo incidente debe tener obligatoriamente un código penal asociado. |
| **RN-002** | Solo el administrador puede modificar los códigos del catálogo. |

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
| **CA-001** | El buscador autocompleta con resultados válidos. |
| **CA-002** | Impide avanzar sin código. |

### 11. Restricciones
- La base de datos IUCR debe estar actualizada anualmente.

### 12. Fuera de alcance
- Sugerencia de penas carcelarias para el delito.

---

### Especificación: Despachar Unidad y Trazar Ruta
### 1. Objetivo
Asignar la patrulla más cercana al incidente y mostrar el tiempo estimado de llegada.

### 2. Contexto
La asignación manual de patrullas depende de la intuición del despachador, generando retrasos críticos en emergencias.

### 3. Usuarios o actores
- Operador de Emergencias

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe calcular la distancia entre patrullas disponibles y el incidente. |
| **RF-002** | El sistema debe permitir al Operador confirmar el despacho. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | El cálculo de distancia debe ser en tiempo real usando algoritmos geoespaciales. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Solo se pueden despachar unidades cuyo estado sea 'Disponible'. |
| **RN-002** | Si se rechaza el despacho, salta a la siguiente patrulla más cercana. |

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
| **CA-001** | Muestra siempre la patrulla activa más cercana. |
| **CA-002** | Cambia estado a 'En camino' exitosamente. |

### 11. Restricciones
- Depende de la API de Google Maps o Mapbox.

### 12. Fuera de alcance
- Control remoto de las sirenas del vehículo.

---

### Especificación: Registrar Tiempo de Llegada de Patrullas a Emergencias
### 1. Objetivo
Medir y auditar los tiempos exactos desde la llamada hasta la llegada a la escena.

### 2. Contexto
Las métricas de respuesta son manipuladas manualmente por los oficiales para evitar sanciones. Se necesita registro inmutable.

### 3. Usuarios o actores
- Sistema (Automático)

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe registrar timestamp de Despacho. |
| **RF-002** | El sistema debe registrar timestamp de Llegada cuando el GPS de la patrulla coincida con la escena. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Los timestamps deben usar el reloj del servidor (UTC) y no del móvil. |
| **RNF-002** | Inmutabilidad estricta a nivel base de datos. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | La hora de llegada nunca puede ser menor a la hora de despacho. |
| **RN-002** | El tiempo de respuesta = Hora Llegada - Hora Despacho. |

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
| **CA-001** | Registro de tiempos 100% automático basado en geocercas. |
| **CA-002** | Uso exclusivo de reloj de servidor. |

### 11. Restricciones
- Las geocercas pueden variar según edificios altos.

### 12. Fuera de alcance
- Justificación manual de retrasos por tráfico.

---

### Especificación: Ingresar Número de Víctimas
### 1. Objetivo
Registrar cuantitativamente el impacto civil y policial del incidente.

### 2. Contexto
Para solicitar ambulancias adicionales y para estadísticas criminalísticas, es crítico contabilizar heridos y fallecidos.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe proporcionar campos numéricos para víctimas. |
| **RF-002** | Clasificar en heridos y fallecidos (civiles/policías). |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | El campo numérico debe impedir caracteres alfabéticos. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | No se permiten números negativos. |
| **RN-002** | Si hay víctimas, debe activarse el flag de 'Notificar Paramédicos'. |

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
| **CA-001** | Permite guardar valores >= 0. |
| **CA-002** | Dispara alerta EMS al haber heridos. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Triaje médico de las víctimas.

---

### Especificación: Detallar Uso o Detonación de Armas
### 1. Objetivo
Auditar legalmente si el incidente involucró el uso de fuerza letal.

### 2. Contexto
El uso de armas de fuego desencadena investigaciones de Asuntos Internos inmediatas.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe incluir un toggle 'Uso de Arma'. |
| **RF-002** | Si es 'Sí', desplegar campo para 'Cantidad de detonaciones'. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Accesibilidad táctil rápida (Botones grandes). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Si se marca 'Sí', es obligatorio ingresar la cantidad de disparos. |
| **RN-002** | Se bloquea el cierre rápido del incidente obligando a crear un Caso Mayor. |

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
| **CA-001** | Toggle activa sub-campos correctamente. |
| **CA-002** | Alerta generada automáticamente. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Descuento automático de munición del inventario (eso es módulo Logística).

---

### Especificación: Adjuntar Fotografías de Evidencia
### 1. Objetivo
Preservar el estado inicial de la escena antes de su contaminación.

### 2. Contexto
Las fotos forenses suelen perderse o manipularse en redes sociales. Se requiere una vía cifrada directa.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe abrir la cámara nativa dentro de la app. |
| **RF-002** | El sistema debe subir la imagen comprimida y borrarla del carrete local. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Peso máximo de imagen 2MB. |
| **RNF-002** | Compresión sin pérdida perceptible (JPEG 85%). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Las imágenes subidas no pueden ser borradas por el oficial. |
| **RN-002** | Toda foto debe estamparse con fecha, hora y GPS (Marca de agua). |

### 7. Entradas
- Captura de la cámara.

### 8. Salidas
- Archivo de imagen cifrado en Azure Blob Storage.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el oficial toma una foto de la evidencia | Cuando acepta la previsualización | Entonces el sistema comprime, sube, sella y limpia el carrete |
| **Caso de Error** | Dado que el oficial intenta subir una foto de 15MB de su galería | Cuando selecciona el archivo | Entonces el sistema la comprime automáticamente antes de subirla o la rechaza si no es formato válido |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Foto sellada con metadatos. |
| **CA-002** | Foto no queda en galería pública del teléfono. |

### 11. Restricciones
- Depende de los permisos de SO (iOS/Android) sobre la cámara.

### 12. Fuera de alcance
- Reconocimiento de objetos por IA en la foto.

---

### Especificación: Registrar Estado Climático
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
| **RF-001** | El sistema debe consultar API externa según las coordenadas GPS. |
| **RF-002** | El sistema debe permitir corrección manual si el clima cambia drásticamente. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La consulta a la API de clima debe durar menos de 1 segundo. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | El clima se registra una sola vez al inicio del incidente. |

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
| **CA-001** | Autocompletado vía API exitoso. |
| **CA-002** | Fallback manual funciona en caso de error API. |

### 11. Restricciones
- Depende de la disponibilidad de la API Meteorológica.

### 12. Fuera de alcance
- Pronóstico del clima a futuro.

---

### Especificación: Clasificar Nivel de Gravedad (Triage 911)
### 1. Objetivo
Priorizar la atención y despacho de emergencias en base a su nivel de criticidad.

### 2. Contexto
Cuando entran 10 llamadas simultáneas, el operador necesita saber cuál enviar primero para salvar vidas.

### 3. Usuarios o actores
- Operador de Emergencias

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe obligar a seleccionar un nivel de 1 (Leve) a 5 (Crítico). |
| **RF-002** | El sistema ordenará la cola de incidentes según este nivel. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Interfaz con código de colores (Rojo para 5, Verde para 1). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Triage 5 salta toda la cola de espera de despacho. |
| **RN-002** | Incidentes de Triage 5 notifican al Sheriff de Turno de inmediato. |

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
| **CA-001** | Ordenamiento de cola respetando el nivel mayor primero. |
| **CA-002** | Notificación al Sheriff operativa para nivel 5. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Evaluación psicológica del denunciante telefónico.

---



## 4.2 Módulo Operativo Inteligencia y Detectives

### Especificación: Ingresar Alias del Sospechoso
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

### Especificación: Describir Tatuajes y Señas
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

### Especificación: Registrar Placas de Vehículos
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

### Especificación: Testimonio Confidencial
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

### Especificación: Subir Audios de Interrogatorios
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

### Especificación: Relacionar Arresto
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

### Especificación: Custodia de Evidencia
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

### Especificación: Ingresar Notas Periciales
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

### Especificación: Reporte Conclusivo y Cerrar Caso
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



## 4.3 Módulo Operativo Logística y Flota

### Especificación: Registrar Kilometraje
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

### Especificación: Reportar Daños en Carrocería
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

### Especificación: Informar Nivel de Combustible
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

### Especificación: Registrar Entrega de Radio
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

### Especificación: Escanear Bodycam
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

### Especificación: Reportar Munición Asignada
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

### Especificación: Ticket de Falla Mecánica
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

### Especificación: Registrar Descarga de Taser
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

### Especificación: Informar Presión Neumáticos
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



## 4.4 Módulo Operativo Recursos Humanos

### Especificación: Registrar Clock-in / Clock-out
### 1. Objetivo
Llevar un control exacto y auditable de las horas trabajadas por los oficiales.

### 2. Contexto
El fraude en horas extras es común cuando los oficiales reportan sus turnos en hojas de papel al finalizar el día.

### 3. Usuarios o actores
- Oficial de Patrulla

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | Permitir hacer Clock-in con un botón en la app. |
| **RF-002** | Capturar automáticamente la hora del servidor (UTC) y la geolocalización de la estación al presionar. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La interfaz debe impedir el doble toque del botón (Debounce). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | No se permite hacer Clock-in si ya hay un turno activo. |
| **RN-002** | El Clock-out exige estar en el perímetro de la estación (Geocerca) o solicitar anulación por emergencia. |

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
| **CA-001** | Uso exclusivo de hora de servidor, ignora reloj del teléfono. |
| **CA-002** | Valida geocerca de la estación policial. |

### 11. Restricciones
- Depende de la conexión al servidor NTP para la hora.

### 12. Fuera de alcance
- Cálculo del pago monetario por las horas extra.

---

### Especificación: Asignar Oficial a Cuadrante
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
| **RF-001** | Mostrar un mapa interactivo con los cuadrantes de la ciudad. |
| **RF-002** | Permitir arrastrar y soltar (Drag and Drop) el perfil del oficial sobre un cuadrante libre. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | El mapa debe actualizar la asignación en tiempo real (menos de 2 seg). |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Un cuadrante de alto riesgo requiere mínimo 2 patrulleros asignados. |
| **RN-002** | Un oficial no puede ser asignado a dos cuadrantes al mismo tiempo en el mismo turno. |

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
| **CA-001** | Funcionalidad Drag and Drop sin errores lógicos. |
| **CA-002** | Impide duplicidad de asignaciones en un mismo turno temporal. |

### 11. Restricciones
- Definición previa de los polígonos de los cuadrantes en BD.

### 12. Fuera de alcance
- Redibujo automático de cuadrantes según tráfico.

---

### Especificación: Ingresar Solicitud de Permisos
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
| **RF-001** | El oficial debe poder seleccionar fechas en un calendario. |
| **RF-002** | El Sheriff debe tener una bandeja de 'Solicitudes Pendientes' para Aprobar/Rechazar. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La interfaz de calendario debe bloquear la selección de fechas pasadas. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Las solicitudes aprobadas bloquean la asignación de turnos del oficial para esas fechas. |
| **RN-002** | Las licencias médicas requieren adjuntar obligatoriamente un archivo (certificado). |

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
| **CA-001** | Flujo de aprobación (Pendiente -> Aprobado/Rechazado) funcional. |
| **CA-002** | Bloqueo de cruce con turnos asignados. |

### 11. Restricciones
- Ninguna.

### 12. Fuera de alcance
- Cálculo legal de días acumulados por antigüedad de ley.

---

### Especificación: Registrar Amonestación en Hoja de Vida
### 1. Objetivo
Mantener un registro inmutable del comportamiento disciplinario del personal policial.

### 2. Contexto
Historiales limpios falsificados por amistades internas impiden purgar a los malos elementos del departamento.

### 3. Usuarios o actores
- Sheriff
- Asuntos Internos

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe permitir ingresar texto describiendo la falta y clasificarla (Leve, Grave, Crítica). |
| **RF-002** | Emitir notificación formal al oficial afectado. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Cifrado en reposo para el módulo disciplinario para evitar filtraciones. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Una amonestación guardada es inmutable; no puede ser borrada, solo apelada con notas adicionales. |
| **RN-002** | Tres amonestaciones Graves en un año suspenden automáticamente la cuenta de acceso del oficial. |

### 7. Entradas
- Descripción textual de la falta.
- Clasificación.

### 8. Salidas
- Registro agregado a la hoja de vida.
- Alerta de suspensión (si aplica).

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el Sheriff registra una falta leve por uniforme sucio | Cuando guarda el reporte | Entonces el expediente se actualiza con la mancha disciplinaria |
| **Caso de Error** | Dado que un Sargento de menor rango intenta borrar una amonestación | Cuando accede al expediente | Entonces el sistema no muestra el botón de Eliminar (inmutabilidad) |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Aplicación estricta de append-only logs. |
| **CA-002** | Contabilización automática de faltas para gatillar suspensión. |

### 11. Restricciones
- Depende de los reportes oficiales de Asuntos Internos.

### 12. Fuera de alcance
- Firma biométrica del oficial aceptando la sanción.

---

### Especificación: Actualizar Récord de Certificaciones
### 1. Objetivo
Documentar los entrenamientos tácticos (Taser, Tiro, RCP) aprobados por el oficial.

### 2. Contexto
Si un oficial dispara un Taser y resulta que su certificación expiró hace un mes, el departamento enfrenta demandas millonarias por negligencia.

### 3. Usuarios o actores
- Administrador de RRHH

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe registrar nombre de la certificación, fecha de expedición y fecha de caducidad. |
| **RF-002** | El sistema debe alertar 30 días antes de que expire una certificación. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Cron job (tarea programada) diario para verificar fechas de expiración. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Si la certificación de Taser expira, el sistema de Logística bloquea la entrega de Tasers a ese oficial. |
| **RN-002** | Toda certificación requiere comprobante PDF. |

### 7. Entradas
- Fechas
- PDF de certificado.

### 8. Salidas
- Dashboard de oficiales capacitados.
- Alertas de expiración próximas.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el sistema corre el cron job y detecta que el RCP de Pérez expira en 30 días | Cuando se completa la ejecución | Entonces envía un correo a Pérez y al Sargento para que programen reentrenamiento |
| **Caso de Error** | Dado que Pérez tiene su certificación de Taser expirada | Cuando Logística intenta escanear un Taser para asignárselo | Entonces el sistema bloquea indicando 'Certificación Inválida' |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Generación correcta de alertas previas al vencimiento. |
| **CA-002** | Integración efectiva bloqueando equipos en Logística. |

### 11. Restricciones
- Los catálogos de entrenamientos válidos los define el estado.

### 12. Fuera de alcance
- Cursos e-learning tomados dentro de la misma plataforma.

---



## 4.5 Módulo Operativo Ciberseguridad

### Especificación: Rastrear Inicio de Sesión
### 1. Objetivo
Mantener una bitácora forense de quién, cuándo y desde dónde accede a la plataforma.

### 2. Contexto
Si hay una filtración de información a la prensa, el departamento necesita auditar qué cuentas accedieron al expediente a esa hora.

### 3. Usuarios o actores
- Sistema (Automático)

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe registrar la IP, el User-Agent (navegador/dispositivo) y el Timestamp al intentar hacer login. |
| **RF-002** | Debe registrar si el intento fue Exitoso o Fallido. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | La tabla de login_logs debe estar particionada por mes para no degradar el rendimiento. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Esta tabla de rastreo no puede vaciarse mediante la interfaz de usuario. |
| **RN-002** | Las IPs internas de la red policial deben marcarse automáticamente como 'Zona Segura'. |

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
| **CA-001** | Captura correcta de IP cliente detrás de balanceadores (X-Forwarded-For). |
| **CA-002** | Diferenciación clara entre fallos de usuario y fallos de contraseña. |

### 11. Restricciones
- Depende de la configuración de red Azure Firewall.

### 12. Fuera de alcance
- Geolocalización a nivel de calle por IP.

---

### Especificación: Modificar Permisos de Acceso RBAC
### 1. Objetivo
Controlar el acceso a los diferentes módulos de la plataforma utilizando matrices de roles.

### 2. Contexto
Un Operador 911 no debería tener acceso a modificar los perfiles de los detectives ni ver reportes administrativos de sueldos.

### 3. Usuarios o actores
- Administrador de Sistema

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe proporcionar un dashboard de matriz: Filas (Roles), Columnas (Módulos/Permisos). |
| **RF-002** | Permitir activar/desactivar permisos de Lectura, Escritura, Borrado y Ejecución (CRUD). |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Los cambios en RBAC deben aplicarse en caché instantáneamente (máx 100ms) sin obligar a reiniciar sesión a los afectados. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | El rol de 'Super Administrador' no puede perder sus propios permisos de editar RBAC. |
| **RN-002** | Un usuario hereda todos los permisos del rol asignado, sin excepciones granulares por usuario. |

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
| **CA-001** | Efectividad inmediata del bloqueo de accesos. |
| **CA-002** | Restricciones a nivel backend (API), no solo ocultando botones visuales. |

### 11. Restricciones
- Arquitectura basada estrictamente en Roles, no en permisos aislados.

### 12. Fuera de alcance
- Integración LDAP local.

---

### Especificación: Ejecutar Respaldo de Base de Datos
### 1. Objetivo
Prevenir la pérdida de información crítica operativa y garantizar la recuperación ante desastres (Disaster Recovery).

### 2. Contexto
Ataques de Ransomware a ayuntamientos han borrado décadas de información policial. Backups cifrados fuera de línea son mandatorios.

### 3. Usuarios o actores
- Sistema (Automático)

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe realizar un Dump completo de la base de datos PostgreSQL. |
| **RF-002** | Enviar el archivo encriptado a un Azure Storage (Cold Tier). |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | El respaldo completo debe ocurrir todos los días a las 03:00 AM UTC para minimizar impacto operativo. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | El archivo de backup debe ser comprimido e inyectarle un hash SHA-256 para validación futura. |
| **RN-002** | Mantener retención de los últimos 30 días, rotando y borrando el día 31. |

### 7. Entradas
- Cron Job programado.

### 8. Salidas
- Archivo SQL.GZ o Dump binario en nube.
- Alerta de éxito/fallo.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que son las 03:00 AM | Cuando se gatilla el proceso | Entonces el sistema comprime, encripta y envía a Azure, reportando 'Respaldo Exitoso' |
| **Caso de Error** | Dado que la conexión a Azure falla | Cuando intenta subir el archivo | Entonces reintenta 3 veces y si falla dispara alerta crítica SMS al Administrador |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Verificación del archivo mediante Hash SHA-256. |
| **CA-002** | Rotación cíclica correcta (Día 31 eliminado). |

### 11. Restricciones
- Depende del ancho de banda hacia la nube de Azure.

### 12. Fuera de alcance
- Restauración automática de bases de datos con un clic.

---

### Especificación: Etiquetar Acceso a Evidencias (Auditoría Ciega)
### 1. Objetivo
Auditar si se accede a información sensible sin modificarla, previniendo espionaje interno.

### 2. Contexto
Si un oficial busca en el sistema las fotos del caso de un amigo solo por curiosidad o para avisarle, esto contamina la investigación.

### 3. Usuarios o actores
- Sistema (Automático)

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe crear un log cada vez que un usuario abra la pantalla de detalle de un Expediente o descargue una fotografía forense. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | Inserciones asíncronas en base de datos para no ralentizar la visualización de la foto. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Los logs de 'Solo Lectura' (GET requests) sobre evidencias se guardan mínimo 5 años. |
| **RN-002** | Detectives asignados formalmente al caso no generan banderas sospechosas al consultar, pero su consulta igual se registra. |

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
| **CA-001** | Trazabilidad del 100% de consultas GET en rutas de evidencia. |
| **CA-002** | No penaliza el rendimiento de la aplicación móvil. |

### 11. Restricciones
- Altísimo volumen de escritura en base de datos.

### 12. Fuera de alcance
- Análisis del comportamiento del usuario (User Behavior Analytics) mediante IA.

---

### Especificación: Bloquear Cuenta por Intentos Fallidos
### 1. Objetivo
Mitigar ataques de fuerza bruta o relleno de credenciales (credential stuffing).

### 2. Contexto
Las contraseñas débiles de algunos oficiales pueden ser adivinadas si no se limita el número de intentos que puede hacer un atacante.

### 3. Usuarios o actores
- Sistema (Automático)

### 4. Requisitos funcionales
| Código | Descripción |
| :--- | :--- |
| **RF-001** | El sistema debe llevar un contador temporal de contraseñas incorrectas por usuario y por IP. |
| **RF-002** | Desactivar cuenta y mostrar temporizador en pantalla. |

### 5. Requisitos no funcionales
| Código | Descripción |
| :--- | :--- |
| **RNF-001** | El bloqueo debe ejecutarse de forma atómica en BD o Redis. |

### 6. Reglas de negocio
| Código | Regla de Negocio |
| :--- | :--- |
| **RN-001** | Al alcanzar 3 intentos fallidos consecutivos, la cuenta se bloquea por 15 minutos. |
| **RN-002** | Un inicio de sesión exitoso resetea el contador de fallos a cero. |

### 7. Entradas
- Intentos de Login fallidos.

### 8. Salidas
- Estado del usuario cambiado a 'Lockout'.
- Banner de rechazo de sesión.

### 9. Escenarios principales
| Escenario | Condición (Dado que) | Acción (Cuando) | Resultado (Entonces) |
| :--- | :--- | :--- | :--- |
| **Caso Exitoso** | Dado que el atacante falla la contraseña 3 veces seguidas | Cuando ingresa la correcta en el intento 4 | Entonces el sistema rechaza el login, dice 'Cuenta bloqueada' y no procesa la clave real |
| **Caso de Error** | Dado que el usuario intenta burlar el bloqueo cambiando su IP pero usando el mismo usuario | Cuando ataca de nuevo | Entonces el sistema mantiene el bloqueo porque es a nivel de usuario, no solo IP |

### 10. Criterios de aceptación
| Código | Criterio de Aceptación |
| :--- | :--- |
| **CA-001** | Bloqueo efectivo e impenetrable durante los 15 minutos exactos. |
| **CA-002** | Reseteo correcto del contador si ingresa bien a la segunda oportunidad. |

### 11. Restricciones
- Depende del caché Redis para alto rendimiento.

### 12. Fuera de alcance
- Notificación SMS de código de desbloqueo.

---



## 4.6 Módulo Operativo Tránsito y Comunidad

### Especificación: Emitir Infracción de Tránsito (e-Citation)
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

### Especificación: Registrar Prueba de Alcoholemia (BAC)
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

### Especificación: Coordinar Despacho de Grúa
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

### Especificación: Documentar Reunión Comunitaria
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

### Especificación: Validar Alerta de Botón de Pánico
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

### Especificación: Gestionar Celdas y Detenidos: Registrar Inventario de Celda (Booking)
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

### Especificación: Gestionar Celdas y Detenidos: Registrar Bitácora de Detenidos
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





---

# 5. PARTE V: ESPECIFICACIÓN DE CASOS DE USO E HISTORIAS DE USUARIO



## 5.1 Módulo Unidad de Operaciones de Campo

### 5.1.1 CU-01: Gestionar Incidentes
**Tabla 1: Caso de uso Gestionar Incidentes**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-01 |
| **Nombre del caso de uso** | Gestionar Incidentes |
| **Actor** | Oficial de Patrulla, Operador 911, Sheriff |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Permitir el ingreso formal y seguro de nuevos eventos delictivos para la alimentación de las bases de datos de inteligencia y despacho. |
| **Descripción** | El oficial o el operador registra un acto delictivo presenciado o reportado en la calle, llenando detalles geográficos y tipificando el crimen según el código penal, con opción de modificar y eliminar lógicamente dicho registro. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | acceder a un formulario digital desde mi terminal | documentar un incidente rápidamente en la calle. |
| Oficial de Patrulla | seleccionar la clasificación del delito de un catálogo precargado | evitar errores de tipificación manual. |
| Sistema SafeCity | calcular automáticamente las coordenadas geográficas al colocar un pin | asegurar que el mapeo posterior sea preciso. |
| Operador 911 | recibir una alerta si ingreso un incidente duplicado | no sobrescribir datos y evitar saturar a las unidades. |

---

### 5.1.2 CU-02: Consultar / Filtrar Incidentes
**Tabla 1: Caso de uso Consultar / Filtrar Incidentes**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-02 |
| **Nombre del caso de uso** | Consultar / Filtrar Incidentes |
| **Actor** | Sheriff, Detective, Oficial de Patrulla |
| **Prioridad** | Media (7 — Nivel Operativo) |
| **Propósito del CU** | Proveer una herramienta de búsqueda avanzada para localizar incidentes históricos según variables cruzadas. |
| **Descripción** | Permite realizar consultas sobre la base de datos de incidentes aplicando filtros por fecha, tipo penal, distrito, nivel de gravedad y palabras clave para apoyar investigaciones o generar reportes operativos. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Detective | filtrar incidentes por un rango de fechas y cuadrante específico | analizar patrones de robos en una zona particular. |
| Sheriff | visualizar los resultados de búsqueda tanto en formato de tabla como de mapa interactivo | comprender mejor la distribución espacial de los delitos. |
| Oficial de Patrulla | buscar incidentes históricos por número de caso | consultar referencias rápidas sobre casos en los que trabajé previamente. |

---

### 5.1.3 CU-03: Registrar Tiempo de Llegada de Patrullas a Emergencias
**Tabla 1: Caso de uso Registrar Tiempo de Llegada de Patrullas a Emergencias**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-03 |
| **Nombre del caso de uso** | Registrar Tiempo de Llegada de Patrullas a Emergencias |
| **Actor** | Sistema (Actor Automático) |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Medir con precisión inmutable el tiempo de respuesta (SLA) de la fuerza policial a incidentes críticos. |
| **Descripción** | El sistema detecta automáticamente mediante geocercas GPS (radio de 50m) el momento exacto en el que una patrulla despachada arriba a la escena, calculando la diferencia contra el tiempo de despacho original. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sistema SafeCity | registrar el timestamp exacto de llegada de la patrulla | calcular los tiempos de respuesta oficiales y evitar alteraciones manuales. |
| Sheriff | verificar que las alertas de tiempos excedidos (SLAs) se disparen | tomar acciones inmediatas si una unidad tarda más del tiempo reglamentario. |

---

## 5.2 Módulo Inteligencia Geográfica y Mapas Tácticos

### 5.2.1 CU-04: Visualizar Mapa de Calor Táctico (Heatmap)
**Tabla 1: Caso de uso Visualizar Mapa de Calor Táctico (Heatmap)**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-04 |
| **Nombre del caso de uso** | Visualizar Mapa de Calor Táctico (Heatmap) |
| **Actor** | Sheriff, Detective, Analista de Inteligencia Criminal |
| **Prioridad** | Media (8 — Nivel Operativo) |
| **Propósito del CU** | Brindar perspectiva geoespacial del volumen delictivo para reasignación de recursos policiales. |
| **Descripción** | El usuario visualiza un mapa interactivo renderizando densidades criminales (puntos calientes) basados en la frecuencia y gravedad de los incidentes en un período seleccionado. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | ver un mapa de calor dinámico sobre el mapa de la ciudad | identificar inmediatamente las zonas rojas que requieren mayor patrullaje. |
| Analista de Inteligencia Criminal | cambiar el gradiente de intensidad y el radio de los puntos calientes | ajustar la visualización a presentaciones de nivel estratégico. |

---

### 5.2.2 CU-05: Filtrar Crímenes por Calle / Zona
**Tabla 1: Caso de uso Filtrar Crímenes por Calle / Zona**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-05 |
| **Nombre del caso de uso** | Filtrar Crímenes por Calle / Zona |
| **Actor** | Sheriff, Analista de Inteligencia Criminal |
| **Prioridad** | Media (6 — Nivel Operativo) |
| **Propósito del CU** | Aislar datos geoespaciales para enfocar esfuerzos investigativos en delimitaciones geográficas exactas. |
| **Descripción** | Permite trazar polígonos o seleccionar calles específicas dentro del mapa para filtrar y listar exclusivamente los crímenes ocurridos en esos micro-tramos. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Analista de Inteligencia Criminal | trazar un polígono manual sobre el mapa | analizar crímenes exclusivamente dentro del territorio de una pandilla. |
| Sheriff | filtrar incidentes ocurridos únicamente sobre la avenida principal | evaluar si los operativos de control están reduciendo los delitos viales. |

---

### 5.2.3 CU-06: Alternar Capas del Mapa
**Tabla 1: Caso de uso Alternar Capas del Mapa**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-06 |
| **Nombre del caso de uso** | Alternar Capas del Mapa |
| **Actor** | Sheriff, Analista de Inteligencia Criminal |
| **Prioridad** | Baja (5 — Nivel Operativo) |
| **Propósito del CU** | Personalizar la interfaz visual geoespacial para cruzar distintas variables delictivas, de tránsito o logísticas. |
| **Descripción** | Facilidad para encender o apagar capas de información (Incidentes, Patrullas activas, Semáforos, Cámaras LPR) de forma individual sobre el mapa base satelital o callejero. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Operador 911 | poder encender la capa de Patrullas GPS | ver qué unidades están libres cerca del evento crítico. |
| Detective | activar la capa de Cámaras LPR | conocer rápidamente si el vehículo de un sospechoso pasó por cámaras cercanas a la zona del crimen. |

---

## 5.3 Módulo División de Investigaciones Criminales

### 5.3.1 CU-07: Abrir Expediente de Investigación y Asignar Detective
**Tabla 1: Caso de uso Abrir Expediente de Investigación y Asignar Detective**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-07 |
| **Nombre del caso de uso** | Abrir Expediente de Investigación y Asignar Detective |
| **Actor** | Sheriff, Detective |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Formalizar el inicio de una investigación a profundidad sobre un incidente criminal grave. |
| **Descripción** | El Sheriff o mando superior transforma un 'incidente crudo' en un 'expediente investigativo' y lo asigna a un Detective principal, activando la carpeta para recopilación de evidencias, testigos y vinculaciones. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | crear un expediente basado en un incidente de homicidio previo | formalizar la recolección de indicios sin perder los datos iniciales de los oficiales de patrulla. |
| Sheriff | asignar a un Detective principal al expediente recién creado | delegar la responsabilidad de la investigación criminal. |
| Detective | recibir una alerta inmediata al ser asignado a un caso | empezar mi investigación sin pérdida de tiempo. |

---

### 5.3.2 CU-08: Consultar 'Mis Casos' / Bandeja del Detective
**Tabla 1: Caso de uso Consultar 'Mis Casos' / Bandeja del Detective**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-08 |
| **Nombre del caso de uso** | Consultar 'Mis Casos' / Bandeja del Detective |
| **Actor** | Detective |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Centralizar el espacio de trabajo de cada investigador para priorizar sus tareas y tiempos. |
| **Descripción** | Panel de control personal del Detective que lista todos los expedientes activos, en pausa o cerrados asignados a su cargo, ordenados por nivel de prioridad o tiempo de expiración legal. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Detective | ver un listado de todos mis casos clasificados por nivel de prioridad | saber en qué investigación debo enfocar mis esfuerzos diariamente. |
| Detective | poder visualizar alertas de plazos legales que están por vencer en mis casos | no arriesgar la admisibilidad en la corte por demoras procesales. |

---

### 5.3.3 CU-09: Registrar Arresto Relacionado al Expediente
**Tabla 1: Caso de uso Registrar Arresto Relacionado al Expediente**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-09 |
| **Nombre del caso de uso** | Registrar Arresto Relacionado al Expediente |
| **Actor** | Detective, Oficial de Patrulla |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Garantizar la conexión legal entre el acto físico de aprensión y la investigación formal previa. |
| **Descripción** | Permite registrar una orden de captura o un arresto en flagrancia y asociarlo directamente como un 'logro' dentro del expediente criminal en cuestión, vinculando al individuo arrestado. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | poder indicar en mi formulario de arresto el ID del Expediente en curso | que el Detective principal sea notificado de la captura del prófugo. |
| Detective | ver reflejado el arresto de mi sospechoso principal directamente dentro del dashboard del caso | tener trazabilidad completa de los eventos de campo. |

---

### 5.3.4 CU-10: Generar Reporte Conclusivo y Cerrar Caso
**Tabla 1: Caso de uso Generar Reporte Conclusivo y Cerrar Caso**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-10 |
| **Nombre del caso de uso** | Generar Reporte Conclusivo y Cerrar Caso |
| **Actor** | Detective, Sheriff |
| **Prioridad** | Media (8 — Nivel Operativo) |
| **Propósito del CU** | Finalizar procedimentalmente una investigación mediante documentación formal aprobada para fiscalía. |
| **Descripción** | El Detective recopila hallazgos, redacta el dictamen de cierre y solicita la aprobación del Sheriff para cambiar el estado del caso a CERRADO, emitiendo un documento legal cifrado. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Detective | tener un formulario guiado para redactar mi dictamen conclusivo | evitar omisiones técnicas antes de presentarlo al Sheriff. |
| Sheriff | revisar y aprobar con mi firma digital el cierre de caso de un Detective | cerrar el expediente formalmente y notificar a los juzgados. |
| Sistema SafeCity | bloquear la edición de evidencias y testimonios una vez el caso está CERRADO | garantizar la integridad de los datos para la etapa de juicio penal. |

---

### 5.3.5 CU-11: Reabrir Caso Cerrado por Nueva Evidencia
**Tabla 1: Caso de uso Reabrir Caso Cerrado por Nueva Evidencia**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-11 |
| **Nombre del caso de uso** | Reabrir Caso Cerrado por Nueva Evidencia |
| **Actor** | Sheriff, Detective |
| **Prioridad** | Media (7 — Nivel Operativo) |
| **Propósito del CU** | Permitir continuar investigaciones que fueron archivadas (Casos Fríos) si surgen indicios forenses recientes. |
| **Descripción** | Acción privilegiada que desbloquea un expediente previamente cerrado, restaurando su visibilidad y permisos de edición para vincular nuevos hallazgos sin corromper la bitácora anterior. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Detective | solicitar la reapertura de un Caso Frío tras un nuevo match de ADN | poder ingresar al sospechoso finalmente encontrado. |
| Sheriff | autorizar la reapertura del caso mediante justificación escrita | mantener el control de calidad sobre qué investigaciones se retoman y consumen presupuesto. |

---

### 5.3.6 CU-12: Gestionar Búsqueda de Personas Desaparecidas
**Tabla 1: Caso de uso Gestionar Búsqueda de Personas Desaparecidas**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-12 |
| **Nombre del caso de uso** | Gestionar Búsqueda de Personas Desaparecidas |
| **Actor** | Detective, Operador 911 |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Centralizar alertas y características de individuos ausentes para difusión inmediata en la fuerza policial. |
| **Descripción** | Gestión CRUD de registros específicos de personas desaparecidas que incluyen edad, peso, vestimenta en el momento de desaparición, fotos recientes y evolución temporal del caso. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Operador 911 | registrar los datos básicos de la persona desaparecida en tiempo real durante la llamada del familiar | difundir la búsqueda a los patrulleros del sector inmediatamente. |
| Detective | poder actualizar el estado de una persona a 'Encontrada' e indicar sus condiciones de salud | cerrar la alerta y cancelar la búsqueda de campo. |

---

### 5.3.6 CU-43: Gestionar Órdenes Judiciales (Warrants)
**Tabla 1: Caso de uso Gestionar Órdenes Judiciales (Warrants)**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-43 |
| **Nombre del caso de uso** | Gestionar Órdenes Judiciales (Warrants) |
| **Actor** | Sheriff, Detective, Oficial de Patrulla |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Ingresar a las bases operativas los mandatos judiciales de captura para ejecución en campo. |
| **Descripción** | Registro, visualización y actualización (Ejecutada/Expirada) de Warrants firmados por un juez. Cruza directamente en el buscador de la policía durante paradas de tránsito. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Detective | subir el PDF firmado de una Orden de Captura y vincularla a un sospechoso | que su perfil parpadee en rojo para cualquier patrullero que lo identifique. |
| Oficial de Patrulla | consultar la placa de un conductor y ver si tiene una 'Orden de Arresto Activa' | proceder a detenerlo inmediatamente en el punto de control. |
| Oficial de Patrulla | cambiar el estado de la Orden a 'Ejecutada' luego de arrestarlo | cerrar el ciclo judicial y que el sistema no lo siga reportando como prófugo. |

---

## 5.4 Módulo Departamento de Inteligencia y Análisis Criminal

### 5.4.1 CU-13: Gestionar Catálogo de Bandas
**Tabla 1: Caso de uso Gestionar Catálogo de Bandas**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-13 |
| **Nombre del caso de uso** | Gestionar Catálogo de Bandas |
| **Actor** | Sheriff, Analista de Inteligencia Criminal |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Estructurar y clasificar a los grupos delictivos operando en la ciudad y sus alianzas. |
| **Descripción** | Mantenimiento del diccionario de bandas criminales, registrando nombres, territorios controlados, colores representativos, señas manuales e historiales de violencia (RICO Act). |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Analista de Inteligencia Criminal | crear el perfil de una nueva pandilla urbana que apareció en el sur | empezar a vincular delitos individuales a este grupo organizado. |
| Sheriff | poder consultar qué áreas de la ciudad son territorio de la pandilla X | planificar operativos de prevención y presencia policial pesada. |

---

### 5.4.2 CU-14: Gestionar y Vincular Sospechoso
**Tabla 1: Caso de uso Gestionar y Vincular Sospechoso**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-14 |
| **Nombre del caso de uso** | Gestionar y Vincular Sospechoso |
| **Actor** | Detective |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Consolidar información parcial y total de individuos de interés para facilitar identificaciones posteriores. |
| **Descripción** | Permite crear, leer, actualizar y vincular perfiles de sospechosos a múltiples expedientes, incluyendo datos biométricos descriptivos (tatuajes, cicatrices) alias (A.K.A) y vehículos frecuentados. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Detective | registrar a un sospechoso conociendo solamente su alias y un tatuaje particular | que la base de datos me arroje coincidencias con perfiles ya existentes. |
| Detective | vincular un perfil de sospechoso a dos casos de robo diferentes | establecer el patrón de conducta criminal serial (Modus Operandi). |
| Sistema SafeCity | normalizar los alias convirtiéndolos a mayúsculas y quitando espacios | prevenir duplicados innecesarios en la base de datos maestra. |

---

### 5.4.3 CU-15: Registrar Declaración de Testigo
**Tabla 1: Caso de uso Registrar Declaración de Testigo**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-15 |
| **Nombre del caso de uso** | Registrar Declaración de Testigo |
| **Actor** | Detective, Oficial de Patrulla |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Asegurar las versiones verbales de los incidentes asegurando la protección de identidad de informantes. |
| **Descripción** | Formulario seguro para la transcripción o carga de audio de declaraciones juradas, notas de entrevistas y peritajes, con capacidad de encriptación PII para testigos protegidos. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | grabar una breve declaración de un testigo ocular en la calle y vincularla al incidente | evitar que el testigo cambie su versión o desaparezca. |
| Detective | marcar una declaración específica como 'Testigo Protegido' | que los demás oficiales no puedan leer el nombre real ni datos de contacto de quien declara. |

---

### 5.4.4 CU-16: Gestionar Custodia e Inventario
**Tabla 1: Caso de uso Gestionar Custodia e Inventario**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-16 |
| **Nombre del caso de uso** | Gestionar Custodia e Inventario |
| **Actor** | Detective, Oficial de Patrulla |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Mantener inmaculada la cadena de custodia de la evidencia recolectada para los juzgados. |
| **Descripción** | Módulo estricto para registrar el decomiso de armas, drogas y artículos robados, exigiendo foto, firma digital, peso, estado y registro de cada vez que la evidencia es transferida al laboratorio o de vuelta a bodega. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | generar un código de barras para una pistola decomisada desde mi dispositivo | etiquetarla físicamente antes de llevarla a la sala de evidencias. |
| Sistema SafeCity | guardar el usuario, hora y motivo cada vez que una evidencia cambia de manos (Transferencia) | construir un reporte de Cadena de Custodia inmutable. |

---

### 5.4.5 CU-17: Gestionar Alertas BOLO (Be On The Lookout)
**Tabla 1: Caso de uso Gestionar Alertas BOLO (Be On The Lookout)**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-17 |
| **Nombre del caso de uso** | Gestionar Alertas BOLO (Be On The Lookout) |
| **Actor** | Sheriff, Detective |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Difundir de emergencia el requerimiento de detención de un objetivo de alto riesgo. |
| **Descripción** | Creación rápida de alertas prioritarias (BOLO) que hacen sonar alarmas en todas las terminales de patrullas activas, adjuntando placas vehiculares o fotos del prófugo considerado armado y peligroso. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | lanzar un BOLO con nivel 'Crítico' y descripción del vehículo robado | que toda la flota empiece la búsqueda de forma inmediata y coordinada. |
| Oficial de Patrulla | ver en mi pantalla un banner rojo destellante con los detalles del BOLO vigente | estar alerta sin tener que buscar activamente en el sistema. |

---

### 5.4.6 CU-42: Gestionar Celdas y Detenidos
**Tabla 1: Caso de uso Gestionar Celdas y Detenidos**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-42 |
| **Nombre del caso de uso** | Gestionar Celdas y Detenidos |
| **Actor** | Oficial de Patrulla, Detective |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Controlar el flujo temporal de personas privadas de la libertad para prevenir abusos o hacinamiento. |
| **Descripción** | Booking system de la comisaría. Registra el inventario personal confiscado, la hora exacta de ingreso a celda temporal, visitas del abogado o médico, y el proceso de liberación bajo fianza o traslado al penal. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | ingresar al sistema que el detenido trae 1 celular, 1 anillo y $45 dólares | imprimir un recibo de inventario y evitar quejas de robo por parte del reo. |
| Oficial de Patrulla | registrar periódicamente las rondas visuales a la celda cada hora | asegurar el bienestar físico del detenido y evitar responsabilidades penales. |
| Detective | procesar la orden de liberación bajo fianza de un detenido y devolver sus pertenencias | culminar el ciclo legal de su estancia en las celdas temporales. |

---

## 5.5 Módulo Departamento de Logística Operativa y Flota

### 5.5.1 CU-18: Gestionar Check-in y Check-out de Patrullas
**Tabla 1: Caso de uso Gestionar Check-in y Check-out de Patrullas**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-18 |
| **Nombre del caso de uso** | Gestionar Check-in y Check-out de Patrullas |
| **Actor** | Oficial de Patrulla, Jefe de Logística |
| **Prioridad** | Media (8 — Nivel Operativo) |
| **Propósito del CU** | Controlar qué oficiales están a bordo de qué patrullas y la lectura del odómetro. |
| **Descripción** | Proceso rutinario para el inicio y fin del turno (Check-in/out). Requiere la lectura de kilometraje inicial y final, y comprobación visual de abolladuras o problemas mecánicos de la unidad antes de salir a la calle. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | escanear el código QR de mi patrulla asignada para hacer check-in e ingresar el kilometraje | registrar oficialmente el inicio de mis operaciones viales. |
| Jefe de Logística | recibir una advertencia si un oficial hace check-out con un kilometraje menor al de inicio | evitar fraudes o registros corruptos en el uso de los vehículos. |

---

### 5.5.2 CU-19: Gestionar Asignación y Devolución de Equipo Táctico
**Tabla 1: Caso de uso Gestionar Asignación y Devolución de Equipo Táctico**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-19 |
| **Nombre del caso de uso** | Gestionar Asignación y Devolución de Equipo Táctico |
| **Actor** | Jefe de Logística, Oficial de Patrulla |
| **Prioridad** | Media (8 — Nivel Operativo) |
| **Propósito del CU** | Controlar el inventario de armas letales y equipo no letal entregado diariamente a la fuerza policial. |
| **Descripción** | Registro de asignación de radios, escopetas, tasers y chalecos por oficial al iniciar turno. A la devolución, verifica que los niveles de munición coincidan con los reportes de 'Uso de Fuerza' de ese turno. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Jefe de Logística | escanear el ID del oficial y el código de barras de la escopeta asignada | vincular legalmente el arma de fuego a ese oficial durante las próximas 12 horas. |
| Sistema SafeCity | alertar automáticamente si un oficial devuelve una pistola con 3 balas menos pero no existe reporte de 'Uso de Fuerza' | disparar los protocolos de Asuntos Internos inmediatamente. |

---

### 5.5.3 CU-20: Consultar Inventario de Flota y Equipamiento
**Tabla 1: Caso de uso Consultar Inventario de Flota y Equipamiento**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-20 |
| **Nombre del caso de uso** | Consultar Inventario de Flota y Equipamiento |
| **Actor** | Jefe de Logística |
| **Prioridad** | Media (6 — Nivel Operativo) |
| **Propósito del CU** | Proporcionar visibilidad en tiempo real de la disponibilidad operativa y salud de los activos policiales. |
| **Descripción** | Tablero de control maestro que permite verificar cuántas patrullas, armas, motos y blindados están operativos, en reparación, dañados o dados de baja temporalmente. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Jefe de Logística | filtrar las patrullas que actualmente tienen estado 'En Taller' | gestionar presiones con los proveedores de mantenimiento mecánico. |
| Jefe de Logística | ver una métrica del porcentaje de disponibilidad de flota | garantizar que no estemos por debajo del 85% de capacidad exigido por ley. |

---

### 5.5.4 CU-21: Gestionar Tickets de Fallas Mecánicas
**Tabla 1: Caso de uso Gestionar Tickets de Fallas Mecánicas**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-21 |
| **Nombre del caso de uso** | Gestionar Tickets de Fallas Mecánicas |
| **Actor** | Oficial de Patrulla, Jefe de Logística |
| **Prioridad** | Media (7 — Nivel Operativo) |
| **Propósito del CU** | Registrar desperfectos en los bienes públicos de forma ordenada y auditable. |
| **Descripción** | Creación de incidencias de reparación que describen fallas vehiculares o equipo defectuoso, adjuntando fotografías, y permitiendo al departamento logístico hacer seguimiento desde el estado Abierto hasta Resuelto. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | tomar una foto de la llanta pinchada y la luz trasera rota de mi unidad y enviar el reporte | no tener responsabilidad sobre daños ocurridos en turnos previos. |
| Jefe de Logística | marcar un ticket de falla como 'Resuelto' y re-incorporar la patrulla al servicio activo | actualizar automáticamente el inventario de unidades listas para despacho. |

---

### 5.5.5 CU-22: Registrar Uso de Fuerza
**Tabla 1: Caso de uso Registrar Uso de Fuerza**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-22 |
| **Nombre del caso de uso** | Registrar Uso de Fuerza |
| **Actor** | Oficial de Patrulla |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Documentar legalmente las acciones violentas policiales para auditorías y juicios civiles. |
| **Descripción** | Formulario estricto donde el oficial declara cualquier uso de arma letal (armas de fuego), no letal (tasers, gas) o técnicas cuerpo a cuerpo. Exige justificación, sujetos implicados y detalles de municiones usadas. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | llenar obligatoriamente el formulario de Uso de Fuerza tras disparar mi taser | cumplir con el estatuto de operaciones civiles y proteger mi proceder. |
| Sheriff | recibir una notificación inmediata cada vez que se registre un uso letal de fuerza | ordenar presencia de Asuntos Internos en la escena sin demora. |

---

### 5.5.6 CU-23: Dar de Baja Vehículo o Equipo del Inventario
**Tabla 1: Caso de uso Dar de Baja Vehículo o Equipo del Inventario**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-23 |
| **Nombre del caso de uso** | Dar de Baja Vehículo o Equipo del Inventario |
| **Actor** | Jefe de Logística |
| **Prioridad** | Baja (4 — Nivel Operativo) |
| **Propósito del CU** | Retirar de circulación activos policiales que han cumplido su vida útil o sufrieron pérdida total. |
| **Descripción** | Operación de borrado lógico (Soft Delete / Decommission) para vehículos y equipo táctico. Se requiere un motivo y un número de resolución administrativa para proceder. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Jefe de Logística | seleccionar la Patrulla #120 y cambiar su estado a Dado de Baja Adjuntando el reporte de colisión total | asegurar que el despachador 911 jamás la asigne a un oficial. |

---

### 5.5.7 CU-24: Registrar Persecución Vehicular y Revisión Post-Evento
**Tabla 1: Caso de uso Registrar Persecución Vehicular y Revisión Post-Evento**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-24 |
| **Nombre del caso de uso** | Registrar Persecución Vehicular y Revisión Post-Evento |
| **Actor** | Oficial de Patrulla, Sheriff |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Analizar la adherencia de las patrullas a los protocolos de persecuciones de alta velocidad. |
| **Descripción** | Reporte post-evento de una persecución vial que indica velocidades máximas alcanzadas, duración en minutos, resultado (escape o arresto) y que requiere una revisión posterior obligatoria por parte del Sheriff (Justificada/Injustificada). |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | registrar los pormenores de una persecución vehicular a más de 120 km/h en mi reporte de turno | documentar por qué puse vidas en riesgo durante la persecución del sospechoso. |
| Sheriff | revisar la persecución y emitir un veredicto de si violó o no los protocolos de la ciudad | exigir responsabilidad civil a los oficiales imprudentes. |

---

### 5.5.8 CU-25: Trazar Ruta Táctico-Logística
**Tabla 1: Caso de uso Trazar Ruta Táctico-Logística**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-25 |
| **Nombre del caso de uso** | Trazar Ruta Táctico-Logística |
| **Actor** | Sistema, Operador 911 |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Optimizar los tiempos de llegada de la policía utilizando Inteligencia Artificial geoespacial. |
| **Descripción** | El sistema, basado en la posición en vivo de las patrullas y la ubicación del incidente, dibuja en el mapa del oficial la ruta más corta/rápida, evitando tráfico y entregando un Tiempo Estimado de Llegada (ETA). |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Operador 911 | presionar el botón 'Trazar ruta óptima' al despachar | que la patrulla reciba direcciones giro a giro en su terminal (MDT). |
| Sistema SafeCity | calcular las distancias de las unidades usando polígonos de calles (Manhattan distance) en vez de línea recta | entregar estimaciones de tiempo realistas al despachador. |

---

### 5.5.9 CU-31: Asignar / Modificar Cuadrantes de Patrullaje
**Tabla 1: Caso de uso Asignar / Modificar Cuadrantes de Patrullaje**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-31 |
| **Nombre del caso de uso** | Asignar / Modificar Cuadrantes de Patrullaje |
| **Actor** | Sheriff |
| **Prioridad** | Media (8 — Nivel Operativo) |
| **Propósito del CU** | Asegurar que todas las áreas de la ciudad tengan cobertura policial equitativa. |
| **Descripción** | Interfaz de administración territorial para el Sheriff donde arrastra e impone los turnos y oficiales sobre bloques geográficos de la ciudad (Sectores y Subsectores). |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | dibujar sobre el mapa un nuevo cuadrante de patrullaje en la zona norte | asignar temporalmente dos patrullas exclusivas a ese bloque debido a una ola de robos. |
| Sheriff | re-asignar a un patrullero en medio de su turno de un cuadrante pacífico a uno con mayor demanda | balancear la carga operativa de manera dinámica. |

---

## 5.6 Módulo Despacho y Gestión de Emergencias

### 5.6.1 CU-26: Registrar Llamada de Emergencia
**Tabla 1: Caso de uso Registrar Llamada de Emergencia**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-26 |
| **Nombre del caso de uso** | Registrar Llamada de Emergencia |
| **Actor** | Operador 911 |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Recibir y estructurar la primera capa de información ciudadana para movilizar recursos. |
| **Descripción** | El operador registra la información inicial del llamante, incluyendo tipo de queja, ubicación declarada (por voz o triangulación celular), estado de víctimas y presencia de armas de fuego. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Operador 911 | un formulario de captura rápida con autocompletado de calles | no perder valiosos segundos durante una crisis telefónica. |
| Operador 911 | registrar múltiples actualizaciones de la misma llamada a medida que evoluciona | mantener a los oficiales informados en ruta antes de llegar. |

---

### 5.6.2 CU-27: Geolocalizar y Despachar Unidad
**Tabla 1: Caso de uso Geolocalizar y Despachar Unidad**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-27 |
| **Nombre del caso de uso** | Geolocalizar y Despachar Unidad |
| **Actor** | Operador 911, Sistema |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Asignar la unidad más cercana y capacitada para manejar el tipo de incidente reportado. |
| **Descripción** | Proceso CAD (Computer Aided Dispatch) que cruza la ubicación de la emergencia contra la matriz de patrullas disponibles, calculando su proximidad real, y despachándolas formalmente cambiando su estado a 'En Ruta'. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Operador 911 | ver una lista de patrullas sugeridas ordenadas por distancia y disponibilidad | enviar a los oficiales que puedan llegar más rápido. |
| Oficial de Patrulla | recibir un aviso audible y en pantalla grande con la notificación del despacho | aceptar la misión inmediatamente. |

---

### 5.6.3 CU-28: Monitorear Tiempos de Respuesta
**Tabla 1: Caso de uso Monitorear Tiempos de Respuesta**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-28 |
| **Nombre del caso de uso** | Monitorear Tiempos de Respuesta |
| **Actor** | Sheriff, Sistema |
| **Prioridad** | Media (8 — Nivel Operativo) |
| **Propósito del CU** | Supervisar constantemente que la fuerza cumpla los parámetros legales de SLAs (Service Level Agreements). |
| **Descripción** | Visualización de los cronómetros en vivo para incidentes activos que cambian de verde a rojo si superan los umbrales estándar (ej. 5 minutos para asalto en curso). |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | visualizar un tablero de alertas con incidentes cuyo tiempo de respuesta SLA está vencido | exigir novedades por radio a las unidades demoradas. |
| Sistema SafeCity | congelar el reloj de tiempo de respuesta solo cuando el oficial pisa la geocerca de la escena | proveer métricas 100% auditables. |

---

### 5.6.4 CU-29: Clasificar Nivel de Triage (Prioridad 911)
**Tabla 1: Caso de uso Clasificar Nivel de Triage (Prioridad 911)**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-29 |
| **Nombre del caso de uso** | Clasificar Nivel de Triage (Prioridad 911) |
| **Actor** | Operador 911, Sistema |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Garantizar que los incidentes de riesgo vital se atiendan primero que las quejas menores. |
| **Descripción** | Selección del nivel de urgencia de 1 a 5 (siendo 5 la máxima) según protocolos paramédicos/policiales. El sistema puede proponer automáticamente un Triage 5 si detecta palabras clave como 'arma', 'tiroteo' o 'inconsciente'. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Operador 911 | clasificar manualmente un incidente como Triage 5 Crítico | que suba automáticamente al principio de la pila de despacho de todas las estaciones. |
| Sistema SafeCity | colorear los pines del mapa de color rojo intenso para incidentes Triage 5 | que salten a la vista de los Sheriffs. |

---

## 5.7 Módulo Departamento de Gestión de Talento y Asuntos Internos

### 5.7.1 CU-30: Gestionar Asistencia de Personal
**Tabla 1: Caso de uso Gestionar Asistencia de Personal**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-30 |
| **Nombre del caso de uso** | Gestionar Asistencia de Personal |
| **Actor** | Oficial de Patrulla, Oficial de RRHH |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Llevar un control estricto de la fuerza laboral disponible y el pago de horas extras. |
| **Descripción** | Registro de entrada y salida del personal administrativo y operativo mediante terminal biométrica o clave personal, con capacidades para reportes gerenciales (Overtime y Ausentismo). |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | registrar mi entrada (Clock-in) marcando mi huella en el kiosko de la estación | que mi turno empiece a contabilizarse y pueda solicitar mis equipos tácticos. |
| Oficial de RRHH | generar un reporte mensual consolidando las horas extras generadas en la calle | aprobar los pagos de nómina correspondientes. |

---

### 5.7.2 CU-32: Gestionar Solicitudes de Permisos de Ausencia
**Tabla 1: Caso de uso Gestionar Solicitudes de Permisos de Ausencia**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-32 |
| **Nombre del caso de uso** | Gestionar Solicitudes de Permisos de Ausencia |
| **Actor** | Oficial de Patrulla, Sheriff, Oficial de RRHH |
| **Prioridad** | Media (6 — Nivel Operativo) |
| **Propósito del CU** | Estandarizar y auditar el proceso de descansos médicos, licencias y vacaciones. |
| **Descripción** | Flujo de trabajo para enviar, justificar, aprobar o rechazar inasistencias programadas. El sistema bloquea la asignación de cuadrantes en esos días. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | solicitar 15 días de vacaciones mediante un formulario en línea | evitar hacer el trámite con papeleo físico. |
| Sheriff | aprobar la solicitud de descanso médico visualizando primero si no dejará a mi turno sin cobertura mínima | no comprometer la seguridad de la ciudad. |
| Sistema SafeCity | bloquear la programación de turnos de un oficial que tiene un permiso aprobado | evitar asignaciones fantasma. |

---

### 5.7.3 CU-33: Registrar Briefing de Turno (Roll Call)
**Tabla 1: Caso de uso Registrar Briefing de Turno (Roll Call)**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-33 |
| **Nombre del caso de uso** | Registrar Briefing de Turno (Roll Call) |
| **Actor** | Sheriff |
| **Prioridad** | Alta (8 — Nivel Operativo) |
| **Propósito del CU** | Documentar formalmente que los oficiales recibieron instrucciones sobre objetivos y delincuentes buscados antes de salir. |
| **Descripción** | Módulo donde el Sheriff documenta los temas discutidos en la formación matutina (Bolo, pandillas activas) y toma asistencia formal de la tropa presente. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | marcar a un oficial como presente en el Briefing diario e imprimir las minutas | tener constancia de que el oficial conoció las directivas tácticas antes de patrullar. |

---

### 5.7.4 CU-34: Registrar Traspaso de Turno
**Tabla 1: Caso de uso Registrar Traspaso de Turno**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-34 |
| **Nombre del caso de uso** | Registrar Traspaso de Turno |
| **Actor** | Oficial de Patrulla |
| **Prioridad** | Alta (8 — Nivel Operativo) |
| **Propósito del CU** | Evitar la pérdida de conocimiento táctico al realizar los relevos de patrulleros. |
| **Descripción** | Minibitácora que llena el oficial saliente indicando al oficial entrante si hay sospechosos activos en la zona, patrullajes pendientes o anomalías vehiculares en el barrio. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla (Saliente) | dejar una nota digital indicando que el callejón 42 está sin luces públicas | que mi relevo tenga precaución adicional al patrullarlo. |
| Oficial de Patrulla (Entrante) | leer el resumen del turno anterior forzosamente antes de hacer mi Check-in de patrulla | entrar al turno con conciencia situacional. |

---

### 5.7.5 CU-35: Gestionar Capacitaciones y Certificaciones
**Tabla 1: Caso de uso Gestionar Capacitaciones y Certificaciones**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-35 |
| **Nombre del caso de uso** | Gestionar Capacitaciones y Certificaciones |
| **Actor** | Oficial de RRHH, Oficial de Patrulla |
| **Prioridad** | Media (7 — Nivel Operativo) |
| **Propósito del CU** | Prevenir litigios civiles asegurando que los oficiales solo porten equipo para el cual están entrenados. |
| **Descripción** | Registro de cursos (Armas Cortas, Negociador, Manejo Evasivo), puntajes de tiro y fecha de caducidad. Inhabilita automáticamente la asignación de armamento vencido. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de RRHH | registrar que el oficial aprobó la recertificación de Taser y expira en 2 años | mantener su expediente legal al día. |
| Sistema SafeCity | restringir que Logística pueda asignarle una escopeta a un oficial cuya certificación de escopeta caducó | evitar demandas millonarias por mala praxis institucional. |

---

### 5.7.6 CU-36: Registrar Queja Ciudadana contra Oficial
**Tabla 1: Caso de uso Registrar Queja Ciudadana contra Oficial**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-36 |
| **Nombre del caso de uso** | Registrar Queja Ciudadana contra Oficial |
| **Actor** | Oficial de RRHH, Sheriff |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Asegurar la transparencia y procesar disciplinariamente actos de corrupción o abuso policial. |
| **Descripción** | Formulario confidencial para radicar reclamos ciudadanos (Asuntos Internos). Adjunta número de placa, descripción del evento, evidencia externa y resolución administrativa. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | ver el historial de quejas ciudadanas de un oficial antes de promoverlo | garantizar la integridad moral de los mandos medios. |
| Oficial de RRHH | registrar la declaración de un ciudadano sobre exceso de fuerza de manera confidencial | iniciar un proceso investigativo formal en Asuntos Internos. |

---

### 5.7.7 CU-37: Consultar Perfil y Hoja de Vida del Oficial
**Tabla 1: Caso de uso Consultar Perfil y Hoja de Vida del Oficial**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-37 |
| **Nombre del caso de uso** | Consultar Perfil y Hoja de Vida del Oficial |
| **Actor** | Sheriff, Oficial de RRHH |
| **Prioridad** | Baja (5 — Nivel Operativo) |
| **Propósito del CU** | Centralizar toda la metadata administrativa y operativa del policía. |
| **Descripción** | Ficha maestra del usuario policial que cruza datos de desempeño, condecoraciones, quejas disciplinarias, y récord de asistencias. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | entrar al perfil del agente Pérez y ver sus felicitaciones y suspensiones | evaluar su rendimiento integral anual. |

---

### 5.7.8 CU-41: Registrar Reunión Comunitaria
**Tabla 1: Caso de uso Registrar Reunión Comunitaria**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-41 |
| **Nombre del caso de uso** | Registrar Reunión Comunitaria |
| **Actor** | Oficial de Patrulla, Sheriff |
| **Prioridad** | Baja (4 — Nivel Operativo) |
| **Propósito del CU** | Mejorar la percepción ciudadana del servicio policial y documentar esfuerzos preventivos. |
| **Descripción** | Minutas de reuniones con líderes barriales donde se abordan preocupaciones ciudadanas (ruido, luminarias rotas) para generar un mapa de problemas comunitarios. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | registrar que tuvimos una asamblea con la junta de vecinos del barrio Sur | demostrar que cumplimos con los indicadores de Policía de Proximidad exigidos por la alcaldía. |

---

## 5.8 Módulo Unidad de Tránsito y Seguridad Vial

### 5.8.1 CU-38: Gestionar Infracciones de Tránsito
**Tabla 1: Caso de uso Gestionar Infracciones de Tránsito**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-38 |
| **Nombre del caso de uso** | Gestionar Infracciones de Tránsito |
| **Actor** | Agente de Tránsito, Oficial de Patrulla |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Automatizar y centralizar el cobro de multas evitando sobornos o pérdida física de papeletas. |
| **Descripción** | Generación electrónica de multas (e-Citation) escaneando licencias y vinculando el artículo del código de tránsito. Contempla flujos de apelación (anulación) autorizada por juez de tránsito. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Agente de Tránsito | escanear la placa del infractor y seleccionar la multa de 'Exceso de Velocidad' | imprimir el recibo digital y registrar la deuda en el sistema instantáneamente. |
| Agente de Tránsito | adjuntar una fotografía del vehículo mal estacionado como evidencia de la multa | respaldar la sanción legalmente ante la corte. |

---

### 5.8.2 CU-39: Registrar Prueba de Alcoholemia (BAC)
**Tabla 1: Caso de uso Registrar Prueba de Alcoholemia (BAC)**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-39 |
| **Nombre del caso de uso** | Registrar Prueba de Alcoholemia (BAC) |
| **Actor** | Agente de Tránsito |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Estandarizar el registro de grados de alcohol en sangre para sustentar arrestos por DUI. |
| **Descripción** | Captura del nivel BAC (Blood Alcohol Content) dictado por el alcoholímetro, vinculándolo a la infracción y al reporte de incidente de arresto si supera el umbral penal. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Agente de Tránsito | registrar el grado de alcohol '0.12' en el sistema junto con la multa | procesar automáticamente el cambio de Infracción Civil a Delito Penal (DUI). |

---

### 5.8.3 CU-40: Coordinar Despacho de Grúa
**Tabla 1: Caso de uso Coordinar Despacho de Grúa**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-40 |
| **Nombre del caso de uso** | Coordinar Despacho de Grúa |
| **Actor** | Agente de Tránsito, Operador 911 |
| **Prioridad** | Media (7 — Nivel Operativo) |
| **Propósito del CU** | Remover vehículos infractores o accidentados de las vías públicas de forma auditable. |
| **Descripción** | Formulario que notifica al patio de retención vehicular y empresas de grúas aliadas sobre la necesidad de acarreo, inventariando abolladuras previas del vehículo. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Agente de Tránsito | marcar en el sistema 'Solicitar Remolque' luego de multar a un auto abandonado | que la empresa de grúas reciba la notificación con las coordenadas. |
| Agente de Tránsito | hacer un croquis rápido de los daños del carro antes de que la grúa se lo lleve | eximir a la policía de daños que la grúa pudiera causarle en ruta. |

---

### 5.8.4 CU-44: Registrar Informe de Accidente de Tránsito
**Tabla 1: Caso de uso Registrar Informe de Accidente de Tránsito**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-44 |
| **Nombre del caso de uso** | Registrar Informe de Accidente de Tránsito |
| **Actor** | Agente de Tránsito, Oficial de Patrulla |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Levantar la información pericial y civil requerida por aseguradoras y cortes de tránsito. |
| **Descripción** | Reporte estructurado con diagrama de colisión, detalles de heridos, estimación de daños vehiculares e infraestructura, y culpabilidad preliminar. Emite copia foliada (Crash Report). |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Agente de Tránsito | dibujar un croquis digital que muestra la posición final de los dos autos y las huellas de frenado | sustentar objetivamente mi teoría sobre quién ocasionó el accidente. |
| Agente de Tránsito | registrar si hubo heridos transportados al hospital | vincular este accidente al reporte médico en caso de un juicio por lesiones u homicidio culposo. |

---


## 5.10 Módulo Departamento de Tecnología y Ciberseguridad

### 5.9.1 CU-45: Iniciar / Cerrar Sesión
**Tabla 1: Caso de uso Iniciar / Cerrar Sesión**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-45 |
| **Nombre del caso de uso** | Iniciar / Cerrar Sesión |
| **Actor** | Usuario |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Verificar la identidad del agente para autorizar el ingreso al entorno policial digital. |
| **Descripción** | Mecanismo de autenticación (Login/Logout) usando credenciales institucionales y, preferiblemente, biometría (MFA), asegurando el no repudio de todas las acciones del sistema. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | loguearme utilizando mi placa y mi lector de huella dactilar | acceder al sistema rápidamente sin tener que memorizar y tipear passwords complejos en el vehículo. |

---

### 5.9.2 CU-46: Gestionar Usuarios y Roles (RBAC)
**Tabla 1: Caso de uso Gestionar Usuarios y Roles (RBAC)**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-46 |
| **Nombre del caso de uso** | Gestionar Usuarios y Roles (RBAC) |
| **Actor** | Administrador del Sistema |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Controlar qué módulos y datos puede leer o alterar cada nivel jerárquico. |
| **Descripción** | Creación, suspensión y asignación de privilegios granulares (Role-Based Access Control). Ej: Un patrullero no puede cerrar casos de homicidio, solo un Sheriff o Detective puede hacerlo. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Administrador del Sistema | poder asignar el rol de 'Sheriff' a un usuario promovido recientemente | que ahora pueda ver y aprobar las solicitudes de los oficiales bajo su mando. |
| Administrador del Sistema | suspender lógicamente la cuenta de un oficial investigado por corrupción | evitar que acceda a las bases de datos de testigos protegidos. |

---

### 5.9.3 CU-47: Consultar Bitácora de Auditoría
**Tabla 1: Caso de uso Consultar Bitácora de Auditoría**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-47 |
| **Nombre del caso de uso** | Consultar Bitácora de Auditoría |
| **Actor** | Administrador del Sistema, Sheriff |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Garantizar que todo movimiento en el sistema sea rastreable en juicios o auditorías internas. |
| **Descripción** | Registro continuo de toda lectura, creación, modificación o eliminación (CRUD) hecha por los usuarios, guardando IP, timestamp y datos exactos alterados. Ningún usuario puede borrar esta bitácora. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | buscar qué oficial consultó el expediente de una celebridad ayer | sancionar la filtración de información confidencial a la prensa. |
| Sistema SafeCity | registrar cada vez que un oficial cambia un campo y guardar la versión antigua y la nueva | tener transparencia total de los cambios. |

---

### 5.9.4 CU-48: Ejecutar Respaldo de Base de Datos
**Tabla 1: Caso de uso Ejecutar Respaldo de Base de Datos**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-48 |
| **Nombre del caso de uso** | Ejecutar Respaldo de Base de Datos |
| **Actor** | Administrador del Sistema, Sistema |
| **Prioridad** | Crítica (10 — Nivel Operativo) |
| **Propósito del CU** | Proteger la data criminalística de ataques de ransomware y fallos de hardware. |
| **Descripción** | Procedimiento automático y manual (Backup) que comprime y encripta la base de datos SQL y los archivos adjuntos, subiéndolos a repositorios seguros externos o unidades frías. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sistema SafeCity | hacer un backup automático incremental todos los días a las 03:00 AM | prevenir pérdida de datos gubernamentales masivos sin intervención humana. |
| Administrador del Sistema | poder lanzar un backup completo manualmente antes de una gran actualización del sistema | garantizar un punto de restauración inmediato. |

---

### 5.9.5 CU-49: Recuperar o Restablecer Contraseña de Usuario
**Tabla 1: Caso de uso Recuperar o Restablecer Contraseña de Usuario**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-49 |
| **Nombre del caso de uso** | Recuperar o Restablecer Contraseña de Usuario |
| **Actor** | Administrador del Sistema, Usuario |
| **Prioridad** | Alta (8 — Nivel Operativo) |
| **Propósito del CU** | Evitar el bloqueo operacional por olvido de credenciales. |
| **Descripción** | Flujo seguro donde el usuario puede solicitar un restablecimiento de clave vía correo electrónico institucional o solicitar directamente al administrador que reseteé su PIN/Password provisorio. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Oficial de Patrulla | solicitar una contraseña temporal porque olvidé mi PIN luego de mis vacaciones | poder ingresar al despacho y comenzar a trabajar hoy. |
| Administrador del Sistema | forzar a que el oficial cambie su contraseña obligatoriamente al hacer login por primera vez tras un reseteo | garantizar que la seguridad no dependa del IT. |

---

## 5.11 Módulo Laboratorio de Análisis Predictivo e IA

### 5.10.1 CU-50: Generar Reportes Estadísticos Mensuales y Anuales
**Tabla 1: Caso de uso Generar Reportes Estadísticos Mensuales y Anuales**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-50 |
| **Nombre del caso de uso** | Generar Reportes Estadísticos Mensuales y Anuales |
| **Actor** | Analista de Inteligencia Criminal, Sheriff |
| **Prioridad** | Alta (9 — Nivel Operativo) |
| **Propósito del CU** | Extraer inteligencia accionable para alcaldía y conferencias de prensa. |
| **Descripción** | Dashboard que compila métricas consolidadas: porcentaje de incremento de homicidios, índice de crímenes violentos vs crímenes de propiedad, y tasa de resolución de casos (Clearance Rate). |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Sheriff | exportar un reporte PDF con la comparativa de robos del año actual vs el año anterior | presentarlo ante el concejo municipal en la solicitud de presupuesto. |
| Analista de Inteligencia Criminal | visualizar gráficos de barras sobre los delitos más frecuentes del mes | poder medir la eficacia operativa. |

---

### 5.10.2 CU-51: Realizar Análisis Predictivo y Pronóstico de Puntos Calientes
**Tabla 1: Caso de uso Realizar Análisis Predictivo y Pronóstico de Puntos Calientes**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-51 |
| **Nombre del caso de uso** | Realizar Análisis Predictivo y Pronóstico de Puntos Calientes |
| **Actor** | Analista de Inteligencia Criminal, Sistema |
| **Prioridad** | Alta (10 — Nivel Operativo) |
| **Propósito del CU** | Prevenir crímenes antes de que ocurran anticipando los movimientos delictivos futuros. |
| **Descripción** | Motor estadístico o de Machine Learning que correlaciona estacionalidad, fases lunares, clima y tendencias históricas para pronosticar áreas geográficas de altísima vulnerabilidad para el próximo turno. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Analista de Inteligencia Criminal | ejecutar un modelo de series temporales | que el sistema me proyecte la tendencia criminal para el fin de semana largo. |
| Sistema SafeCity | señalar en amarillo las zonas que matemáticamente tienen mayor probabilidad de sufrir asaltos el viernes por la noche | que los Sheriffs envíen unidades disuasivas previamente. |

---

### 5.10.3 CU-52: Ejecutar Análisis de Vínculos Criminales en forma de Red
**Tabla 1: Caso de uso Ejecutar Análisis de Vínculos Criminales en forma de Red**
| Elemento | Descripción |
| :--- | :--- |
| **Identificador del caso de uso** | CU-52 |
| **Nombre del caso de uso** | Ejecutar Análisis de Vínculos Criminales en forma de Red |
| **Actor** | Analista de Inteligencia Criminal |
| **Prioridad** | Media (8 — Nivel Operativo) |
| **Propósito del CU** | Desmantelar la jerarquía oculta de organizaciones criminales conectando puntos dispersos. |
| **Descripción** | Herramienta visual que grafica nodos (sospechosos, vehículos, armas, incidentes) y aristas (relaciones). Ayuda a descubrir al líder central de una pandilla analizando con quiénes fueron arrestados los cómplices menores. |

**Tabla 2: Historias de usuario**
| Como... | Quiero... | Para... |
| :--- | :--- | :--- |
| Analista de Inteligencia Criminal | graficar la red de contactos del Sospechoso 'El Gato' | ver visualmente con cuántos otros individuos de la base de datos ha sido detenido previamente y descubrir su anillo de protección. |
| Analista de Inteligencia Criminal | vincular 5 casos de robos usando la misma patente vehicular | demostrar que están orquestados por el mismo grupo criminal estructurado. |

---



---

