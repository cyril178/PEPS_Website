// @ts-check
import { defineConfig } from 'astro/config';
import todoCheck from './src/integrations/todo-check.mjs';

export default defineConfig({
  // À remplacer par le domaine définitif (ex. https://etude-peps.ch)
  site: 'https://peps-website.cyril17891.workers.dev',
  output: 'static',
  build: { format: 'directory' },
  integrations: [todoCheck()],
});
