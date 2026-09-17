# 📜 Constitución del Sistema: SafeCity Intelligence Ops

Este documento representa la **"Constitución del Sistema"**: el conjunto supremo de directrices arquitectónicas y reglas de negocio inquebrantables que rigen el desarrollo del proyecto.

---

## 🏛️ TÍTULO I: DE LA ARQUITECTURA GENERAL Y TECNOLOGÍAS
- **Artículo 1.** Arquitectura desacoplada: Backend en **Django REST Framework** y Frontend en **Angular 17+ (Standalone Components)**.
- **Artículo 2.** Motor de base de datos primario: **ClickHouse** columnar con motor `MergeTree` para analítica de alto rendimiento (+300,000 registros).
- **Artículo 3.** Almacenamiento multimedia: **Supabase Storage (API S3)** para evidencias y documentos forenses.
- **Artículo 4.** Servicios persistentes (ClickHouse, PocketBase, Airflow) orquestados mediante **Docker**.

---

## 🛡️ TÍTULO II: DE LA INTEGRIDAD FORENSE Y AUDITORÍA
- **Artículo 5.** **Prohibición de Borrado Físico (*Hard Delete*):** Todo registro solo admite eliminación lógica (*Soft Delete*).
- **Artículo 6.** **Inmutabilidad Forense:** La tabla de seguimiento y bitácoras (`seguimiento_incidente`) es estrictamente *append-only* (sin UPDATE ni DELETE).
- **Artículo 7.** **Campos de Auditoría:** Toda tabla transaccional debe registrar `fecha_creacion`, `creado_por`, `fecha_modificacion`.

---

## 🎨 TÍTULO III: DE LA INTERFAZ Y EXPERIENCIA DE USUARIO (UI/UX)
- **Artículo 8.** **Modo Oscuro Táctico:** Paleta corporativa Navy Dark (`#0A1128`), Acento Azul Primario (`#0066FF`), Alertas Rojas (`#D32F2F`) y Éxito Verde (`#2E7D32`).
- **Artículo 9.** **Idioma Estricto:** Toda la interfaz gráfica, botones, formularios y tablas deben estar al 100% en **ESPAÑOL**.
- **Artículo 10.** **Diseño Táctil:** Botones con altura mínima de `48px` para uso en campo.
