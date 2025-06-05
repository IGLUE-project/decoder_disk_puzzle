import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async ({ mode }) => {
  let _ESCAPP_APP_SETTINGS = {};
  try {
    if (mode === "development") {
      _ESCAPP_APP_SETTINGS = await import("./config.js").then((mod) => mod.ESCAPP_APP_SETTINGS);
    }
  } catch(e){}

  return {
    base: './',
    server: {
      open: true,
    },
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    define: {
      ESCAPP_APP_SETTINGS: mode === "development"
        ? JSON.stringify(_ESCAPP_APP_SETTINGS)
        : "undefined",
    },
  };
});