import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CyberStatusProps {
  status: "online" | "scanning" | "error" | "offline" | "complete";
  label?: string;
  className?: string;
  showPulse?: boolean;
}

const statusConfig = {
  online: {
    color: "text-cyber-green border-cyber-green",
    bg: "bg-green-950/30",
    glow: "shadow-[0_0_10px_rgba(34,197,94,0.3)]",
    text: "ONLINE",
  },
  scanning: {
    color: "text-cyber-cyan border-cyber-cyan",
    bg: "bg-cyan-950/30",
    glow: "shadow-[0_0_10px_rgba(6,182,212,0.3)]",
    text: "SCANNING",
  },
  error: {
    color: "text-red-400 border-red-500",
    bg: "bg-red-950/30",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    text: "ERROR",
  },
  offline: {
    color: "text-gray-400 border-gray-500",
    bg: "bg-gray-950/30",
    glow: "shadow-[0_0_10px_rgba(156,163,175,0.3)]",
    text: "OFFLINE",
  },
  complete: {
    color: "text-cyber-purple border-cyber-purple",
    bg: "bg-purple-950/30",
    glow: "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    text: "COMPLETE",
  },
};

export default function CyberStatus({
  status,
  label,
  className,
  showPulse = true,
}: CyberStatusProps) {
  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Status indicator */}
      <div className="relative">
        <div
          className={cn(
            "w-3 h-3 rounded-full border-2",
            config.color,
            config.bg,
            config.glow,
            showPulse && "animate-pulse",
          )}
        />
        {showPulse && status === "scanning" && (
          <div
            className={cn(
              "absolute inset-0 w-3 h-3 rounded-full border-2 animate-ping",
              config.color,
            )}
          />
        )}
      </div>

      {/* Status badge */}
      <Badge
        variant="outline"
        className={cn(
          config.color,
          config.glow,
          "text-xs font-mono tracking-wider",
        )}
      >
        {label || config.text}
      </Badge>
    </div>
  );
}
