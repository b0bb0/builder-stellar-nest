import WebSocket, { WebSocketServer } from "ws";
import { Server } from "http";
import { v4 as uuidv4 } from "uuid";

export interface WSMessage {
  type:
    | "scan_progress"
    | "scan_completed"
    | "scan_failed"
    | "vulnerability_found"
    | "scan_log";
  scanId: string;
  data: any;
  timestamp: string;
}

export interface WSConnection {
  id: string;
  ws: WebSocket;
  subscribedScans: Set<string>;
  lastPing: number;
}

export class WebSocketService {
  private wss: WebSocketServer | null = null;
  private connections: Map<string, WSConnection> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;

  initialize(server: Server) {
    if (!process.env.WS_ENABLED || process.env.WS_ENABLED !== "true") {
      console.log("WebSocket service disabled");
      return;
    }

    this.wss = new WebSocket.Server({
      server,
      path: "/ws",
      perMessageDeflate: false,
    });

    this.wss.on("connection", (ws, req) => {
      const connectionId = uuidv4();
      const connection: WSConnection = {
        id: connectionId,
        ws,
        subscribedScans: new Set(),
        lastPing: Date.now(),
      };

      this.connections.set(connectionId, connection);
      console.log(`WebSocket client connected: ${connectionId}`);

      // Send welcome message
      this.sendToConnection(connectionId, {
        type: "scan_progress",
        scanId: "system",
        data: { message: "Connected to scanner WebSocket" },
        timestamp: new Date().toISOString(),
      });

      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(connectionId, message);
        } catch (error) {
          console.error("Invalid WebSocket message:", error);
        }
      });

      ws.on("pong", () => {
        const conn = this.connections.get(connectionId);
        if (conn) {
          conn.lastPing = Date.now();
        }
      });

      ws.on("close", () => {
        this.connections.delete(connectionId);
        console.log(`WebSocket client disconnected: ${connectionId}`);
      });

      ws.on("error", (error) => {
        console.error(`WebSocket error for ${connectionId}:`, error);
        this.connections.delete(connectionId);
      });
    });

    // Start ping interval to check connection health
    this.pingInterval = setInterval(() => {
      this.pingConnections();
    }, 30000); // 30 seconds

    console.log("WebSocket service initialized");
  }

  private handleClientMessage(connectionId: string, message: any) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    switch (message.type) {
      case "subscribe_scan":
        if (message.scanId) {
          connection.subscribedScans.add(message.scanId);
          console.log(
            `Client ${connectionId} subscribed to scan ${message.scanId}`,
          );
        }
        break;

      case "unsubscribe_scan":
        if (message.scanId) {
          connection.subscribedScans.delete(message.scanId);
          console.log(
            `Client ${connectionId} unsubscribed from scan ${message.scanId}`,
          );
        }
        break;

      case "ping":
        connection.lastPing = Date.now();
        this.sendToConnection(connectionId, {
          type: "scan_progress",
          scanId: "system",
          data: { message: "pong" },
          timestamp: new Date().toISOString(),
        });
        break;
    }
  }

  private pingConnections() {
    const now = Date.now();
    const timeout = 60000; // 60 seconds timeout

    for (const [connectionId, connection] of this.connections.entries()) {
      if (now - connection.lastPing > timeout) {
        console.log(`Closing stale connection: ${connectionId}`);
        connection.ws.terminate();
        this.connections.delete(connectionId);
      } else {
        try {
          connection.ws.ping();
        } catch (error) {
          console.error(`Error pinging connection ${connectionId}:`, error);
          this.connections.delete(connectionId);
        }
      }
    }
  }

  sendToConnection(connectionId: string, message: WSMessage) {
    const connection = this.connections.get(connectionId);
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      try {
        connection.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to ${connectionId}:`, error);
        this.connections.delete(connectionId);
      }
    }
  }

  broadcastToScanSubscribers(scanId: string, message: WSMessage) {
    for (const [connectionId, connection] of this.connections.entries()) {
      if (connection.subscribedScans.has(scanId)) {
        this.sendToConnection(connectionId, message);
      }
    }
  }

  broadcast(message: WSMessage) {
    for (const connectionId of this.connections.keys()) {
      this.sendToConnection(connectionId, message);
    }
  }

  // Convenience methods for different message types
  sendScanProgress(scanId: string, progress: number, phase: string) {
    this.broadcastToScanSubscribers(scanId, {
      type: "scan_progress",
      scanId,
      data: { progress, phase },
      timestamp: new Date().toISOString(),
    });
  }

  sendVulnerabilityFound(scanId: string, vulnerability: any) {
    this.broadcastToScanSubscribers(scanId, {
      type: "vulnerability_found",
      scanId,
      data: vulnerability,
      timestamp: new Date().toISOString(),
    });
  }

  sendScanCompleted(scanId: string, result: any) {
    this.broadcastToScanSubscribers(scanId, {
      type: "scan_completed",
      scanId,
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  sendScanFailed(scanId: string, error: string) {
    this.broadcastToScanSubscribers(scanId, {
      type: "scan_failed",
      scanId,
      data: { error },
      timestamp: new Date().toISOString(),
    });
  }

  sendScanLog(scanId: string, level: string, message: string) {
    this.broadcastToScanSubscribers(scanId, {
      type: "scan_log",
      scanId,
      data: { level, message },
      timestamp: new Date().toISOString(),
    });
  }

  getConnectionCount(): number {
    return this.connections.size;
  }

  getActiveSubscriptions(): { [scanId: string]: number } {
    const subscriptions: { [scanId: string]: number } = {};

    for (const connection of this.connections.values()) {
      for (const scanId of connection.subscribedScans) {
        subscriptions[scanId] = (subscriptions[scanId] || 0) + 1;
      }
    }

    return subscriptions;
  }

  shutdown() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    for (const connection of this.connections.values()) {
      connection.ws.close();
    }

    if (this.wss) {
      this.wss.close();
    }

    console.log("WebSocket service shut down");
  }
}

export const wsService = new WebSocketService();
