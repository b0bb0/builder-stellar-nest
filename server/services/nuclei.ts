import { spawn, ChildProcess } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Vulnerability, SeverityLevel, ScanTool } from "@shared/api";
import { logQueries } from "../config/database";

export interface NucleiOptions {
  target: string;
  templates?: string[];
  severity?: SeverityLevel[];
  timeout?: number;
  rateLimit?: number;
  maxConcurrent?: number;
  outputFormat?: "json" | "jsonl";
}

export interface NucleiResult {
  templateId: string;
  templateName: string;
  templatePath: string;
  info: {
    name: string;
    description: string;
    severity: string;
    tags: string[];
    reference?: string[];
    classification?: {
      cvss?: {
        score: number;
        vector: string;
      };
      cve?: string[];
    };
  };
  matched: string;
  matchedAt: string;
  extractedResults?: string[];
  request?: string;
  response?: string;
  type: string;
  host: string;
  path: string;
  timestamp: string;
}

export class NucleiService {
  private nucleiPath: string;
  private templatesPath: string;
  private defaultTimeout: number;
  private defaultRateLimit: number;
  private defaultMaxConcurrent: number;
  private runningScans: Map<string, ChildProcess> = new Map();

  constructor() {
    this.nucleiPath = process.env.NUCLEI_PATH || "nuclei";
    this.templatesPath =
      process.env.NUCLEI_TEMPLATES_PATH || "./nuclei-templates";
    this.defaultTimeout = parseInt(process.env.NUCLEI_TIMEOUT || "300");
    this.defaultRateLimit = parseInt(process.env.NUCLEI_RATE_LIMIT || "150");
    this.defaultMaxConcurrent = parseInt(
      process.env.NUCLEI_MAX_CONCURRENT || "25",
    );
  }

  async checkInstallation(): Promise<boolean> {
    try {
      return new Promise((resolve) => {
        const process = spawn(this.nucleiPath, ["-version"]);
        process.on("exit", (code) => {
          resolve(code === 0);
        });
        process.on("error", () => {
          resolve(false);
        });
      });
    } catch {
      return false;
    }
  }

  async updateTemplates(): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(this.nucleiPath, ["-update-templates"]);

      process.on("exit", (code) => {
        if (code === 0) {
          console.log("Nuclei templates updated successfully");
          resolve();
        } else {
          reject(new Error(`Template update failed with exit code ${code}`));
        }
      });

      process.on("error", reject);
    });
  }

  async scan(
    scanId: string,
    options: NucleiOptions,
    onProgress?: (progress: number, phase: string) => void,
    onVulnerability?: (vulnerability: Vulnerability) => void,
    onLog?: (level: string, message: string) => void,
  ): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];
    const outputFile = path.join("./temp", `scan_${scanId}.json`);

    // Ensure temp directory exists
    await fs.mkdir("./temp", { recursive: true });

    try {
      const args = this.buildNucleiArgs(options, outputFile);

      onLog?.("info", `Starting Nuclei scan with args: ${args.join(" ")}`);
      onProgress?.(5, "Initializing Nuclei scanner...");

      const nucleiProcess = spawn(this.nucleiPath, args);
      this.runningScans.set(scanId, nucleiProcess);

      let stderr = "";
      let stdout = "";

      nucleiProcess.stdout?.on("data", (data) => {
        stdout += data.toString();
        // Parse progress from Nuclei output if available
        const progressMatch = stdout.match(/(\d+)\/(\d+)/);
        if (progressMatch) {
          const current = parseInt(progressMatch[1]);
          const total = parseInt(progressMatch[2]);
          const progress = Math.min(90, (current / total) * 85 + 5); // 5-90% range
          onProgress?.(progress, `Scanning templates: ${current}/${total}`);
        }
      });

      nucleiProcess.stderr?.on("data", (data) => {
        stderr += data.toString();
        const message = data.toString().trim();
        if (message) {
          onLog?.("info", message);
        }
      });

      return new Promise((resolve, reject) => {
        nucleiProcess.on("exit", async (code) => {
          this.runningScans.delete(scanId);

          if (code !== 0 && code !== null) {
            const errorMsg = `Nuclei process exited with code ${code}: ${stderr}`;
            onLog?.("error", errorMsg);
            reject(new Error(errorMsg));
            return;
          }

          try {
            onProgress?.(95, "Processing scan results...");

            // Read and parse results
            const results = await this.parseNucleiOutput(outputFile);

            for (const result of results) {
              const vulnerability =
                this.convertNucleiResultToVulnerability(result);
              vulnerabilities.push(vulnerability);
              onVulnerability?.(vulnerability);
            }

            onProgress?.(100, "Scan completed successfully");
            onLog?.(
              "info",
              `Scan completed. Found ${vulnerabilities.length} vulnerabilities`,
            );

            // Cleanup temp file
            try {
              await fs.unlink(outputFile);
            } catch (e) {
              // Ignore cleanup errors
            }

            resolve(vulnerabilities);
          } catch (error) {
            onLog?.("error", `Error processing results: ${error}`);
            reject(error);
          }
        });

        nucleiProcess.on("error", (error) => {
          this.runningScans.delete(scanId);
          onLog?.("error", `Nuclei process error: ${error.message}`);
          reject(error);
        });

        // Handle timeout
        setTimeout(
          () => {
            if (this.runningScans.has(scanId)) {
              onLog?.("warning", "Scan timeout reached, terminating...");
              this.stopScan(scanId);
              reject(new Error("Scan timeout"));
            }
          },
          options.timeout || this.defaultTimeout * 1000,
        );
      });
    } catch (error) {
      this.runningScans.delete(scanId);
      throw error;
    }
  }

  stopScan(scanId: string): boolean {
    const process = this.runningScans.get(scanId);
    if (process) {
      process.kill("SIGTERM");
      this.runningScans.delete(scanId);
      return true;
    }
    return false;
  }

  private buildNucleiArgs(
    options: NucleiOptions,
    outputFile: string,
  ): string[] {
    const args = [
      "-target",
      options.target,
      "-json-export",
      outputFile,
      "-rate-limit",
      (options.rateLimit || this.defaultRateLimit).toString(),
      "-bulk-size",
      (options.maxConcurrent || this.defaultMaxConcurrent).toString(),
      "-timeout",
      "10", // Per request timeout
      "-retries",
      "1",
      "-no-color",
      "-silent",
    ];

    // Add severity filter
    if (options.severity && options.severity.length > 0) {
      args.push("-severity", options.severity.join(","));
    }

    // Add template filters
    if (options.templates && options.templates.length > 0) {
      args.push("-templates", options.templates.join(","));
    } else {
      // Use default template directory
      if (this.templatesPath) {
        args.push("-templates", this.templatesPath);
      }
    }

    return args;
  }

  private async parseNucleiOutput(outputFile: string): Promise<NucleiResult[]> {
    try {
      const content = await fs.readFile(outputFile, "utf-8");
      const lines = content
        .trim()
        .split("\n")
        .filter((line) => line.trim());

      return lines
        .map((line) => {
          try {
            return JSON.parse(line) as NucleiResult;
          } catch (error) {
            console.warn("Failed to parse Nuclei result line:", line);
            return null;
          }
        })
        .filter((result): result is NucleiResult => result !== null);
    } catch (error) {
      if ((error as any).code === "ENOENT") {
        // No results file means no vulnerabilities found
        return [];
      }
      throw error;
    }
  }

  private convertNucleiResultToVulnerability(
    result: NucleiResult,
  ): Vulnerability {
    const severity = this.mapNucleiSeverity(result.info.severity);

    return {
      id: uuidv4(),
      title: result.info.name || result.templateName,
      description: result.info.description || "No description available",
      severity,
      cvss: result.info.classification?.cvss?.score,
      cve: result.info.classification?.cve?.[0],
      url: result.matched,
      method: this.extractHttpMethod(result.request),
      evidence: result.extractedResults?.[0] || result.matched,
      tags: result.info.tags || [],
      timestamp: result.timestamp || new Date().toISOString(),
    };
  }

  private mapNucleiSeverity(nucleiSeverity: string): SeverityLevel {
    switch (nucleiSeverity?.toLowerCase()) {
      case "critical":
        return "critical";
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      case "info":
      case "unknown":
      default:
        return "info";
    }
  }

  private extractHttpMethod(request?: string): string | undefined {
    if (!request) return undefined;
    const methodMatch = request.match(
      /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/i,
    );
    return methodMatch?.[1]?.toUpperCase();
  }

  getActiveScans(): string[] {
    return Array.from(this.runningScans.keys());
  }

  getStats(): { activeScans: number; totalScansRun: number } {
    return {
      activeScans: this.runningScans.size,
      totalScansRun: 0, // Could be tracked separately
    };
  }
}

export const nucleiService = new NucleiService();
