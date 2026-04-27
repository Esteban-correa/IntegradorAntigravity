# Project Context — Supabase Integration Rules

## Stack
Proyecto construido con:

- React + TypeScript
- Vite
- Supabase
- Zustand para client state
- React Query para server state
- Tailwind para UI

---

# Supabase Rules

## Siempre usar Supabase como backend principal

Usar Supabase para:

- Authentication
- Database (PostgreSQL)
- Row Level Security (RLS)
- Storage
- Realtime subscriptions
- Edge Functions cuando sea necesario

No proponer Firebase, MongoDB, Express backend ni alternativas salvo que se pida explícitamente.

---

## Cliente Supabase

Siempre reutilizar un único cliente:

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)
```
---

## Variables de entorno

Usar:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Nunca hardcodear keys.

---

## Auth Pattern

Usar Supabase Auth con:

- signUp
- signInWithPassword
- signOut
- getSession
- onAuthStateChange

Preferir sesiones persistentes.

Implementar protección por roles:
- admin
- user

Usar perfiles en tabla profiles relacionada con auth.users.

---

## State Management

Regla:

- React Query → server state (Supabase queries)
- Zustand → UI/client state

No duplicar datos de Supabase en stores globales.

---

## React Query Pattern

Usar hooks:

```ts
useQuery(...)
useMutation(...)
```

Para inserts/updates:

- optimistic updates si aplica
- invalidateQueries después de mutaciones

---

## Row Level Security

Asumir RLS activado siempre.

Generar políticas seguras.

Nunca asumir acceso público.

---

## Cuando generar CRUD

Siempre incluir:

- select
- insert
- update
- delete
- loading
- error handling
- types
- Supabase best practices

---

## Default mindset

Asumir que Supabase es la fuente de verdad del proyecto.

Todas las soluciones deben integrarse con Supabase por defecto.