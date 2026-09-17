# 📊 Guion y Estructura de Diapositivas: "Skills en Agentes de Inteligencia Artificial"
### Feria de Proyectos / Exposición de Construcción de Software · UTEQ

Este documento contiene la estructura completa diapositiva por diapositiva para tu presentación, incluyendo el contenido visual que va en la pantalla y el **guion de exposición (lo que debes decir)** para hablar con fluidez y dominio técnico.

---

## 🎯 RESUMEN EJECUTIVO DE LA PRESENTACIÓN
* **Tema Central:** *Skills (Habilidades Modulares)* en arquitecturas de agentes de IA y sistemas avanzados de desarrollo.
* **Objetivo de la Charla:** Explicar cómo las *Skills* permiten transformar un modelo de lenguaje generalista en un asistente experto especializado en procedimientos de ingeniería complejos sin saturar su ventana de contexto.
* **Duración sugerida:** 7 a 10 minutos (8 a 9 diapositivas).

---

# 📑 DIAPOSITIVA POR DIAPOSITIVA

---

### 🖥️ DIAPOSITIVA 1: Portada
* **Título:** Skills en Agentes de Inteligencia Artificial: Extensión Modular de Capacidades en Ingeniería de Software
* **Subtítulo:** De Asistentes Conversacionales a Agentes Expertos en Procedimientos Complejos
* **Presentador:** Jeremy Jaramillo
* **Materia / Evento:** Construcción de Software — II Feria de Proyectos · UTEQ

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Buenos días con todos. Hoy les voy a presentar un concepto fundamental en la arquitectura de agentes inteligentes de última generación: las **Skills** o Habilidades Modulares. Veremos cómo esta tecnología permite que modelos de lenguaje dejen de ser simples asistentes de texto y se conviertan en ingenieros especializados capaces de ejecutar flujos de trabajo técnicos, ejecutar herramientas y seguir procedimientos rigurosos dentro de un proyecto."*

---

### 🖥️ DIAPOSITIVA 2: ¿Qué es una Skill y por qué es necesaria?
* **Puntos Visuales (Bullets):**
  * **Problema:** Los LLMs generalistas olvidan reglas complejas o consumen demasiados tokens si se les da todo el manual de golpe.
  * **Definición de Skill:** Paquete modular de conocimiento, instrucciones y scripts que enseña al agente un procedimiento o *runbook* especializado.
  * **Propósito:** Capacitar al agente para resolver tareas de varios pasos (ej. pruebas automatizadas, despliegues, migraciones de base de datos) de forma predecible y estandarizada.
* **Elemento Gráfico:** Diagrama de transición: `LLM Base (Generalista) + Skill (Especializada) ➔ Agente Experto`.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Un modelo de lenguaje tradicional es generalista: sabe un poco de todo, pero no conoce las reglas específicas de nuestra arquitectura ni cómo compilar o testear nuestro sistema. Si intentamos escribirle un prompt gigante con todas las instrucciones del proyecto en cada mensaje, saturamos su memoria y generamos alucinaciones. Una **Skill** resuelve esto: es una cápsula de conocimiento bajo demanda que le enseña al agente exactamente qué pasos seguir, qué comandos ejecutar y cómo verificar los resultados para una tarea puntual."*

---

### 🖥️ DIAPOSITIVA 3: Anatomía y Estructura de una Skill
* **Puntos Visuales (Bullets):**
  * Organización en carpetas dentro del repositorio (`.agents/skills/<nombre>/`).
  * **Estructura Estándar:**
    * 📄 `SKILL.md` *(Obligatorio)*: Archivo maestro con metadatos y pasos paso a paso.
    * 📁 `scripts/` *(Opcional)*: Scripts ejecutables (`.py`, `.sh`, `.ps1`) que el agente puede invocar.
    * 📁 `examples/` *(Opcional)*: Casos de uso de referencia y entradas/salidas esperadas.
    * 📁 `references/` *(Opcional)*: Documentación extensa, manuales de API o diagramas.
    * 📁 `resources/` *(Opcional)*: Plantillas de código, schemas JSON o assets.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Una Skill no es solo un texto suelto; tiene una estructura de directorios profesional. En la raíz contiene el archivo obligatorio `SKILL.md`. Pero además, una Skill avanzada se apoya en carpetas auxiliares: scripts de automatización para que el agente no invente comandos, ejemplos de código para guiar su respuesta, y referencias técnicas detalladas que solo leerá si es estrictamente necesario."*

---

### 🖥️ DIAPOSITIVA 4: El Archivo Maestro (`SKILL.md`) y Frontmatter
* **Puntos Visuales (Bullets):**
  * **YAML Frontmatter:** Encabezado con metadatos clave para el descubrimiento del agente.
    * `name`: Identificador único (ej. `generative_ui`, `db-migration`).
    * `description`: Explica **QUÉ** hace y **CUÁNDO** activarse (en tercera persona).
  * **Cuerpo de Instrucciones:** Pasos claros, validaciones de éxito y enlaces relativos a scripts.
* **Ejemplo de Código en Pantalla:**
  ```yaml
  ---
  name: test-runner-safecity
  description: Ejecuta y valida las pruebas unitarias y de integración del backend Django y ClickHouse.
  ---
  # Instrucciones del Procedimiento
  1. Ejecutar el script de preparación: `./scripts/setup_test_db.sh`
  2. Correr pytest y verificar que el código de salida sea 0.
  ```

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"El corazón de la Skill es el archivo `SKILL.md`. Lo más interesante es su encabezado en formato YAML. El campo `description` es crucial porque el agente principal lo lee al inicio para decidir de forma autónoma: '¿Esta petición del usuario requiere esta habilidad?'. Si la respuesta es sí, el agente carga el contenido completo y ejecuta las instrucciones paso a paso."*

---

### 🖥️ DIAPOSITIVA 5: Mecanismo Clave: Progressive Disclosure (Divulgación Progresiva)
* **Puntos Visuales (Bullets):**
  * **Optimización de Contexto:** El agente NO carga todas las skills a la memoria RAM de inicio.
  * **Fase 1 (Descubrimiento):** Solo se inyecta el `name` y `description` (muy pocos tokens).
  * **Fase 2 (Activación On-Demand):** Si el usuario pide una tarea relacionada, el agente abre y lee el `SKILL.md`.
  * **Fase 3 (Profundización):** Si necesita detalles adicionales, lee los archivos de `references/`.
* **Beneficios:** Cero saturación de memoria, costos de API reducidos y mayor precisión sin alucinaciones.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Aquí radica la elegancia técnica del sistema: la **Divulgación Progresiva** o *Progressive Disclosure*. Imaginen tener 50 habilidades instaladas; si cargáramos todas al inicio, consumiríamos la ventana de contexto del modelo. Con este mecanismo, el agente solo tiene un índice ligero de nombres y descripciones. Únicamente cuando el usuario formula una consulta que coincide con la descripción de una Skill, el agente la activa y lee sus instrucciones detalladas."*

---

### 🖥️ DIAPOSITIVA 6: Comparativa: Skills vs. Rules vs. Subagents vs. MCP
* **Tabla Comparativa en Pantalla:**

| Concepto | Ubicación | Modo de Activación | ¿Para qué sirve? |
| :--- | :--- | :--- | :--- |
| **Rules (`AGENTS.md`)** | Raíz del proyecto | Siempre activas / Contextuales | Políticas estrictas de código e idioma. |
| **Skills (`SKILL.md`)** | `.agents/skills/` | Progresivo / Bajo demanda | Procedimientos, guías paso a paso y flujos de trabajo. |
| **Subagents** | Contexto separado | Invocación explícita | Paralelismo y tareas largas sin mezclar historial. |
| **MCP Servers** | Protocolo JSON-RPC | Llamadas a herramientas | Conexión con APIs externas, bases de datos o terminales. |

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Es común confundir las piezas del ecosistema de agentes. Para aclararlo:  
> - Las **Rules** son leyes que aplican siempre (como 'escribe todo en español').  
> - Las **Skills** son procedimientos y recetas de cocina para tareas concretas.  
> - Los **Subagents** son otros agentes que trabajan en paralelo en hilos separados.  
> - Y los **Servidores MCP** son los puentes y enchufes que permiten conectar al agente con bases de datos externas o servicios en la nube."*

---

### 🖥️ DIAPOSITIVA 7: Buenas Prácticas para Diseñar Skills
* **Puntos Visuales (Bullets):**
  * **1. Descripción orientada a la acción:** Describir con exactitud cuándo debe intervenir el agente.
  * **2. Helpers ejecutables:** Crear scripts en `scripts/` para evitar que la IA improvise líneas de comando complejas.
  * **3. Pasos de verificación (QA):** Enseñar al agente a auto-verificar si la tarea tuvo éxito (ej. verificar logs o status HTTP 200).
  * **4. No redundancia:** No explicar conceptos obvios que el modelo ya domina (como sintaxis básica de Python).

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Para que una Skill sea realmente efectiva, la industria sigue 4 buenas prácticas: primero, redactar descripciones precisas; segundo, empaquetar comandos largos en scripts ejecutables; tercero, indicarle al agente cómo verificar que lo que hizo funciona correctamente; y cuarto, mantener las instrucciones concisas, enfocadas únicamente en lo que hace único a nuestro proyecto."*

---

### 🖥️ DIAPOSITIVA 8: Caso de Éxito en SafeCity Intelligence Ops
* **Puntos Visuales (Bullets):**
  * **Skill de ETL y Big Data:** Guió al agente para orquestar pipelines en Apache Airflow, comprimir en Parquet y poblar ClickHouse con +300k registros.
  * **Skill de UI Generativa / GIS:** Procedimiento especializado para renderizar capas geoespaciales en Leaflet y mapas de calor sin errores de compilación en Angular.
  * **Impacto Medible:** 
    * Reducción del tiempo de configuración en un 70%.
    * Cero errores de incompatibilidad entre versiones de backend y frontend.
    * Desarrollo guiado por especificaciones 100% reproducible.

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"En nuestro proyecto SafeCity, las Skills fueron la columna vertebral. Por ejemplo, creamos una Skill para la ingesta de datos que le enseñaba al agente cómo validar los esquemas columnares de ClickHouse y cómo configurar los DAGs de Apache Airflow. Gracias a esto, cualquier desarrollador o agente de IA que entra al proyecto puede ejecutar tareas complejas de ingeniería de datos sin romper la arquitectura existente."*

---

### 🖥️ DIAPOSITIVA 9: Conclusiones
* **Puntos Visuales (Bullets):**
  * **Estandarización del Conocimiento:** Las Skills convierten el *know-how* tácito del equipo en activos de software versionables en Git.
  * **Escalabilidad y Eficiencia:** Permiten extender las capacidades del agente de forma infinita sin inflar el costo de tokens.
  * **El Futuro de la Ingeniería de Software:** Hacia equipos híbridos donde los ingenieros definen Skills y los agentes de IA las ejecutan con precisión quirúrgica.
* **Mensaje de Cierre:** *"El valor ya no está solo en escribir código, sino en diseñar las especificaciones y habilidades que guían a la IA."*

> 🎙️ **Guion del Expositor (Qué decir):**  
> *"Para concluir: las Skills representan la evolución del desarrollo de software. Nos permiten guardar el conocimiento técnico del equipo dentro del mismo repositorio y ponerlo a disposición de agentes autónomos. Al final del día, esto nos permite construir software más robusto, más rápido y con los más altos estándares de calidad. Muchas gracias por su atención y quedo atento a sus preguntas."*
