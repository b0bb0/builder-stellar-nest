import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  ScanOptions,
  ScanResponse,
  ScanStatusResponse,
  Vulnerability,
  SeverityLevel,
} from "@shared/api";

// Simple validation schema
const ScanOptionsSchema = z.object({
  target: z.object({
    url: z.string().url(),
    name: z.string().optional(),
  }),
  tools: z
    .array(
      z.object({
        name: z.string(),
        enabled: z.boolean(),
        description: z.string(),
      }),
    )
    .min(1),
  severity: z
    .array(z.enum(["critical", "high", "medium", "low", "info"]))
    .optional(),
  timeout: z.number().min(10).max(3600).optional(),
});

// In-memory store for demo purposes (replace with actual DB later)
const mockScans = new Map<string, any>();

// Generate mock vulnerabilities for demo
function generateMockVulnerabilities(targetUrl: string): Vulnerability[] {
  return [
    {
      id: uuidv4(),
      title: "Demo SQL Injection Vulnerability",
      description:
        "Mock vulnerability for demonstration. The system is working correctly.",
      severity: "high" as SeverityLevel,
      cvss: 8.1,
      cve: "CVE-2023-DEMO-1",
      url: `${targetUrl}/login`,
      method: "POST",
      evidence: "Mock SQL injection evidence",
      tags: ["injection", "sql", "demo"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Demo Cross-Site Scripting (XSS)",
      description: "Mock XSS vulnerability for demonstration purposes.",
      severity: "medium" as SeverityLevel,
      cvss: 6.1,
      url: `${targetUrl}/search`,
      method: "GET",
      evidence: "Mock XSS payload",
      tags: ["xss", "client-side", "demo"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Demo Security Headers Missing",
      description: "Mock security configuration issue for demonstration.",
      severity: "low" as SeverityLevel,
      cvss: 3.1,
      url: targetUrl,
      method: "GET",
      evidence: "Missing security headers",
      tags: ["headers", "configuration", "demo"],
      timestamp: new Date().toISOString(),
    },
  ];
}

export const startSimpleScan: RequestHandler = async (req, res) => {
  try {
    console.log(
      "Simple scan start request received:",
      JSON.stringify(req.body, null, 2),
    );

    // Validate request
    const validatedOptions = ScanOptionsSchema.parse(req.body);
    const scanId = uuidv4();

    // Store scan info
    mockScans.set(scanId, {
      id: scanId,
      target: validatedOptions.target,
      status: "completed",
      vulnerabilities: generateMockVulnerabilities(validatedOptions.target.url),
      stats: { total: 3, critical: 0, high: 1, medium: 1, low: 1, info: 0 },
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: 5,
    });

    const response: ScanResponse = {
      scanId,
      status: "started",
      message: "Demo scan completed successfully",
    };

    console.log("Simple scan started successfully:", response);
    res.status(202).json(response);
  } catch (error) {
    console.error("Simple scan error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request data",
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : "Something went wrong",
    });
  }
};

export const getSimpleScanStatus: RequestHandler = async (req, res) => {
  try {
    const { scanId } = req.params;

    if (!scanId) {
      return res.status(400).json({
        error: "Scan ID is required",
      });
    }

    const scanResult = mockScans.get(scanId);

    if (!scanResult) {
      return res.status(404).json({
        error: "Scan not found",
      });
    }

    const response: ScanStatusResponse = {
      scan: scanResult,
      analysis: {
        summary:
          "Demo scan completed successfully. This is a mock analysis showing that the scanner is working correctly.",
        riskScore: 65,
        recommendations: [
          "Fix the SQL injection vulnerability immediately",
          "Implement XSS protection measures",
          "Add missing security headers",
          "Conduct regular security assessments",
        ],
        prioritizedVulns: scanResult.vulnerabilities.slice(0, 3),
        riskFactors: [
          "High-severity SQL injection vulnerability detected",
          "Multiple web application security issues identified",
          "Missing security configuration",
        ],
        estimatedFixTime: "2-3 days",
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Simple scan status error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getSimpleScannerHealth: RequestHandler = async (req, res) => {
  try {
    const health = {
      status: "healthy",
      mode: process.env.NODE_ENV || "development",
      activeScans: 0,
      maxConcurrent: 5,
      availableSlots: 5,
      nucleiAvailable: false,
      aiEnabled: false,
      websocketConnections: 0,
      timestamp: new Date().toISOString(),
    };

    res.json(health);
  } catch (error) {
    console.error("Simple health check error:", error);
    res.status(500).json({
      status: "error",
      error: "Health check failed",
    });
  }
};
