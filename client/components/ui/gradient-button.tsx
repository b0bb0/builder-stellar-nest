import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface GradientButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  children,
  className = "",
  disabled,
  onClick,
  type = "button",
}) => {
  const variants = {
    primary: "from-pink-500 via-purple-500 to-cyan-500",
    secondary: "from-gray-600 via-gray-700 to-gray-800",
    danger: "from-red-500 via-orange-500 to-yellow-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      className={`
        relative overflow-hidden rounded-lg font-semibold
        bg-gradient-to-r ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        transition-all duration-300 group
        ${className}
      `}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      {/* Animated background glow */}
      <motion.div
        className={`
          absolute inset-0 bg-gradient-to-r ${variants[variant]}
          opacity-0 group-hover:opacity-100 blur-xl
        `}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
            <span>{children}</span>
            {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
          </>
        )}
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};
