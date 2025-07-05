import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import {
  ScanOptions,
  ScanResponse,
  ScanResult,
  AIAnalysis,
  Vulnerability,
} from "@shared/api";

// Simple in-memory storage for development
const mockScans = new Map<string, any>();
const mockVulnerabilities = new Map<string, Vulnerability[]>();

export function createDevServer() {
  const app = express();

  // Simple CORS and body parsing without Express middleware conflicts
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }

    // Set empty body by default
    req.body = {};
    next();
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      mode: "development",
      timestamp: new Date().toISOString(),
    });
  });

  // Basic API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "LUMINOUS FLOW Scanner API v2.0 (Dev Mode)" });
  });

  // Mock scanner routes
  app.post("/api/scanner/start", (req, res) => {
    try {
      const options = req.body as ScanOptions;
      const scanId = uuidv4();

      // Store mock scan
      mockScans.set(scanId, {
        id: scanId,
        target: options.target,
        status: "pending",
        startTime: new Date().toISOString(),
      });

      const response: ScanResponse = {
        scanId,
        status: "started",
        message: "Mock vulnerability scan initiated",
      };

      res.status(202).json(response);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.get("/api/scanner/status/:scanId", (req, res) => {
    const { scanId } = req.params;
    const scan = mockScans.get(scanId);

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    // Generate mock vulnerabilities
    const vulnerabilities = generateMockVulnerabilities(scan.target.url);

    const result: ScanResult = {
      id: scanId,
      target: scan.target,
      status: "completed",
      vulnerabilities,
      stats: {
        total: vulnerabilities.length,
        critical: vulnerabilities.filter((v) => v.severity === "critical")
          .length,
        high: vulnerabilities.filter((v) => v.severity === "high").length,
        medium: vulnerabilities.filter((v) => v.severity === "medium").length,
        low: vulnerabilities.filter((v) => v.severity === "low").length,
        info: vulnerabilities.filter((v) => v.severity === "info").length,
      },
      startTime: scan.startTime,
      endTime: new Date().toISOString(),
      duration: 120,
    };

    res.json({ scan: result });
  });

  app.get("/api/ai-analysis/:scanId", (req, res) => {
    const { scanId } = req.params;
    const scan = mockScans.get(scanId);

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    const analysis: AIAnalysis = {
      summary:
        "Mock AI analysis for development testing. The target application shows several security vulnerabilities that require attention.",
      riskScore: 75,
      recommendations: [
        "Implement input validation and parameterized queries",
        "Enable proper authentication mechanisms",
        "Update third-party dependencies",
        "Implement security headers",
        "Add rate limiting protection",
      ],
      prioritizedVulns: generateMockVulnerabilities(scan.target.url).slice(
        0,
        5,
      ),
      riskFactors: [
        "Multiple high-severity vulnerabilities detected",
        "Outdated software components identified",
        "Insufficient access controls observed",
      ],
      estimatedFixTime: "2-3 weeks",
    };

    res.json(analysis);
  });

  // Enhanced API routes (v2)
  app.post("/api/v2/scanner/start", (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        console.log("Received raw body:", body);
        const options = body ? JSON.parse(body) : {};
        console.log("Parsed options:", JSON.stringify(options, null, 2));

        // Basic validation
        if (!options.target?.url) {
          console.log("Validation failed: missing target.url", options.target);
          return res.status(400).json({ error: "Target URL is required" });
        }

        const scanId = uuidv4();

        // Store mock scan
        mockScans.set(scanId, {
          id: scanId,
          target: options.target,
          status: "pending",
          startTime: new Date().toISOString(),
        });

        const response = {
          scanId,
          status: "started",
          message: "Enhanced mock vulnerability scan initiated",
        };

        console.log("Scan started successfully:", response);
        res.status(202).json(response);
      } catch (error) {
        console.error("Scan start error:", error);
        res.status(400).json({ error: "Invalid request data" });
      }
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      res.status(500).json({ error: "Request processing failed" });
    });
  });

  app.get("/api/v2/scanner/status/:scanId", (req, res) => {
    try {
      const { scanId } = req.params;
      const scan = mockScans.get(scanId);

      if (!scan) {
        return res.status(404).json({ error: "Scan not found" });
      }

      // Generate mock vulnerabilities
      const vulnerabilities = generateMockVulnerabilities(scan.target.url);

      const result = {
        id: scanId,
        target: scan.target,
        status: "completed",
        vulnerabilities,
        stats: {
          total: vulnerabilities.length,
          critical: vulnerabilities.filter((v) => v.severity === "critical")
            .length,
          high: vulnerabilities.filter((v) => v.severity === "high").length,
          medium: vulnerabilities.filter((v) => v.severity === "medium").length,
          low: vulnerabilities.filter((v) => v.severity === "low").length,
          info: vulnerabilities.filter((v) => v.severity === "info").length,
        },
        startTime: scan.startTime,
        endTime: new Date().toISOString(),
        duration: 120,
      };

      const analysis = {
        summary:
          "Enhanced mock analysis showing the scanner is working correctly in development mode.",
        riskScore: 68,
        recommendations: [
          "Address critical SQL injection vulnerability",
          "Implement XSS protection measures",
          "Fix directory traversal issues",
          "Add security headers configuration",
        ],
        prioritizedVulns: vulnerabilities.slice(0, 5),
        riskFactors: [
          "Multiple high-severity vulnerabilities detected",
          "Web application security gaps identified",
        ],
        estimatedFixTime: "3-5 days",
      };

      console.log("Returning scan status for:", scanId);
      res.json({ scan: result, analysis });
    } catch (error) {
      console.error("Scan status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/v2/scanner/health", (_req, res) => {
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

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      error: "API endpoint not found",
      path: req.originalUrl,
      mode: "development",
    });
  });

  return app;
}

function generateMockVulnerabilities(targetUrl?: string): Vulnerability[] {
  const baseUrl = targetUrl || "https://target.example.com";

  const vulnerabilityTemplates = [
    {
      title: "SQL Injection in Login Form",
      description:
        "The login form is vulnerable to SQL injection attacks through the username parameter",
      severity: "critical" as const,
      cvss: 9.8,
      tags: ["SQL Injection", "Authentication", "Database"],
      method: "POST",
      path: "/login.php",
      evidence: "' OR '1'='1' -- -",
    },
    {
      title: "Cross-Site Scripting (XSS)",
      description:
        "Reflected XSS vulnerability in search functionality allows script injection",
      severity: "high" as const,
      cvss: 8.2,
      tags: ["XSS", "Client-Side", "Input Validation"],
      method: "GET",
      path: "/search.php",
      evidence: "<script>alert(1)</script>",
    },
    {
      title: "Weak Authentication Mechanism",
      description: "Password policy is insufficient and allows weak passwords",
      severity: "medium" as const,
      cvss: 6.5,
      tags: ["Authentication", "Policy", "Security"],
      method: "POST",
      path: "/auth",
      evidence: "Password requirements not enforced",
    },
    {
      title: "Information Disclosure",
      description: "Sensitive server information exposed in HTTP headers",
      severity: "low" as const,
      cvss: 3.1,
      tags: ["Information", "Headers", "Configuration"],
      method: "GET",
      path: "/",
      evidence: "Server: Apache/2.4.41, X-Powered-By: PHP/7.4.3",
    },
    {
      title: "CSRF Token Missing",
      description: "Cross-Site Request Forgery protection is not implemented",
      severity: "medium" as const,
      cvss: 5.4,
      tags: ["CSRF", "Session", "Security"],
      method: "POST",
      path: "/profile/update",
      evidence: "No CSRF token validation",
    },
    {
      title: "Directory Traversal",
      description: "File inclusion vulnerability allows access to system files",
      severity: "high" as const,
      cvss: 7.8,
      tags: ["Directory Traversal", "File System", "Server"],
      method: "GET",
      path: "/download.php",
      evidence: "root:x:0:0:root:/root:/bin/bash",
    },
    {
      title: "Insecure Direct Object Reference",
      description:
        "User can access other users' data by modifying ID parameters",
      severity: "high" as const,
      cvss: 8.1,
      tags: ["IDOR", "Authorization", "Data"],
      method: "GET",
      path: "/user/profile",
      evidence: "Unauthorized data access",
    },
    {
      title: "SSL/TLS Configuration Issue",
      description: "Server supports weak SSL/TLS protocols and ciphers",
      severity: "medium" as const,
      cvss: 5.9,
      tags: ["Network", "SSL", "Encryption"],
      method: "GET",
      path: "/",
      evidence: "TLS 1.0 supported, weak ciphers enabled",
    },
    {
      title: "Open Redirect Vulnerability",
      description:
        "Application redirects users to external domains without validation",
      severity: "low" as const,
      cvss: 4.2,
      tags: ["Redirect", "Validation", "Client-Side"],
      method: "GET",
      path: "/redirect",
      evidence: "Redirects to malicious domain",
    },
    {
      title: "Command Injection",
      description:
        "OS command injection vulnerability in file upload functionality",
      severity: "critical" as const,
      cvss: 9.9,
      tags: ["Command Injection", "Upload", "Server"],
      method: "POST",
      path: "/upload",
      evidence: "; cat /etc/passwd",
    },
    {
      title: "Session Fixation",
      description: "Session ID is not regenerated after authentication",
      severity: "medium" as const,
      cvss: 6.1,
      tags: ["Session", "Authentication", "Security"],
      method: "POST",
      path: "/login",
      evidence: "Session ID remains unchanged after login",
    },
    {
      title: "Missing Security Headers",
      description: "Important security headers like CSP and HSTS are missing",
      severity: "info" as const,
      cvss: 2.1,
      tags: ["Headers", "Configuration", "Information"],
      method: "GET",
      path: "/",
      evidence: "Missing: X-Frame-Options, CSP, HSTS",
    },
  ];

  return vulnerabilityTemplates.map((template, index) => ({
    id: uuidv4(),
    title: template.title,
    description: template.description,
    severity: template.severity,
    cvss: template.cvss,
    cve: `CVE-2024-${String(1000 + index).padStart(4, "0")}`,
    url: `${baseUrl}${template.path}`,
    method: template.method,
    evidence: template.evidence,
    tags: template.tags,
    timestamp: new Date().toISOString(),
  }));
}
