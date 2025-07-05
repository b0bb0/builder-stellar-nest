import { RequestHandler } from "express";
import { z } from "zod";
import {
  ScanOptions,
  ScanResponse,
  ScanStatusResponse,
  AIAnalysis,
} from "@shared/api";

// Lazy imports to avoid circular dependency
let scanManager: any = null;
let aiAnalysisQueries: any = null;

const getScanManager = async () => {
  if (!scanManager) {
    const module = await import("../services/scan-manager");
    scanManager = module.scanManager;
  }
  return scanManager;
};

const getAiAnalysisQueries = async () => {
  if (!aiAnalysisQueries) {
    const module = await import("../config/database");
    aiAnalysisQueries = module.aiAnalysisQueries;
  }
  return aiAnalysisQueries;
};

// Validation schemas
const ScanToolSchema = z.object({
  name: z.string(),
  enabled: z.boolean(),
  description: z.string(),
});

const ScanTargetSchema = z.object({
  url: z.string().url(),
  name: z.string().optional(),
});

const ScanOptionsSchema = z.object({
  target: ScanTargetSchema,
  tools: z.array(ScanToolSchema).min(1),
  severity: z
    .array(z.enum(["critical", "high", "medium", "low", "info"]))
    .optional(),
  timeout: z.number().min(10).max(3600).optional(),
});

export const startEnhancedScan: RequestHandler = async (req, res) => {
  try {
    console.log(
      "Starting enhanced scan with request body:",
      JSON.stringify(req.body, null, 2),
    );

    // Validate request body
    const validatedOptions = ScanOptionsSchema.parse(req.body);

    // Check rate limiting (basic implementation)
    const clientIp = req.ip || req.connection.remoteAddress;
    // TODO: Implement proper rate limiting with Redis or memory store

    // Start the scan
    const manager = await getScanManager();
    const scanId = await manager.startScan(validatedOptions);

    const response: ScanResponse = {
      scanId,
      status: "started",
      message: "Vulnerability scan initiated successfully",
    };

    res.status(202).json(response);
  } catch (error) {
    console.error("Error starting enhanced scan:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request data",
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getEnhancedScanStatus: RequestHandler = async (req, res) => {
  try {
    const { scanId } = req.params;

    if (!scanId) {
      return res.status(400).json({
        error: "Scan ID is required",
      });
    }

    const manager = await getScanManager();
    const scanResult = await manager.getScanResult(scanId);

    if (!scanResult) {
      return res.status(404).json({
        error: "Scan not found",
      });
    }

    let analysis: AIAnalysis | undefined;

    // Get AI analysis if scan is completed
    if (scanResult.status === "completed") {
      const queries = await getAiAnalysisQueries();
      const dbAnalysis = queries.findByScanId.get(scanId);
      if (dbAnalysis) {
        analysis = {
          summary: dbAnalysis.summary,
          riskScore: dbAnalysis.risk_score,
          recommendations: JSON.parse(dbAnalysis.recommendations),
          prioritizedVulns: scanResult.vulnerabilities
            .sort((a, b) => {
              const severityOrder = {
                critical: 5,
                high: 4,
                medium: 3,
                low: 2,
                info: 1,
              };
              return severityOrder[b.severity] - severityOrder[a.severity];
            })
            .slice(0, 10),
          riskFactors: JSON.parse(dbAnalysis.risk_factors),
          estimatedFixTime: dbAnalysis.estimated_fix_time,
        };
      }
    }

    const response: ScanStatusResponse = {
      scan: scanResult,
      analysis,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching scan status:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const stopScan: RequestHandler = async (req, res) => {
  try {
    const { scanId } = req.params;

    if (!scanId) {
      return res.status(400).json({
        error: "Scan ID is required",
      });
    }

    const manager = await getScanManager();
    const stopped = await manager.stopScan(scanId);

    if (stopped) {
      res.json({
        message: "Scan stopped successfully",
        scanId,
      });
    } else {
      res.status(404).json({
        error: "Scan not found or already completed",
      });
    }
  } catch (error) {
    console.error("Error stopping scan:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getScanLogs: RequestHandler = async (req, res) => {
  try {
    const { scanId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!scanId) {
      return res.status(400).json({
        error: "Scan ID is required",
      });
    }

    const manager = await getScanManager();
    const logs = await manager.getScanLogs(scanId, limit);

    res.json({
      scanId,
      logs,
    });
  } catch (error) {
    console.error("Error fetching scan logs:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getActiveScans: RequestHandler = async (req, res) => {
  try {
    const manager = await getScanManager();
    const activeScans = manager.getActiveScanIds();
    const activeCount = manager.getActiveScanCount();

    res.json({
      activeScans,
      activeCount,
      maxConcurrent: parseInt(process.env.MAX_CONCURRENT_SCANS || "5"),
    });
  } catch (error) {
    console.error("Error fetching active scans:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getRecentScans: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const manager = await getScanManager();
    const recentScans = await manager.getRecentScans(limit);

    res.json({
      scans: recentScans,
    });
  } catch (error) {
    console.error("Error fetching recent scans:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getScannerHealth: RequestHandler = async (req, res) => {
  try {
    const manager = await getScanManager();
    const activeScans = manager.getActiveScanCount();
    const maxConcurrent = parseInt(process.env.MAX_CONCURRENT_SCANS || "5");

    // Check system health
    const health = {
      status: "healthy",
      mode: process.env.NODE_ENV || "development",
      activeScans,
      maxConcurrent,
      availableSlots: maxConcurrent - activeScans,
      nucleiAvailable: false, // Will be checked below
      aiEnabled: process.env.AI_ENABLED === "true",
      websocketConnections: 0, // Will be populated by WebSocket service
      timestamp: new Date().toISOString(),
    };

    // Check Nuclei availability (async)
    try {
      const { nucleiService } = await import("../services/nuclei");
      health.nucleiAvailable = await nucleiService.checkInstallation();
    } catch (error) {
      console.warn("Nuclei check failed:", error);
    }

    // Get WebSocket stats
    try {
      const { wsService } = await import("../services/websocket");
      health.websocketConnections = wsService.getConnectionCount();
    } catch (error) {
      console.warn("WebSocket stats failed:", error);
    }

    res.json(health);
  } catch (error) {
    console.error("Error checking scanner health:", error);
    res.status(500).json({
      status: "error",
      error: "Health check failed",
    });
  }
};
