import { RequestHandler } from "express";
import {
  ScanOptions,
  ScanResponse,
  ScanResult,
  Vulnerability,
  SeverityLevel,
} from "@shared/api";
import { v4 as uuidv4 } from "uuid";

// Mock scan results for demo purposes
// In a real implementation, this would integrate with actual Nuclei scanner
const generateMockVulnerabilities = (targetUrl: string): Vulnerability[] => {
  const mockVulns: Vulnerability[] = [
    {
      id: uuidv4(),
      title: "SQL Injection in Login Form",
      description:
        "The login form is vulnerable to SQL injection attacks through the username parameter.",
      severity: "critical" as SeverityLevel,
      cvss: 9.8,
      cve: "CVE-2023-12345",
      url: `${targetUrl}/login.php`,
      method: "POST",
      evidence: "' OR '1'='1' -- -",
      tags: ["injection", "sql", "authentication"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Cross-Site Scripting (XSS)",
      description: "Reflected XSS vulnerability found in search parameter.",
      severity: "high" as SeverityLevel,
      cvss: 7.2,
      cve: "CVE-2023-12346",
      url: `${targetUrl}/search.php?q=<script>alert(1)</script>`,
      method: "GET",
      evidence: "<script>alert(1)</script>",
      tags: ["xss", "injection", "client-side"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Directory Traversal",
      description: "Application is vulnerable to directory traversal attacks.",
      severity: "high" as SeverityLevel,
      cvss: 8.1,
      url: `${targetUrl}/download.php?file=../../../etc/passwd`,
      method: "GET",
      evidence: "root:x:0:0:root:/root:/bin/bash",
      tags: ["traversal", "file-access"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Insecure Direct Object Reference",
      description:
        "User can access other users' data by manipulating ID parameters.",
      severity: "medium" as SeverityLevel,
      cvss: 6.5,
      url: `${targetUrl}/profile.php?user_id=1337`,
      method: "GET",
      evidence: "Unauthorized access to user profile",
      tags: ["idor", "authorization"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Missing Security Headers",
      description:
        "Application is missing important security headers like X-Frame-Options and Content-Security-Policy.",
      severity: "low" as SeverityLevel,
      cvss: 3.1,
      url: targetUrl,
      method: "GET",
      evidence: "Missing: X-Frame-Options, CSP, HSTS",
      tags: ["headers", "configuration"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Information Disclosure",
      description:
        "Server version and technology stack exposed in HTTP headers.",
      severity: "info" as SeverityLevel,
      cvss: 2.0,
      url: targetUrl,
      method: "GET",
      evidence: "Server: Apache/2.4.41, X-Powered-By: PHP/7.4.3",
      tags: ["disclosure", "fingerprinting"],
      timestamp: new Date().toISOString(),
    },
  ];

  return mockVulns;
};

const calculateStats = (vulnerabilities: Vulnerability[]) => {
  const stats = {
    total: vulnerabilities.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  vulnerabilities.forEach((vuln) => {
    stats[vuln.severity]++;
  });

  return stats;
};

export const startScan: RequestHandler = async (req, res) => {
  try {
    const scanOptions = req.body as ScanOptions;
    const scanId = uuidv4();

    // Validate input
    if (!scanOptions.target?.url) {
      return res.status(400).json({
        error: "Target URL is required",
      });
    }

    if (!scanOptions.tools?.length) {
      return res.status(400).json({
        error: "At least one scanning tool must be selected",
      });
    }

    // In a real implementation, this would:
    // 1. Queue the scan job
    // 2. Execute Nuclei with appropriate templates
    // 3. Parse and store results
    // 4. Return scan ID for status checking

    // For demo purposes, we'll simulate immediate response
    const response: ScanResponse = {
      scanId,
      status: "started",
      message: "Vulnerability scan initiated successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error starting scan:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getScanStatus: RequestHandler = async (req, res) => {
  try {
    const { scanId } = req.params;

    // In a real implementation, this would check the actual scan status
    // For demo purposes, we'll return a completed scan with mock data
    const mockVulnerabilities = generateMockVulnerabilities(
      "https://target.example.com",
    );
    const stats = calculateStats(mockVulnerabilities);

    const scanResult: ScanResult = {
      id: scanId,
      target: { url: "https://target.example.com" },
      status: "completed",
      vulnerabilities: mockVulnerabilities,
      stats,
      startTime: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      endTime: new Date().toISOString(),
      duration: 300, // 5 minutes in seconds
    };

    res.json({ scan: scanResult });
  } catch (error) {
    console.error("Error fetching scan status:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
