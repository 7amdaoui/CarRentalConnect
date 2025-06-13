import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy API requests to the backend
      '/cars': 'http://localhost:8080',
      '/reservations': 'http://localhost:8080',
      '/users': 'http://localhost:8080',
      '/cars/agencies': 'http://localhost:8080',
      '/revenue': 'http://localhost:8080',
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
