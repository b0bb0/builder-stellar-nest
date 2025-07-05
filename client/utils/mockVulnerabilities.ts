import { Vulnerability } from "@shared/api";

export const generateMockVulnerabilities = (
  count: number = 12,
): Vulnerability[] => {
  const vulnerabilityTemplates = [
    {
      title: "SQL Injection in Login Form",
      description:
        "The login form is vulnerable to SQL injection attacks through the username parameter",
      severity: "critical" as const,
      cvss: 9.8,
      tags: ["SQL Injection", "Authentication", "Database"],
      method: "POST",
    },
    {
      title: "Cross-Site Scripting (XSS)",
      description:
        "Reflected XSS vulnerability in search functionality allows script injection",
      severity: "high" as const,
      cvss: 8.2,
      tags: ["XSS", "Client-Side", "Input Validation"],
      method: "GET",
    },
    {
      title: "Weak Authentication Mechanism",
      description: "Password policy is insufficient and allows weak passwords",
      severity: "medium" as const,
      cvss: 6.5,
      tags: ["Authentication", "Policy", "Security"],
      method: "POST",
    },
    {
      title: "Information Disclosure",
      description: "Sensitive server information exposed in HTTP headers",
      severity: "low" as const,
      cvss: 3.1,
      tags: ["Information", "Headers", "Configuration"],
      method: "GET",
    },
    {
      title: "CSRF Token Missing",
      description: "Cross-Site Request Forgery protection is not implemented",
      severity: "medium" as const,
      cvss: 5.4,
      tags: ["CSRF", "Session", "Security"],
      method: "POST",
    },
    {
      title: "Directory Traversal",
      description: "File inclusion vulnerability allows access to system files",
      severity: "high" as const,
      cvss: 7.8,
      tags: ["Directory Traversal", "File System", "Server"],
      method: "GET",
    },
    {
      title: "Insecure Direct Object Reference",
      description:
        "User can access other users' data by modifying ID parameters",
      severity: "high" as const,
      cvss: 8.1,
      tags: ["IDOR", "Authorization", "Data"],
      method: "GET",
    },
    {
      title: "SSL/TLS Configuration Issue",
      description: "Server supports weak SSL/TLS protocols and ciphers",
      severity: "medium" as const,
      cvss: 5.9,
      tags: ["Network", "SSL", "Encryption"],
      method: "GET",
    },
    {
      title: "Open Redirect Vulnerability",
      description:
        "Application redirects users to external domains without validation",
      severity: "low" as const,
      cvss: 4.2,
      tags: ["Redirect", "Validation", "Client-Side"],
      method: "GET",
    },
    {
      title: "Command Injection",
      description:
        "OS command injection vulnerability in file upload functionality",
      severity: "critical" as const,
      cvss: 9.9,
      tags: ["Command Injection", "Upload", "Server"],
      method: "POST",
    },
    {
      title: "Session Fixation",
      description: "Session ID is not regenerated after authentication",
      severity: "medium" as const,
      cvss: 6.1,
      tags: ["Session", "Authentication", "Security"],
      method: "POST",
    },
    {
      title: "Missing Security Headers",
      description: "Important security headers like CSP and HSTS are missing",
      severity: "info" as const,
      cvss: 2.1,
      tags: ["Headers", "Configuration", "Information"],
      method: "GET",
    },
  ];

  return Array.from({ length: count }, (_, index) => {
    const template =
      vulnerabilityTemplates[index % vulnerabilityTemplates.length];
    return {
      id: `vuln-${index + 1}`,
      title: `${template.title} #${index + 1}`,
      description: template.description,
      severity: template.severity,
      cvss: template.cvss,
      cve: `CVE-2024-${String(1000 + index).padStart(4, "0")}`,
      url: `https://target.example.com/path/${index}`,
      method: template.method,
      evidence: `Payload: test${index}`,
      tags: template.tags,
      timestamp: new Date().toISOString(),
    };
  });
};
