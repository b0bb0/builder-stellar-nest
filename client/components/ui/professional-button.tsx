import React from "react";
import { cn } from "@/lib/utils";

interface ProfessionalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function ProfessionalButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
}: ProfessionalButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 border border-blue-400/30",
    secondary:
      "bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 border border-slate-600/50",
    outline:
      "bg-transparent text-blue-400 border-2 border-blue-400/50 hover:bg-blue-400/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
