# ✅ Lista de Verificación de Calidad (QA): Módulo de Incidentes

## 1. Identidad Visual (100% Coincidente)
- `[x]` Tipografía `Inter` para todo el texto + `JetBrains Mono` para datos tabulares.
- `[x]` Color primario: `#00173d`, primary-container: `#0b2b5e`.
- `[x]` Fondo surface-bright: `#f7f9fb`, surface-container-lowest: `#ffffff`.
- `[x]` Error: `#ba1a1a`, error-container: `#ffdad6`.
- `[x]` Iconos: Google Material Symbols (`material-symbols-outlined`).
- `[x]` Espaciado: xs=4px, sm=8px, md=16px, lg=24px, xl=32px.

## 2. CRUD Completo
- `[x]` CREATE: Formulario con 17+ campos, mapa Leaflet con geocodificación, buscador IUCR con 23 códigos, upload PDF.
- `[x]` READ Lista: 4 KPI cards + 5 filtros combobox buscables + tabla 7 columnas + paginación 10/página.
- `[x]` READ Detalle: Cache-first, severidad automática, 7 pestañas forenses, 9 acciones (asignar, escalar, cerrar, reabrir, PDF...).
- `[x]` UPDATE: Mismo formulario con datos precargados + mapa para reubicar.
- `[x]` DELETE: Modal de confirmación, soft delete en backend, manejo de errores.

## 3. Filtros del Listado
- `[x]` Buscador de texto con debounce 400ms (RxJS Subject).
- `[x]` Combobox de patrullas cargado desde LogisticsService (vehículos + turnos).
- `[x]` Combobox de estado: 4 opciones (Todos, Activos, Cerrados, Alta Prioridad).
- `[x]` Combobox de distrito: 22 distritos de Chicago cargados desde CategoryService.
- `[x]` Combobox de tipo penal: 18+ categorías cargadas desde CategoryService.

## 4. Rendimiento y SLAs
- `[x]` Consulta ClickHouse sobre +300,000 registros: < 800ms.
- `[x]` Cache-first loading en detalle (sin round-trip adicional).
- `[x]` Debounce de búsqueda: 400ms (texto) y 300ms (mapa).

## 5. Seguridad y Roles
- `[x]` JWT (`SafeCityJWTAuthentication`) en todos los endpoints.
- `[x]` Roles: `oficial`, `detective`, `operador_emergencias`, `administrador`.
- `[x]` Modal de solicitudes solo visible para `administrador`.
- `[x]` Acciones de detective (asignar, escalar, cerrar, reabrir) solo para roles autorizados.

## 6. Consola CAD 911
- `[x]` CRUD de llamadas con 5 niveles de prioridad.
- `[x]` Despacho con creación automática de incidente vinculado.
- `[x]` KPIs: total, pendientes, despachadas, en sitio, resueltas, tiempos promedio.
