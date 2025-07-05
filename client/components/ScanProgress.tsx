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

            {/* Lightning Blue Loading Bar */}
            <div className="w-full max-w-xs mx-auto mb-4">
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
                  style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.8)" }}
                >
                  {Math.round(progress)}%
                </span>
                <span className="text-blue-300">100%</span>
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
