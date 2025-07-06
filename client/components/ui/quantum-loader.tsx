import React from "react";
import { motion } from "framer-motion";

interface QuantumLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "purple" | "pink";
}

export const QuantumLoader: React.FC<QuantumLoaderProps> = ({
  size = "md",
  color = "cyan",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const colors = {
    cyan: "#06b6d4",
    purple: "#8b5cf6",
    pink: "#ec4899",
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      {/* Outer ring */}
      <motion.div
        className={`absolute inset-0 border-4 border-transparent rounded-full`}
        style={{
          borderTopColor: colors[color],
          borderRightColor: `${colors[color]}40`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Middle ring */}
      <motion.div
        className={`absolute inset-2 border-2 border-transparent rounded-full`}
        style={{
          borderBottomColor: colors[color],
          borderLeftColor: `${colors[color]}60`,
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner ring */}
      <motion.div
        className={`absolute inset-4 border border-transparent rounded-full`}
        style={{
          borderTopColor: colors[color],
          borderBottomColor: `${colors[color]}80`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: colors[color] }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md opacity-50"
        style={{ backgroundColor: colors[color] }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
