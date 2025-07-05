import React from "react";
import { cn } from "@/lib/utils";

interface FloatingHudProps {
  data: {
    label: string;
    value: string | number;
    unit?: string;
    status?: "normal" | "warning" | "critical";
    icon?: React.ReactNode;
  }[];
  centerElement?: React.ReactNode;
  className?: string;
}

export default function FloatingHUD({
  data,
  centerElement,
  className,
}: FloatingHudProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "warning":
        return "border-yellow-400 text-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.2)]";
      case "critical":
        return "border-red-400 text-red-400 shadow-[0_0_6px_rgba(239,68,68,0.2)]";
      default:
        return "border-cyber-cyan text-cyber-cyan shadow-[0_0_6px_rgba(0,255,255,0.2)]";
    }
  };

  // Position calculations for floating elements
  const positions = [
    { top: "10%", left: "15%", delay: "0s" },
    { top: "15%", right: "20%", delay: "0.5s" },
    { top: "30%", left: "5%", delay: "1s" },
    { top: "40%", right: "10%", delay: "1.5s" },
    { bottom: "25%", left: "20%", delay: "2s" },
    { bottom: "20%", right: "15%", delay: "2.5s" },
    { bottom: "35%", left: "8%", delay: "3s" },
    { top: "60%", right: "5%", delay: "3.5s" },
    { top: "25%", left: "45%", delay: "4s" },
    { bottom: "40%", right: "40%", delay: "4.5s" },
  ];

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Central HUD element */}
      {centerElement && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          {centerElement}
        </div>
      )}

      {/* Floating data panels */}
      {data.map((item, index) => {
        const position = positions[index % positions.length];

        return (
          <div
            key={index}
            className={cn(
              "absolute backdrop-blur-md rounded-lg p-3 border transition-all duration-500",
              "hover:scale-110 hover:z-30",
              getStatusColor(item.status),
              "animate-float",
            )}
            style={{
              ...position,
              animationDelay: position.delay,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {/* Connection lines */}
            <div
              className={cn(
                "absolute w-px h-8 opacity-30",
                item.status === "critical"
                  ? "bg-red-400"
                  : item.status === "warning"
                    ? "bg-yellow-400"
                    : "bg-cyber-cyan",
              )}
              style={{
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />

            <div className="flex items-center space-x-2 min-w-[120px]">
              {item.icon && <div className="flex-shrink-0">{item.icon}</div>}

              <div className="flex-1">
                <div className="text-xs font-medium opacity-80 uppercase tracking-wide">
                  {item.label}
                </div>
                <div className="text-lg font-mono font-bold">
                  {item.value}
                  {item.unit && (
                    <span className="text-xs ml-1 opacity-60">{item.unit}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Animated border */}
            <div
              className={cn(
                "absolute inset-0 rounded-lg border opacity-30 animate-pulse",
                item.status === "critical"
                  ? "border-red-400"
                  : item.status === "warning"
                    ? "border-yellow-400"
                    : "border-cyber-cyan",
              )}
            />

            {/* Additional pulsing border overlay */}
            <div
              className="absolute inset-0 rounded-lg border border-cyber-cyan opacity-30 animate-pulse"
              style={{ animationDuration: "2s" }}
            />
          </div>
        );
      })}

      {/* Animated connection grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient
            id="connectionGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(0,255,255)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="rgb(255,0,255)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(0,255,255)" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Dynamic connection lines */}
        {data.slice(0, 6).map((_, index) => {
          const startPos = positions[index];
          const endPos = positions[(index + 2) % positions.length];

          return (
            <line
              key={index}
              x1={`${parseFloat(startPos.left || startPos.right || "50")}%`}
              y1={`${parseFloat(startPos.top || startPos.bottom || "50")}%`}
              x2={`${parseFloat(endPos.left || endPos.right || "50")}%`}
              y2={`${parseFloat(endPos.top || endPos.bottom || "50")}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              className="animate-pulse"
              style={{
                animationDelay: `${index * 0.5}s`,
                animationDuration: "3s",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
