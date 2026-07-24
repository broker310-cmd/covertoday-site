import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://covertoday.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'es'],
    routing: { prefixDefaultLocale: false },
  },
});
