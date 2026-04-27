# Users Module Context Rules

## Objetivo

Construir la pestaña Usuarios del dashboard como un módulo CRUD completo conectado a Supabase.

Debe funcionar como panel de gestión de usuarios estilo SaaS admin.

---

# Vista principal Users

La pestaña usuarios debe incluir:

```bash
Users Page
├── Header
├── KPI summary
├── Search + Filters
├── Users Table
├── User Detail Panel
├── Create/Edit Modal
└── Actions
```

---

# Diseño esperado

Diseño estilo admin moderno:

- tabla profesional
- cards para métricas
- filtros superiores
- acciones rápidas
- drawer o modal para editar
- responsive

Inspiración:

- Stripe Customers
- Hubspot Contacts
- Supabase Auth Users

---

# KPIs superiores

Mostrar:

- Total usuarios
- Usuarios activos
- Nuevos usuarios
- Usuarios por rol

Cada card con:

- valor
- tendencia
- comparación

---

# Tabla de usuarios

Columnas:

- Nombre
- Email
- Rol
- Estado
- Fecha creación
- Último acceso
- Acciones

Acciones por fila:

- Ver detalle
- Editar
- Activar / desactivar
- Eliminar

Soportar:

- búsqueda
- filtros
- sorting
- paginación
- selección múltiple

---

# Filtros

Agregar filtros por:

- rol
- estado
- fecha registro
- activos/inactivos

Ejemplo:

Todos | Admin | Usuarios

Activos | Inactivos

---

# CRUD Completo

Debe incluir:

## Crear usuario
Formulario:

- nombre
- email
- rol
- estado

Usar modal o drawer.

---

## Editar usuario

Editable desde tabla.

Actualizar en Supabase.

---

## Eliminar usuario

Confirmación antes de borrar.

Soft delete preferido si aplica.

---

# Supabase

Datos vienen de:

```sql
profiles
auth.users
```

Estructura esperada:

```sql
profiles
- id
- name
- email
- role
- status
- created_at
- last_login
```

---

# React Query

Usar:

- useUsers()
- useCreateUser()
- useUpdateUser()
- useDeleteUser()

Con:

- cache
- invalidateQueries
- loading states
- optimistic updates si aplica

---

# Estado

Usar:

React Query:
- datos usuarios

Zustand:
- filtros
- modales
- tabla selections
- UI state

No duplicar server data en stores.

---

# Componentización

Estructura:

```bash
src/features/users/
components/
hooks/
services/
types/
```

Archivos:

```bash
UsersPage.tsx
UsersTable.tsx
UserFilters.tsx
UserModal.tsx
UserDetailsDrawer.tsx
useUsers.ts
users.service.ts
```

---

# Tabla UX

Estados:

- loading skeleton
- empty state
- error state

Bulk actions:

- exportar
- eliminar múltiples
- cambiar rol
- activar/desactivar

---

# Roles

Preparar soporte RBAC:

- admin
- manager
- user

Controlar permisos por acciones.

---

# Código generado

Siempre:

- TypeScript
- clean code
- componentes reutilizables
- producción
- modular
- editable

Evitar componentes monolíticos.

---

# Cuando se pida Users

Asumir siempre:

- módulo CRUD completo
- conectado a Supabase
- estilo SaaS admin
- escalable
- filtros + tablas + acciones