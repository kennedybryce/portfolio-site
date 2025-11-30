// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://kennedybryce.github.io/portfolio-site',
  base: import.meta.env.PROD ? "/portfolio-site/" : "/",
  vite: {
    plugins: [tailwindcss()]
  },
  experimental: {
    clientPrerender: true
  }
});