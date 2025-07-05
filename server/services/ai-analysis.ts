import { AIAnalysis, Vulnerability, SeverityLevel } from "@shared/api";
import { v4 as uuidv4 } from "uuid";

// Mock AI service - in production, integrate with OpenAI, Claude, or other AI services
export class AIAnalysisService {
  private apiKey: string | null;
  private model: string;
  private enabled: boolean;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || null;
    this.model = process.env.AI_MODEL || "gpt-4";
    this.enabled = process.env.AI_ENABLED === "true" && !!this.apiKey;
  }

  async analyzeVulnerabilities(
    vulnerabilities: Vulnerability[],
    targetUrl: string,
    scanDuration?: number,
  ): Promise<AIAnalysis> {
    if (!this.enabled) {
      console.log("AI analysis disabled, generating mock analysis");
      return this.generateMockAnalysis(
        vulnerabilities,
        targetUrl,
        scanDuration,
      );
    }

    try {
      // In production, this would call an actual AI service
      return await this.callAIService(vulnerabilities, targetUrl, scanDuration);
    } catch (error) {
      console.error("AI analysis failed, falling back to mock:", error);
      return this.generateMockAnalysis(
        vulnerabilities,
        targetUrl,
        scanDuration,
      );
    }
  }

  private async callAIService(
    vulnerabilities: Vulnerability[],
    targetUrl: string,
    scanDuration?: number,
  ): Promise<AIAnalysis> {
    // This would be the actual AI integration
    // For now, return enhanced mock analysis

    const prompt = this.buildAnalysisPrompt(
      vulnerabilities,
      targetUrl,
      scanDuration,
    );

    // TODO: Integrate with OpenAI API
    /*
    const response = await openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are a cybersecurity expert analyzing vulnerability scan results...'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });
    
    return this.parseAIResponse(response.choices[0].message.content);
    */

    // For now, return enhanced mock
    return this.generateEnhancedMockAnalysis(
      vulnerabilities,
      targetUrl,
      scanDuration,
    );
  }

  private buildAnalysisPrompt(
    vulnerabilities: Vulnerability[],
    targetUrl: string,
    scanDuration?: number,
  ): string {
    const vulnSummary = this.summarizeVulnerabilities(vulnerabilities);

    return `
    Analyze the following vulnerability scan results for ${targetUrl}:
    
    Scan Summary:
    - Total vulnerabilities: ${vulnerabilities.length}
    - Critical: ${vulnSummary.critical}
    - High: ${vulnSummary.high}
    - Medium: ${vulnSummary.medium}
    - Low: ${vulnSummary.low}
    - Info: ${vulnSummary.info}
    - Scan duration: ${scanDuration ? `${scanDuration}s` : "Unknown"}
    
    Top Vulnerabilities:
    ${vulnerabilities
      .slice(0, 5)
      .map(
        (v) => `- ${v.title} (${v.severity.toUpperCase()}): ${v.description}`,
      )
      .join("\n")}
    
    Please provide:
    1. Executive summary of security posture
    2. Risk score (0-100)
    3. Top 5 remediation recommendations
    4. Key risk factors
    5. Estimated time to fix critical/high issues
    
    Format as JSON with fields: summary, riskScore, recommendations, riskFactors, estimatedFixTime
    `;
  }

  private summarizeVulnerabilities(vulnerabilities: Vulnerability[]) {
    return vulnerabilities.reduce(
      (acc, vuln) => {
        acc[vuln.severity]++;
        return acc;
      },
      {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
      } as Record<SeverityLevel, number>,
    );
  }

  private generateMockAnalysis(
    vulnerabilities: Vulnerability[],
    targetUrl: string,
    scanDuration?: number,
  ): AIAnalysis {
    const stats = this.summarizeVulnerabilities(vulnerabilities);
    const riskScore = this.calculateRiskScore(stats);

    return {
      summary: this.generateSummary(stats, targetUrl, riskScore),
      riskScore,
      recommendations: this.generateRecommendations(vulnerabilities, stats),
      prioritizedVulns: this.prioritizeVulnerabilities(vulnerabilities),
      riskFactors: this.generateRiskFactors(vulnerabilities, stats),
      estimatedFixTime: this.estimateFixTime(stats),
    };
  }

  private generateEnhancedMockAnalysis(
    vulnerabilities: Vulnerability[],
    targetUrl: string,
    scanDuration?: number,
  ): AIAnalysis {
    const stats = this.summarizeVulnerabilities(vulnerabilities);
    const riskScore = this.calculateRiskScore(stats);

    // More sophisticated analysis based on vulnerability patterns
    const vulnTypes = this.analyzeVulnerabilityTypes(vulnerabilities);
    const isWebApp = targetUrl.startsWith("http");

    return {
      summary: this.generateEnhancedSummary(
        stats,
        targetUrl,
        riskScore,
        vulnTypes,
        isWebApp,
      ),
      riskScore,
      recommendations: this.generateEnhancedRecommendations(
        vulnerabilities,
        stats,
        vulnTypes,
      ),
      prioritizedVulns: this.prioritizeVulnerabilities(vulnerabilities),
      riskFactors: this.generateEnhancedRiskFactors(
        vulnerabilities,
        stats,
        vulnTypes,
      ),
      estimatedFixTime: this.estimateEnhancedFixTime(stats, vulnTypes),
    };
  }

  private calculateRiskScore(stats: Record<SeverityLevel, number>): number {
    let score = 0;
    score += stats.critical * 25;
    score += stats.high * 15;
    score += stats.medium * 8;
    score += stats.low * 3;
    score += stats.info * 1;

    return Math.min(100, score);
  }

  private generateSummary(
    stats: Record<SeverityLevel, number>,
    targetUrl: string,
    riskScore: number,
  ): string {
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    const critical = stats.critical + stats.high;

    let summary = `Security assessment of ${targetUrl} completed. `;

    if (total === 0) {
      summary +=
        "No significant vulnerabilities were detected during the scan. ";
    } else {
      summary += `Identified ${total} security issue(s). `;

      if (critical > 0) {
        summary += `${critical} critical/high severity vulnerabilities require immediate attention. `;
      }
    }

    if (riskScore >= 80) {
      summary +=
        "The application presents a HIGH security risk and requires urgent remediation.";
    } else if (riskScore >= 60) {
      summary +=
        "The application presents a MEDIUM security risk with several issues to address.";
    } else if (riskScore >= 30) {
      summary +=
        "The application presents a LOW security risk with minor issues to address.";
    } else {
      summary +=
        "The application demonstrates good security posture with minimal risks.";
    }

    return summary;
  }

  private generateEnhancedSummary(
    stats: Record<SeverityLevel, number>,
    targetUrl: string,
    riskScore: number,
    vulnTypes: Map<string, number>,
    isWebApp: boolean,
  ): string {
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    const critical = stats.critical + stats.high;

    let summary = `Comprehensive security assessment of ${targetUrl} completed using advanced scanning techniques. `;

    if (total === 0) {
      summary +=
        "The scan found no significant vulnerabilities, indicating robust security controls are in place. ";
    } else {
      summary += `Analysis revealed ${total} security findings across multiple attack vectors. `;

      if (critical > 0) {
        summary += `${critical} high-impact vulnerabilities pose immediate threats to confidentiality, integrity, or availability. `;
      }

      // Add specific vulnerability type insights
      const topVulnType = Array.from(vulnTypes.entries()).sort(
        (a, b) => b[1] - a[1],
      )[0];
      if (topVulnType) {
        summary += `The primary vulnerability category is ${topVulnType[0]} with ${topVulnType[1]} instances. `;
      }
    }

    if (isWebApp) {
      summary +=
        "As a web application, special attention should be paid to input validation, authentication, and session management. ";
    }

    if (riskScore >= 80) {
      summary +=
        "The security posture requires immediate executive attention and emergency patching procedures.";
    } else if (riskScore >= 60) {
      summary +=
        "The security posture requires prioritized remediation within the next sprint cycle.";
    } else if (riskScore >= 30) {
      summary +=
        "The security posture is acceptable but would benefit from proactive hardening measures.";
    } else {
      summary +=
        "The security posture demonstrates mature security practices with only minor improvements needed.";
    }

    return summary;
  }

  private analyzeVulnerabilityTypes(
    vulnerabilities: Vulnerability[],
  ): Map<string, number> {
    const types = new Map<string, number>();

    vulnerabilities.forEach((vuln) => {
      // Categorize vulnerabilities based on title and tags
      const category = this.categorizeVulnerability(vuln);
      types.set(category, (types.get(category) || 0) + 1);
    });

    return types;
  }

  private categorizeVulnerability(vuln: Vulnerability): string {
    const title = vuln.title.toLowerCase();
    const tags = vuln.tags.map((t) => t.toLowerCase());

    if (title.includes("sql") || tags.includes("injection"))
      return "Injection Attacks";
    if (title.includes("xss") || title.includes("script"))
      return "Cross-Site Scripting";
    if (title.includes("csrf") || title.includes("forgery")) return "CSRF";
    if (title.includes("auth") || title.includes("login"))
      return "Authentication";
    if (title.includes("disclosure") || title.includes("exposure"))
      return "Information Disclosure";
    if (title.includes("traversal") || title.includes("directory"))
      return "Path Traversal";
    if (title.includes("configuration") || title.includes("misconfiguration"))
      return "Security Misconfiguration";
    if (title.includes("crypto") || title.includes("encryption"))
      return "Cryptographic Issues";
    if (title.includes("cors") || title.includes("header"))
      return "Security Headers";

    return "Other Security Issues";
  }

  private generateRecommendations(
    vulnerabilities: Vulnerability[],
    stats: Record<SeverityLevel, number>,
  ): string[] {
    const recommendations: string[] = [];

    if (stats.critical > 0) {
      recommendations.push(
        "Immediately patch all critical vulnerabilities - these pose imminent security risks",
      );
    }

    if (stats.high > 0) {
      recommendations.push(
        "Address high-severity vulnerabilities within 48-72 hours",
      );
    }

    if (vulnerabilities.some((v) => v.tags.includes("injection"))) {
      recommendations.push(
        "Implement input validation and parameterized queries to prevent injection attacks",
      );
    }

    if (vulnerabilities.some((v) => v.tags.includes("xss"))) {
      recommendations.push(
        "Deploy Content Security Policy (CSP) and output encoding to mitigate XSS risks",
      );
    }

    recommendations.push(
      "Establish continuous security scanning in your CI/CD pipeline",
    );
    recommendations.push(
      "Conduct security code reviews and penetration testing",
    );
    recommendations.push("Implement a comprehensive incident response plan");

    return recommendations.slice(0, 6);
  }

  private generateEnhancedRecommendations(
    vulnerabilities: Vulnerability[],
    stats: Record<SeverityLevel, number>,
    vulnTypes: Map<string, number>,
  ): string[] {
    const recommendations: string[] = [];

    // Priority-based recommendations
    if (stats.critical > 0) {
      recommendations.push(
        "URGENT: Initiate emergency patching procedures for critical vulnerabilities within 24 hours",
      );
    }

    if (stats.high > 0) {
      recommendations.push(
        "HIGH PRIORITY: Schedule immediate remediation for high-severity findings within 72 hours",
      );
    }

    // Specific recommendations based on vulnerability types
    for (const [type, count] of vulnTypes.entries()) {
      if (count > 0) {
        switch (type) {
          case "Injection Attacks":
            recommendations.push(
              "Implement comprehensive input validation, use prepared statements, and deploy WAF rules",
            );
            break;
          case "Cross-Site Scripting":
            recommendations.push(
              "Deploy strict Content Security Policy, implement output encoding, and sanitize user inputs",
            );
            break;
          case "Authentication":
            recommendations.push(
              "Strengthen authentication mechanisms, implement MFA, and review session management",
            );
            break;
          case "Information Disclosure":
            recommendations.push(
              "Review error handling, implement proper access controls, and audit information exposure",
            );
            break;
          case "Security Misconfiguration":
            recommendations.push(
              "Harden server configurations, update security headers, and implement least privilege principles",
            );
            break;
        }
      }
    }

    // Strategic recommendations
    recommendations.push(
      "Integrate automated security testing into development workflow (DevSecOps)",
    );
    recommendations.push(
      "Establish threat modeling and risk assessment processes",
    );
    recommendations.push(
      "Implement continuous monitoring and incident response capabilities",
    );

    return recommendations.slice(0, 8);
  }

  private prioritizeVulnerabilities(
    vulnerabilities: Vulnerability[],
  ): Vulnerability[] {
    const severityOrder: Record<SeverityLevel, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };

    return [...vulnerabilities].sort((a, b) => {
      // Sort by severity first
      const severityDiff =
        severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;

      // Then by CVSS score if available
      const aCvss = a.cvss || 0;
      const bCvss = b.cvss || 0;
      if (aCvss !== bCvss) return bCvss - aCvss;

      // Finally by timestamp (newer first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  private generateRiskFactors(
    vulnerabilities: Vulnerability[],
    stats: Record<SeverityLevel, number>,
  ): string[] {
    const factors: string[] = [];

    if (stats.critical > 0) {
      factors.push(
        `${stats.critical} critical vulnerabilities requiring immediate attention`,
      );
    }

    if (stats.high > 0) {
      factors.push(`${stats.high} high-severity security flaws detected`);
    }

    const hasInjection = vulnerabilities.some((v) =>
      v.tags.includes("injection"),
    );
    if (hasInjection) {
      factors.push("Code injection vulnerabilities present significant risk");
    }

    const hasAuth = vulnerabilities.some((v) =>
      v.tags.includes("authentication"),
    );
    if (hasAuth) {
      factors.push("Authentication bypass vulnerabilities detected");
    }

    const hasDisclosure = vulnerabilities.some((v) =>
      v.tags.includes("disclosure"),
    );
    if (hasDisclosure) {
      factors.push(
        "Information disclosure vulnerabilities may expose sensitive data",
      );
    }

    return factors;
  }

  private generateEnhancedRiskFactors(
    vulnerabilities: Vulnerability[],
    stats: Record<SeverityLevel, number>,
    vulnTypes: Map<string, number>,
  ): string[] {
    const factors: string[] = [];

    if (stats.critical > 0) {
      factors.push(
        `${stats.critical} critical vulnerabilities enable immediate system compromise`,
      );
    }

    if (stats.high > 0) {
      factors.push(
        `${stats.high} high-severity vulnerabilities provide significant attack vectors`,
      );
    }

    // Risk factors based on vulnerability clustering
    for (const [type, count] of vulnTypes.entries()) {
      if (count >= 3) {
        factors.push(
          `Multiple ${type.toLowerCase()} vulnerabilities indicate systemic security gaps`,
        );
      }
    }

    // CVSS-based risk factors
    const highCvss = vulnerabilities.filter((v) => (v.cvss || 0) >= 8).length;
    if (highCvss > 0) {
      factors.push(
        `${highCvss} vulnerabilities have CVSS scores ≥8.0 indicating severe exploitability`,
      );
    }

    // CVE-based risk factors
    const withCve = vulnerabilities.filter((v) => v.cve).length;
    if (withCve > 0) {
      factors.push(
        `${withCve} vulnerabilities have known CVE identifiers with public exploits`,
      );
    }

    return factors;
  }

  private estimateFixTime(stats: Record<SeverityLevel, number>): string {
    let days = 0;
    days += stats.critical * 2; // 2 days per critical
    days += stats.high * 1; // 1 day per high
    days += stats.medium * 0.5; // 0.5 days per medium
    days += stats.low * 0.25; // 0.25 days per low

    if (days < 1) return "< 1 day";
    if (days < 7) return `${Math.ceil(days)} days`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} months`;
  }

  private estimateEnhancedFixTime(
    stats: Record<SeverityLevel, number>,
    vulnTypes: Map<string, number>,
  ): string {
    let days = 0;

    // Base time estimation
    days += stats.critical * 3; // More realistic 3 days per critical
    days += stats.high * 1.5; // 1.5 days per high
    days += stats.medium * 0.5;
    days += stats.low * 0.25;

    // Complexity multipliers based on vulnerability types
    for (const [type, count] of vulnTypes.entries()) {
      switch (type) {
        case "Injection Attacks":
          days += count * 0.5; // Injection fixes are complex
          break;
        case "Authentication":
          days += count * 0.75; // Auth changes require testing
          break;
        case "Security Misconfiguration":
          days += count * 0.25; // Config changes are faster
          break;
      }
    }

    // Add overhead for testing and deployment
    days *= 1.3;

    if (days < 1) return "< 1 day";
    if (days < 7) return `${Math.ceil(days)} days`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} months`;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const aiService = new AIAnalysisService();
