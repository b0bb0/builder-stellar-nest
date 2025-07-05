import {
  CyberCard,
  CyberCardContent,
  CyberCardHeader,
  CyberCardTitle,
} from "@/components/ui/cyber-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CyberProgressRing from "@/components/ui/cyber-progress-ring";
import VulnCard from "@/components/ui/vuln-card";
import CyberStatus from "@/components/ui/cyber-status";
import { AIAnalysis, ScanResult, SeverityLevel } from "@shared/api";
import {
  Brain,
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
} from "lucide-react";

interface AIAnalysisProps {
  scanResult: ScanResult;
  analysis: AIAnalysis;
}

const severityColors: Record<SeverityLevel, string> = {
  critical: "text-red-400 border-red-500",
  high: "text-orange-400 border-orange-500",
  medium: "text-yellow-400 border-yellow-500",
  low: "text-blue-400 border-blue-500",
  info: "text-gray-400 border-gray-500",
};

const severityGlow: Record<SeverityLevel, string> = {
  critical: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
  high: "shadow-[0_0_10px_rgba(251,146,60,0.3)]",
  medium: "shadow-[0_0_10px_rgba(250,204,21,0.3)]",
  low: "shadow-[0_0_10px_rgba(96,165,250,0.3)]",
  info: "shadow-[0_0_10px_rgba(156,163,175,0.3)]",
};

export default function AIAnalysisComponent({
  scanResult,
  analysis,
}: AIAnalysisProps) {
  const getRiskLevelColor = (score: number) => {
    if (score >= 80) return "text-red-400";
    if (score >= 60) return "text-orange-400";
    if (score >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const getRiskLevelText = (score: number) => {
    if (score >= 80) return "CRITICAL";
    if (score >= 60) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-cyber-cyan">
          <Brain className="h-8 w-8" />
          <h1 className="text-4xl font-bold text-glow-cyan">AI ANALYSIS</h1>
          <Brain className="h-8 w-8" />
        </div>
        <p className="text-cyber-purple text-sm tracking-widest uppercase">
          [CLASSIFIED] INTELLIGENCE ASSESSMENT
        </p>
      </div>

      {/* Risk Score */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            RISK ASSESSMENT
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center space-y-4">
              <CyberProgressRing
                progress={analysis.riskScore}
                size={140}
                color={
                  analysis.riskScore >= 80
                    ? "red"
                    : analysis.riskScore >= 60
                      ? "purple"
                      : "cyan"
                }
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">
                    {analysis.riskScore}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    RISK SCORE
                  </div>
                </div>
              </CyberProgressRing>

              <div className="text-center space-y-2">
                <Badge
                  variant="outline"
                  className={`${getRiskLevelColor(analysis.riskScore)} border-current text-lg px-4 py-2`}
                >
                  {getRiskLevelText(analysis.riskScore)} RISK
                </Badge>
                <CyberStatus
                  status={
                    analysis.riskScore >= 80
                      ? "error"
                      : analysis.riskScore >= 60
                        ? "scanning"
                        : "complete"
                  }
                  label="THREAT LEVEL"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyber-cyan" />
                <h4 className="text-sm font-medium text-cyber-cyan">
                  Vulnerability Distribution
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(scanResult.stats).map(
                  ([severity, count]) =>
                    severity !== "total" && (
                      <div
                        key={severity}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${severityColors[severity as SeverityLevel]} ${severityGlow[severity as SeverityLevel]}`}
                      >
                        <div className="text-xs uppercase font-bold mb-1">
                          {severity}
                        </div>
                        <div className="text-2xl font-mono">{count}</div>
                        <div className="w-full h-1 rounded mt-2 bg-current opacity-30" />
                      </div>
                    ),
                )}
              </div>

              <div className="pt-2 border-t border-cyber-surface">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Issues:</span>
                  <span className="text-cyber-cyan font-mono text-lg">
                    {scanResult.stats.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Summary */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            EXECUTIVE SUMMARY
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <p className="text-cyber-cyan leading-relaxed">{analysis.summary}</p>
        </CyberCardContent>
      </CyberCard>

      {/* Risk Factors */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            RISK FACTORS
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-2">
            {analysis.riskFactors.map((factor, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded bg-cyber-surface border-l-2 border-cyber-purple"
              >
                <AlertTriangle className="h-4 w-4 text-cyber-purple flex-shrink-0" />
                <span className="text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Recommendations */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            RECOMMENDATIONS
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded bg-cyber-surface border-l-2 border-cyber-cyan"
              >
                <div className="w-6 h-6 rounded-full bg-cyber-cyan text-cyber-bg-dark flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Priority Vulnerabilities */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            PRIORITY VULNERABILITIES
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-4">
            {analysis.prioritizedVulns.slice(0, 5).map((vuln, index) => (
              <VulnCard
                key={vuln.id}
                vulnerability={vuln}
                isHighlighted={index === 0} // Highlight the most critical
                className="transition-all hover:scale-[1.02]"
              />
            ))}

            {analysis.prioritizedVulns.length > 5 && (
              <div className="text-center pt-4 border-t border-cyber-surface">
                <Badge
                  variant="outline"
                  className="text-cyber-cyan border-cyber-cyan"
                >
                  +{analysis.prioritizedVulns.length - 5} MORE VULNERABILITIES
                </Badge>
              </div>
            )}
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Estimated Fix Time */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            REMEDIATION TIMELINE
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="text-center space-y-2">
            <p className="text-3xl font-mono text-cyber-cyan">
              {analysis.estimatedFixTime}
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated time to resolve all critical and high severity issues
            </p>
          </div>
        </CyberCardContent>
      </CyberCard>
    </div>
  );
}
