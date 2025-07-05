import React from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "critical" | "warning" | "success";
  glowIntensity?: "low" | "medium" | "high";
  children: React.ReactNode;
}

const HolographicCard = React.forwardRef<HTMLDivElement, HolographicCardProps>(
  (
    {
      className,
      variant = "default",
      glowIntensity = "medium",
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      default:
        "from-cyber-cyan/10 via-cyber-purple/10 to-cyber-pink/10 border-cyber-cyan/30",
      critical:
        "from-red-500/15 via-red-400/10 to-pink-500/15 border-red-400/40",
      warning:
        "from-yellow-500/15 via-orange-400/10 to-red-500/15 border-yellow-400/40",
      success:
        "from-green-500/15 via-emerald-400/10 to-cyan-500/15 border-green-400/40",
    };

    const glowStyles = {
      low: "shadow-[0_0_8px_rgba(0,255,255,0.1)]",
      medium: "shadow-[0_0_12px_rgba(0,255,255,0.15)]",
      high: "shadow-[0_0_16px_rgba(0,255,255,0.2)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl p-6 backdrop-blur-sm transition-all duration-500 hover:scale-[1.01]",
          "bg-gradient-to-br",
          variantStyles[variant],
          glowStyles[glowIntensity],
          "border border-opacity-60",
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
          "after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-t after:from-transparent after:via-white/2 after:to-white/5 after:opacity-30",
          className,
        )}
        style={{
          background: `
            linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(255,0,255,0.1) 50%, rgba(0,255,255,0.1) 100%),
            linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)
          `,
          backgroundSize: "200% 200%, 100% 100%",
          animation: "holographic-shift 8s ease-in-out infinite",
        }}
        {...props}
      >
        <div className="relative z-10">{children}</div>

        {/* Holographic shimmer effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-15"
          style={{
            background: `
              linear-gradient(
                45deg,
                transparent 40%,
                rgba(255,255,255,0.1) 45%,
                rgba(0,255,255,0.15) 50%,
                rgba(255,0,255,0.15) 55%,
                rgba(255,255,255,0.1) 60%,
                transparent 70%
              )
            `,
            backgroundSize: "200% 200%",
            animation: "shimmer 4s ease-in-out infinite",
          }}
        />
      </div>
    );
  },
);

HolographicCard.displayName = "HolographicCard";

export { HolographicCard };
