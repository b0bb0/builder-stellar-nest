/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Vulnerability Scanner API Types
 */

export interface ScanTarget {
  url: string;
  name?: string;
}

export interface ScanOptions {
  target: ScanTarget;
  tools: ScanTool[];
  severity?: SeverityLevel[];
  timeout?: number;
}

export interface ScanTool {
  name: string;
  enabled: boolean;
  description: string;
}

export type SeverityLevel = "info" | "low" | "medium" | "high" | "critical";

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  cvss?: number;
  cve?: string;
  url: string;
  method?: string;
  evidence?: string;
  tags: string[];
  timestamp: string;
}

export interface ScanResult {
  id: string;
  target: ScanTarget;
  status: "pending" | "running" | "completed" | "failed";
  vulnerabilities: Vulnerability[];
  stats: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  startTime: string;
  endTime?: string;
  duration?: number;
}

export interface AIAnalysis {
  summary: string;
  riskScore: number;
  recommendations: string[];
  prioritizedVulns: Vulnerability[];
  riskFactors: string[];
  estimatedFixTime: string;
}

export interface ScanResponse {
  scanId: string;
  status: string;
  message: string;
}

export interface ScanStatusResponse {
  scan: ScanResult;
  analysis?: AIAnalysis;
}
