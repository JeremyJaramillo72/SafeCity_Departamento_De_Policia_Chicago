# Reglas del Agente SafeCity (OpenSpec)

1. **Bases de Datos y Docker:** 
   ClickHouse está corriendo en el contenedor local (`localhost:9000` nativo y `localhost:8123` HTTP). El usuario es `default` con contraseña `password12345`.
2. **Desarrollo Local:**
   - Backend Django en `localhost:8000`.
   - Frontend Angular en `localhost:4200`.
3. **Idioma Obligatorio:**
   Todo el código, variables, tablas y textos de UI deben estar estrictamente en **ESPAÑOL**.
4. **Metodología OpenSpec:**
   Antes de generar código, el agente debe basarse estrictamente en `specs/plan.md` y `specs/incidentes-spec.md`.
