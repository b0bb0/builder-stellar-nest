import React from "react";
import { cn } from "@/lib/utils";

interface CyberRobotProps {
  isWaving?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CyberRobot({
  isWaving = true,
  size = "md",
  className,
}: CyberRobotProps) {
  const sizeClasses = {
    sm: "scale-40",
    md: "scale-60",
    lg: "scale-80",
  };

  return (
    <div
      className={cn("relative", sizeClasses[size], className)}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Robot Container */}
      <div
        className="relative"
        style={{
          transform: "rotateX(10deg) rotateY(-5deg)",
          transformStyle: "preserve-3d",
          animation: "robot-float 3s ease-in-out infinite",
        }}
      >
        {/* Shadow */}
        <div
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/30 rounded-full blur-sm"
          style={{
            animation: "shadow-pulse 3s ease-in-out infinite",
          }}
        />

        {/* Robot Body */}
        <div className="relative">
          {/* Head - Large spherical head like modern 3D robot */}
          <div
            className="relative w-28 h-24 mx-auto mb-1 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400"
            style={{
              transform: "translateZ(15px)",
              boxShadow:
                "0 15px 35px rgba(0,0,0,0.5), inset 0 6px 0 rgba(255,255,255,0.4), inset 0 -6px 12px rgba(0,0,0,0.2)",
              border: "1px solid rgba(180,180,180,0.8)",
            }}
          >
            {/* Large Dark Visor - Takes up most of the head */}
            <div
              className="absolute top-1 left-1 right-1 bottom-2 rounded-full bg-gray-900 border border-gray-700 overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse at 40% 30%, #1a1a1a, #000000)",
                boxShadow:
                  "inset 0 0 40px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,255,255,0.1)",
              }}
            >
              {/* Large Bright Glowing Eyes */}
              <div
                className="absolute top-6 left-6 w-5 h-5 rounded-full bg-cyan-400"
                style={{
                  boxShadow:
                    "0 0 20px rgba(0,255,255,1), inset 0 0 10px rgba(0,255,255,0.7), 0 0 40px rgba(0,255,255,0.5)",
                  animation: "eye-glow 2s ease-in-out infinite",
                }}
              />
              <div
                className="absolute top-6 right-6 w-5 h-5 rounded-full bg-cyan-400"
                style={{
                  boxShadow:
                    "0 0 20px rgba(0,255,255,1), inset 0 0 10px rgba(0,255,255,0.7), 0 0 40px rgba(0,255,255,0.5)",
                  animation: "eye-glow 2s ease-in-out infinite",
                  animationDelay: "0.1s",
                }}
              />
            </div>

            {/* Thin Elegant Antennae */}
            <div className="absolute -top-2 left-8 w-0.5 h-6 bg-gray-600 rounded-full transform rotate-15" />
            <div className="absolute -top-2 right-8 w-0.5 h-6 bg-gray-600 rounded-full transform -rotate-15" />
            <div
              className="absolute -top-3 left-8 w-2 h-2 rounded-full bg-cyan-400 transform rotate-15"
              style={{
                boxShadow: "0 0 8px rgba(0,255,255,0.9)",
                animation: "antenna-glow 3s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -top-3 right-8 w-2 h-2 rounded-full bg-cyan-400 transform -rotate-15"
              style={{
                boxShadow: "0 0 8px rgba(0,255,255,0.9)",
                animation: "antenna-glow 3s ease-in-out infinite",
                animationDelay: "1.5s",
              }}
            />
          </div>

          {/* Compact Rounded Body */}
          <div
            className="relative w-22 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400"
            style={{
              transform: "translateZ(12px)",
              boxShadow:
                "0 12px 30px rgba(0,0,0,0.5), inset 0 5px 0 rgba(255,255,255,0.4), inset 0 -5px 10px rgba(0,0,0,0.2)",
              border: "1px solid rgba(180,180,180,0.8)",
            }}
          >
            {/* Small Circular Chest Emblem */}
            <div
              className="absolute top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gray-800 border border-gray-600"
              style={{
                boxShadow:
                  "inset 0 0 12px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)",
              }}
            >
              {/* Inner Circle with Logo */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-cyan-400 bg-gray-900"
                style={{
                  boxShadow:
                    "0 0 8px rgba(0,255,255,0.6), inset 0 0 4px rgba(0,255,255,0.2)",
                }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-cyan-400 font-bold">
                  S
                </div>
              </div>
            </div>
          </div>

          {/* Left Arm - Compact and modern */}
          <div
            className={cn(
              "absolute top-28 -left-6 w-3 h-6 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border border-gray-400",
              isWaving && "origin-top",
            )}
            style={{
              transform: "translateZ(8px)",
              animation: isWaving
                ? "wave-arm 1.5s ease-in-out infinite"
                : "none",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)",
            }}
          >
            {/* Hand - Small round hand */}
            <div
              className="absolute -bottom-1 -left-0.5 w-4 h-3 rounded-full bg-gradient-to-b from-gray-300 to-gray-400 border border-gray-400"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            />
          </div>

          {/* Right Arm */}
          <div
            className="absolute top-28 -right-6 w-3 h-6 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border border-gray-400"
            style={{
              transform: "translateZ(8px)",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)",
            }}
          >
            {/* Hand */}
            <div
              className="absolute -bottom-1 -right-0.5 w-4 h-3 rounded-full bg-gradient-to-b from-gray-300 to-gray-400 border border-gray-400"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            />
          </div>

          {/* Legs - Short and compact */}
          <div
            className="absolute top-40 left-6 w-3 h-5 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border border-gray-400"
            style={{
              transform: "translateZ(9px)",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)",
            }}
          >
            {/* Foot - Small rounded boots */}
            <div
              className="absolute -bottom-1 -left-0.5 w-4 h-3 rounded-full bg-gradient-to-b from-gray-400 to-gray-500 border border-gray-500"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            />
          </div>

          <div
            className="absolute top-40 right-6 w-3 h-5 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border border-gray-400"
            style={{
              transform: "translateZ(9px)",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)",
            }}
          >
            {/* Foot */}
            <div
              className="absolute -bottom-1 -right-0.5 w-4 h-3 rounded-full bg-gradient-to-b from-gray-400 to-gray-500 border border-gray-500"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
