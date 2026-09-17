# 📊 Diapositivas y Guion de Exposición: Spec-Driven Development (SDD)
### Construcción de Software Guiada por Especificaciones e Inteligencia Artificial
**Feria de Proyectos — Construcción de Software · UTEQ (Paralelo B)**  
**Autor:** Jeremy Jaramillo · **Proyecto:** SafeCity Intelligence Ops

---

## 🎯 RESUMEN EJECUTIVO DE LA EXPOSICIÓN
* **Tema Central:** Metodología **Spec-Driven Development (SDD)** y el marco de desarrollo guiado por especificaciones con IA.
* **Pregunta Clave que Responde:** ¿Cómo construir software empresarial de alta complejidad con Inteligencia Artificial garantizando arquitectura sólida, cero alucinaciones y cumplimiento estricto de los objetivos del negocio?
* **Duración recomendada:** 8 a 10 minutos (9 diapositivas estructuradas con apoyos visuales y guion paso a paso).

---

# 📑 CONTENIDO DIAPOSITIVA POR DIAPOSITIVA

---

### 🖥️ DIAPOSITIVA 1: Portada
* **Título Principal:** Spec-Driven Development (SDD): Metodología de Construcción de Software Guiada por Especificaciones e IA
* **Subtítulo:** De los Objetivos Estratégicos del Negocio a la Implementación con Trazabilidad Total
* **Presentador:** Jeremy Jaramillo
* **Proyecto de Demostración:** SafeCity Intelligence Ops
* **Evento / Institución:** II Feria de Proyectos de Construcción de Software · Universidad Técnica Estatal de Quevedo (UTEQ)

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Buenos días con todos, estimado docente y compañeros. Hoy les voy a presentar la metodología **Spec-Driven Development (SDD)** o Desarrollo Guiado por Especificaciones. Veremos cómo esta disciplina de ingeniería transforma la forma en que construimos software asistido por Inteligencia Artificial, asegurando que cada línea de código responda directamente a los objetivos estratégicos de la organización y a contratos arquitectónicos estrictos."*

---

### 🖥️ DIAPOSITIVA 2: El Problema: Del "Vibe Coding" al Desarrollo Formal
* **Puntos Visuales (Bullets / Cajas de contraste):**
  * ❌ **Desarrollo Tradicional & Prompting Informal ("Vibe Coding"):**
    * Pedirle a la IA que programe "a ciegas" mediante prompts conversacionales sueltos.
    * Consecuencias: Código espagueti, deuda técnica instantánea, alucinación de librerías y pérdida de reglas de negocio.
  * ✅ **La Respuesta con SDD (Spec-Driven Development):**
    * La especificación formal es la **Única Fuente de Verdad** (*Single Source of Truth*).
    * Ninguna IA ni desarrollador escribe una sola línea de código sin que antes existan requisitos, planes de datos y criterios de aceptación formalizados.
* **Frase de Impacto:** *"Si la especificación no está clara, el código resultante será impredecible."*

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Hoy en día es fácil caer en la trampa del 'Vibe Coding', que consiste en pedirle a un asistente de IA que genere pantallas y controladores mediante mensajes improvisados. El resultado suele ser desastroso: código redundante, bases de datos mal estructuradas y reglas de negocio violadas.  
> **Spec-Driven Development** cambia radicalmente este paradigma: establece que la especificación es la única fuente de verdad. La IA no improvisa; implementa rigurosamente un contrato técnico previamente validado por el ingeniero."*

---

### 🖥️ DIAPOSITIVA 3: ¿Qué es Spec-Driven Development (SDD)?
* **Puntos Visuales (Bullets):**
  * **Definición:** Metodología sistemática donde el diseño de software se desacopla en documentos de especificación estructurados antes de la fase de codificación.
  * **Los 3 Pilares Fundamentales:**
    1. **Enfoque de Negocio Primero:** Cada requerimiento nace de un objetivo de la empresa, no de simples deseos técnicos.
    2. **Desacoplamiento Modular:** División del sistema en paquetes funcionales independientes y autónomos.
    3. **Implementación Asistida por IA:** La IA actúa como un compilador de especificaciones a código ejecutable.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"¿Qué es entonces SDD? Es una metodología que divide el ciclo de vida del software en especificaciones modulares y verificables. En lugar de sentarnos a programar inmediatamente, el ingeniero diseña la lógica, modela los datos y establece los escenarios de prueba. La IA recibe estos documentos y se encarga de la codificación repetitiva con máxima fidelidad arquitectónica."*

---

### 🖥️ DIAPOSITIVA 4: La Constitución del Sistema: La Ley Suprema
* **Puntos Visuales (Bullets):**
  * **Concepto:** Documento maestro (`Archivo_Constitucion.md`) que establece las directrices no negociables de todo el proyecto.
  * **¿Qué define la Constitución?**
    * **Arquitectura Tecnológica:** Backend en Django DRF, Frontend en Angular 17+, Base de Datos Columnar en ClickHouse y Supabase S3.
    * **Integridad Forense:** Prohibición absoluta de borrado físico (*Hard Delete*) y obligatoriedad de borrado lógico (*Soft Delete*).
    * **Ciberseguridad y RBAC:** Matriz de roles estrictos, autenticación por JWT y bitácoras de auditoría inmutables (*append-only*).
    * **Estándar Lingüístico:** Interfaz, variables, esquemas y endpoints 100% en español.
  * **Regla Suprema:** *Ninguna Spec ni línea de código puede contradecir la Constitución.*

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"En la cúspide de SDD se encuentra la **Constitución del Sistema**. Es la 'Corte Suprema' del software: contiene las leyes universales que ningún módulo puede violar. Por ejemplo, en nuestro proyecto SafeCity, la Constitución prohíbe terminantemente borrar registros físicos de incidentes policiales, obliga al uso de tokens JWT y estandariza que todo el esquema de datos y la interfaz gráfica estén estrictamente en español. Si la IA intenta sugerir algo fuera de estas leyes, el marco de desarrollo lo rechaza automáticamente."*

---

### 🖥️ DIAPOSITIVA 5: Anatomía de una Spec: Los 4 Archivos Esenciales
* **Diagrama Visual de la Carpeta de Módulo:**
  ```
  📁 specs/operativo/incidentes/
  ├── 📄 spec.md       ➜ El QUÉ (Requisitos del Negocio y Dominio)
  ├── 📄 plan.md       ➜ El CÓMO (Arquitectura Técnica y Modelos)
  ├── 📄 tasks.md      ➜ El PASO A PASO (Plan de Ejecución por Sprints)
  └── 📄 checklist.md  ➜ La VERIFICACIÓN (Control de Calidad y SLAs)
  ```
* **Resumen de cada archivo:**
  * **`spec.md`:** Requisitos Funcionales (RF), No Funcionales (RNF), Reglas de Negocio (RN) y Escenarios BDD (*Dado que / Cuando / Entonces*).
  * **`plan.md`:** Esquemas de tablas ClickHouse (`MergeTree`), contratos de endpoints REST y componentes Angular.
  * **`tasks.md`:** Desglose secuencial de tareas con casillas de verificación (`[x]`).
  * **`checklist.md`:** Criterios de QA, pruebas de casos borde, latencia < 800ms y validación de seguridad.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Cada módulo funcional del sistema se encapsula en una carpeta con 4 archivos fundamentales:  
> 1. El archivo **spec.md** define el QUÉ: qué necesita el usuario, los requisitos funcionales y los escenarios de uso.  
> 2. El archivo **plan.md** define el CÓMO: qué tablas crear en ClickHouse, qué rutas de API exponer en Django y qué componentes crear en Angular.  
> 3. El archivo **tasks.md** define el PASO A PASO: una guía de tareas dividida por sprints para que la IA avance metódicamente sin perderse.  
> 4. Y el archivo **checklist.md** define la VERIFICACIÓN: la lista de control de calidad para auditar que el sistema responde en menos de 800 milisegundos y maneja casos de error de forma segura."*

---

### 🖥️ DIAPOSITIVA 6: Jerarquía de Negocio: Estratégico ➔ Táctico ➔ Operativo
* **Puntos Visuales (Pirámide de Gestión):**
  * 🔺 **Nivel Estratégico (OE):**
    * *Propósito:* Decide el rumbo y rentabilidad del negocio.
    * *En SafeCity:* Tablero ejecutivo del Sheriff y predicción de delitos a largo plazo con Machine Learning.
  * 🔹 **Nivel Táctico (OT):**
    * *Propósito:* Coordina recursos y áreas operativas.
    * *En SafeCity:* Mapas de calor GIS, cobertura de cuadrantes y mantenimiento predictivo de patrullas.
  * 🔻 **Nivel Operativo (OP):**
    * *Propósito:* Tareas transaccionales del día a día.
    * *En SafeCity:* Captura GPS de emergencias, consola CAD 911, control de celdas y bitácora de detenidos.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Una ventaja clave de SDD es que conecta directamente la estrategia empresarial con las líneas de código mediante tres niveles de gestión:  
> - En el nivel **Estratégico**, el sistema entrega KPIs consolidados a los tomadores de decisiones.  
> - En el nivel **Táctico**, permite a los coordinadores planificar patrullajes y predecir averías mecánicas.  
> - Y en el nivel **Operativo**, agiliza el trabajo diario de los oficiales en campo con geolocalización y formularios rápidos. Cada función del software tiene una razón de ser en esta jerarquía."*

---

### 🖥️ DIAPOSITIVA 7: Ciclo de Vida SDD e Integración con Agentes de IA
* **Diagrama de Fases:**
  ```
  1. Definición del Problema ──► 2. Recolección (OE/OT/OP) ──► 3. Spec Formal (spec.md)
                                                                       │
  6. Implementación IA  ◄── 5. Diseño Técnico (plan.md) ◄── 4. Validación (Constitución)
          │
          ▼
  7. Tareas (tasks.md) ──► 8. Verificación (checklist.md) ──► 9. Despliegue y Mantenimiento
  ```
* **El Rol del Desarrollador:** Pasa de ser un "picador de código" a un **Arquitecto de Especificaciones y Auditor de Calidad**.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"El ciclo de vida en SDD consta de 9 fases metódicas. El desarrollador lidera las primeras 5 fases redactando y validando las especificaciones. En la fase 6, los agentes de IA (como Claude Code o Cursor) consumen la Spec y el Plan para generar el código fuente con un nivel de precisión asombroso. Finalmente, las fases de pruebas y checklist garantizan que el código cumple el 100% de los criterios antes de llegar a producción."*

---

### 🖥️ DIAPOSITIVA 8: Caso Práctico Real: SafeCity Intelligence Ops
* **Puntos Visuales (Métricas y Resultados del Proyecto):**
  * **35 Archivos de Especificación Formal:** Divididos en 6 dominios (Incidentes, Inteligencia, Logística, RRHH, Seguridad, Tránsito).
  * **Capacidad Analítica Big Data:** Ingesta y consulta de **+300,000 registros policiales** en ClickHouse en **< 800 ms**.
  * **Inteligencia Artificial Dual:**
    * *IA Externa:* Agentes que construyeron el sistema guiados por SDD.
    * *IA Interna:* Modelos de Regresión y Random Forest en Python para predecir puntos calientes de delincuencia y desgaste de patrullas.
  * **Impacto:** Reducción del **400% en el tiempo de desarrollo** y cero deuda técnica.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"En nuestro proyecto SafeCity aplicamos esta metodología de principio a fin. Creamos más de 35 archivos de especificación para estructurar 6 módulos operativos. Gracias a SDD, logramos integrar una base de datos columnar de alto rendimiento como ClickHouse, construir una consola de despacho 911 en tiempo real en Angular y desplegar modelos de Inteligencia Artificial para predecir fallas mecánicas y criminalidad, todo con una sincronización arquitectónica impecable."*

---

### 🖥️ DIAPOSITIVA 9: Conclusiones y Beneficios Clave
* **Puntos Visuales (Resumen Final):**
  * 🎯 **Trazabilidad Absoluta:** Cada botón y endpoint responde a un objetivo de negocio cuantificable (KPI).
  * ⚡ **Desarrollo Ágil y Controlado:** La IA programa a velocidad récord sin alucinar gracias a las restricciones de la Constitución.
  * 🔄 **Mantenibilidad y Escalabilidad:** Nuevos desarrolladores pueden entender y extender el sistema en minutos simplemente leyendo las Specs.
* **Mensaje de Cierre:** *"En la era de la Inteligencia Artificial, el código es abundante; la claridad en la especificación es lo que marca la excelencia en la ingeniería."*

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Para finalizar: Spec-Driven Development no es solo una técnica de documentación, es la metodología del presente y del futuro para el desarrollo de software asistido por IA. Nos enseña que cuando los requisitos, la arquitectura y las reglas están formalmente especificados, la IA se convierte en el aliado más potente de la ingeniería. Muchas gracias por su atención."*
