import React, { useState, useEffect } from "react";
import {
  Shield,
  Target,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Wifi,
  AlertTriangle,
  Gauge,
  Globe,
  Activity,
  Cpu,
  Eye,
  Search,
  Lock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProfessionalBackground from "./ui/professional-background";
import GlassCard from "./ui/glass-card";
import ProfessionalButton from "./ui/professional-button";
import {
  MainHeading,
  SubHeading,
  SectionLabel,
  BodyText,
  Accent,
} from "./ui/professional-typography";
import CyberRobot from "./ui/cyber-robot";

import { ScanOptions } from "@shared/api";

interface ScannerDashboardProps {
  onStartScan: (options: ScanOptions) => void;
  isScanning: boolean;
  scanProgress?: number;
  scanPhase?: string;
  vulnerabilityCount?: number;
}

interface ScanTool {
  name: string;
  enabled: boolean;
  description: string;
}

const AVAILABLE_TOOLS: ScanTool[] = [
  {
    name: "Nmap",
    enabled: true,
    description: "Network discovery and security auditing",
  },
  {
    name: "Nuclei",
    enabled: true,
    description: "Vulnerability scanner based on templates",
  },
  {
    name: "Gobuster",
    enabled: false,
    description: "Directory/file & DNS busting tool",
  },
  {
    name: "Sqlmap",
    enabled: false,
    description: "SQL injection vulnerability scanner",
  },
  {
    name: "Subfinder",
    enabled: false,
    description: "Subdomain discovery tool",
  },
];

export default function ScannerDashboard({
  onStartScan,
  isScanning,
  scanProgress = 0,
  scanPhase = "Initializing...",
  vulnerabilityCount = 0,
}: ScannerDashboardProps) {
  const [targetUrl, setTargetUrl] = useState("https://target.example.com");
  const [tools, setTools] = useState<ScanTool[]>(AVAILABLE_TOOLS);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [isRobotWaving, setIsRobotWaving] = useState(false);

  const handleStartScan = () => {
    const enabledTools = tools.filter((tool) => tool.enabled);
    onStartScan({
      target: {
        url: targetUrl,
        name: "Security Assessment Target",
      },
      tools: enabledTools.map((tool) => ({
        name: tool.name.toLowerCase(),
        enabled: tool.enabled,
        description: tool.description,
      })),
    });
  };

  return (
    <div className="min-h-screen relative">
      <ProfessionalBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Robot in top left */}
        <div
          className="fixed top-4 z-50 flex flex-col cursor-pointer transition-transform hover:scale-105"
          style={{ left: "92px" }}
          onMouseEnter={() => setIsRobotWaving(true)}
          onMouseLeave={() => setIsRobotWaving(false)}
        >
          <CyberRobot
            isWaving={isRobotWaving}
            size="sm"
            className="drop-shadow-lg"
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <SectionLabel>SECURITY PLATFORM</SectionLabel>
              <MainHeading className="mb-6">
                Advanced <Accent>Vulnerability</Accent>
                <br />
                <Accent>Assessment</Accent> Platform
              </MainHeading>
              <SubHeading className="max-w-3xl mx-auto mb-8">
                AI powered LLM Trained models
              </SubHeading>
            </div>

            {/* Main Interface */}
            {isScanning ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Scanning Progress */}
                <GlassCard className="p-8" variant="primary">
                  <div className="text-center space-y-6">
                    <SectionLabel>SCAN IN PROGRESS</SectionLabel>

                    {/* Large Progress Ring */}
                    <div className="relative flex items-center justify-center">
                      <div className="w-48 h-48 relative">
                        <svg
                          className="w-48 h-48 transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="rgba(59, 130, 246, 0.2)"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="url(#progressGradient)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - scanProgress / 100)}`}
                            className="transition-all duration-500 ease-out"
                          />
                          <defs>
                            <linearGradient
                              id="progressGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-light text-white mb-1">
                              {Math.round(scanProgress)}%
                            </div>
                            <div className="text-sm text-blue-300 uppercase tracking-wider">
                              Complete
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lightning Blue Loading Bar */}
                    <div className="w-full max-w-xs mx-auto">
                      <div className="relative h-3 bg-slate-900/80 rounded-full overflow-hidden border border-blue-400/30 shadow-lg">
                        {/* Background lightning glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-cyan-300/50 to-blue-400/30 animate-pulse"></div>

                        {/* Main lightning progress bar */}
                        <div
                          className="relative h-full bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 rounded-full transition-all duration-100 ease-linear"
                          style={{
                            width: `${scanProgress}%`,
                            boxShadow:
                              "0 0 30px rgba(0, 191, 255, 1), 0 0 60px rgba(0, 255, 255, 0.8), 0 0 100px rgba(0, 191, 255, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.5)",
                            filter: "brightness(1.5) saturate(1.3)",
                          }}
                        >
                          {/* Multiple shimmer layers for lightning effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer rounded-full"></div>
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-100/40 to-transparent animate-shimmer rounded-full"
                            style={{ animationDelay: "0.5s" }}
                          ></div>

                          {/* Lightning bolt effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full animate-lightning-bolt"></div>
                        </div>

                        {/* Enhanced edge glow effects */}
                        <div
                          className="absolute top-0 h-full w-12 bg-gradient-to-r from-transparent via-cyan-200/70 to-blue-300/80 rounded-r-full transition-all duration-100"
                          style={{
                            left: `${Math.max(0, scanProgress - 10)}%`,
                            opacity: scanProgress > 3 ? 1 : 0,
                            boxShadow: "0 0 20px rgba(0, 255, 255, 0.8)",
                          }}
                        ></div>

                        {/* Pulsing outer ring */}
                        <div
                          className="absolute -inset-1 rounded-full border border-cyan-300/50 animate-pulse"
                          style={{ animationDuration: "1s" }}
                        ></div>
                      </div>

                      {/* Enhanced progress indicators */}
                      <div className="flex justify-between text-xs text-cyan-200 mt-2 font-medium">
                        <span className="text-blue-300">0%</span>
                        <span
                          className="text-cyan-100 font-bold text-sm drop-shadow-lg"
                          style={{
                            textShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
                          }}
                        >
                          {Math.round(scanProgress)}%
                        </span>
                        <span className="text-blue-300">100%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-medium text-white">
                        {scanPhase}
                      </h3>
                      <p className="text-blue-300">
                        <Accent>{vulnerabilityCount}</Accent> vulnerabilities
                        detected
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Scan Details */}
                <GlassCard className="p-8" variant="secondary">
                  <div className="space-y-6">
                    <SectionLabel>SCAN DETAILS</SectionLabel>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-slate-600/30">
                        <span className="text-slate-300">Target</span>
                        <span className="text-white font-mono text-sm">
                          {targetUrl}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-slate-600/30">
                        <span className="text-slate-300">Status</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400">Active</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-slate-600/30">
                        <span className="text-slate-300">Duration</span>
                        <span className="text-white">02:34</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-slate-300">Threats Found</span>
                        <span className="text-red-400 font-semibold">
                          {vulnerabilityCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Target Configuration */}
                <GlassCard className="p-8 relative" variant="default">
                  {/* Outer radiating neon blue glow */}
                  <div
                    className="absolute -inset-8 rounded-3xl opacity-40"
                    style={{
                      background:
                        "radial-gradient(circle, #0ea5e9 0%, #06b6d4 25%, transparent 70%)",
                      zIndex: -3,
                      filter: "blur(20px)",
                    }}
                  />
                  <div
                    className="absolute -inset-4 rounded-2xl opacity-50"
                    style={{
                      background:
                        "radial-gradient(circle, #3b82f6 0%, #60a5fa 40%, transparent 70%)",
                      zIndex: -2,
                      filter: "blur(12px)",
                    }}
                  />
                  {/* Enhanced light blue glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, #60a5fa, #3b82f6, #06b6d4, #0ea5e9)",
                      zIndex: -1,
                      filter: "blur(4px)",
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
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Target className="h-6 w-6 text-blue-400" />
                      <h3 className="text-xl font-medium text-white">
                        Target Configuration
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Target URL or IP Address
                        </label>
                        <input
                          type="url"
                          placeholder="https://target.example.com"
                          value={targetUrl}
                          onChange={(e) => setTargetUrl(e.target.value)}
                          className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Scan Type
                          </label>
                          <select className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20">
                            <option value="comprehensive">Comprehensive</option>
                            <option value="quick">Quick Scan</option>
                            <option value="deep">Deep Analysis</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Priority
                          </label>
                          <select className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20">
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Triangle Scan Button */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleStartScan}
                    className="relative group cursor-pointer"
                  >
                    {/* Outer glow layers */}
                    <div
                      className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                      style={{
                        filter: "blur(15px)",
                        background:
                          "linear-gradient(45deg, #ff0080, #ff4d9f, #ff80bf)",
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105"
                      style={{
                        filter: "blur(25px)",
                        background:
                          "radial-gradient(circle, #ff0080 0%, #8b5cf6 50%, #06b6d4 100%)",
                      }}
                    />

                    {/* Triangle container */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      {/* SVG Triangle with neon effect */}
                      <svg
                        width="192"
                        height="192"
                        viewBox="0 0 192 192"
                        className="absolute inset-0"
                      >
                        <defs>
                          <linearGradient
                            id="triangleGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#ff0080" />
                            <stop offset="50%" stopColor="#ff4d9f" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                          <filter id="neonGlow">
                            <feGaussianBlur
                              stdDeviation="3"
                              result="coloredBlur"
                            />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Main triangle */}
                        <polygon
                          points="96,20 172,152 20,152"
                          fill="none"
                          stroke="url(#triangleGradient)"
                          strokeWidth="3"
                          filter="url(#neonGlow)"
                          className="group-hover:stroke-[4] transition-all duration-300"
                        />

                        {/* Inner triangle lines */}
                        <polygon
                          points="96,35 157,137 35,137"
                          fill="none"
                          stroke="#ff80bf"
                          strokeWidth="1"
                          opacity="0.6"
                        />

                        {/* Center lines */}
                        <line
                          x1="96"
                          y1="35"
                          x2="96"
                          y2="100"
                          stroke="#ff0080"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        <line
                          x1="75"
                          y1="100"
                          x2="117"
                          y2="100"
                          stroke="#ff0080"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                      </svg>

                      {/* Center content */}
                      <div className="relative z-10 text-center">
                        <Zap className="h-12 w-12 text-white mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-white font-bold text-lg group-hover:text-pink-200 transition-colors duration-300">
                          SCAN
                        </div>
                        <div className="text-pink-300 text-xs font-medium uppercase tracking-wider">
                          Initialize
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <GlassCard className="p-6 text-center" variant="secondary">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Advanced Protection
                </h4>
                <BodyText className="text-sm">
                  Multi-layered security analysis with real-time threat
                  intelligence
                </BodyText>
              </GlassCard>

              <GlassCard className="p-6 text-center" variant="secondary">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Performance Optimized
                </h4>
                <BodyText className="text-sm">
                  High-speed scanning with minimal resource footprint
                </BodyText>
              </GlassCard>

              <GlassCard className="p-6 text-center" variant="secondary">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Global Coverage
                </h4>
                <BodyText className="text-sm">
                  Comprehensive database of worldwide threat signatures
                </BodyText>
              </GlassCard>
            </div>

            {/* Advanced Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* SMS Notification Feature */}
              <GlassCard className="p-8 relative" variant="primary">
                {/* Enhanced pink/magenta glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff0080, #ff4d9f, #8b5cf6)",
                    zIndex: -1,
                    filter: "blur(8px)",
                  }}
                />
                <div
                  className="absolute inset-[1px] rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 0, 128, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
                    zIndex: -1,
                  }}
                />
                <div className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl flex items-center justify-center border border-pink-400/50">
                        <svg
                          className="h-7 w-7 text-pink-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white">
                          SMS Notification
                        </h4>
                        <p className="text-pink-300 text-sm">
                          Global Threat Activities
                        </p>
                      </div>
                    </div>

                    <BodyText className="text-slate-300">
                      Instant SMS alerts for critical global threat activities
                      and security incidents. Stay informed about emerging
                      threats that could impact your infrastructure.
                    </BodyText>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Real-time threat intelligence</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Critical alert prioritization</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Global coverage network</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* AI Scan Result Feature */}
              <GlassCard className="p-8 relative" variant="primary">
                {/* Enhanced blue/cyan glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9, #06b6d4, #3b82f6)",
                    zIndex: -1,
                    filter: "blur(8px)",
                  }}
                />
                <div
                  className="absolute inset-[1px] rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)",
                    zIndex: -1,
                  }}
                />
                <div className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-400/50">
                        <svg
                          className="h-7 w-7 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white">
                          AI Scan Result
                        </h4>
                        <p className="text-blue-300 text-sm">
                          Intelligent Analysis
                        </p>
                      </div>
                    </div>

                    <BodyText className="text-slate-300">
                      Advanced AI-powered analysis provides intelligent
                      insights, predictive threat modeling, and automated
                      remediation recommendations.
                    </BodyText>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Machine learning algorithms</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Predictive threat analysis</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Automated recommendations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Full Access Registration Form */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Register for Full Access
                </h3>
                <p className="text-slate-400">
                  Complete your registration to unlock all premium features
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <GlassCard className="p-8 relative" variant="primary">
                  {/* Enhanced multicolor glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-60"
                    style={{
                      background:
                        "linear-gradient(135deg, #ff0080, #ff4d9f, #8b5cf6, #3b82f6, #10b981)",
                      zIndex: -1,
                      filter: "blur(8px)",
                    }}
                  />
                  <div
                    className="absolute inset-[1px] rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 0, 128, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(16, 185, 129, 0.1) 100%)",
                      zIndex: -1,
                    }}
                  />
                  <div className="relative z-10">
                    <h4 className="text-2xl font-semibold text-white mb-8 text-center">
                      Complete Your Registration
                    </h4>

                    <form className="space-y-6">
                      {/* Form 1: Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-2 flex items-center gap-2">
                          <span className="w-6 h-6 bg-green-500/30 rounded-lg flex items-center justify-center text-xs font-bold">
                            1
                          </span>
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="w-full bg-slate-800/50 border border-green-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                          required
                        />
                        <p className="text-xs text-green-400/70 mt-1">
                          For SMS verification and security alerts
                        </p>
                      </div>

                      {/* Form 2: Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-500/30 rounded-lg flex items-center justify-center text-xs font-bold">
                            2
                          </span>
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full bg-slate-800/50 border border-blue-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                          required
                        />
                      </div>

                      {/* Form 3: Email Address */}
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-500/30 rounded-lg flex items-center justify-center text-xs font-bold">
                            3
                          </span>
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="john.doe@example.com"
                          className="w-full bg-slate-800/50 border border-purple-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                          required
                        />
                        <p className="text-xs text-purple-400/70 mt-1">
                          For account verification and updates
                        </p>
                      </div>

                      {/* Form 4: Organization */}
                      <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2">
                          <span className="w-6 h-6 bg-cyan-500/30 rounded-lg flex items-center justify-center text-xs font-bold">
                            4
                          </span>
                          Organization (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Your Company Name"
                          className="w-full bg-slate-800/50 border border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      </div>

                      {/* Terms and Conditions */}
                      <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-600/50">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mt-1 w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                          required
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-slate-300"
                        >
                          I agree to the{" "}
                          <a
                            href="#"
                            className="text-purple-400 hover:text-purple-300 underline"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="text-purple-400 hover:text-purple-300 underline"
                          >
                            Privacy Policy
                          </a>
                          . I consent to receive SMS notifications for security
                          alerts and account updates.
                        </label>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 text-lg"
                      >
                        Register for Full Access
                      </button>
                    </form>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
