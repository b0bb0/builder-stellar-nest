import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Import database and services
import { initializeDatabase } from "./config/database";
import { wsService } from "./services/websocket";

// Import route handlers
import { handleDemo } from "./routes/demo";
import { startScan, getScanStatus } from "./routes/scanner";
import { getAIAnalysis } from "./routes/ai-analysis";
import {
  startSimpleScan,
  getSimpleScanStatus,
  getSimpleScannerHealth,
} from "./routes/simple-scanner";

export function createExpressServer() {
  const app = express();

  // Trust proxy for rate limiting and IP detection
  app.set("trust proxy", 1);

  // Middleware
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : true,
      credentials: true,
    }),
  );

  // Test endpoint before JSON middleware
  app.post("/api/test", (req, res) => {
    res.json({ message: "Test POST works" });
  });

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
      );
    });
    next();
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      mode: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown",
    });
  });

  // Legacy API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "LUMINOUS FLOW Scanner API v2.0" });
  });

  app.get("/api/demo", handleDemo);

  // Legacy scanner routes (for backward compatibility)
  app.post("/api/scanner/start", startScan);
  app.get("/api/scanner/status/:scanId", getScanStatus);
  app.get("/api/ai-analysis/:scanId", getAIAnalysis);

  // Ultra-simple scanner routes (inline to avoid any import issues)
  app.post("/api/v2/scanner/start", (req, res) => {
    try {
      console.log("Scan start request received");
      const scanId = Math.random().toString(36).substring(7);
      res.status(202).json({
        scanId,
        status: "started",
        message: "Demo scan initiated successfully",
      });
    } catch (error) {
      console.error("Scan start error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/v2/scanner/status/:scanId", (req, res) => {
    try {
      const { scanId } = req.params;
      res.json({
        scan: {
          id: scanId,
          target: { url: "https://demo.example.com" },
          status: "completed",
          vulnerabilities: [
            {
              id: "demo-1",
              title: "Demo Vulnerability",
              description: "This is a demonstration vulnerability.",
              severity: "medium",
              url: "https://demo.example.com/test",
              tags: ["demo"],
              timestamp: new Date().toISOString(),
            },
          ],
          stats: { total: 1, critical: 0, high: 0, medium: 1, low: 0, info: 0 },
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          duration: 30,
        },
        analysis: {
          summary: "Demo scan completed successfully.",
          riskScore: 45,
          recommendations: [
            "Review demo findings",
            "Implement security measures",
          ],
          prioritizedVulns: [],
          riskFactors: ["Demo risk factor"],
          estimatedFixTime: "1 day",
        },
      });
    } catch (error) {
      console.error("Scan status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/v2/scanner/health", (req, res) => {
    res.json({
      status: "healthy",
      mode: "development",
      activeScans: 0,
      maxConcurrent: 5,
      availableSlots: 5,
      nucleiAvailable: false,
      aiEnabled: false,
      websocketConnections: 0,
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/v2/scanner/stop/:scanId", (req, res) => {
    res.json({ message: "Scan stopped", scanId: req.params.scanId });
  });

  app.get("/api/v2/scanner/logs/:scanId", (req, res) => {
    res.json({ scanId: req.params.scanId, logs: [] });
  });

  app.get("/api/v2/scanner/active", (req, res) => {
    res.json({ activeScans: [], activeCount: 0, maxConcurrent: 5 });
  });

  app.get("/api/v2/scanner/recent", (req, res) => {
    res.json({ scans: [] });
  });

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Unhandled error:", err);
      res.status(500).json({
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
      });
    },
  );

  // In production, serve static files and handle SPA routing
  if (process.env.NODE_ENV === "production") {
    const __dirname = import.meta.dirname || process.cwd();
    const distPath = path.join(__dirname, "../spa");
    
    console.log("Serving static files from:", distPath);
    
    // Serve static files
    app.use(express.static(distPath));
    
    // Handle React Router - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      // Don't serve index.html for API routes
      if (
        req.path.startsWith("/api/") ||
        req.path.startsWith("/health") ||
        req.path.startsWith("/ws")
      ) {
        return res.status(404).json({ error: "API endpoint not found" });
      }
      
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // 404 handler for development
    app.use("*", (req, res) => {
      res.status(404).json({
        error: "Not found",
        path: req.originalUrl,
      });
    });
  }

  return app;
}

export function createHttpServer() {
  // Initialize database
  console.log("Initializing database...");
  try {
    initializeDatabase();
  } catch (error) {
    console.error("Database initialization failed, using mock data:", error);
  }

  // Create Express app
  const app = createExpressServer();

  // Create HTTP server
  const server = createServer(app);

  // Initialize WebSocket service
  console.log("Initializing WebSocket service...");
  wsService.initialize(server);

  // Graceful shutdown handling
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully...");
    wsService.shutdown();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully...");
    wsService.shutdown();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  return server;
}
