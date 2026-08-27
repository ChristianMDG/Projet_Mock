import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import viteCompression from 'vite-plugin-compression';

// ============================================================================
// VITE CONFIGURATION
// ============================================================================

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isSSRBuild = process.env.SSR_BUILD === 'true';

  return {
    // ========================================
    // Plugins
    // ========================================
    plugins: [
      react(),
      viteCompression({
        verbose: true,
        threshold: 1024,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      viteCompression({
        verbose: true,
        threshold: 1024,
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
    ],

    // ========================================
    // Development Server
    // ========================================
    server: {
      host: true,
      port: 5173,
      watch: {
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
      },
      hmr: {
        port: 24678,
      },
    },

    // ========================================
    // Path Aliases
    // ========================================
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },

    // ========================================
    // Global Constants
    // ========================================
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENV),
      __API_URL__: JSON.stringify(env.VITE_API_URL),
      // Use globalThis (works in both browser and Node.js) instead of window (browser-only)
      // Skip for SSR builds where Node.js already provides global
      ...(isSSRBuild ? {} : { global: 'globalThis' }),
    },

    // ========================================
    // Dependency Pre-bundling
    // ========================================
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
      esbuildOptions: {
        target: 'esnext',
      },
    },

    // ========================================
    // SSR Configuration
    // ========================================
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
        'react-transition-group',
      ],
    },

    // ========================================
    // Build Configuration
    // ========================================
    build: {
      ssr: isSSRBuild ? 'src/entry-server.tsx' : undefined,
      outDir: isSSRBuild ? 'dist/server' : 'dist/client',
      target: 'esnext',
      minify: 'esbuild',
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output:
          process.env.SSR_BUILD === 'true'
            ? {}
            : {
                manualChunks: {
                  // Vendor chunks
                  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                  'vendor-mui': ['@mui/material', '@mui/lab'],
                  'vendor-mui-icons': ['@mui/icons-material'],
                  'vendor-query': ['@tanstack/react-query'],
                  'vendor-utils': ['dayjs', 'axios', 'zustand'],
                },
              },
      },
    },
  };
});
