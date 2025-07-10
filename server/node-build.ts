import path from "path";
import { createHttpServer, createExpressServer } from "./index";
import * as express from "express";

const server = createHttpServer();
const app = createExpressServer();
const port = process.env.PORT || 3001;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

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

server.listen(port, () => {
  console.log(`🛡️  LUMINOUS FLOW Scanner running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`📡 WebSocket: ws://localhost:${port}/ws`);
  console.log(`🔍 Health: http://localhost:${port}/api/health`);
});

// The graceful shutdown is already handled in createHttpServer

import { createHttpServer } from './index';
import { initializeDatabase } from './config/database';
import { WebSocketService } from './services/websocket';

const startServer = async () => {
    // ...existing code...
    const port = process.env.PORT || 8080;
    const app = createHttpServer();
    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      
      // Initialize WebSocket service only if enabled
      if (process.env.WS_ENABLED === 'true') {
        console.log('Initializing WebSocket service...');
        const wss = new WebSocketService();
        wss.initialize(server);
        console.log('WebSocket service initialized.');
      } else {
        console.log('WebSocket service is disabled.');
      }
    });

    const shutdown = (signal: string) => {
    // ...existing code...
