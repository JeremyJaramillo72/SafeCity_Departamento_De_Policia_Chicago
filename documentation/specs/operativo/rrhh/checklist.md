# ✅ Lista de Verificación de Calidad (QA): Módulo Operativo - Recursos Humanos

## 1. Pruebas Funcionales (Flujo Principal)
- `[x]` **Marcaje Entrada (*Clock-In*):** Se guarda la hora y fecha del servidor con estado `PRESENTE`.
- `[x]` **Marcaje Salida (*Clock-Out*):** Calcula la diferencia de horas trabajadas y cierra la jornada.
- `[x]` **Creación de Permiso:** Se registra en `rrhh_solicitud_permiso` en estado `PENDIENTE`.
- `[x]` **Aprobación de Permiso:** El usuario de RRHH aprueba o rechaza actualizando `aprobado_por`.
- `[x]` **Minuta de Relevo:** El oficial entrante confirma el `ShiftHandover`.

## 2. Pruebas de Casos Extremos (Casos Borde)
- `[x]` **Salida sin Entrada Previa:** El sistema valida y asocia la salida a la jornada abierta del día.
- `[x]` **Doble Marcaje de Entrada:** Bloquea entradas duplicadas en la misma ventana de turno.
- `[x]` **Aprobación por Oficial Raso:** El backend rechaza intentos de aprobación de permisos por usuarios sin rol `recursos_humanos` o `administrador`.

## 3. Pruebas de Rendimiento y Seguridad
- `[x]` **Marcaje en Milisegundos:** La llamada de `ClockIn` responde en **< 300ms**.
- `[x]` **Protección de Salarios / PII:** Datos de contacto de emergencia e historial disciplinario solo son visibles para roles autorizados.
