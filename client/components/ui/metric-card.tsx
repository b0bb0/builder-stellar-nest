import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "purple" | "pink" | "cyan" | "green" | "red";
  isLoading?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
  isLoading = false,
  onClick,
}) => {
  const colors = {
    blue: {
      border: "border-blue-500/30",
      bg: "from-blue-500/10 to-blue-600/5",
      text: "text-blue-400",
      glow: "shadow-blue-500/20",
    },
    purple: {
      border: "border-purple-500/30",
      bg: "from-purple-500/10 to-purple-600/5",
      text: "text-purple-400",
      glow: "shadow-purple-500/20",
    },
    pink: {
      border: "border-pink-500/30",
      bg: "from-pink-500/10 to-pink-600/5",
      text: "text-pink-400",
      glow: "shadow-pink-500/20",
    },
    cyan: {
      border: "border-cyan-500/30",
      bg: "from-cyan-500/10 to-cyan-600/5",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/20",
    },
    green: {
      border: "border-green-500/30",
      bg: "from-green-500/10 to-green-600/5",
      text: "text-green-400",
      glow: "shadow-green-500/20",
    },
    red: {
      border: "border-red-500/30",
      bg: "from-red-500/10 to-red-600/5",
      text: "text-red-400",
      glow: "shadow-red-500/20",
    },
  };

  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-gray-400",
  };

  const colorTheme = colors[color];

  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl border ${colorTheme.border}
        bg-gradient-to-br ${colorTheme.bg}
        backdrop-blur-sm shadow-lg ${colorTheme.glow}
        ${onClick ? "cursor-pointer" : ""}
        group transition-all duration-300
      `}
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onClick}
    >
      {/* Background glow effect */}
      <motion.div
        className={`
          absolute inset-0 rounded-2xl bg-gradient-to-br ${colorTheme.bg}
          opacity-0 group-hover:opacity-100 blur-xl
        `}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
            {title}
          </h3>
          {Icon && (
            <motion.div
              className={`p-2 rounded-lg bg-gradient-to-br ${colorTheme.bg}`}
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className={`w-5 h-5 ${colorTheme.text}`} />
            </motion.div>
          )}
        </div>

        {/* Main Value */}
        <div className="mb-2">
          {isLoading ? (
            <motion.div
              className="h-8 bg-gray-700 rounded animate-pulse"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ) : (
            <motion.span
              className="text-3xl font-bold text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {value}
            </motion.span>
          )}
        </div>

        {/* Subtitle and Trend */}
        <div className="flex items-center justify-between">
          {subtitle && (
            <span className="text-sm text-gray-400">{subtitle}</span>
          )}
          {trend && trendValue && (
            <motion.div
              className={`text-xs font-medium ${trendColors[trend]} flex items-center gap-1`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                initial={{ y: 0 }}
                animate={{
                  y: trend === "up" ? -2 : trend === "down" ? 2 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
              </motion.span>
              {trendValue}
            </motion.div>
          )}
        </div>

        {/* Animated border */}
        <motion.div
          className={`absolute inset-0 rounded-2xl border-2 ${colorTheme.border} opacity-0 group-hover:opacity-100`}
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
};
