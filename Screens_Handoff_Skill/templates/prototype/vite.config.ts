import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// ds.config.json is written by tools/build_prototype.py: where the project's Storybook source lives (its components,
// tokens and styles are imported from there through the @ds alias, never copied or re-created).
const cfg = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, 'ds.config.json'), 'utf8'));
const dsSrc = path.resolve(import.meta.dirname, cfg.storybookSrc);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@ds': dsSrc },
    // The Storybook components import react from their own folder; one copy keeps hooks working.
    dedupe: ['react', 'react-dom'],
  },
  server: { fs: { allow: [import.meta.dirname, dsSrc] } },
});
