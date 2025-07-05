import { v4 as uuidv4 } from "uuid";
import {
  ScanOptions,
  ScanResult,
  ScanTool,
  Vulnerability,
  SeverityLevel,
} from "@shared/api";
import { nucleiService } from "./nuclei";
import { aiService } from "./ai-analysis";
import { wsService } from "./websocket";

// Lazy database imports to prevent circular dependency
let _dbQueries: any = null;
const getDbQueries = async () => {
  if (!_dbQueries) {
    const db = await import("../config/database");
    _dbQueries = {
      scanQueries: db.scanQueries,
      vulnerabilityQueries: db.vulnerabilityQueries,
      aiAnalysisQueries: db.aiAnalysisQueries,
      logQueries: db.logQueries,
    };
  }
  return _dbQueries;
};

export class ScanManager {
  private activeScanJobs: Map<string, Promise<ScanResult>> = new Map();
  private maxConcurrentScans: number;

  constructor() {
    this.maxConcurrentScans = parseInt(process.env.MAX_CONCURRENT_SCANS || "5");
  }

  async startScan(options: ScanOptions): Promise<string> {
    try {
      // Validate options
      this.validateScanOptions(options);

      // Check concurrent scan limit
      if (this.activeScanJobs.size >= this.maxConcurrentScans) {
        throw new Error(
          `Maximum concurrent scans limit reached (${this.maxConcurrentScans})`,
        );
      }

      const scanId = uuidv4();

      // Create scan record
      const toolsJson = JSON.stringify(options.tools);
      const severityJson = JSON.stringify(options.severity || []);

      try {
        const { scanQueries } = await getDbQueries();
        scanQueries.create.run(
          scanId,
          options.target.url,
          options.target.name || null,
          "pending",
          toolsJson,
          severityJson,
        );
      } catch (dbError) {
        console.error("Database error when creating scan:", dbError);
        throw new Error("Database not available. Please try again later.");
      }

      // Start scan job
      const scanPromise = this.executeScan(scanId, options);
      this.activeScanJobs.set(scanId, scanPromise);

      // Handle scan completion
      scanPromise
        .then((result) => {
          this.activeScanJobs.delete(scanId);
          wsService.sendScanCompleted(scanId, result);
        })
        .catch(async (error) => {
          this.activeScanJobs.delete(scanId);
          await this.handleScanError(scanId, error);
          wsService.sendScanFailed(scanId, error.message);
        });

      return scanId;
    } catch (error) {
      console.error("Error starting scan:", error);
      throw error;
    }
  }

  private validateScanOptions(options: ScanOptions): void {
    if (!options.target?.url) {
      throw new Error("Target URL is required");
    }

    if (!options.tools?.length) {
      throw new Error("At least one scanning tool must be selected");
    }

    // Validate URL format
    try {
      new URL(options.target.url);
    } catch {
      throw new Error("Invalid target URL format");
    }

    // Check if Nuclei is selected and available
    const hasNuclei = options.tools.some((tool) => tool.name === "Nuclei");
    if (hasNuclei) {
      // Could add Nuclei availability check here
    }
  }

  private async executeScan(
    scanId: string,
    options: ScanOptions,
  ): Promise<ScanResult> {
    const startTime = new Date();

    try {
      const { scanQueries } = await getDbQueries();

      // Update scan status to running
      scanQueries.updateStatus.run("running", "running", "running", scanId);
      await this.logScanEvent(scanId, "info", "Scan started");

      wsService.sendScanProgress(scanId, 0, "Initializing scan...");

      const vulnerabilities: Vulnerability[] = [];

      // Execute selected tools
      for (const tool of options.tools) {
        if (!tool.enabled) continue;

        await this.logScanEvent(scanId, "info", `Starting ${tool.name} scan`);
        wsService.sendScanProgress(
          scanId,
          10,
          `Initializing ${tool.name} scanner...`,
        );

        switch (tool.name) {
          case "Nuclei":
            const nucleiResults = await this.runNucleiScan(scanId, options);
            vulnerabilities.push(...nucleiResults);
            break;

          case "Httpx":
          case "Nmap":
          case "Gobuster":
          case "Sqlmap":
          case "Subfinder":
            // Placeholder for other tools
            await this.logScanEvent(
              scanId,
              "info",
              `${tool.name} integration not implemented yet`,
            );
            break;
        }
      }

      // Store vulnerabilities
      const { vulnerabilityQueries } = await getDbQueries();
      for (const vuln of vulnerabilities) {
        vulnerabilityQueries.create.run(
          vuln.id,
          scanId,
          vuln.title,
          vuln.description,
          vuln.severity,
          vuln.cvss || null,
          vuln.cve || null,
          vuln.url,
          vuln.method || null,
          vuln.evidence || null,
          JSON.stringify(vuln.tags),
          null, // template_id
          null, // template_name
          null, // reference
        );
      }

      // Calculate statistics
      const stats = this.calculateStats(vulnerabilities);
      const endTime = new Date();
      const duration = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000,
      );

      // Update scan record
      const dbQueries = await getDbQueries();
      dbQueries.scanQueries.updateStats.run(
        stats.total,
        stats.critical,
        stats.high,
        stats.medium,
        stats.low,
        stats.info,
        duration,
        scanId,
      );

      // Generate AI analysis
      wsService.sendScanProgress(scanId, 95, "Generating AI analysis...");
      const aiAnalysis = await aiService.analyzeVulnerabilities(
        vulnerabilities,
        options.target.url,
        duration,
      );

      // Store AI analysis
      dbQueries.aiAnalysisQueries.create.run(
        uuidv4(),
        scanId,
        aiAnalysis.summary,
        aiAnalysis.riskScore,
        JSON.stringify(aiAnalysis.recommendations),
        JSON.stringify(aiAnalysis.riskFactors),
        aiAnalysis.estimatedFixTime,
      );

      // Update final status
      dbQueries.scanQueries.updateStatus.run(
        "completed",
        "completed",
        "completed",
        scanId,
      );
      await this.logScanEvent(scanId, "info", "Scan completed successfully");

      const result: ScanResult = {
        id: scanId,
        target: options.target,
        status: "completed",
        vulnerabilities,
        stats,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
      };

      return result;
    } catch (error) {
      await this.handleScanError(scanId, error as Error);
      throw error;
    }
  }

  private async runNucleiScan(
    scanId: string,
    options: ScanOptions,
  ): Promise<Vulnerability[]> {
    try {
      // Check if Nuclei is available
      const isNucleiAvailable = await nucleiService.checkInstallation();
      if (!isNucleiAvailable) {
        await this.logScanEvent(
          scanId,
          "warning",
          "Nuclei not installed, generating mock results for demo",
        );
        // Generate mock vulnerabilities for demo purposes
        return this.generateMockVulnerabilities(options.target.url);
      }

      const nucleiOptions = {
        target: options.target.url,
        severity: options.severity,
        timeout: options.timeout,
      };

      return await nucleiService.scan(
        scanId,
        nucleiOptions,
        (progress, phase) => {
          wsService.sendScanProgress(scanId, progress, phase);
        },
        (vulnerability) => {
          wsService.sendVulnerabilityFound(scanId, vulnerability);
        },
        (level, message) => {
          this.logScanEvent(scanId, level, message);
          wsService.sendScanLog(scanId, level, message);
        },
      );
    } catch (error) {
      await this.logScanEvent(
        scanId,
        "error",
        `Nuclei scan failed: ${error}. Falling back to mock data.`,
      );
      // Fallback to mock data if Nuclei fails
      return this.generateMockVulnerabilities(options.target.url);
    }
  }

  private generateMockVulnerabilities(targetUrl: string): Vulnerability[] {
    return [
      {
        id: uuidv4(),
        title: "Demo SQL Injection Vulnerability",
        description:
          "This is a mock vulnerability for demonstration purposes. Nuclei is not installed or failed to run.",
        severity: "high" as SeverityLevel,
        cvss: 8.1,
        cve: "CVE-2023-DEMO",
        url: `${targetUrl}/login`,
        method: "POST",
        evidence: "Mock evidence of SQL injection",
        tags: ["injection", "sql", "demo"],
        timestamp: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Demo Cross-Site Scripting (XSS)",
        description:
          "This is a mock XSS vulnerability for demonstration purposes.",
        severity: "medium" as SeverityLevel,
        cvss: 6.1,
        url: `${targetUrl}/search`,
        method: "GET",
        evidence: "Mock XSS payload",
        tags: ["xss", "client-side", "demo"],
        timestamp: new Date().toISOString(),
      },
    ];
  }

  private calculateStats(vulnerabilities: Vulnerability[]) {
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
  }

  private async handleScanError(scanId: string, error: Error): Promise<void> {
    try {
      const { scanQueries } = await getDbQueries();
      scanQueries.setError.run(error.message, scanId);
      await this.logScanEvent(scanId, "error", `Scan failed: ${error.message}`);
      console.error(`Scan ${scanId} failed:`, error);
    } catch (dbError) {
      console.error(`Failed to log scan error to database:`, dbError);
    }
  }

  private async logScanEvent(
    scanId: string,
    level: string,
    message: string,
  ): Promise<void> {
    try {
      const { logQueries } = await getDbQueries();
      logQueries.create.run(scanId, level, message);
    } catch (dbError) {
      console.error(`Failed to log scan event to database:`, dbError);
    }
  }

  async getScanResult(scanId: string): Promise<ScanResult | null> {
    const { scanQueries, vulnerabilityQueries } = await getDbQueries();
    const scan = scanQueries.findById.get(scanId);
    if (!scan) return null;

    const vulnerabilities = vulnerabilityQueries.findByScanId.all(scanId);

    // Parse JSON fields and convert to proper types
    const result: ScanResult = {
      id: scan.id,
      target: {
        url: scan.target_url,
        name: scan.target_name,
      },
      status: scan.status as any,
      vulnerabilities: vulnerabilities.map(this.mapDbVulnerability),
      stats: {
        total: scan.total_vulnerabilities,
        critical: scan.critical_count,
        high: scan.high_count,
        medium: scan.medium_count,
        low: scan.low_count,
        info: scan.info_count,
      },
      startTime: scan.started_at || scan.created_at,
      endTime: scan.completed_at,
      duration: scan.duration,
    };

    return result;
  }

  private mapDbVulnerability(dbVuln: any): Vulnerability {
    return {
      id: dbVuln.id,
      title: dbVuln.title,
      description: dbVuln.description,
      severity: dbVuln.severity as SeverityLevel,
      cvss: dbVuln.cvss,
      cve: dbVuln.cve,
      url: dbVuln.url,
      method: dbVuln.method,
      evidence: dbVuln.evidence,
      tags: JSON.parse(dbVuln.tags || "[]"),
      timestamp: dbVuln.created_at,
    };
  }

  async stopScan(scanId: string): Promise<boolean> {
    // Stop the scan job if it's running
    const nucleiStopped = nucleiService.stopScan(scanId);

    if (nucleiStopped) {
      const { scanQueries } = await getDbQueries();
      scanQueries.setError.run("Scan stopped by user", scanId);
      await this.logScanEvent(scanId, "info", "Scan stopped by user");
      this.activeScanJobs.delete(scanId);
      return true;
    }

    return false;
  }

  getActiveScanCount(): number {
    return this.activeScanJobs.size;
  }

  getActiveScanIds(): string[] {
    return Array.from(this.activeScanJobs.keys());
  }

  async getRecentScans(limit: number = 10): Promise<any[]> {
    const { scanQueries } = await getDbQueries();
    return scanQueries.getRecent.all(limit);
  }

  async getScanLogs(scanId: string, limit: number = 50): Promise<any[]> {
    const { logQueries } = await getDbQueries();
    return logQueries.findByScanId.all(scanId, limit);
  }
}

export const scanManager = new ScanManager();
