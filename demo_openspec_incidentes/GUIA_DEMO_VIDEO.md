# 🎥 Guía de Grabación y Demostración: OpenSpec + IA (20 Minutos)

Esta carpeta (`demo_openspec_incidentes/`) está configurada específicamente para demostrar en tu video cómo construir el **Módulo de Incidentes** aplicando **OpenSpec (Spec-Driven Development)** asistido por Inteligencia Artificial en **VSCode**.

---

## 📁 Estructura del Entorno Demo

```
demo_openspec_incidentes/
├── CONSTITUCION.md          <-- Leyes supremas de SafeCity (ClickHouse, Soft Delete, Dark Mode)
├── .agents/
│   └── AGENTS.md            <-- Instrucciones de infraestructura para el Agente IA
├── specs/
│   ├── incidentes-spec.md   <-- Requisitos (RF), Reglas de Negocio (RN) y Gherkin (Given-When-Then)
│   ├── plan.md              <-- Arquitectura técnica (ClickHouse SQL, Django REST, Angular)
│   ├── tasks.md             <-- Tareas de desarrollo por Sprints
│   └── checklist.md         <-- Criterios de calidad QA y SLAs
├── docker-compose.yml       <-- Configuración de ClickHouse para Docker
├── verificar_conexion.py    <-- Script de verificación de conexión y prueba de velocidad (SLA < 800ms)
└── GUIA_DEMO_VIDEO.md       <-- Este documento
```

---

## 🤖 Prompt Maestro para Pedirle al Agente en el Video

Cuando estés grabando y abras el chat con la IA en VSCode, puedes copiar y pegar el siguiente prompt:

```text
Hola Agente. Siguiendo la metodología OpenSpec (Spec-Driven Development) y cumpliendo estrictamente con nuestra CONSTITUCION.md, implementa el Módulo de Incidentes y Despacho CAD basándote en la especificación specs/incidentes-spec.md y el plan técnico en specs/plan.md.

Por favor:
1. Revisa que las tablas en ClickHouse (chicago_crimes, incidente_delito, llamada_emergencia) cumplan con el motor MergeTree y soft delete.
2. Verifica los endpoints en Django REST Framework (/api/operativa/incidents/, /api/operativa/emergency-calls/).
3. Asegura que los componentes de Angular 17 en Modo Oscuro (#0A1128) capturen coordenadas GPS, validen el catálogo penal IUCR y permitan despachar unidades.
```

---

## ⏱️ Minuto a Minuto del Video (20 Minutos)

| Tiempo | Sección | Qué mostrar en pantalla |
|---|---|---|
| **00:00 - 02:30** | **Introducción** | Mostrar VSCode con esta carpeta, terminal con `verificar_conexion.py` y servidores activos. |
| **02:30 - 05:30** | **La Constitución** | Abrir `CONSTITUCION.md` y explicar los Artículos 1, 2, 5 (Soft Delete) y 8 (Dark Mode). |
| **05:30 - 09:30** | **OpenSpec (4 Archivos)** | Abrir `incidentes-spec.md` (Gherkin), `plan.md` (SQL/Endpoints), `tasks.md` y `checklist.md`. |
| **09:30 - 14:00** | **La IA en Acción** | Enviar el prompt a la IA y mostrar cómo la IA lee el `plan.md` y genera/revisa el código en Django y Angular. |
| **14:00 - 18:30** | **Demostración en Vivo** | Abrir `http://localhost:4200/incidents`, filtrar +300k crímenes, crear un nuevo incidente con mapa GPS y despachar en la consola CAD 911. |
| **18:30 - 20:00** | **Cierre y QA** | Abrir `checklist.md` en VSCode, verificar que se cumplió el SLA (< 800ms) y despedir el video. |

---

## ⚡ Comando de Terminal para Mostrar en Vivo
```bash
python demo_openspec_incidentes/verificar_conexion.py
```
*Este comando demuestra en consola la conexión directa a ClickHouse, el conteo de más de 300k registros y el tiempo de respuesta de consulta analítica en milisegundos.*
