import { AIAnalysis, ScanResult, SeverityLevel } from "@shared/api";
import GlassCard from "./ui/glass-card";
import ProfessionalBackground from "./ui/professional-background";
import ProfessionalButton from "./ui/professional-button";
import VulnerabilityNetwork from "./ui/vulnerability-network";
import {
  SectionLabel,
  MainHeading,
  SubHeading,
  BodyText,
  Accent,
} from "./ui/professional-typography";
import {
  Brain,
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  CheckCircle,
  Download,
  Share,
  Eye,
  Globe,
  Activity,
} from "lucide-react";

interface ProfessionalScanResultsProps {
  scanResult: ScanResult;
  analysis: AIAnalysis;
}

const severityConfig = {
  critical: {
    color: "border-red-500 bg-red-500/10 text-red-400",
    bgGlow: "bg-red-500/20",
    textColor: "text-red-400",
  },
  high: {
    color: "border-orange-500 bg-orange-500/10 text-orange-400",
    bgGlow: "bg-orange-500/20",
    textColor: "text-orange-400",
  },
  medium: {
    color: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
    bgGlow: "bg-yellow-500/20",
    textColor: "text-yellow-400",
  },
  low: {
    color: "border-blue-500 bg-blue-500/10 text-blue-400",
    bgGlow: "bg-blue-500/20",
    textColor: "text-blue-400",
  },
  info: {
    color: "border-slate-500 bg-slate-500/10 text-slate-400",
    bgGlow: "bg-slate-500/20",
    textColor: "text-slate-400",
  },
};

export default function ProfessionalScanResults({
  scanResult,
  analysis,
}: ProfessionalScanResultsProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "CRITICAL", color: "text-red-400" };
    if (score >= 60) return { level: "HIGH", color: "text-orange-400" };
    if (score >= 40) return { level: "MEDIUM", color: "text-yellow-400" };
    return { level: "LOW", color: "text-green-400" };
  };

  const riskLevel = getRiskLevel(analysis.riskScore);

  return (
    <div className="min-h-screen relative">
      <ProfessionalBackground />

      <div className="relative z-10 min-h-screen">
        <div className="px-8 py-16">
          <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <SectionLabel>SECURITY ASSESSMENT</SectionLabel>
              <MainHeading className="mb-4">
                <Accent>Risk Assessment</Accent> Complete
              </MainHeading>
              <SubHeading className="max-w-3xl mx-auto">
                Comprehensive vulnerability analysis with AI-powered threat
                intelligence
              </SubHeading>
            </div>

            {/* Risk Assessment Overview - Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Circular Neon Risk Score */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Outer glow layers */}
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      filter: "blur(20px)",
                      background:
                        "radial-gradient(circle, #ff0080 0%, #ff4d9f 30%, #8b5cf6 60%, transparent 80%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-80"
                    style={{
                      filter: "blur(30px)",
                      background:
                        "radial-gradient(circle, #ff0080 0%, #8b5cf6 50%, transparent 70%)",
                    }}
                  />

                  {/* Circle container */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* SVG Circle with neon effect */}
                    <svg
                      width="256"
                      height="256"
                      viewBox="0 0 256 256"
                      className="absolute inset-0"
                    >
                      <defs>
                        <linearGradient
                          id="circleGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#ff0080" />
                          <stop offset="50%" stopColor="#ff4d9f" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <filter id="circleNeonGlow">
                          <feGaussianBlur
                            stdDeviation="4"
                            result="coloredBlur"
                          />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Main circle */}
                      <circle
                        cx="128"
                        cy="128"
                        r="100"
                        fill="none"
                        stroke="url(#circleGradient)"
                        strokeWidth="4"
                        filter="url(#circleNeonGlow)"
                      />

                      {/* Inner circle lines */}
                      <circle
                        cx="128"
                        cy="128"
                        r="85"
                        fill="none"
                        stroke="#ff80bf"
                        strokeWidth="1"
                        opacity="0.6"
                      />

                      {/* Triangle elements inside circle */}
                      <polygon
                        points="128,70 158,130 98,130"
                        fill="none"
                        stroke="#ff0080"
                        strokeWidth="2"
                        opacity="0.4"
                      />
                    </svg>

                    {/* Center content */}
                    <div className="relative z-10 text-center">
                      <div className="text-white text-xs font-medium uppercase tracking-wider mb-2 opacity-80">
                        RISK ASSESSMENT
                      </div>
                      <div className="text-white font-bold text-4xl mb-1">
                        {analysis.riskScore}
                      </div>
                      <div className="text-pink-300 text-sm font-medium uppercase tracking-wider">
                        RISK SCORE
                      </div>
                      <div className="mt-4">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-lg border ${riskLevel.color} border-current text-xs font-semibold`}
                        >
                          {riskLevel.level} RISK
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Stats */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Outer glow layers */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      filter: "blur(20px)",
                      background:
                        "radial-gradient(circle, #ff0080 0%, #ff4d9f 30%, #8b5cf6 60%, transparent 80%)",
                    }}
                  />

                  {/* Chart container */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="text-white text-xs font-medium uppercase tracking-wider opacity-80">
                        SCAN STATISTICS
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="relative h-48 flex items-end justify-center gap-3 p-4">
                      {/* Grid lines */}
                      <div className="absolute inset-4 opacity-10">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-full border-t border-pink-400/30"
                            style={{ bottom: `${i * 25}%` }}
                          ></div>
                        ))}
                      </div>

                      {/* Chart bars */}
                      {Object.entries(scanResult.stats).map(
                        ([severity, count]) => {
                          if (severity === "total") return null;
                          const maxCount = Math.max(
                            ...Object.values(scanResult.stats).filter(
                              (_, i) =>
                                i < Object.keys(scanResult.stats).length - 1,
                            ),
                          );
                          const height = Math.max((count / maxCount) * 120, 15); // Min height 15px, max 120px

                          return (
                            <div
                              key={severity}
                              className="relative flex flex-col items-center group"
                            >
                              {/* Value label above bar */}
                              <div
                                className="absolute bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 rounded-lg text-white font-bold text-sm shadow-lg transition-all duration-300 group-hover:scale-110"
                                style={{ bottom: `${height + 10}px` }}
                              >
                                {count.toLocaleString()}
                              </div>

                              {/* Large count display on hover */}
                              <div
                                className="absolute bg-gradient-to-br from-pink-600 to-purple-600 px-6 py-4 rounded-2xl text-white font-bold text-3xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 border-2 border-pink-400/50"
                                style={{
                                  bottom: `${height + 60}px`,
                                  transform: "translateX(-50%)",
                                  left: "50%",
                                  filter:
                                    "drop-shadow(0 0 20px rgba(255, 0, 128, 0.8))",
                                }}
                              >
                                <div className="text-center">
                                  <div className="text-3xl font-mono">
                                    {count}
                                  </div>
                                  <div className="text-xs uppercase tracking-wider opacity-80 mt-1">
                                    {severity} Issues
                                  </div>
                                </div>
                              </div>

                              {/* Bar */}
                              <div
                                className="relative w-10 rounded-t-lg transition-all duration-700 hover:scale-105 cursor-pointer"
                                style={{
                                  height: `${height}px`,
                                  background: `linear-gradient(to top, #ff0080 0%, #ff4d9f 50%, #8b5cf6 100%)`,
                                }}
                              >
                                {/* Outer glow */}
                                <div
                                  className="absolute inset-0 rounded-t-lg opacity-50 group-hover:opacity-70 transition-all duration-300"
                                  style={{
                                    background: `linear-gradient(to top, #ff0080, #ff4d9f, #8b5cf6)`,
                                    filter: "blur(8px)",
                                    zIndex: -1,
                                    transform: "scale(1.1)",
                                  }}
                                ></div>

                                {/* Inner highlight */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white/30 rounded-full"></div>
                              </div>

                              {/* Bottom label */}
                              <div className="mt-2 text-center">
                                <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                                  {severity.slice(0, 4)}
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>

                    {/* Compact Total at bottom */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="text-center">
                        <div className="text-xs text-pink-300 uppercase tracking-wider">
                          Total
                        </div>
                        <div className="text-lg font-mono text-pink-400 font-bold">
                          {scanResult.stats.total}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics - Wide Horizontal Layout */}
            <div className="mb-12">
              <GlassCard
                className="p-8 relative"
                variant="default"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
                }}
              >
                {/* Enhanced light blue luminescent gradient border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-90"
                  style={{
                    background:
                      "linear-gradient(135deg, #60a5fa, #3b82f6, #06b6d4, #0ea5e9)",
                    zIndex: -1,
                    filter: "blur(5px)",
                  }}
                />
                <div
                  className="absolute inset-[3px] rounded-2xl opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #60a5fa, #a855f7, #06b6d4, #8b5cf6, #10b981)",
                    zIndex: -1,
                    filter: "blur(1px)",
                  }}
                />
                <div
                  className="absolute inset-[1px] rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                    zIndex: -1,
                  }}
                />

                <div className="relative z-10">
                  <SectionLabel className="mb-6">KEY METRICS</SectionLabel>

                  {/* Horizontal Grid Layout for Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Duration Metric */}
                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border border-blue-400/40">
                      <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-br from-blue-400/60 via-cyan-400/60 to-blue-400/60 opacity-90 blur-md"></div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-blue-400/20 opacity-60 blur-sm"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/30 border border-blue-400/50 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="text-blue-300 font-medium text-sm">
                            Duration
                          </span>
                        </div>
                        <div className="text-white font-mono text-lg">
                          {Math.round(scanResult.duration / 60)}m{" "}
                          {scanResult.duration % 60}s
                        </div>
                      </div>
                    </div>

                    {/* Status Metric */}
                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-500/15 to-violet-500/15 border border-purple-400/40">
                      <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-br from-blue-400/50 via-cyan-400/50 to-blue-400/50 opacity-80 blur-md"></div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/20 via-violet-400/20 to-purple-400/20 opacity-60 blur-sm"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-purple-400" />
                          </div>
                          <span className="text-purple-300 font-medium text-sm">
                            Status
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 font-medium">
                            Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fix Time Metric */}
                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-yellow-500/15 to-orange-500/15 border border-yellow-400/40">
                      <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-br from-blue-400/50 via-cyan-400/50 to-blue-400/50 opacity-80 blur-md"></div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-yellow-400/20 opacity-60 blur-sm"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/30 border border-yellow-400/50 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-yellow-400" />
                          </div>
                          <span className="text-yellow-300 font-medium text-sm">
                            Fix Time
                          </span>
                        </div>
                        <div className="text-yellow-400 font-semibold text-lg">
                          {analysis.estimatedFixTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Vulnerability Network Visualization */}
            <GlassCard
              className="p-8 mb-12 relative"
              variant="secondary"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
              }}
            >
              {/* Enhanced light blue glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-70"
                style={{
                  background:
                    "linear-gradient(135deg, #60a5fa, #3b82f6, #06b6d4, #0ea5e9)",
                  zIndex: -1,
                  filter: "blur(3px)",
                }}
              />
              <div
                className="absolute inset-[1px] rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                  zIndex: -1,
                }}
              />
              <div className="relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="h-6 w-6 text-purple-400" />
                    <h3 className="text-2xl font-medium text-white">
                      Vulnerability Network Map
                    </h3>
                  </div>
                  <BodyText className="mb-6 text-slate-300">
                    Interactive visualization showing vulnerability
                    relationships and risk distribution across your
                    infrastructure.
                  </BodyText>

                  {/* Target URL Bar */}
                  <div className="relative mb-6">
                    <div className="relative p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50">
                      {/* Enhanced green glow */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-60"
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981, #22c55e, #34d399)",
                          zIndex: -1,
                          filter: "blur(8px)",
                        }}
                      />
                      <div
                        className="absolute inset-[1px] rounded-xl"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(52, 211, 153, 0.15) 100%)",
                          zIndex: -1,
                        }}
                      />
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/30 border border-green-400/50 flex items-center justify-center">
                          <Target className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-green-300 font-medium text-sm mb-1">
                            Scan Target
                          </div>
                          <div className="text-white font-mono text-lg">
                            {scanResult.target.url}
                          </div>
                        </div>
                        <div className="text-green-400 text-sm font-medium px-3 py-1 bg-green-500/20 rounded-lg border border-green-400/30">
                          Active
                        </div>
                      </div>
                    </div>
                  </div>

                  <VulnerabilityNetwork
                    vulnerabilities={analysis.prioritizedVulns || []}
                    riskScore={analysis.riskScore}
                    className="border border-purple-500/20 rounded-xl"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Executive Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <GlassCard
                className="p-8 relative"
                variant="secondary"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
                }}
              >
                {/* Light blue glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #60a5fa, #3b82f6, #06b6d4)",
                    zIndex: -1,
                    filter: "blur(2px)",
                  }}
                />
                <div
                  className="absolute inset-[1px] rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                    zIndex: -1,
                  }}
                />
                <div className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="h-6 w-6 text-purple-400" />
                      <h3 className="text-xl font-medium text-white">
                        Executive Summary
                      </h3>
                    </div>
                    <BodyText className="leading-relaxed">
                      {analysis.summary}
                    </BodyText>
                  </div>
                </div>
              </GlassCard>

              <GlassCard
                className="p-8 relative"
                variant="default"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
                }}
              >
                {/* Light blue glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #60a5fa, #3b82f6, #06b6d4)",
                    zIndex: -1,
                    filter: "blur(2px)",
                  }}
                />
                <div
                  className="absolute inset-[1px] rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                    zIndex: -1,
                  }}
                />
                <div className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-6 w-6 text-orange-400" />
                      <h3 className="text-xl font-medium text-white">
                        Risk Factors
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {analysis.riskFactors.slice(0, 4).map((factor, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-600/30"
                        >
                          <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <AlertTriangle className="h-3 w-3 text-orange-400" />
                          </div>
                          <span className="text-sm text-slate-300">
                            {factor}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Recommendations */}
            <GlassCard
              className="p-8 mb-12 relative"
              variant="primary"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%)",
              }}
            >
              {/* Enhanced light blue glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-80"
                style={{
                  background:
                    "linear-gradient(135deg, #60a5fa, #3b82f6, #06b6d4, #0ea5e9)",
                  zIndex: -1,
                  filter: "blur(3px)",
                }}
              />
              <div
                className="absolute inset-[1px] rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%)",
                  zIndex: -1,
                }}
              />
              <div className="relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="h-6 w-6 text-blue-400" />
                    <h3 className="text-2xl font-medium text-white">
                      Priority Recommendations
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.recommendations
                      .slice(0, 6)
                      .map((recommendation, index) => (
                        <div
                          key={index}
                          className="relative group hover:scale-[1.02] transition-all duration-300"
                        >
                          {/* Enhanced glow effect for each recommendation */}
                          <div
                            className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                            style={{
                              background: `linear-gradient(135deg, #60a5fa, #3b82f6, #06b6d4)`,
                              filter: "blur(4px)",
                              zIndex: -1,
                            }}
                          />
                          <div
                            className="absolute inset-[1px] rounded-xl"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(147, 197, 253, 0.15) 100%)",
                              zIndex: -1,
                            }}
                          />
                          <div className="relative flex items-start gap-3 p-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-400/40 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-blue-300/50 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                              <span className="text-white font-bold text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <span className="text-sm text-slate-200 leading-relaxed font-medium">
                              {recommendation}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProfessionalButton variant="primary" size="lg">
                <Download className="h-5 w-5" />
                Download Report
              </ProfessionalButton>

              <ProfessionalButton variant="secondary" size="lg">
                <Share className="h-5 w-5" />
                Share Results
              </ProfessionalButton>

              <ProfessionalButton variant="outline" size="lg">
                <Eye className="h-5 w-5" />
                View Details
              </ProfessionalButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
