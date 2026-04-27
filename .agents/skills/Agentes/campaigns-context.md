# Campaigns Module Context Rules

## Objetivo

Construir la pestaña Campañas como un módulo completo de gestión, monitoreo y análisis conectado a Supabase.

Debe funcionar como un campaign management dashboard estilo SaaS.

---

# Vista principal Campaigns

Estructura:

```bash
Campaigns Page
├── Header
├── KPI Summary
├── Filters
├── Campaign Table
├── Analytics Section
├── Create/Edit Modal
└── Campaign Detail View
```

---

# Diseño esperado

Estilo moderno tipo CRM/Marketing Dashboard:

- cards KPI
- tablas profesionales
- charts
- filtros avanzados
- detalle de campaña
- quick actions

Inspiración:

- Hubspot Campaigns
- Meta Ads Manager
- Salesforce Marketing Cloud

---

# KPIs superiores

Mostrar:

- Campañas activas
- Total conversiones
- ROI
- Presupuesto usado
- CTR promedio
- Leads generados

Cada KPI debe incluir:

- valor
- tendencia %
- comparación periodo anterior

---

# Tabla campañas

Columnas:

- Nombre campaña
- Estado
- Canal
- Presupuesto
- Conversiones
- ROI
- Fecha inicio
- Fecha fin
- Acciones

Estados:

- Draft
- Active
- Paused
- Completed

Acciones:

- Ver
- Editar
- Duplicar
- Pausar
- Eliminar

Soportar:

- búsqueda
- filtros
- ordenamiento
- paginación
- bulk actions

---

# Filtros

Permitir filtros por:

- Estado
- Canal
- Fecha
- Presupuesto
- Performance

Canales ejemplo:

- Email
- Social
- Paid Ads
- Organic

---

# CRUD Campañas

## Crear campaña

Formulario:

- nombre
- descripción
- canal
- presupuesto
- objetivo
- fecha inicio
- fecha fin
- estado

---

## Editar campaña

Actualización desde modal o drawer.

Persistir en Supabase.

---

## Eliminar campaña

Con confirmación.

Soft delete si aplica.

---

# Analytics Section

Incluir:

## Performance Trend
Line chart

## Conversion Funnel
Bar chart

## Channel Performance
Pie / Bar chart

## ROI Analysis
Area chart

Usar Recharts.

---

# Supabase

Datos desde tablas:

```sql
campaigns
campaign_metrics
leads
conversions
```

Ejemplo:

```sql
campaigns
- id
- name
- status
- channel
- budget
- start_date
- end_date
- created_at
```

```sql
campaign_metrics
- campaign_id
- impressions
- clicks
- conversions
- roi
```

---

# React Query

Hooks:

- useCampaigns()
- useCampaignMetrics()
- useCreateCampaign()
- useUpdateCampaign()
- useDeleteCampaign()

Usar:

- cache
- invalidation
- loading states
- optimistic updates

---

# Estado

React Query:

- server data

Zustand:

- filtros
- modales
- selected campaign
- UI state

No duplicar datos del backend.

---

# Componentización

Estructura:

```bash
src/features/campaigns/
components/
hooks/
services/
types/
```

Archivos:

```bash
CampaignsPage.tsx
CampaignTable.tsx
CampaignFilters.tsx
CampaignModal.tsx
CampaignAnalytics.tsx
CampaignDetails.tsx
useCampaigns.ts
campaigns.service.ts
```

---

# Vista detalle campaña

Cada campaña debe tener:

- métricas
- timeline
- leads generados
- conversiones
- presupuesto usado
- rendimiento por canal

Tipo panel drill-down.

---

# UX

Agregar:

- loading skeletons
- empty states
- alerts
- performance warnings
- quick actions

Ejemplo alertas:

- presupuesto agotándose
- campaña con bajo rendimiento
- ROI negativo

---

# Bulk Actions

Permitir:

- activar múltiples
- pausar múltiples
- duplicar campañas
- exportar campañas

---

# Código generado

Siempre:

- TypeScript
- Clean code
- modular
- production-ready
- editable
- reusable

Evitar componentes gigantes.

---

# Cuando se pida Campaigns

Asumir siempre:

- módulo completo CRM marketing
- conectado a Supabase
- dashboards + analytics + CRUD
- diseño SaaS moderno
- escalable