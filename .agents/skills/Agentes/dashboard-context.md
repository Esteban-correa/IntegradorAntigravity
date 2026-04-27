# Dashboard Context Rules

## Objetivo

Construir el dashboard principal del proyecto usando React + TypeScript + Supabase.

El dashboard debe ser moderno, modular, editable y conectado a datos reales de Supabase.

---

# Dashboard Architecture

El dashboard debe incluir:

## Layout principal

- Sidebar navegable
- Top navbar
- Área central con KPIs
- Tablas
- Gráficas
- Actividad reciente
- Widgets reutilizables

---

# Diseño esperado

Usar estilo tipo SaaS admin dashboard:

- limpio
- minimalista
- responsive
- cards con sombras suaves
- grid layout
- componentes reutilizables

Inspiración:

- Stripe Dashboard
- Hubspot
- Notion Analytics
- Supabase Dashboard

---

# KPIs a mostrar

Primera fila:

- Usuarios activos
- Ingresos
- Conversiones
- Campañas activas

Cada KPI debe incluir:

- valor
- tendencia %
- comparación periodo anterior
- indicador visual

Ejemplo:

Revenue
$24,500
+12.4%
vs mes anterior

---

# Gráficas

Incluir:

## Revenue Trend
Line chart

## Conversion Funnel
Bar chart

## Growth Analytics
Area chart

Usar Recharts.

---

# Tablas

Dashboard debe incluir tablas con:

- usuarios recientes
- campañas
- actividad
- métricas operativas

Tablas:
- búsqueda
- filtros
- ordenamiento
- paginación

---

# Datos

Todos los datos deben venir desde Supabase.

No usar mock data salvo placeholders temporales.

Usar React Query para:

- queries
- cache
- refetch
- loading
- error states

---

# Supabase Sources

Consumir datos desde tablas como:

```sql
profiles
campaigns
sales
analytics
notifications
```

---

# UX Requerimientos

Agregar:

- loading skeletons
- empty states
- alerts
- quick actions
- dark mode compatible

---

# Código

Todo código generado debe ser:

- TypeScript
- Clean code
- reusable
- escalable
- production-ready

Evitar componentes gigantes.

Máximo una responsabilidad por componente.

---

# Estado

Usar:

- React Query → datos Supabase
- Zustand → UI state (sidebar, filtros, modales)

No guardar server data en Zustand.

---

# Dashboard Tabs

Preparar estructura para pestañas:

- Overview
- Usuarios
- Campañas
- Reportes

Cada una como vista separada.

---

# Siempre asumir

Si se pide generar o modificar dashboard:

- conectar con Supabase
- mantener diseño SaaS moderno
- preservar modularidad
- no romper estructura existente