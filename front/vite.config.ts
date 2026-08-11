import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: true, // Expose to local network
      port: 5173, // Default Vite port
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
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
        '@mui/lab',
        '@emotion/react',
        '@emotion/styled',
        '@tanstack/react-query',
        'dayjs',
        'axios',
        'zustand',
      ],
      force: true, // Force re-optimization on restart
    },
    ssr: {
      resolve: {
        externalConditions: ['import'],
      },
      noExternal: [
        '@mui/material',
        '@mui/icons-material',
        '@mui/lab',
        '@emotion/react',
        '@emotion/styled',
        'react-i18next',
        'react-helmet-async',
      ],
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
                  // Vendor chunks
                  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                  'vendor-mui': ['@mui/material', '@mui/icons-material', '@mui/lab'],
                  'vendor-query': ['@tanstack/react-query'],
                  'vendor-utils': ['dayjs', 'axios', 'zustand'],

                  // Feature-based chunks - split main pages further
                  'pages-home': ['./src/pages/HomePage.tsx'],
                  'pages-auth': ['./src/pages/LoginPage.tsx'],
                  'pages-koperative': ['./src/pages/KoperativePage.tsx', './src/pages/KoperativeDetailPage.tsx'],
                  'pages-gare': ['./src/pages/GarePage.tsx', './src/pages/GareDetailPage.tsx'],
                  'pages-operator': ['./src/pages/OperatorPage.tsx'],
                  'pages-contrat': ['./src/pages/ContratPage.tsx', './src/pages/ContratFormPage.tsx'],
                  'pages-dynamic': ['./src/pages/DynamicPage.tsx', './src/pages/ListDynamicPage.tsx'],

                  // Store chunks
                  stores: [
                    './src/stores/auth.store.ts',
                    './src/stores/header.store.ts',
                    './src/stores/voyage-scheduler.store.ts',
                    './src/stores/guichet-form.store.ts',
                    './src/stores/gare-form.store.ts',
                    './src/stores/koperative-form.store.ts',
                    './src/stores/operator-form.store.ts',
                    './src/stores/guichet-list.store.ts',
                  ],
                },
              },
      },
      chunkSizeWarningLimit: 700, // Increase warning limit to 700kb
    },
  };
});
