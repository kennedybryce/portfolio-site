// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://bryce-kennedy.com', // Update this to your actual custom domain
  base: '/',
  vite: {
    plugins: [tailwindcss()]
  },
  experimental: {
    clientPrerender: true
  }
});