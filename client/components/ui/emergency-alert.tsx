import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface EmergencyAlertProps {
  type?: "warning" | "critical" | "emergency";
  duration?: number; // in seconds
  title?: string;
  message?: string;
  onTimeout?: () => void;
  className?: string;
}

export default function EmergencyAlert({
  type = "warning",
  duration = 60,
  title = "SECURITY ALERT",
  message = "Critical vulnerabilities detected",
  onTimeout,
  className,
}: EmergencyAlertProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const alertStyles = {
    warning: {
      primary: "text-yellow-400",
      secondary: "text-yellow-300",
      glow: "shadow-[0_0_12px_rgba(234,179,8,0.4)]",
      border: "border-yellow-400",
      bg: "bg-yellow-500/8",
    },
    critical: {
      primary: "text-red-400",
      secondary: "text-red-300",
      glow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]",
      border: "border-red-400",
      bg: "bg-red-500/8",
    },
    emergency: {
      primary: "text-pink-400",
      secondary: "text-pink-300",
      glow: "shadow-[0_0_12px_rgba(236,72,153,0.4)]",
      border: "border-pink-400",
      bg: "bg-pink-500/8",
    },
  };

  const style = alertStyles[type];

  return (
    <div
      className={cn("relative flex flex-col items-center space-y-6", className)}
    >
      {/* Warning triangles */}
      <div className="flex items-center space-x-8">
        <div
          className={cn(
            "relative p-4 border-2 rounded-lg rotate-0",
            style.border,
            style.glow,
            "animate-pulse",
          )}
        >
          <div
            className={cn("absolute inset-0 rounded-lg animate-ping", style.bg)}
          />
          <AlertTriangle
            className={cn("h-8 w-8 relative z-10", style.primary)}
          />
        </div>

        {/* Central countdown display */}
        <div
          className={cn(
            "relative p-8 border-2 rounded-xl backdrop-blur-md",
            style.border,
            style.glow,
            style.bg,
          )}
        >
          {/* Neon triangle frame */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl border-2 animate-pulse",
              style.border,
            )}
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              transform: "scale(1.1)",
            }}
          />

          <div className="relative z-10 text-center">
            <div
              className={cn(
                "text-5xl font-mono font-bold tracking-wider mb-2",
                style.primary,
              )}
              style={{
                textShadow: `0 0 4px currentColor`,
                fontFamily: "monospace",
              }}
            >
              {formatTime(timeLeft)}
            </div>

            <div
              className={cn(
                "text-sm font-bold tracking-[0.2em] uppercase",
                style.secondary,
              )}
            >
              {title}
            </div>

            {message && (
              <div className={cn("text-xs mt-2 opacity-80", style.secondary)}>
                {message}
              </div>
            )}
          </div>

          {/* Animated border effect */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl border-2 opacity-50",
              style.border,
            )}
            style={{
              animation: "border-pulse 2s ease-in-out infinite",
            }}
          />
        </div>

        <div
          className={cn(
            "relative p-4 border-2 rounded-lg rotate-0",
            style.border,
            style.glow,
            "animate-pulse",
          )}
        >
          <div
            className={cn("absolute inset-0 rounded-lg animate-ping", style.bg)}
          />
          <AlertTriangle
            className={cn("h-8 w-8 relative z-10", style.primary)}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div
          className={cn("h-2 rounded-full bg-gray-800 border", style.border)}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-linear",
              style.primary.replace("text-", "bg-"),
            )}
            style={{
              width: `${(timeLeft / duration) * 100}%`,
              boxShadow: `0 0 10px currentColor`,
            }}
          />
        </div>
        <div
          className={cn("text-center text-xs mt-2 font-mono", style.secondary)}
        >
          {Math.round((timeLeft / duration) * 100)}% TIME REMAINING
        </div>
      </div>
    </div>
  );
}
