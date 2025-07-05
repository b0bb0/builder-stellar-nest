import { useEffect, useState } from "react";
import { ScanResult } from "@shared/api";
import GlassCard from "./ui/glass-card";
import ProfessionalBackground from "./ui/professional-background";
import {
  SectionLabel,
  MainHeading,
  SubHeading,
  BodyText,
  Accent,
} from "./ui/professional-typography";
import {
  Activity,
  Clock,
  Target,
  AlertTriangle,
  Zap,
  Shield,
  CheckCircle,
  Search,
  Globe,
} from "lucide-react";

interface ProfessionalScanProgressProps {
  scanId: string;
  onScanComplete: (result: ScanResult) => void;
}

export default function ProfessionalScanProgress({
  scanId,
  onScanComplete,
}: ProfessionalScanProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Initializing...");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState(0);
  const [activeScans, setActiveScans] = useState([
    "Port Discovery",
    "SSL Analysis",
  ]);

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 6000; // 6 seconds

    // Phases for 6 seconds
    const phases = [
      { phase: "Target Reconnaissance", duration: 1000 },
      { phase: "Network Discovery", duration: 1200 },
      { phase: "Vulnerability Assessment", duration: 1500 },
      { phase: "Security Analysis", duration: 1200 },
      { phase: "Threat Intelligence", duration: 800 },
      { phase: "Report Generation", duration: 300 },
    ];

    let currentPhaseIndex = 0;
    let currentPhaseStart = 0;

    // Smooth progress animation - updates every 16ms (~60fps)
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const baseProgress = Math.min((elapsed / totalDuration) * 100, 100);

      // Add small random variations for natural feel (±2%)
      const randomVariation = (Math.random() - 0.5) * 4;
      const smoothProgress = Math.max(
        0,
        Math.min(100, baseProgress + randomVariation),
      );

      setProgress(smoothProgress);

      // Update phase based on time
      let phaseElapsed = 0;
      let phaseIndex = 0;
      for (let i = 0; i < phases.length; i++) {
        if (elapsed < phaseElapsed + phases[i].duration) {
          phaseIndex = i;
          break;
        }
        phaseElapsed += phases[i].duration;
      }

      if (phaseIndex !== currentPhaseIndex) {
        currentPhaseIndex = phaseIndex;
        setCurrentPhase(phases[currentPhaseIndex].phase);
      }

      // Simulate finding vulnerabilities randomly
      if (Math.random() > 0.998) {
        setVulnerabilitiesFound((prev) => prev + 1);
      }

      // Complete after 6 seconds
      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        clearInterval(timeInterval);
        setProgress(100);
        setCurrentPhase("Analysis Complete");

        const mockResult: ScanResult = {
          id: scanId,
          target: { url: "https://target.example.com" },
          status: "completed",
          vulnerabilities: [],
          stats: {
            total: vulnerabilitiesFound,
            critical: Math.floor(vulnerabilitiesFound * 0.1),
            high: Math.floor(vulnerabilitiesFound * 0.2),
            medium: Math.floor(vulnerabilitiesFound * 0.3),
            low: Math.floor(vulnerabilitiesFound * 0.3),
            info: Math.floor(vulnerabilitiesFound * 0.1),
          },
          startTime: new Date(startTime).toISOString(),
          endTime: new Date().toISOString(),
          duration: 6,
        };

        setTimeout(() => onScanComplete(mockResult), 1500);
      }
    }, 16); // 60fps smooth updates

    // Update elapsed time
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [scanId, onScanComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen relative">
      <ProfessionalBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <SectionLabel>SECURITY ASSESSMENT</SectionLabel>
              <MainHeading className="mb-4">
                <Accent>Vulnerability Scan</Accent> in Progress
              </MainHeading>
              <SubHeading>
                Comprehensive security analysis using advanced threat detection
                algorithms
              </SubHeading>
            </div>

            {/* Main Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Progress Visualization */}
              <GlassCard className="p-8 text-center" variant="primary">
                <div className="space-y-6">
                  <SectionLabel>SCAN PROGRESS</SectionLabel>

                  {/* Large Progress Circle */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-56 h-56 relative">
                      <svg
                        className="w-56 h-56 transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="rgba(59, 130, 246, 0.1)"
                          strokeWidth="4"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="url(#progressGradient)"
                          strokeWidth="4"
                          fill="transparent"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
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
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-light text-white mb-2">
                            {Math.round(progress)}%
                          </div>
                          <div className="text-sm text-blue-300 uppercase tracking-wider">
                            Complete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lightning Blue Loading Bar */}
                  <div className="w-full max-w-xs mx-auto mb-6">
                    <div className="relative h-3 bg-slate-900/80 rounded-full overflow-hidden border border-blue-400/30 shadow-lg">
                      {/* Background lightning glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-cyan-300/50 to-blue-400/30 animate-pulse"></div>

                      {/* Main lightning progress bar */}
                      <div
                        className="relative h-full bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 rounded-full transition-all duration-100 ease-linear"
                        style={{
                          width: `${progress}%`,
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
                          left: `${Math.max(0, progress - 10)}%`,
                          opacity: progress > 3 ? 1 : 0,
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
                        {Math.round(progress)}%
                      </span>
                      <span className="text-blue-300">100%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-white">
                      {currentPhase}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Scan Details */}
              <GlassCard className="p-8" variant="secondary">
                <div className="space-y-6">
                  <SectionLabel>REAL-TIME METRICS</SectionLabel>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-slate-600/30">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-400" />
                        <span className="text-slate-300">Duration</span>
                      </div>
                      <span className="text-white font-mono text-lg">
                        {formatTime(elapsedTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-slate-600/30">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        <span className="text-slate-300">Issues Found</span>
                      </div>
                      <span className="text-orange-400 font-semibold text-lg">
                        {vulnerabilitiesFound}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-slate-600/30">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-green-400" />
                        <span className="text-slate-300">Progress</span>
                      </div>
                      <span className="text-green-400 font-mono text-lg">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 text-purple-400" />
                        <span className="text-slate-300">Current Phase</span>
                      </div>
                      <span className="text-purple-400 text-sm">
                        {currentPhase}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Active Scans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6" variant="default">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <h4 className="text-lg font-medium text-white">
                    Security Tests
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">
                      SSL/TLS Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">
                      Port Scanning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
                    <span className="text-sm text-blue-400">CVE Detection</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" variant="default">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-6 w-6 text-purple-400" />
                  <h4 className="text-lg font-medium text-white">
                    Network Analysis
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">
                      DNS Enumeration
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-purple-400 rounded-full border-t-transparent animate-spin"></div>
                    <span className="text-sm text-purple-400">
                      Subdomain Discovery
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-600 rounded-full"></div>
                    <span className="text-sm text-slate-500">
                      WAF Detection
                    </span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" variant="default">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  <h4 className="text-lg font-medium text-white">
                    Threat Intelligence
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">
                      Reputation Check
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">IOC Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
                    <span className="text-sm text-yellow-400">
                      Risk Assessment
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
