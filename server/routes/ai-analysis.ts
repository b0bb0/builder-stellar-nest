import { RequestHandler } from "express";
import { AIAnalysis, Vulnerability, SeverityLevel } from "@shared/api";

// Mock AI analysis generator
// In a real implementation, this would integrate with AI services like OpenAI, Claude, etc.
const generateAIAnalysis = (vulnerabilities: Vulnerability[]): AIAnalysis => {
  const criticalCount = vulnerabilities.filter(
    (v) => v.severity === "critical",
  ).length;
  const highCount = vulnerabilities.filter((v) => v.severity === "high").length;
  const mediumCount = vulnerabilities.filter(
    (v) => v.severity === "medium",
  ).length;
  const lowCount = vulnerabilities.filter((v) => v.severity === "low").length;
  const infoCount = vulnerabilities.filter((v) => v.severity === "info").length;

  // Calculate risk score based on vulnerability distribution
  let riskScore = 0;
  riskScore += criticalCount * 20;
  riskScore += highCount * 15;
  riskScore += mediumCount * 10;
  riskScore += lowCount * 5;
  riskScore += infoCount * 1;
  riskScore = Math.min(riskScore, 100);

  // Generate summary based on findings
  let summary = "The security assessment has been completed. ";
  if (criticalCount > 0) {
    summary += `${criticalCount} critical vulnerabilities were identified that require immediate attention. `;
  }
  if (highCount > 0) {
    summary += `${highCount} high-severity issues were found that should be addressed promptly. `;
  }
  if (criticalCount + highCount === 0) {
    summary +=
      "No critical or high-severity vulnerabilities were detected, indicating a relatively good security posture. ";
  }
  summary +=
    "Regular security assessments and timely patching are recommended to maintain security standards.";

  // Generate recommendations based on vulnerability types
  const recommendations: string[] = [];
  const vulnTypes = new Set(vulnerabilities.flatMap((v) => v.tags));

  if (vulnTypes.has("injection") || vulnTypes.has("sql")) {
    recommendations.push(
      "Implement input validation and parameterized queries to prevent injection attacks",
    );
  }
  if (vulnTypes.has("xss")) {
    recommendations.push(
      "Implement proper output encoding and Content Security Policy (CSP) headers",
    );
  }
  if (vulnTypes.has("authorization") || vulnTypes.has("idor")) {
    recommendations.push(
      "Strengthen access controls and implement proper authorization checks",
    );
  }
  if (vulnTypes.has("headers") || vulnTypes.has("configuration")) {
    recommendations.push(
      "Configure security headers and harden server configuration",
    );
  }
  if (vulnTypes.has("traversal")) {
    recommendations.push(
      "Implement path validation and restrict file system access",
    );
  }

  // Add general recommendations
  recommendations.push(
    "Conduct regular security training for development team",
  );
  recommendations.push(
    "Implement automated security testing in CI/CD pipeline",
  );
  recommendations.push("Establish incident response procedures");

  // Generate risk factors
  const riskFactors: string[] = [];
  if (criticalCount > 0) {
    riskFactors.push(`${criticalCount} critical vulnerabilities detected`);
  }
  if (highCount > 0) {
    riskFactors.push(`${highCount} high-severity issues identified`);
  }
  if (vulnTypes.has("injection")) {
    riskFactors.push("Code injection vulnerabilities present");
  }
  if (vulnTypes.has("authentication")) {
    riskFactors.push("Authentication bypass possibilities");
  }
  if (vulnTypes.has("disclosure")) {
    riskFactors.push("Information disclosure vulnerabilities");
  }

  // Sort vulnerabilities by severity for prioritization
  const severityOrder: Record<SeverityLevel, number> = {
    critical: 5,
    high: 4,
    medium: 3,
    low: 2,
    info: 1,
  };

  const prioritizedVulns = [...vulnerabilities].sort(
    (a, b) => severityOrder[b.severity] - severityOrder[a.severity],
  );

  // Estimate fix time based on vulnerability count and severity
  let estimatedDays = 0;
  estimatedDays += criticalCount * 2; // 2 days per critical
  estimatedDays += highCount * 1; // 1 day per high
  estimatedDays += mediumCount * 0.5; // 0.5 days per medium
  estimatedDays += lowCount * 0.25; // 0.25 days per low

  const estimatedFixTime =
    estimatedDays < 1
      ? "< 1 day"
      : estimatedDays < 7
        ? `${Math.ceil(estimatedDays)} days`
        : estimatedDays < 30
          ? `${Math.ceil(estimatedDays / 7)} weeks`
          : `${Math.ceil(estimatedDays / 30)} months`;

  return {
    summary,
    riskScore,
    recommendations: recommendations.slice(0, 6), // Limit to 6 recommendations
    prioritizedVulns,
    riskFactors,
    estimatedFixTime,
  };
};

export const getAIAnalysis: RequestHandler = async (req, res) => {
  try {
    const { scanId } = req.params;

    // In a real implementation, this would:
    // 1. Fetch scan results from database
    // 2. Send vulnerability data to AI service
    // 3. Process AI response and format results
    // 4. Cache analysis for future requests

    // For demo purposes, we'll generate mock analysis
    // This should match the vulnerabilities generated in scanner.ts
    const mockVulnerabilities: Vulnerability[] = [
      {
        id: "1",
        title: "SQL Injection in Login Form",
        description:
          "The login form is vulnerable to SQL injection attacks through the username parameter.",
        severity: "critical" as SeverityLevel,
        cvss: 9.8,
        cve: "CVE-2023-12345",
        url: "https://target.example.com/login.php",
        method: "POST",
        evidence: "' OR '1'='1' -- -",
        tags: ["injection", "sql", "authentication"],
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Cross-Site Scripting (XSS)",
        description: "Reflected XSS vulnerability found in search parameter.",
        severity: "high" as SeverityLevel,
        cvss: 7.2,
        cve: "CVE-2023-12346",
        url: "https://target.example.com/search.php?q=<script>alert(1)</script>",
        method: "GET",
        evidence: "<script>alert(1)</script>",
        tags: ["xss", "injection", "client-side"],
        timestamp: new Date().toISOString(),
      },
      // Add more mock vulnerabilities as needed
    ];

    const analysis = generateAIAnalysis(mockVulnerabilities);

    res.json(analysis);
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
