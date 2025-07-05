import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      try {
        // Use simplified development server
        const { createDevServer } = require("./server/dev-server.ts");
        const app = createDevServer();

        // Add Express app as middleware to Vite dev server
        server.middlewares.use(app);
        console.log("Development server loaded successfully");
      } catch (error) {
        console.error("Failed to load development server:", error);

        // Fallback - serve basic health endpoint
        server.middlewares.use("/api", (req, res, next) => {
          if (req.url === "/health") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                status: "error",
                error: "Development server failed to load",
                message: error.message,
              }),
            );
          } else {
            res.writeHead(503, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "Service temporarily unavailable",
                message: "Development server failed to initialize",
              }),
            );
          }
        });
      }
    },
  };
}
