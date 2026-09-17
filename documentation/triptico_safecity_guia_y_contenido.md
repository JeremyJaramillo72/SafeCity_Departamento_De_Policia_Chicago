# 📄 Guía y Contenido para el Tríptico — SafeCity Intelligence Ops
### Feria de Proyectos de Construcción de Software · UTEQ (Paralelo B)

Este documento contiene la explicación conceptual y metodológica del enfoque **Spec-Driven Development (SDD)** junto con todo el texto redactado, panel por panel, listo para ser copiado y pegado en la plantilla oficial del tríptico.

---

# 🧠 SECCIÓN 1: FUNDAMENTOS — SPEC, CONSTITUCIÓN Y SUS ARCHIVOS

En el desarrollo de software asistido por Inteligencia Artificial (metodología **Spec-Driven Development** o *Desarrollo Guiado por Especificaciones*), el sistema se planifica formalmente a través de un contrato de requisitos y arquitectura antes de generar código.

```
                  ┌─────────────────────────────────────────┐
                  │       📜 CONSTITUCIÓN DEL SISTEMA       │  <-- Leyes supremas no negociables
                  │  (Arquitectura, Idioma, RBAC, etc.)     │
                  └────────────────────┬────────────────────┘
                                       │
       ┌───────────────────────────────┴───────────────────────────────┐
       ▼                                                               ▼
┌─────────────────────────────────┐               ┌─────────────────────────────────┐
│     📁 SPEC: INCIDENTES         │               │      📁 SPEC: LOGÍSTICA         │
│ ├─ 📄 incidentes-spec.md        │               │ ├─ 📄 logistica-spec.md         │
│ ├─ 📄 plan.md                   │               │ ├─ 📄 plan.md                   │
│ ├─ 📄 tasks.md                  │               │ ├─ 📄 tasks.md                  │
│ └─ 📄 checklist.md              │               │ └─ 📄 checklist.md              │
└─────────────────────────────────┘               └─────────────────────────────────┘
```

---

## 1.1. ¿Qué es la Constitución? (`constitution.md` / `Archivo_Constitucion.md`)

Es el **documento supremo de leyes arquitectónicas, reglas de negocio e ingeniería inquebrantables** que rigen todo el ecosistema de software.
* **Propósito:** Actúa como la "Corte Suprema" del sistema. Ningún desarrollador ni agente de IA puede generar código que viole sus directrices.
* **Aspectos que define:**
  1. **Arquitectura Base y Tecnologías:** Backend en Django DRF, Frontend en Angular 17+ (Standalone Components), Base de datos columnar en ClickHouse, Docker y Supabase S3.
  2. **Reglas de Integridad y Almacenamiento Forense:** Prohibición estricta de borrado físico (*Hard Delete*), obligatoriedad de *Soft Delete* e inmutabilidad de bitácoras (*append-only*).
  3. **Seguridad y Control de Acceso (RBAC):** Roles oficiales (`administrador`, `detective`, `oficial`, `operador_emergencias`, `recursos_humanos`, etc.), autenticación por JSON Web Tokens (JWT) y auditoría inmutable de accesos.
  4. **Estándar de Idioma:** Frontend e interfaz gráfica 100% en **Español**; esquemas, tablas, variables y backend también en **Español**.

---

## 1.2. ¿Qué es una Spec y qué archivos contiene?

Una **Spec (Especificación)** es el contrato modular que define en detalle un dominio o funcionalidad específica del sistema (ej. *Módulo de Incidentes*, *Módulo de Logística y Flota*, *Módulo de Recursos Humanos*). Cada módulo contiene **4 archivos esenciales**:

### A. `spec.md` (El QUÉ — Requisitos del Negocio y Dominio)
* **Objetivo:** Establece qué debe hacer el sistema desde la perspectiva del negocio sin mezclarse con la implementación técnica.
* **Estructura clave:**
  * **Objetivo y Contexto:** Problema operativo que resuelve y usuarios/actores involucrados.
  * **Requisitos Funcionales (RF):** Lista codificada de capacidades del sistema (ej. `RF-INC-001: Registrar Ubicación GPS`).
  * **Requisitos No Funcionales (RNF):** Restricciones de rendimiento, usabilidad y tiempo de carga (ej. `RNF-INC-002: Tiempos < 800ms`).
  * **Reglas de Negocio (RN):** Validaciones lógicas ineludibles (ej. `RN-INC-001: No guardar incidentes sin GPS`).
  * **Escenarios BDD (Dado que / Cuando / Entonces):** Casos de uso estructurados para validación.

### B. `plan.md` (El CÓMO — Diseño Arquitectónico y Técnico)
* **Objetivo:** Traduce las necesidades de la especificación a una arquitectura de software detallada.
* **Estructura clave:**
  * **Modelado de Datos:** Esquemas de tablas en ClickHouse (`ENGINE = MergeTree()`), tipos de columnas, índices y claves primarias.
  * **Contrato de API REST:** Endpoints HTTP (`GET /api/operativa/incidents/`, `POST`, `PATCH`), parámetros de consulta y estructuras JSON.
  * **Arquitectura Frontend:** Componentes de Angular requeridos, servicios inyectables, manejo de estado y bibliotecas gráficas (Leaflet, Tailwind).
  * **Fases de Desarrollo:** Hitos secuenciales de construcción.

### C. `tasks.md` (El PASO A PASO — Plan de Ejecución)
* **Objetivo:** Desglosa el trabajo en tareas granulares y ordenadas por sprints para guiar al desarrollador o al agente de IA.
* **Estructura clave:**
  * `Sprint 1:` Creación de tablas, migraciones y endpoints Core en Django.
  * `Sprint 2:` Componentes UI, mapas interactivos y formularios reactivos en Angular.
  * `Sprint 3:` Lógica de despacho CAD 911 en tiempo real y alertas.
  * `Sprint 4:` Auditoría inmutable, pruebas y guardas de seguridad (RBAC).

### D. `checklist.md` (La VERIFICACIÓN — Control de Calidad / QA)
* **Objetivo:** Lista de comprobación rigurosa para auditar que el software cumple con todos los criterios de aceptación antes de desplegarse.
* **Estructura clave:**
  * **Pruebas Funcionales:** Verificación del flujo principal de datos y autogeneración de correlativos.
  * **Pruebas de Casos Borde:** Comportamiento ante fallas de conexión GPS, datos nulos o archivos de gran tamaño.
  * **Pruebas de Rendimiento (SLAs):** Tiempos de respuesta en consultas de alto volumen en ClickHouse.
  * **Pruebas de Seguridad:** Validación de cabeceras JWT, prevención de inyecciones y permisos de rol.

---

# 📑 SECCIÓN 2: CONTENIDO PANEL POR PANEL DEL TRÍPTICO

---

## 🔵 CARA EXTERIOR (Página 2 de la Plantilla)

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│     PANEL IZQUIERDO     │      PANEL CENTRO       │      PANEL DERECHO      │
│  CONÉCTATE CON EL PROY. │   SOBRE EL PROYECTO     │        PORTADA          │
│       (Solapa)          │     (Contraportada)     │                         │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

### [Panel 1 - Izquierdo] CONÉCTATE CON EL PROYECTO

* **Código QR:**  
  `[Pegar aquí el código QR hacia el repositorio GitHub o video demostrativo]`

* **Estudiante(s) / Autor:**  
  Jeremy Jaramillo  
  `jeremy.jaramillo2021@uteq.edu.ec` · GitHub: `@JeremyJaramillo72`

* **Referencias (Formato IEEE):**  
  * **[1]** City of Chicago Data Portal, *"Crimes - 2001 to Present,"* Chicago Open Data Portal, 2024.  
  * **[2]** GitHub, *"Spec-Driven Development: Building software with AI specifications,"* GitHub Engineering, 2024.  
  * **[3]** ClickHouse Inc., *"ClickHouse High-Performance Columnar Database Documentation,"* ClickHouse Docs, 2024.  

* **Pie de página:**  
  *Construcción de Software · UTEQ · Paralelo B*

---

### [Panel 2 - Centro] SOBRE EL PROYECTO

* **Resumen:**  
  **SafeCity Intelligence Ops** es una plataforma GovTech de soporte a la decisión policial desarrollada para el **Departamento de Policía de Chicago (CPD)** por la empresa tecnológica ficticia **SafeCity Solutions**. El sistema digitaliza y centraliza la captura de incidentes 911, gestión táctica de patrullas, mantenimiento predictivo de flota e investigación criminal sobre más de 300,000 registros delictivos históricos, erradicando la lentitud del registro en papel y optimizando la respuesta ante emergencias.

* `[Insertar aquí una captura del Dashboard de Operaciones o del Mapa Táctico]`

* **3 claves para entenderlo:**  
  * **Especificación:** Hoja de ruta estructurada (Constitución, Spec, Plan, Tasks, Checklist) que definió las reglas y arquitectura antes de generar código.  
  * **IA implementadora:** Agentes de IA que transformaron especificaciones formales en código funcional en Django, Angular y ClickHouse.  
  * **Enfoque empresarial:** El sistema nació de objetivos estratégicos de optimización de recursos estatales y reducción de tiempos de respuesta (SLAs), no de simples formularios aislados.  

---

### [Panel 3 - Derecho] PORTADA

**II FERIA DE PROYECTOS**  
*Feria de Proyectos — Construcción de Software*

---

# SafeCity Intelligence Ops
### *Plataforma de Inteligencia Operativa y Despacho Táctico 911*

* `[Insertar Logo de SafeCity / Escudo Táctico Corporativo]`

* **Autor:** Jeremy Jaramillo  
* **Institución:** Universidad Técnica Estatal de Quevedo  
* **Carrera:** Ingeniería en Software / Ciencias de la Ingeniería  
* **Fecha:** Agosto 2024 / 2025  

---

## 🔵 CARA INTERIOR (Página 3 de la Plantilla — Al abrir la hoja)

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│     PANEL IZQUIERDO     │      PANEL CENTRO       │      PANEL DERECHO      │
│   EL RETO DEL NEGOCIO   │    CÓMO SE CONSTRUYÓ    │   LA IA EN EL PROCESO   │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

### [Panel 4 - Izquierdo] EL RETO DEL NEGOCIO

* **La Empresa y sus Objetivos Estratégicos:**  
  **SafeCity Solutions** es una compañía B2G (Business-to-Government) enfocada en software de misión crítica para la seguridad pública. Sus objetivos estratégicos son dotar a los comandos policiales de analítica predictiva, optimizar el uso de patrullas y garantizar la admisibilidad legal de la evidencia en cortes judiciales.

* **Necesidad que resuelve:**  
  La fragmentación de datos, lentitud en los despachos 911 y la falta de trazabilidad en las cadenas de custodia provocan demoras de hasta 25 minutos en la atención de delitos y pérdida de casos judiciales. SafeCity unifica la operación en tiempo real.

* **Indicador de Éxito (KPI):**  
  * **Reducción del Tiempo de Respuesta (SLA 911):** De 18 a menos de 6 minutos mediante despacho asistido por GPS.  
  * **Disponibilidad de Flota:** Mantenimiento preventivo por IA superior al 92%.  
  * **Velocidad de Consulta Masiva:** Consultas analíticas sobre >300,000 crímenes en menos de **800 ms** en ClickHouse.  

* `[Insertar captura o diagrama de dashboard ejecutivo / KPIs]`

---

### [Panel 5 - Centro] CÓMO SE CONSTRUYÓ

**Niveles de gestión: estratégico · táctico · operativo**

* **Resumen del enfoque basado en especificaciones:**  
  El software se construyó bajo la metodología **Spec-Driven Development (SDD)**. La **Constitución** definió leyes inmutables (RBAC, soft-delete, idioma español), mientras que las **Specs modulares** (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) guiaron la generación exacta de APIs y componentes frontend mediante IA sin desviaciones arquitectónicas.

* **Funciones reales en los 3 niveles de gestión:**  
  * **Estratégico:** Tablero ejecutivo consolidado con KPIs departamentales del Sheriff y modelo de Machine Learning para predecir tendencias delictivas anuales.  
  * **Táctico:** Mapa de calor geoespacial (GIS) para distribución de cuadrantes y modelo predictivo de fallas mecánicas en flota de patrullas.  
  * **Operativo:** Registro de incidentes en campo con captura GPS, consola de despacho CAD 911 e inventario inmutable de celdas y detenidos.  

* **Stack utilizado:**  
  * **Backend:** Django 5 & Django REST Framework (Python)  
  * **Frontend:** Angular 17+ (Standalone Components, Tailwind CSS, Leaflet GIS)  
  * **Bases de Datos:** ClickHouse Columnar DB (Analítica Big Data) & Supabase S3 (Archivos)  
  * **DevOps / ETL:** Docker persistence & Apache Airflow (Pipelines Parquet)  

---

### [Panel 6 - Derecho] LA IA EN EL PROCESO

* **IA que implementó el sistema (~95 palabras):**  
  Se utilizaron asistentes avanzados de codificación (**Claude Code / Cursor / Antigravity**) alimentados de forma modular por la Constitución y los documentos de especificación (`spec.md` y `plan.md`). La entrega por módulos funcionales (Incidentes, Logística, Tránsito, RRHH) permitió generar endpoints REST y componentes en Angular con tipado estricto. Los ajustes manuales fueron mínimos, limitándose a la calibración de capas geoespaciales en Leaflet y afinamiento de consultas agregadas en ClickHouse. La ventaja clave fue un incremento del **400% en la velocidad de desarrollo**, garantizando cero desvío de reglas de negocio gracias al marco de especificaciones.

* `[Insertar imagen representativa de IA de programación o flujo SDD]`

* **IA como funcionalidad del sistema (Machine Learning):**  
  SafeCity integra Inteligencia Artificial dentro de su lógica operativa:  
  1. **Predicción de Delitos (Scikit-Learn):** Algoritmos de regresión sobre series temporales para proyectar puntos calientes (*hotspots*) futuros en el mapa táctico.  
  2. **Mantenimiento Predictivo de Flota (Random Forest):** Cálculo automático del *Health Score* y probabilidad de avería vehicular según telemetría y kilometraje.  
  3. **Grafos Criminales Interactivos (vis-network):** Detección de anomalías y vínculos entre sospechosos, vehículos y bandas organizadas.  

---

# 🎨 GUÍA DE IMPRESIÓN Y DOBLADO (Según la Plantilla)

1. **Paleta Oficial de la Portada:**
   * Azul Profundo: `#1D4E75`
   * Dorado: `#C29840`
2. **Formato:** Hoja A4 horizontal (apaisada), impresión a doble cara (voltear por el borde corto).
3. **Doblado:**
   * Doblar el panel derecho de la Página 1 (Portada) hacia el centro.
   * Doblar el panel izquierdo sobre el pliegue anterior.
   * Resultado: La portada queda visible al frente y al abrir se visualizan los 3 paneles interiores.
