import { useEffect, useRef, useState } from "react";

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

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const [messageHistory, setMessageHistory] = useState<WSMessage[]>([]);

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const messageListeners = useRef<Map<string, (message: WSMessage) => void>>(
    new Map(),
  );
  const scanSubscriptions = useRef<Set<string>>(new Set());

  const connect = () => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      setConnectionStatus("connecting");
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setConnectionStatus("connected");
        reconnectAttempts.current = 0;

        // Re-subscribe to any scans we were previously subscribed to
        scanSubscriptions.current.forEach((scanId) => {
          subscribeTo(scanId);
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          setLastMessage(message);
          setMessageHistory((prev) => [...prev.slice(-99), message]); // Keep last 100 messages

          // Call specific listeners
          const listener = messageListeners.current.get(message.type);
          if (listener) {
            listener(message);
          }

          // Call scan-specific listeners
          const scanListener = messageListeners.current.get(
            `scan:${message.scanId}`,
          );
          if (scanListener) {
            scanListener(message);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus("disconnected");

        // Attempt to reconnect if not a manual close
        if (
          event.code !== 1000 &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          reconnectAttempts.current++;
          console.log(
            `Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`,
          );

          setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.warn("WebSocket error (development mode):", error);
        setConnectionStatus("error");
      };
    } catch (error) {
      console.warn(
        "Failed to create WebSocket connection (development mode):",
        error,
      );
      setConnectionStatus("error");
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close(1000, "Manual disconnect");
      ws.current = null;
    }
  };

  const send = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  const subscribeTo = (scanId: string) => {
    scanSubscriptions.current.add(scanId);
    send({
      type: "subscribe_scan",
      scanId,
    });
  };

  const unsubscribeFrom = (scanId: string) => {
    scanSubscriptions.current.delete(scanId);
    send({
      type: "unsubscribe_scan",
      scanId,
    });
  };

  const addMessageListener = (
    type: string,
    callback: (message: WSMessage) => void,
  ) => {
    messageListeners.current.set(type, callback);

    // Return cleanup function
    return () => {
      messageListeners.current.delete(type);
    };
  };

  const addScanListener = (
    scanId: string,
    callback: (message: WSMessage) => void,
  ) => {
    return addMessageListener(`scan:${scanId}`, callback);
  };

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  // Ping to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      send({ type: "ping" });
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [isConnected]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    messageHistory,
    connect,
    disconnect,
    send,
    subscribeTo,
    unsubscribeFrom,
    addMessageListener,
    addScanListener,
  };
}

// Specialized hook for scan monitoring
export function useScanWebSocket(scanId: string | null) {
  const ws = useWebSocket();
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState("Initializing...");
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!scanId || !ws.isConnected) return;

    // Subscribe to the scan
    ws.subscribeTo(scanId);

    // Set up scan-specific listeners
    const cleanupListeners = [
      ws.addScanListener(scanId, (message) => {
        switch (message.type) {
          case "scan_progress":
            setScanProgress(message.data.progress || 0);
            setScanPhase(message.data.phase || "Processing...");
            break;

          case "vulnerability_found":
            setVulnerabilities((prev) => [...prev, message.data]);
            break;

          case "scan_log":
            setLogs((prev) => [
              ...prev.slice(-49), // Keep last 50 logs
              {
                timestamp: message.timestamp,
                level: message.data.level,
                message: message.data.message,
              },
            ]);
            break;

          case "scan_completed":
          case "scan_failed":
            // These will be handled by the parent component
            break;
        }
      }),
    ];

    return () => {
      // Cleanup listeners
      cleanupListeners.forEach((cleanup) => cleanup());

      // Unsubscribe from the scan
      if (scanId) {
        ws.unsubscribeFrom(scanId);
      }
    };
  }, [scanId, ws.isConnected]);

  return {
    ...ws,
    scanProgress,
    scanPhase,
    vulnerabilities,
    logs,
  };
}
