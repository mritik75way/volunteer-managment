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
          manualChunks: (id) => {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'redux-vendor';
            }
            if (id.includes('antd')) {
              if (id.includes('@ant-design/icons')) {
                return 'antd-icons';
              }
              if (id.includes('/table') || id.includes('/pagination')) {
                return 'antd-table';
              }
              if (id.includes('/form') || id.includes('/input') || id.includes('/select') || id.includes('/date-picker') || id.includes('/input-number')) {
                return 'antd-form';
              }
              if (id.includes('/modal') || id.includes('/drawer') || id.includes('/popover') || id.includes('/dropdown') || id.includes('/tooltip')) {
                return 'antd-overlay';
              }
              if (id.includes('/skeleton') || id.includes('/result') || id.includes('/message') || id.includes('/notification') || id.includes('/spin') || id.includes('/progress')) {
                return 'antd-feedback';
              }
              if (id.includes('/typography') || id.includes('/card') || id.includes('/space') || id.includes('/divider') || id.includes('/list') || id.includes('/tag') || id.includes('/avatar')) {
                return 'antd-common';
              }
              return 'antd-core';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
              return 'form-vendor';
            }
            if (id.includes('axios') || id.includes('dayjs') || id.includes('clsx')) {
              return 'utils-vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  }
})