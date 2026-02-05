import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // React core
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // Redux
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
            // Ant Design UI library
            'antd-vendor': ['antd', '@ant-design/icons'],
            // Form libraries
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // Utilities
            'utils-vendor': ['axios', 'dayjs', 'clsx', 'tailwind-merge'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  }
})