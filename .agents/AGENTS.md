# Reglas de Infraestructura de SafeCity

1. **Bases de Datos y Servicios de Fondo en Docker:** 
   ClickHouse, PocketBase y Apache Airflow se ejecutan siempre de forma persistente a través de Docker y `docker-compose`. Los contenedores tienen `restart: always`. Asume que los puertos `8123`, `8091` y `8080` ya están siendo expuestos por estos contenedores localmente. Nunca intentes iniciar estos servicios a mano.

2. **Servidores de Desarrollo en Local (HMR):** 
   Para garantizar una recarga en vivo ultrarrápida durante el desarrollo (Hot Module Replacement) sin la latencia de sincronización de volúmenes de Docker en Windows:
   - El **Backend (Django)** se debe ejecutar localmente usando `.venv\Scripts\python.exe manage.py runserver` dentro de la carpeta `django_app`. 
   - El **Frontend (Angular)** se debe ejecutar localmente usando `npm start` dentro de la carpeta `frontend`.

3. Nunca intentes encender el frontend o el backend mediante Docker para desarrollo activo, asume que el desarrollador está trabajando en `localhost:4200` y `localhost:8000` nativamente en Windows.

4. **Idioma de la Aplicación:** 
   - **Frontend/UI (Lo que ve el cliente):** Absolutamente TODO el texto visible en la interfaz gráfica (HTML, botones, menús, alertas, modales, tablas, filtros) debe estar estrictamente en **ESPAÑOL**.
   - **Backend/Código/BD (Lo que no ve el cliente):** El esquema de base de datos, nombres de tablas, columnas, variables, nombres de funciones, logs y comentarios deben estar en **ESPAÑOL** (Ej. tabla `ingreso_celda`, variable `nombre_detenido`).

5. **Validaciones de Componentes y Entorno (Angular):**
   - Cuando crees nuevos componentes o servicios, **VERIFICA SIEMPRE** las rutas de importación de variables globales o configuraciones (Ej. `environment`).
   - No asumas que la estructura `src/environments/environment.ts` existe por defecto. Revisa cómo otros componentes consumen la API o crea el archivo si es necesario.
   - **Obligatorio:** Tras crear código en Angular, revisa que el compilador del servidor local (`npm start`) no arroje errores fatales que tumben la aplicación (como `ERR_CONNECTION_REFUSED`), deteniendo o reiniciando el servidor de desarrollo en background si este falla por un error de compilación.
