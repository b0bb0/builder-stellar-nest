import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Shield,
  Search,
  Zap,
  Target,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Network,
  Eye,
  Clock,
} from "lucide-react";

interface EnhancedScanLoadingProps {
  scanId: string;
  onScanComplete: () => void;
}

interface ScanPhase {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  duration: number;
  description: string;
  color: string;
  glowColor: string;
}

const scanPhases: ScanPhase[] = [
  {
    id: "init",
    name: "Initializing Scanner",
    icon: Cpu,
    duration: 800,
    description: "Preparing advanced threat detection algorithms",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.5)",
  },
  {
    id: "recon",
    name: "Target Reconnaissance",
    icon: Eye,
    duration: 1200,
    description: "Gathering target information and fingerprinting",
    color: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.5)",
  },
  {
    id: "discovery",
    name: "Network Discovery",
    icon: Network,
    duration: 1500,
    description: "Scanning ports and identifying services",
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
  {
    id: "analysis",
    name: "Vulnerability Analysis",
    icon: Shield,
    duration: 2000,
    description: "Deep scanning for security vulnerabilities",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
  {
    id: "exploitation",
    name: "Exploit Detection",
    icon: AlertTriangle,
    duration: 1800,
    description: "Testing for exploitable vulnerabilities",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.5)",
  },
  {
    id: "completion",
    name: "Finalizing Results",
    icon: CheckCircle,
    duration: 700,
    description: "Compiling comprehensive security report",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.5)",
  },
];

export default function EnhancedScanLoading({
  scanId,
  onScanComplete,
}: EnhancedScanLoadingProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState(0);
  const [activeScans, setActiveScans] = useState<string[]>([]);

  // Calculate total duration
  const totalDuration = scanPhases.reduce(
    (sum, phase) => sum + phase.duration,
    0,
  );

  useEffect(() => {
    let startTime = Date.now();
    let phaseStartTime = startTime;
    let currentPhase = 0;

    const interval = setInterval(() => {
      const now = Date.now();
      const totalElapsed = now - startTime;
      const phaseElapsed = now - phaseStartTime;

      // Update elapsed time
      setElapsedTime(Math.floor(totalElapsed / 1000));

      // Update progress
      const overallProgress = Math.min(
        (totalElapsed / totalDuration) * 100,
        100,
      );
      setProgress(overallProgress);

      // Simulate vulnerabilities being found
      const vulnCount =
        Math.floor((overallProgress / 100) * 12) +
        Math.floor(Math.random() * 3);
      setVulnerabilitiesFound(vulnCount);

      // Update active scans
      setActiveScans(
        [
          scanPhases[currentPhase]?.name || "Scanning",
          ...(currentPhase > 0 ? [scanPhases[currentPhase - 1]?.name] : []),
        ].filter(Boolean),
      );

      // Check if current phase is complete
      if (phaseElapsed >= scanPhases[currentPhase]?.duration) {
        if (currentPhase < scanPhases.length - 1) {
          currentPhase++;
          setCurrentPhaseIndex(currentPhase);
          phaseStartTime = now;
        } else {
          // Scan complete
          clearInterval(interval);
          setTimeout(() => {
            onScanComplete();
          }, 1000);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onScanComplete, totalDuration]);

  const currentPhase = scanPhases[currentPhaseIndex];

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Multiple animated gradient orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${10 + i * 15}%`,
              top: `${10 + i * 12}%`,
              background: `radial-gradient(circle, ${currentPhase?.glowColor || "rgba(6, 182, 212, 0.3)"} 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Scanning beam effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${currentPhase?.glowColor || "rgba(6, 182, 212, 0.1)"} 50%, transparent 100%)`,
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-5xl font-bold mb-4"
              style={{ color: currentPhase?.color || "#06b6d4" }}
              animate={{
                textShadow: [
                  `0 0 20px ${currentPhase?.glowColor || "rgba(6, 182, 212, 0.5)"}`,
                  `0 0 40px ${currentPhase?.glowColor || "rgba(6, 182, 212, 0.8)"}`,
                  `0 0 20px ${currentPhase?.glowColor || "rgba(6, 182, 212, 0.5)"}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Scan Progress
            </motion.h1>
            <p className="text-xl text-gray-300">
              Advanced Security Assessment in Progress
            </p>
          </motion.div>

          {/* Main Progress Circle */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Background circle */}
              <svg
                className="w-80 h-80 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2"
                  fill="none"
                />

                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={currentPhase?.color || "#06b6d4"}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    pathLength: progress / 100,
                    filter: `drop-shadow(0 0 20px ${currentPhase?.glowColor || "rgba(6, 182, 212, 0.8)"})`,
                  }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Animated dots around circle */}
                {[...Array(12)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={50 + 35 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                    cy={50 + 35 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                    r="1"
                    fill={currentPhase?.color || "#06b6d4"}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="text-6xl font-bold mb-2"
                  style={{ color: currentPhase?.color || "#06b6d4" }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {Math.round(progress)}%
                </motion.div>
                <div className="text-lg text-gray-300">Complete</div>
              </div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${currentPhase?.glowColor || "rgba(6, 182, 212, 0.2)"} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Current Phase Display */}
          <motion.div
            className="text-center mb-8"
            key={currentPhase?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              {currentPhase?.icon && (
                <motion.div
                  className="p-3 rounded-full"
                  style={{
                    backgroundColor: `${currentPhase.color}20`,
                    border: `1px solid ${currentPhase.color}40`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${currentPhase.glowColor}`,
                      `0 0 40px ${currentPhase.glowColor}`,
                      `0 0 20px ${currentPhase.glowColor}`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <currentPhase.icon
                    className="w-8 h-8"
                    style={{ color: currentPhase.color }}
                  />
                </motion.div>
              )}
            </div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: currentPhase?.color || "#06b6d4" }}
            >
              {currentPhase?.name || "Scanning..."}
            </h2>
            <p className="text-gray-400 text-lg">
              {currentPhase?.description || "Processing security scan..."}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Elapsed Time */}
            <motion.div
              className="p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-cyan-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-cyan-400" />
                <span className="text-cyan-400 font-medium">Elapsed Time</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.floor(elapsedTime / 60)}:
                {(elapsedTime % 60).toString().padStart(2, "0")}
              </div>
            </motion.div>

            {/* Vulnerabilities Found */}
            <motion.div
              className="p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-orange-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
                <span className="text-orange-400 font-medium">
                  Vulnerabilities
                </span>
              </div>
              <motion.div
                className="text-2xl font-bold text-white"
                animate={{ scale: vulnerabilitiesFound > 0 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {vulnerabilitiesFound}
              </motion.div>
            </motion.div>

            {/* Scan Phase */}
            <motion.div
              className="p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-purple-400" />
                <span className="text-purple-400 font-medium">Phase</span>
              </div>
              <div className="text-lg font-bold text-white">
                {currentPhaseIndex + 1} of {scanPhases.length}
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${currentPhase?.color || "#06b6d4"} 0%, ${currentPhase?.color || "#06b6d4"}80 100%)`,
                  boxShadow: `0 0 20px ${currentPhase?.glowColor || "rgba(6, 182, 212, 0.5)"}`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />

              {/* Animated glow line */}
              <motion.div
                className="absolute inset-y-0 w-1 bg-white"
                style={{
                  left: `${progress}%`,
                  boxShadow: `0 0 10px ${currentPhase?.color || "#06b6d4"}`,
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Active Scans */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-lg font-medium text-gray-300 mb-4">
              Active Scans
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <AnimatePresence>
                {activeScans.map((scan, index) => (
                  <motion.div
                    key={scan}
                    className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-cyan-500/30 text-cyan-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span
                      animate={{
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      {scan}
                    </motion.span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
