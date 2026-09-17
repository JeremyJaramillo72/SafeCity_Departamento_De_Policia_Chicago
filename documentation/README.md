# SafeCity — Documentación General

Bienvenido a la documentación oficial de **SafeCity Intelligence Ops**, plataforma SaaS B2G de misión crítica para departamentos de policía, desarrollada por **SafeCity Solutions**.

Este directorio centraliza toda la documentación del proyecto siguiendo la metodología **Spec Driven Development (SDD)**.

---

## 📋 Fases SDD Completadas

| Fase | Estado | Documento |
| :--- | :---: | :--- |
| **Fase 1 — Definición del Problema** | ✅ | [Planificación Estratégica](./planificacion_estrategica_safecity.md) §1 |
| **Fase 2 — Recolección de Requisitos** | ✅ | [Jerarquía OE/OT/OP](./planificacion_estrategica_safecity.md) §3 |
| **Fase 3 — Especificación Formal** | ✅ | [Carpeta specs/](./specs/) — 35 archivos |
| **Fase 4 — Validación de la Spec** | ✅ | [specs/000-sistema-general/rules.md](./specs/000-sistema-general/rules.md) |
| **Fase 5 — Diseño del Sistema** | 🔶 | [Visión Arquitectónica](./planificacion_estrategica_safecity.md) — plan.md por módulo |
| **Fase 6 — Implementación** | 🔶 | Django App + Angular Frontend |
| **Fase 7 — Pruebas** | ⬜ | tasks.md por módulo (pendiente) |
| **Fase 8 — Verificación Final** | ⬜ | checklist.md por módulo (pendiente) |
| **Fase 9 — Mantenimiento** | ⬜ | Pendiente post-entrega |

---

## 📂 Estructura de la Documentación

### 📖 Documento Principal
- [**Planificación Estratégica Completa**](./planificacion_estrategica_safecity.md) — Documento maestro con:
  - Identidad organizacional y Balanced Scorecard
  - Jerarquía de Objetivos: 5 OE → 10 OT → 44 OP
  - Catálogo completo de 57 Casos de Uso (3 estratégicos + 13 tácticos + 44 operativos)
  - Diagrama textual de Casos de Uso por actor
  - Visión Arquitectónica (Fact-Dim, técnicas IA/ML, matrices por nivel)

### 📐 Especificaciones SDD (Spec Driven Development)
```
specs/
├── 000-sistema-general/        → Visión global, glosario y reglas de arquitectura
├── 001-estrategico/            → CU-E01 a CU-E03 (Dashboard, Mapa Calor, Reportes)
├── 002-tactico/                → CU-T01 a CU-T13 (Historial, Bandas, Flota, Investigaciones)
├── 003-operativo-incidentes/   → CU-O01 a CU-O09 (Registro 911, GPS, Fotos, Triage)
├── 004-operativo-inteligencia/ → CU-O10 a CU-O18 (Detective, Testimonios, Custodia)
├── 005-operativo-logistica/    → CU-O19 a CU-O27 (Flota, Bodycam, Taser, Munición)
├── 006-operativo-rrhh/         → CU-O28 a CU-O32 (Turnos, Permisos, Certificaciones)
├── 007-operativo-seguridad/    → CU-O33 a CU-O37 (RBAC, Logs, Backups, Bloqueos)
└── 008-operativo-transito/     → CU-O38 a CU-O44 (Multas, Alcoholemia, Booking)
```
Cada carpeta contiene: `spec.md` · `plan.md` · `tasks.md` · `checklist.md`

### 📊 Diagramas del Sistema
- [Diagrama de Casos de Uso por Paquetes](./use-case-diagram-by-packages/use-case-diagram-by-packages.md)
- [Diagrama de Base de Datos (Modelo ERD)](./database-diagram/database-diagram.md)

---

## 🏗️ Stack Tecnológico

| Capa | Componente | Descripción |
| :--- | :--- | :--- |
| **Frontend** | Angular 17+ (Standalone Components) | Interfaz táctica interactiva — SPA |
| **Backend** | Django 4+ / DRF | API REST — lógica de negocio y seguridad JWT |
| **Data Warehouse** | ClickHouse (MergeTree Columnar) | Motor analítico OLAP de alto rendimiento |
| **BD Transaccional** | PocketBase / PostgreSQL | Registros operativos del día a día |
| **Pipeline ETL** | Apache Airflow + Apache Kafka | Carga incremental nocturna hacia ClickHouse |
| **Infraestructura** | Azure AKS (Kubernetes Multi-Tenant) | Despliegue cloud multi-región |
| **Autenticación** | JWT firmados por Django | Control de sesiones y RBAC |

---

## 👥 Actores del Sistema y Niveles

| Actor | Nivel | Casos de Uso |
| :--- | :--- | :--- |
| **Gerente General** | Estratégico (SafeCity Solutions) | Expansión comercial, BSC |
| **Sheriff** | Estratégico / Táctico | CU-E01, CU-E02, CU-O31 |
| **Analista de Inteligencia** | Táctico | CU-T03 a CU-T05, CU-T11, CU-T12, CU-E03 |
| **Operador de Emergencias** | Táctico / Operativo | CU-O03, CU-O09, CU-O40, CU-O42, CU-T13 |
| **Jefe de Logística** | Táctico | CU-T06, CU-T07, CU-O29 |
| **Administrador de Sistema** | Operativo | CU-O32 a CU-O37, CU-T08 |
| **Detective** | Operativo | CU-O10 a CU-O18, CU-T09, CU-T10 |
| **Oficial de Patrulla** | Operativo | CU-O01 a CU-O09, CU-O11, CU-O12, CU-O19 a CU-O31, CU-O38, CU-O39, CU-O41, CU-O43, CU-O44 |

---

## 🔑 Matriz de Roles y Acceso

| Rol | Módulos con Acceso | Permisos |
| :--- | :--- | :--- |
| **Administrador de Sistema** | Todos | CRUD completo + gestión de roles |
| **Sheriff** | Estratégico, Táctico, RRHH | Lectura total + aprobaciones |
| **Analista de Inteligencia** | Táctico, Estratégico | Análisis y generación de reportes |
| **Detective** | Inteligencia Criminal, Casos Mayores | Gestión de expedientes asignados |
| **Jefe de Logística** | Logística, Turnos | CRUD de flota y personal |
| **Operador de Emergencias** | 911, Despacho | Crear y gestionar llamadas |
| **Oficial de Patrulla** | Incidentes, Logística propia | Crear incidentes y registro diario |

---

## 📁 Estructura del Repositorio

```
safecity_project/
├── django_app/                    # Backend (API REST en Django)
│   ├── administracion_seguridad/  # Autenticación, usuarios, RBAC
│   ├── gestion_operativa/         # Incidentes, KPIs, 911
│   ├── inteligencia_criminal/     # Sospechosos, evidencias, testigos
│   ├── investigacion_especial/    # Casos Mayores (Detectives)
│   └── logistica_patrullaje/      # Flota, turnos, personal
├── frontend/                      # SPA Angular (interfaz táctica)
│   └── src/app/                   # Componentes por módulo
├── airflow/                       # ETL automatizado
├── dataset/                       # Datos históricos Chicago PD
└── documentation/                 # ← ESTÁS AQUÍ
    ├── specs/                     # Especificaciones SDD por módulo
    ├── database-diagram/          # ERD del Data Warehouse
    ├── use-case-diagram-by-packages/
    ├── planificacion_estrategica_safecity.md
    ├── about-project.md
    └── README.md
```

---

## 📊 Métricas del Proyecto

| Indicador | Valor |
| :--- | :--- |
| Objetivos Estratégicos (OE) | 5 |
| Objetivos Tácticos (OT) | 10 |
| Objetivos Operativos (OP) | 44 |
| Casos de Uso Totales | 57 (3E + 13T + 44O) |
| Tablas Fact (ClickHouse) | 15 |
| Tablas Dim (ClickHouse) | 15 |
| Total tablas arquitectónicas | 31 |
| Archivos de Especificación SDD | 35 |
| Actores del Sistema | 8 |
