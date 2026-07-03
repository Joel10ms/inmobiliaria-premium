# Plan de Hosting y Base de Datos — Élite Propiedades

## Por qué GoDaddy no sirve para este proyecto

GoDaddy es hosting compartido PHP/Apache. Next.js 15 requiere un runtime Node.js activo para SSR, API routes y App Router. No hay forma de hacer funcionar este proyecto en GoDaddy sin hacerlo completamente estático, lo que rompe el admin, las API routes y el SSR.

---

## Opciones de Hosting + Base de Datos

### Opción 1 — Gratis (solo para pruebas / demos)

| Servicio | Costo | Notas |
|----------|-------|-------|
| Vercel Hobby | $0 | Solo para proyectos personales, sin uso comercial |
| Neon (free tier) | $0 | 0.5 GB PostgreSQL, 1 proyecto |
| Cloudinary (free) | $0 | 25 créditos/mes |
| **Total** | **$0/mes** | No apto para producción comercial |

---

### Opción 2 — Profesional ⭐ Recomendada

| Servicio | Costo USD | Notas |
|----------|-----------|-------|
| **Vercel Pro** | $20/mes | Hecho por el equipo de Next.js, mejor rendimiento, despliegue automático desde GitHub |
| **Neon Launch** | $19/mes | PostgreSQL serverless, autoscaling, backups automáticos, 10 GB |
| Cloudinary (free) | $0 | Suficiente para empezar |
| **Total** | **~$39/mes** (~$780 MXN) | |

**Por qué esta opción:** Vercel tiene integración nativa con Next.js (fue creado por el mismo equipo), con soporte para App Router, Edge Functions, ISR y despliegue con un solo `git push`. Neon es la DB más popular en el ecosistema Next.js/Prisma.

---

### Opción 3 — Todo en uno económico

| Servicio | Costo USD | Notas |
|----------|-----------|-------|
| **Railway** | $10–20/mes | App + PostgreSQL en una sola plataforma, cobro por uso |
| Cloudinary (free) | $0 | |
| **Total** | **~$15–20/mes** (~$300–400 MXN) | |

**Por qué esta opción:** Más económica. Railway despliega el app y la DB juntos, factura por consumo real. Ideal si el tráfico es bajo al inicio.

---

### Opción 4 — Empresa con más features

| Servicio | Costo USD | Notas |
|----------|-----------|-------|
| **Vercel Pro** | $20/mes | |
| **Supabase Pro** | $25/mes | PostgreSQL + Auth integrada + Storage + Realtime |
| Cloudinary free | $0 | |
| **Total** | **~$45/mes** (~$900 MXN) | |

**Por qué esta opción:** Supabase incluye funcionalidades extra útiles para futuro: almacenamiento de archivos, autenticación OAuth, funciones en tiempo real. Si el proyecto escala, ya tienes la infraestructura.

---

## Resumen comparativo

| | Vercel + Neon | Railway | Vercel + Supabase |
|--|:--:|:--:|:--:|
| Costo/mes | ~$39 | ~$15–20 | ~$45 |
| Soporte Next.js | Nativo ⭐ | Bueno | Nativo ⭐ |
| Facilidad de deploy | `git push` | `git push` | `git push` |
| PostgreSQL | Sí | Sí | Sí + extras |
| Backups automáticos | Sí | Sí | Sí |
| Escala automática | Sí | Limitado | Sí |
| Panel de DB visual | Sí (Neon) | Sí | Sí (Supabase Studio) |

---

## Recomendación

**Opción 2 — Vercel Pro + Neon (~$39/mes):**

1. La migración desde GoDaddy es un `git push` — el repo ya está en GitHub (`Joel10ms/inmobiliaria-premium`)
2. Vercel detecta Next.js automáticamente y configura todo sin tocar nada
3. Neon tiene tier gratuito para hacer pruebas antes de pagar
4. El costo de ~$780 MXN/mes es razonable para un sitio inmobiliario premium donde una sola comisión lo paga por años

## Pasos para migrar

1. Crear cuenta en [vercel.com](https://vercel.com) e importar el repo de GitHub
2. Crear cuenta en [neon.tech](https://neon.tech) y crear un proyecto PostgreSQL
3. Configurar variables de entorno en Vercel (copiar desde `.env.example`)
4. Ejecutar `prisma db push` apuntando a la nueva DB de Neon
5. Ejecutar `prisma db seed` para poblar datos iniciales
6. Apuntar el dominio de GoDaddy a los nameservers de Vercel
