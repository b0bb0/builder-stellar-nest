import { useEffect, useState } from "react";
import {
  CyberCard,
  CyberCardContent,
  CyberCardHeader,
  CyberCardTitle,
} from "@/components/ui/cyber-card";
import { Progress } from "@/components/ui/progress";
import CyberProgressRing from "@/components/ui/cyber-progress-ring";
import CyberTerminal from "@/components/ui/cyber-terminal";
import CyberStatus from "@/components/ui/cyber-status";
import { Badge } from "@/components/ui/badge";
import { ScanResult } from "@shared/api";
import { Activity, Clock, Target, AlertTriangle, Zap, Cpu } from "lucide-react";

interface ScanProgressProps {
  scanId: string;
  onScanComplete: (result: ScanResult) => void;
}

export default function ScanProgress({
  scanId,
  onScanComplete,
}: ScanProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Initializing...");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Initializing scan sequence...",
  ]);

  useEffect(() => {
    const startTime = Date.now();

    // Simulate scan progress
    const phases = [
      { phase: "Target reconnaissance...", duration: 2000 },
      { phase: "Port scanning...", duration: 3000 },
      { phase: "Vulnerability detection...", duration: 8000 },
      { phase: "Deep analysis...", duration: 5000 },
      { phase: "AI processing results...", duration: 3000 },
      { phase: "Generating report...", duration: 1000 },
    ];

    let currentPhaseIndex = 0;
    let totalProgress = 0;

    const phaseInterval = setInterval(() => {
      if (currentPhaseIndex < phases.length) {
        const phase = phases[currentPhaseIndex];
        setCurrentPhase(phase.phase);

        const phaseProgress = 100 / phases.length;
        const phaseStart = currentPhaseIndex * phaseProgress;

        // Add terminal log for phase start
        setTerminalLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${phase.phase}`,
        ]);

        let phaseElapsed = 0;
        const phaseTimer = setInterval(() => {
          phaseElapsed += 100;
          const phaseProgressPercent = Math.min(
            (phaseElapsed / phase.duration) * phaseProgress,
            phaseProgress,
          );
          setProgress(phaseStart + phaseProgressPercent);

          // Simulate finding vulnerabilities with terminal logs
          if (currentPhaseIndex >= 2 && Math.random() > 0.9) {
            const newVulnCount = vulnerabilitiesFound + 1;
            setVulnerabilitiesFound(newVulnCount);
            const vulnTypes = [
              "SQL Injection",
              "XSS",
              "Directory Traversal",
              "IDOR",
              "Info Disclosure",
            ];
            const vulnType =
              vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
            setTerminalLogs((prev) => [
              ...prev,
              `[ALERT] ${vulnType} detected - ID: ${newVulnCount}`,
            ]);
          }

          // Add periodic status logs
          if (phaseElapsed % 2000 === 0) {
            setTerminalLogs((prev) => [
              ...prev,
              `[INFO] Progress: ${Math.round(phaseStart + phaseProgressPercent)}% - ${Math.floor(phaseElapsed / 1000)}s elapsed`,
            ]);
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
        setCurrentPhase("Scan completed!");
        setProgress(100);

        // Simulate scan result
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

        setTimeout(() => onScanComplete(mockResult), 1000);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-cyber-purple">
          <Activity className="h-8 w-8 animate-pulse" />
          <h1 className="text-4xl font-bold text-glow-purple">
            SCAN IN PROGRESS
          </h1>
        </div>
        <p className="text-cyber-cyan text-sm tracking-widest uppercase">
          [ACTIVE] VULNERABILITY ASSESSMENT
        </p>
      </div>

      {/* Progress Card */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SCAN STATUS
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent className="space-y-6">
          {/* Progress Ring */}
          <div className="flex flex-col items-center space-y-4">
            <CyberProgressRing
              progress={progress}
              size={160}
              color="cyan"
              className="mb-4"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-cyber-cyan font-mono">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-muted-foreground">COMPLETE</div>
              </div>
            </CyberProgressRing>

            {/* Blue Luminescent Loading Bar */}
            <div className="w-full max-w-xs mx-auto mb-4">
              <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-400/30 to-blue-500/20 animate-pulse"></div>

                {/* Main progress bar */}
                <div
                  className="relative h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    boxShadow:
                      "0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full"></div>
                </div>

                {/* Edge glow effects */}
                <div
                  className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent to-blue-400/50 rounded-r-full transition-all duration-300"
                  style={{
                    left: `${Math.max(0, progress - 8)}%`,
                    opacity: progress > 5 ? 1 : 0,
                  }}
                ></div>
              </div>

              {/* Progress indicators */}
              <div className="flex justify-between text-xs text-blue-300/70 mt-2">
                <span>0%</span>
                <span className="text-cyan-300 font-medium">
                  {Math.round(progress)}%
                </span>
                <span>100%</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-cyber-cyan text-sm font-medium mb-1">
                {currentPhase}
              </div>
              <CyberStatus
                status="scanning"
                label="ACTIVE SCAN"
                showPulse={true}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-cyber-surface border border-cyber-cyan/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-cyber-cyan" />
                <span className="text-sm font-medium text-cyber-cyan">
                  Elapsed Time
                </span>
              </div>
              <p className="text-2xl font-mono text-white">
                {formatTime(elapsedTime)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-cyber-surface border border-cyber-purple/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-cyber-purple" />
                <span className="text-sm font-medium text-cyber-purple">
                  Vulnerabilities Found
                </span>
              </div>
              <p className="text-2xl font-mono text-white">
                {vulnerabilitiesFound}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-cyber-surface border border-cyber-green/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-cyber-green" />
                <span className="text-sm font-medium text-cyber-green">
                  Progress
                </span>
              </div>
              <p className="text-2xl font-mono text-white">
                {Math.round(progress)}%
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="border-cyber-green text-cyber-green animate-pulse"
            >
              SCANNING
            </Badge>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-cyber-cyan rounded-full animate-ping"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Live Terminal */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            SCAN TERMINAL
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <CyberTerminal
            lines={terminalLogs.slice(-8)} // Show last 8 logs
            autoType={false}
            className="h-48 overflow-y-auto"
          />
        </CyberCardContent>
      </CyberCard>
    </div>
  );
}
