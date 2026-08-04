// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: actualizar a la URL real de producción cuando se defina el dominio/host final.
const SITE_URL = 'https://www.alandarmerida.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  image: {
    // Los renders/master plan son pesados (varios PNG >2MB); Astro los convierte
    // a formatos responsivos (webp/avif) y genera srcset automáticamente.
    responsiveStyles: true,
  },
});
