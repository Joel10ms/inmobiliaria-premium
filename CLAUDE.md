# CLAUDE.md — Inmobiliaria Premium

Plataforma inmobiliaria de lujo **Élite Propiedades** construida con Next.js 15 App Router.

## Comandos esenciales

```bash
npm run dev          # Servidor de desarrollo → http://localhost:3000
npm run build        # Build de producción
npm run lint         # ESLint
npm run db:push      # Aplicar schema Prisma a la DB (sin migraciones)
npm run db:studio    # GUI de Prisma para explorar la DB
npm run db:seed      # Poblar DB con datos de prueba
```

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15.1 App Router |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS v3 + Design System propio |
| Base de datos | PostgreSQL + Prisma 5 |
| Auth | NextAuth.js v5 (beta) |
| Imágenes | Cloudinary + next-cloudinary |
| Formularios | react-hook-form + Zod |
| UI primitivas | Radix UI |
| Íconos | lucide-react |
| Carrusel | embla-carousel-react |
| Animaciones | framer-motion |

## Estructura del proyecto

```
src/
├── app/
│   ├── (marketing)/          # Rutas públicas (home, propiedades, agentes)
│   ├── (admin)/admin/        # Panel de administración (protegido)
│   ├── (auth)/login/         # Página de login
│   └── api/
│       ├── admin/            # REST API protegida (properties, leads)
│       ├── inquiries/        # Formulario de contacto público
│       └── upload/           # Firma de uploads Cloudinary
├── components/
│   ├── admin/                # Tablas, formularios y shell del admin
│   ├── home/                 # Secciones de la home
│   ├── property/             # Tarjetas, galería, mapa, filtros
│   ├── agent/                # Tarjeta de agente
│   ├── analytics/            # Google Analytics 4
│   ├── layout/               # Navbar y Footer
│   ├── shared/               # SectionHeader, PageHero
│   └── ui/                   # Button, Input, Badge, Card, Modal, Skeleton
├── lib/
│   ├── db.ts                 # Cliente Prisma singleton
│   ├── auth-helpers.ts       # requireAuth() para API routes
│   ├── notifications.ts      # WhatsApp + webhook
│   ├── mock-data.ts          # Datos en memoria cuando no hay DB
│   ├── filter-properties.ts  # Lógica de filtrado + constantes ZONES
│   ├── validations.ts        # Schemas Zod compartidos
│   └── queries/              # Capa de acceso a datos
│       ├── properties.ts
│       ├── inquiries.ts
│       └── agents.ts
├── config/site.ts            # Constantes globales de la marca
├── types/index.ts            # Tipos TypeScript del dominio
├── auth.ts                   # Configuración NextAuth
└── middleware.ts             # Protección de rutas /admin y /login
```

## Design System

### Paleta de colores

| Token | Valor | Uso |
|-------|-------|-----|
| `crimson` | `#960018` | Color primario — CTAs, acentos |
| `gold` | `#C9A86A` | Acento dorado — detalles premium |
| `obsidian` | `#121212` | Color de texto principal |
| `ivory` | `#F8F8F8` | Fondos de secciones alternas |

**Regla:** nunca usar colores genéricos de Tailwind (`blue-500`, `green-400`) para elementos de marca. Usar siempre los tokens del design system.

### Tipografía

- **Títulos:** `font-playfair` (Playfair Display) con `tracking-tight`
- **Cuerpo:** `font-inter` (Inter)
- Los `h1`–`h6` ya aplican `font-playfair` vía `globals.css`

### Clases de utilidad clave

```css
.section-padding      /* py-section px-4 md:px-8 lg:px-12 */
.container-luxury     /* max-w-8xl mx-auto */
.section-label        /* eyebrow text: uppercase, tracking-widest, text-crimson */
.glass / .glass-dark  /* glassmorphism */
.text-gradient-gold   /* degradado dorado en texto */
```

## Patrones importantes

### Modo sin base de datos (DB_AVAILABLE)

Todas las funciones en `src/lib/queries/` verifican:

```typescript
const DB_AVAILABLE = Boolean(process.env.DATABASE_URL);
```

Si `DATABASE_URL` no está configurada, retornan datos mock de `src/lib/mock-data.ts`. El app funciona completamente sin DB en desarrollo.

### Protección de API routes

El middleware solo cubre rutas de página (`/admin/:path*`). Las API routes bajo `/api/admin/*` deben llamar `requireAuth()` manualmente:

```typescript
import { requireAuth } from "@/lib/auth-helpers";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;
  // ...
}
```

### Button con asChild (Radix Slot)

Cuando `asChild=true`, los íconos van **dentro** del `<Link>`, no como props `leftIcon`/`rightIcon`:

```tsx
// ✅ Correcto
<Button asChild variant="primary">
  <Link href="/ruta">
    <Plus className="h-4 w-4" />
    Nueva propiedad
  </Link>
</Button>

// ❌ Incorrecto — los íconos se ignoran con asChild
<Button asChild leftIcon={<Plus />}>
  <Link href="/ruta">Nueva propiedad</Link>
</Button>
```

### Zonas y slugs de propiedades

- `createProperty` recibe `zoneSlug` (string), resuelve `zoneId` con un lookup a DB antes de crear.
- `generateUniqueSlug(title)` en `queries/properties.ts` es async — verifica conflictos en DB y añade sufijo numérico si es necesario.

### InquiryNote — campo `content` vs `text`

- Schema Prisma usa `content` (no `text`)
- El frontend y las API routes usan `text` como alias
- La API de notas mapea `note.content → text` al responder

### Actualizaciones optimistas en el admin

`properties-table.tsx` y `leads-table.tsx` actualizan el estado local **antes** de hacer el fetch. Si el API falla, hacen rollback o re-fetch.

## Variables de entorno

Ver `.env.example` para la lista completa. Las críticas para desarrollo:

```bash
DATABASE_URL              # PostgreSQL — opcional, usa mock si no existe
AUTH_SECRET               # Requerido para NextAuth (cualquier string en dev)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  # Para subida de imágenes
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY    # Para mapa interactivo en detalle
NEXT_PUBLIC_GA_ID                  # Google Analytics 4
```

## Rutas del sistema

| Ruta | Descripción |
|------|-------------|
| `/` | Home con hero, propiedades destacadas, agentes |
| `/propiedades` | Listado con filtros |
| `/propiedades/[slug]` | Detalle de propiedad |
| `/agentes` | Directorio de agentes |
| `/login` | Autenticación |
| `/admin` | Dashboard (protegido) |
| `/admin/propiedades` | CRUD de propiedades |
| `/admin/propiedades/nueva` | Formulario nueva propiedad |
| `/admin/propiedades/[id]` | Editar propiedad |
| `/admin/leads` | Gestión de leads/contactos |
| `/admin/agentes` | Gestión de agentes |
| `/api/admin/properties` | GET lista / POST crear |
| `/api/admin/properties/[id]` | PUT actualizar / DELETE eliminar |
| `/api/admin/properties/[id]/status` | PATCH cambiar estado |
| `/api/admin/leads/[id]/status` | PATCH cambiar estado lead |
| `/api/admin/leads/[id]/notes` | POST agregar nota |
| `/api/inquiries` | POST formulario de contacto público |
| `/api/upload` | POST firma Cloudinary |

## Estado del proyecto — Fases completadas

- **Fase 1** — Arquitectura, Design System, schema Prisma, componentes UI base
- **Fase 2** — Home page, Navbar, Footer
- **Fase 3** — Listado de propiedades + filtros + búsqueda
- **Fase 4** — Detalle de propiedad (galería, mapa, contacto)
- **Fase 5** — Panel admin (CRUD visual)
- **Fase 6** — Autenticación y roles (NextAuth v5 + middleware)
- **Fase 7** — SEO avanzado, JSON-LD, sitemap, capa Prisma
- **Fase 8** — Integraciones: Cloudinary, Google Maps, Analytics GA4, WhatsApp Business API
- **Fase 9** — Admin REST API completa, CRUD persistente con optimistic updates
