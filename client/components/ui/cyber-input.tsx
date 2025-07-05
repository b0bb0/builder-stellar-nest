import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Search, Lock, Globe } from "lucide-react";

export interface CyberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "target" | "secure" | "search";
  showStatusLine?: boolean;
  statusText?: string;
  isScanning?: boolean;
}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  (
    {
      className,
      type,
      variant = "default",
      showStatusLine = false,
      statusText,
      isScanning = false,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const getIcon = () => {
      switch (variant) {
        case "target":
          return <Globe className="h-4 w-4 text-cyber-cyan" />;
        case "secure":
          return <Lock className="h-4 w-4 text-cyber-purple" />;
        case "search":
          return <Search className="h-4 w-4 text-cyber-cyan" />;
        default:
          return null;
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "target":
          return "border-cyber-cyan/50 focus:border-cyber-cyan bg-cyber-surface text-cyber-cyan placeholder:text-cyber-cyan/50";
        case "secure":
          return "border-cyber-purple/50 focus:border-cyber-purple bg-cyber-surface text-cyber-purple placeholder:text-cyber-purple/50";
        case "search":
          return "border-cyber-cyan/50 focus:border-cyber-cyan bg-cyber-surface text-cyber-cyan placeholder:text-cyber-cyan/50";
        default:
          return "border-cyber-surface focus:border-cyber-cyan bg-cyber-surface text-foreground";
      }
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          {/* Icon */}
          {getIcon() && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              {getIcon()}
            </div>
          )}

          {/* Input */}
          <input
            type={
              type === "password" && showPassword
                ? "text"
                : type === "password"
                  ? "password"
                  : type
            }
            className={cn(
              "flex h-12 w-full rounded-md border px-3 py-2 text-sm transition-all duration-300",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "font-mono tracking-wide",
              getIcon() && "pl-10",
              type === "password" && "pr-10",
              getVariantStyles(),
              focused && "glow-cyan",
              isScanning && "animate-pulse",
              className,
            )}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            ref={ref}
            {...props}
          />

          {/* Password toggle */}
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-cyan hover:text-cyber-purple transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Scanning effect */}
          {isScanning && (
            <div className="absolute inset-0 rounded-md border border-cyber-cyan animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Status line */}
        {showStatusLine && (
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span className="text-cyber-green font-mono">
              {statusText || "CONNECTION ESTABLISHED"}
            </span>
          </div>
        )}

        {/* Scanning line */}
        {focused && (
          <div className="h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-pulse" />
        )}
      </div>
    );
  },
);
CyberInput.displayName = "CyberInput";

export { CyberInput };
