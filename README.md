# Alandar Paseo Residencial — Landing

Landing de una sola página construida con [Astro](https://astro.build) (sin framework de UI, sin Docker) a partir de la propuesta de diseño en `Downloads/propuesta Sitio web Alandar 2026/`. Todo el HTML se genera estático en build; la interactividad (menú, slider, master plan, cotizador, galería, formularios) es JS vanilla por componente.

## Comandos

| Comando | Acción |
| --- | --- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local en `http://localhost:4321` |
| `npm run build` | Build de producción a `./dist/` (HTML/CSS/JS/imágenes estáticas) |
| `npm run preview` | Sirve el build de `./dist/` para probarlo antes de subirlo |
| `npx astro check` | Type-check de los componentes `.astro` |

## Estructura

- `src/data/content.ts` — todos los textos/datos (stats, amenidades, financiamiento, pines del master plan, etc.). Editar aquí antes que en los componentes.
- `src/components/` — una sección por archivo (`Hero`, `MasterPlan`, `Amenities`, `Contact`, etc.).
- `src/layouts/Layout.astro` — `<head>` con SEO (meta, Open Graph, JSON-LD), fuentes y wrapper de header/footer.
- `src/assets/img/` — imágenes que Astro optimiza automáticamente (`astro:assets`, conversión a WebP + `srcset` en build).
- `public/media/` — video (`alandar-04.mp4`) y brochure (`.pdf`), se sirven tal cual sin procesar.

## Pendientes antes de publicar (marcados como `TODO` en el código)

1. **Dominio real**: cambiar `SITE_URL` en `astro.config.mjs` y la URL del sitemap en `public/robots.txt` por el dominio final.
2. **Teléfono/WhatsApp y correo de ventas reales**: en `src/data/content.ts` → `site.phoneDisplay`, `site.phoneWhatsapp`, `site.email`. Hoy tienen valores de ejemplo. El botón flotante de WhatsApp y los formularios (contacto, brochure, info) dependen de `site.phoneWhatsapp`.
3. **Formularios**: no hay backend. Actualmente abren WhatsApp con el mensaje prellenado (o descargan el PDF en el caso del brochure). Si se quiere conectar a un CRM/n8n/correo, es el punto para integrarlo.

## Deploy

Es un sitio 100% estático (`output: "static"` por default en Astro). `npm run build` genera `./dist/` listo para subir a cualquier hosting estático (Nginx, Vercel, Netlify, Hostinger, etc.) — sin necesidad de Node en el servidor ni Docker.
