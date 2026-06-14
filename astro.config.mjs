import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.covertoday.com',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'es'],
    routing: {
      prefixDefaultLocale: false, // en at root, /ru and /es prefixed
    },
  },
});
