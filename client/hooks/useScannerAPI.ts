import { useState } from "react";
import {
  ScanOptions,
  ScanResponse,
  ScanStatusResponse,
  ScanResult,
  AIAnalysis,
} from "@shared/api";

export interface ScannerHealth {
  status: string;
  activeScans: number;
  maxConcurrent: number;
  availableSlots: number;
  nucleiAvailable: boolean;
  aiEnabled: boolean;
  websocketConnections: number;
  timestamp: string;
}

export interface UseScannerAPIReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  startScan: (options: ScanOptions) => Promise<string>;
  getScanStatus: (scanId: string) => Promise<ScanStatusResponse>;
  stopScan: (scanId: string) => Promise<void>;
  getScanLogs: (scanId: string, limit?: number) => Promise<any[]>;
  getActiveScans: () => Promise<{
    activeScans: string[];
    activeCount: number;
    maxConcurrent: number;
  }>;
  getRecentScans: (limit?: number) => Promise<any[]>;
  getHealth: () => Promise<ScannerHealth>;

  // Utility
  clearError: () => void;
}

const API_BASE = "/api/v2";

export function useScannerAPI(): UseScannerAPIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async <T>(
    requestFn: () => Promise<Response>,
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await requestFn();

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;

        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }

          // Add additional context for common error codes
          if (response.status === 500) {
            errorMessage +=
              ". Server error - please check if all services are running properly.";
          } else if (response.status === 400) {
            errorMessage = "Invalid request: " + errorMessage;
          } else if (response.status === 404) {
            errorMessage = "API endpoint not found: " + errorMessage;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status code
          errorMessage = `Server error (${response.status}). Please try again or contact support.`;
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("API request failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const startScan = async (options: ScanOptions): Promise<string> => {
    console.log("Starting scan with options:", options);
    console.log("Making request to:", `${API_BASE}/scanner/start`);

    const response = await handleRequest<ScanResponse>(() =>
      fetch(`${API_BASE}/scanner/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      }),
    );

    console.log("Scan started successfully:", response);
    return response.scanId;
  };

  const getScanStatus = async (scanId: string): Promise<ScanStatusResponse> => {
    return await handleRequest<ScanStatusResponse>(() =>
      fetch(`${API_BASE}/scanner/status/${scanId}`),
    );
  };

  const stopScan = async (scanId: string): Promise<void> => {
    await handleRequest(() =>
      fetch(`${API_BASE}/scanner/stop/${scanId}`, {
        method: "POST",
      }),
    );
  };

  const getScanLogs = async (
    scanId: string,
    limit: number = 50,
  ): Promise<any[]> => {
    const response = await handleRequest<{ logs: any[] }>(() =>
      fetch(`${API_BASE}/scanner/logs/${scanId}?limit=${limit}`),
    );

    return response.logs;
  };

  const getActiveScans = async () => {
    return await handleRequest<{
      activeScans: string[];
      activeCount: number;
      maxConcurrent: number;
    }>(() => fetch(`${API_BASE}/scanner/active`));
  };

  const getRecentScans = async (limit: number = 10) => {
    const response = await handleRequest<{ scans: any[] }>(() =>
      fetch(`${API_BASE}/scanner/recent?limit=${limit}`),
    );

    return response.scans;
  };

  const getHealth = async (): Promise<ScannerHealth> => {
    return await handleRequest<ScannerHealth>(() =>
      fetch(`${API_BASE}/scanner/health`),
    );
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    startScan,
    getScanStatus,
    stopScan,
    getScanLogs,
    getActiveScans,
    getRecentScans,
    getHealth,
    clearError,
  };
}

// Specialized hook for managing a single scan lifecycle
export function useScanLifecycle() {
  const api = useScannerAPI();
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const startNewScan = async (options: ScanOptions) => {
    const scanId = await api.startScan(options);
    setCurrentScanId(scanId);
    setScanResult(null);
    setAiAnalysis(null);
    return scanId;
  };

  const checkScanStatus = async () => {
    if (!currentScanId) return null;

    const statusResponse = await api.getScanStatus(currentScanId);
    setScanResult(statusResponse.scan);

    if (statusResponse.analysis) {
      setAiAnalysis(statusResponse.analysis);
    }

    return statusResponse;
  };

  const stopCurrentScan = async () => {
    if (!currentScanId) return;

    await api.stopScan(currentScanId);
    setCurrentScanId(null);
  };

  const resetScan = () => {
    setCurrentScanId(null);
    setScanResult(null);
    setAiAnalysis(null);
  };

  return {
    ...api,
    currentScanId,
    scanResult,
    aiAnalysis,
    startNewScan,
    checkScanStatus,
    stopCurrentScan,
    resetScan,
  };
}
