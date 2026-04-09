import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icon-192x192.png', 'icon-512x512.png'],
          manifest: {
            name: 'AWS Cloud Prep',
            short_name: 'AWSPrep',
            description: 'AWS Cloud Practitioner Exam Preparation',
            theme_color: '#1e3a5f',
            background_color: '#f8fafc',
            display: 'standalone',
            scope: '/',
            start_url: '/',
            icons: [
              {
                src: 'icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
        }),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
