# Especificaciones: Módulo Operativo Recursos Humanos

## Especificación: Registrar Clock-in / Clock-out
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

## Especificación: Asignar Oficial a Cuadrante
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

## Especificación: Ingresar Solicitud de Permisos
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

## Especificación: Registrar Amonestación en Hoja de Vida
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

## Especificación: Actualizar Récord de Certificaciones
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

