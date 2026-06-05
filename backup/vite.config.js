import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-at-profile-routes',
      configureServer(server) {
        // Vite reserves /@ for internal modules (/@vite/client, /@fs/, /@id/, etc.)
        // Profile routes like /@username get intercepted before React Router loads.
        // Respond directly with transformed index.html so the browser URL stays
        // intact and React Router can match the /@:handle route client-side.
        server.middlewares.use(async (req, res, next) => {
          if (req.url && /^\/@(?!vite|fs|id|react-refresh)/.test(req.url)) {
            try {
              const indexPath = path.resolve(process.cwd(), 'index.html');
              let html = fs.readFileSync(indexPath, 'utf-8');
              html = await server.transformIndexHtml(req.url, html);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(html);
            } catch (e) {
              next(e);
            }
            return;
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: true
  }
})
