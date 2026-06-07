# SafeCity — Documentación General

Bienvenido a la documentación oficial de **SafeCity**, la plataforma de inteligencia operacional y gestión del Departamento de Policía de Chicago (CPD).

Este directorio centraliza la documentación técnica, arquitectónica y de diseño del proyecto.

---

## 📂 Contenido de la Documentación

### 📖 General
* [Información del Proyecto (About SafeCity)](file:///c:/Users/ASUS/Documents/safecity_project/documentation/about-project.md) — Detalles generales de SafeCity, objetivos del negocio, módulos y valor agregado.

### 📊 Diagramas del Sistema
* [Diagrama de Casos de Uso Agrupado por Paquetes](file:///c:/Users/ASUS/Documents/safecity_project/documentation/use-case-diagram-by-packages/use-case-diagram-by-packages.md) — Define los casos de uso del sistema agrupados por módulos funcionales y sus actores.
* [Diagrama de Base de Datos (Modelo ERD)](file:///c:/Users/ASUS/Documents/safecity_project/documentation/database-diagram/database-diagram.md) — Mapea las tablas de ClickHouse (crímenes, logística, inteligencia y seguridad) y sus relaciones detalladas.

---

## 🛠️ Stack Tecnológico

La plataforma adopta una arquitectura desacoplada de tres capas:

| Capa | Componente | Descripción |
| :--- | :--- | :--- |
| **Frontend** | Angular 21+ (Standalone) | Interfaz táctica interactiva con Tailwind CSS. |
| **Backend** | Django 4+ / DRF | API REST para orquestación y lógica de negocio. |
| **Base de Datos** | ClickHouse Server | Motor analítico columnar de alto rendimiento. |
| **ETL Pipeline** | Apache Airflow | Carga y sincronización incremental semanal de datos. |
| **Local DB** | PocketBase | Gestión intermedia de datos iniciales. |

---

## 🔑 Roles y Matriz de Acceso

| Rol | Vistas Clave | Permisos Principales |
| :--- | :--- | :--- |
| **Administrador de Sistema** | Users, Audit Logs, Backups, Settings | Gestión de cuentas, auditoría y control de sistema. |
| **Administrador (Comandante)** | Dashboard, Active Cases, Logistics, Map | Monitoreo operacional y control de recursos logísticos. |
| **Detective** | My Cases, Active Cases, Tactical Map, Intel | Investigación especial de casos, sospechosos y evidencias. |
| **Oficial (Patrullero)** | Active Cases, Log New Case, Criminal Intel | Registro de incidentes en calle y consulta de datos. |

---

## 📁 Estructura del Repositorio

```
safecity_project/
├── django_app/         # Backend (API REST en Django)
│   ├── administracion_seguridad/  # Módulo de autenticación y usuarios
│   ├── gestion_operativa/         # CRUD de incidentes y KPIs
│   ├── inteligencia_criminal/     # Sospechosos, evidencias, testigos
│   ├── investigacion_especial/    # Casos asignados a detectives
│   └── logistica_patrullaje/      # Flota de vehículos y oficiales
├── frontend/           # SPA en Angular (interfaz táctica)
│   └── src/app/        # Componentes UI organizados por módulos
├── airflow/            # Automatización y ETL semanal
└── documentation/      # Documentación y diagramas del proyecto (esta carpeta)
```
