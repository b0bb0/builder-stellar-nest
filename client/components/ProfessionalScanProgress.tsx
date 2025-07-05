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

    // Sophisticated scan phases
    const phases = [
      { phase: "Target Reconnaissance", duration: 2000 },
      { phase: "Network Discovery", duration: 3000 },
      { phase: "Vulnerability Assessment", duration: 8000 },
      { phase: "Security Analysis", duration: 5000 },
      { phase: "Threat Intelligence", duration: 3000 },
      { phase: "Report Generation", duration: 1000 },
    ];

    let currentPhaseIndex = 0;

    const phaseInterval = setInterval(() => {
      if (currentPhaseIndex < phases.length) {
        const phase = phases[currentPhaseIndex];
        setCurrentPhase(phase.phase);

        const phaseProgress = 100 / phases.length;
        const phaseStart = currentPhaseIndex * phaseProgress;

        let phaseElapsed = 0;
        const phaseTimer = setInterval(() => {
          phaseElapsed += 100;
          const phaseProgressPercent = Math.min(
            (phaseElapsed / phase.duration) * phaseProgress,
            phaseProgress,
          );
          setProgress(phaseStart + phaseProgressPercent);

          // Simulate finding vulnerabilities
          if (currentPhaseIndex >= 2 && Math.random() > 0.95) {
            setVulnerabilitiesFound((prev) => prev + 1);
          }

          if (phaseElapsed >= phase.duration) {
            clearInterval(phaseTimer);
            currentPhaseIndex++;
          }
        }, 100);

        setTimeout(() => {
          clearInterval(phaseTimer);
        }, phase.duration);
      } else {
        // Scan complete
        clearInterval(phaseInterval);
        setCurrentPhase("Analysis Complete");
        setProgress(100);

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
          duration: elapsedTime,
        };

        setTimeout(() => onScanComplete(mockResult), 1500);
      }
    }, 100);

    // Update elapsed time
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(phaseInterval);
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
