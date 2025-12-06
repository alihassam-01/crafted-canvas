import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 9011,
    proxy: {
      '/api/auth': { target: 'http://localhost:3001', changeOrigin: true },
      '/api/shops': { 
        target: 'http://localhost:3002', 
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/products': { target: 'http://localhost:3003', changeOrigin: true },
      '/api/orders': { target: 'http://localhost:3004', changeOrigin: true },
      '/api/cart': { target: 'http://localhost:3004', changeOrigin: true },
      '/api/payments': { target: 'http://localhost:3005', changeOrigin: true },
      '/api/notifications': { target: 'http://localhost:3006', changeOrigin: true },
      '/api/reviews': { target: 'http://localhost:3008', changeOrigin: true },
      '/api/admin': { target: 'http://localhost:3009', changeOrigin: true },
      '/api/promotions': { target: 'http://localhost:3010', changeOrigin: true },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
