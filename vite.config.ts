import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'] },
  build: { target: 'es2022', sourcemap: true },
  server: { host: '0.0.0.0' }
});
