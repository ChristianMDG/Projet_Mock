import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@models', replacement: path.resolve(__dirname, '../front/src/models') },
      ],
    },
    server: {
      port: 3001,
      host: true,
      open: true,
    },
    define: {
      // Make env variables available in the app
      __APP_ENV__: JSON.stringify(env.VITE_ENV),
      __API_URL__: JSON.stringify(env.VITE_API_URL),
      global: 'window',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        '@tanstack/react-query',
        'axios',
        'zustand',
      ],
      force: true,
    },
    ssr: {
      resolve: {
        externalConditions: ['import'],
      },
      noExternal: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled', 'react-i18next'],
    },
    build: {
      // SSR build configuration
      ssr: process.env.SSR_BUILD === 'true' ? 'src/entry-server.tsx' : undefined,
      outDir: process.env.SSR_BUILD === 'true' ? 'dist/server' : 'dist/client',
      rollupOptions: {
        output:
          process.env.SSR_BUILD === 'true'
            ? {}
            : {
                manualChunks: {
                  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                  'vendor-mui': ['@mui/material', '@mui/icons-material'],
                  'vendor-query': ['@tanstack/react-query'],
                  'vendor-utils': ['axios', 'zustand'],
                },
              },
      },
      chunkSizeWarningLimit: 700,
    },
  };
});
