import React from "react";
import { cn } from "@/lib/utils";

interface CyberProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: "cyan" | "purple" | "green" | "red";
}

export default function CyberProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  color = "cyan",
}: CyberProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    cyan: "stroke-cyber-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]",
    purple: "stroke-cyber-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]",
    green: "stroke-cyber-green drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]",
    red: "stroke-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-cyber-surface opacity-30"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500 ease-in-out",
            colorClasses[color],
          )}
          style={{
            filter: `drop-shadow(0 0 10px ${color === "cyan" ? "#06b6d4" : color === "purple" ? "#a855f7" : color === "green" ? "#22c55e" : "#ef4444"}80)`,
          }}
        />

        {/* Animated glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth + 2}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("opacity-30 animate-pulse", colorClasses[color])}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <div className="text-2xl font-bold text-white font-mono">
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
