# Especificaciones: Módulo Operativo Ciberseguridad

## Especificación: Rastrear Inicio de Sesión
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

## Especificación: Modificar Permisos de Acceso RBAC
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

## Especificación: Ejecutar Respaldo de Base de Datos
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

## Especificación: Etiquetar Acceso a Evidencias (Auditoría Ciega)
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

## Especificación: Bloquear Cuenta por Intentos Fallidos
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

