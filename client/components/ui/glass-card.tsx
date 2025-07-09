import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary";
  style?: React.CSSProperties;
}

export default function GlassCard({
  children,
  className,
  variant = "default",
}: GlassCardProps) {
  const variants = {
    default: "bg-white/10 border-white/20",
    primary: "bg-blue-500/20 border-blue-400/30",
    secondary: "bg-slate-800/40 border-slate-600/30",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border backdrop-blur-xl shadow-2xl",
        variants[variant],
        className,
      )}
      style={{
        background:
          variant === "primary"
            ? "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%)"
            : variant === "secondary"
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.5) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Subtle inner border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
