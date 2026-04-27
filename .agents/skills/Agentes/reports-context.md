# Reports Module Context Rules

## Objetivo

Construir la pestaña Reportes como un módulo de análisis, visualización y exportación conectado a Supabase.

Debe funcionar como centro de reporting y business intelligence del dashboard.

---

# Vista principal Reports

Estructura:

```bash
Reports Page
├── Header
├── KPI Summary
├── Date Filters
├── Analytics Dashboard
├── Reports Tables
├── Export Center
└── Custom Reports Builder
```

---

# Diseño esperado

Estilo analytics / BI dashboard:

- executive KPI cards
- gráficas avanzadas
- tablas analíticas
- filtros globales
- exportaciones
- drilldowns

Inspiración:

- Google Analytics
- Power BI
- Tableau
- Hubspot Reports

---

# KPIs superiores

Mostrar:

- Revenue
- Conversiones
- ROI
- Leads
- Growth %
- Churn / Retención

Cada card:

- valor actual
- tendencia
- comparación periodo anterior
- meta vs real

---

# Filtros globales

Permitir:

- rango de fechas
- canal
- campaña
- usuario
- segmento

Presets:

- Hoy
- Últimos 7 días
- Últimos 30 días
- Mensual
- Trimestral

---

# Secciones de reportes

## Revenue Trends

Line chart

---

## Conversion Analytics

Bar chart

---

## Channel Performance

Pie / Bar chart

---

## Cohort / Retention

Heatmap o tabla cohort

---

## Funnel Analysis

Conversion funnel

---

## ROI Performance

Area chart

Usar Recharts.

---

# Tablas analíticas

Mostrar:

- top campañas
- rendimiento por canal
- usuarios top
- conversiones por fuente

Features:

- sorting
- filters
- search
- export

---

# Report Builder

Permitir construir reportes custom:

Campos:

- métricas
- dimensiones
- filtros
- agrupaciones

Ejemplos:

- Leads por campaña
- ROI por canal
- Conversiones por usuario

---

# Export Center

Permitir exportar:

- CSV
- Excel
- PDF

Botones:

- Export Report
- Schedule Report
- Download Snapshot

---

# Supabase

Consumir desde:

```sql
analytics
campaign_metrics
sales
conversions
reports
```

Ejemplo:

```sql
analytics
- id
- metric_name
- metric_value
- period
- created_at
```

---

# React Query

Hooks:

- useReportMetrics()
- useRevenueReport()
- useConversionReport()
- useCustomReports()

Usar:

- caching
- refetch
- invalidateQueries
- loading/error states

---

# Estado

React Query:

- datos de reportes

Zustand:

- filtros globales
- report builder state
- export modal
- UI controls

No duplicar server data.

---

# Componentización

Estructura:

```bash
src/features/reports/
components/
hooks/
services/
types/
```

Archivos:

```bash
ReportsPage.tsx
KpiOverview.tsx
RevenueChart.tsx
ConversionChart.tsx
ReportsTable.tsx
ReportBuilder.tsx
ExportPanel.tsx
useReports.ts
reports.service.ts
```

---

# Drilldowns

Cada métrica debe permitir:

- ver detalle
- breakdown por segmento
- comparar periodos
- detectar anomalías

---

# Alerts e Insights

Agregar sección Insights:

Ejemplos:

- ROI cayó 12%
- Conversión subió 8%
- Campaña X supera benchmark

Reportes deben dar información accionable.

---

# Dashboard UX

Agregar:

- loading skeletons
- empty states
- anomalies warnings
- responsive charts
- dark mode compatible

---

# Reportes automáticos

Preparar soporte para:

- scheduled reports
- weekly summaries
- monthly executive reports

---

# Código generado

Siempre:

- TypeScript
- clean code
- modular
- editable
- reusable
- production-ready

Evitar componentes grandes.

---

# Cuando se pida Reports

Asumir siempre:

- módulo BI / analytics completo
- conectado a Supabase
- charts + exports + reporting
- diseño moderno tipo Power BI
- escalable