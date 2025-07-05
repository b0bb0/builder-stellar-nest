import { useEffect, useState } from "react";
import { AlertTriangle, Shield, Zap } from "lucide-react";

interface EmergencyAlertProps {
  title?: string;
  message?: string;
  countdown?: number; // seconds
  onComplete?: () => void;
  severity?: "critical" | "high" | "warning";
  isVisible?: boolean;
}

export default function EmergencyAlert({
  title = "EMERGENCY ALERT",
  message = "Critical security threat detected",
  countdown = 60,
  onComplete,
  severity = "critical",
  isVisible = true,
}: EmergencyAlertProps) {
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [isActive, setIsActive] = useState(isVisible);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onComplete]);

  useEffect(() => {
    setIsActive(isVisible);
    setTimeLeft(countdown);
  }, [isVisible, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSeverityColors = () => {
    switch (severity) {
      case "critical":
        return {
          primary: "rgba(239, 68, 68, 1)", // red-500
          secondary: "rgba(236, 72, 153, 1)", // pink-500
          accent: "rgba(168, 85, 247, 1)", // purple-500
          glow: "rgba(239, 68, 68, 0.8)",
        };
      case "high":
        return {
          primary: "rgba(245, 101, 101, 1)", // red-400
          secondary: "rgba(251, 146, 60, 1)", // orange-400
          accent: "rgba(250, 204, 21, 1)", // yellow-400
          glow: "rgba(245, 101, 101, 0.8)",
        };
      case "warning":
        return {
          primary: "rgba(250, 204, 21, 1)", // yellow-400
          secondary: "rgba(34, 197, 94, 1)", // green-500
          accent: "rgba(59, 130, 246, 1)", // blue-500
          glow: "rgba(250, 204, 21, 0.8)",
        };
    }
  };

  const colors = getSeverityColors();

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Atmospheric Beams */}
        <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-cyan-400/60 to-transparent blur-sm animate-pulse" />
        <div
          className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-purple-400/60 to-transparent blur-sm animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-pink-400/40 to-transparent blur-sm animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Corner Warning Triangles */}
        <div
          className="absolute top-8 left-8 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="relative">
            <div
              className="w-16 h-16 border-4 border-transparent bg-gradient-to-br from-red-500 to-pink-500 rounded-sm rotate-45"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                transform: "rotate(0deg)",
                boxShadow: `0 0 20px ${colors.glow}`,
              }}
            />
            <AlertTriangle
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
              size={24}
            />
          </div>
        </div>

        <div
          className="absolute top-8 right-8 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <div className="relative">
            <div
              className="w-16 h-16 border-4 border-transparent bg-gradient-to-br from-red-500 to-pink-500 rounded-sm"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                boxShadow: `0 0 20px ${colors.glow}`,
              }}
            />
            <AlertTriangle
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
              size={24}
            />
          </div>
        </div>

        <div
          className="absolute bottom-8 left-8 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="relative">
            <div
              className="w-16 h-16 border-4 border-transparent bg-gradient-to-br from-red-500 to-pink-500 rounded-sm"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                boxShadow: `0 0 20px ${colors.glow}`,
              }}
            />
            <AlertTriangle
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
              size={24}
            />
          </div>
        </div>

        <div
          className="absolute bottom-8 right-8 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          <div className="relative">
            <div
              className="w-16 h-16 border-4 border-transparent bg-gradient-to-br from-red-500 to-pink-500 rounded-sm"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                boxShadow: `0 0 20px ${colors.glow}`,
              }}
            />
            <AlertTriangle
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
              size={24}
            />
          </div>
        </div>
      </div>

      {/* Main Alert Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-8">
        {/* Top Warning Triangle */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div
              className="w-24 h-24 bg-gradient-to-br from-red-500 via-pink-500 to-red-600 mx-auto animate-pulse"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                boxShadow: `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
              }}
            />
            <AlertTriangle
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white animate-pulse"
              size={36}
            />
          </div>
        </div>

        {/* Main Alert Display */}
        <div
          className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-2xl border-2 overflow-hidden"
          style={{
            borderColor: colors.primary,
            boxShadow: `
              0 0 50px ${colors.glow},
              inset 0 0 50px rgba(0, 0, 0, 0.5),
              0 0 100px ${colors.secondary}
            `,
          }}
        >
          {/* Animated Border */}
          <div
            className="absolute inset-0 rounded-2xl animate-pulse"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent}, ${colors.primary})`,
              backgroundSize: "300% 300%",
              animation: "holographic-shift 3s ease-in-out infinite",
            }}
          />
          <div className="absolute inset-[2px] bg-gradient-to-br from-slate-900/98 to-slate-800/98 rounded-2xl" />

          {/* Content */}
          <div className="relative z-10 p-12 text-center">
            {/* Title */}
            <h1
              className="text-6xl font-bold mb-6 tracking-wider animate-pulse"
              style={{
                color: colors.primary,
                textShadow: `
                  0 0 10px ${colors.glow},
                  0 0 20px ${colors.glow},
                  0 0 40px ${colors.glow}
                `,
              }}
            >
              {title}
            </h1>

            {/* Countdown Timer */}
            <div className="mb-8">
              <div
                className="inline-block bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border-2 px-12 py-6"
                style={{
                  borderColor: colors.accent,
                  boxShadow: `0 0 30px ${colors.glow}`,
                }}
              >
                <div
                  className="text-8xl font-mono font-bold tracking-widest animate-pulse"
                  style={{
                    color: colors.primary,
                    textShadow: `
                      0 0 15px ${colors.glow},
                      0 0 30px ${colors.glow}
                    `,
                  }}
                >
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm uppercase tracking-[0.3em] text-slate-400 mt-2">
                  EMERGENCY ALERT
                </div>
              </div>
            </div>

            {/* Message */}
            <p className="text-xl text-slate-300 mb-8 tracking-wide">
              {message}
            </p>

            {/* Action Icons */}
            <div className="flex justify-center items-center gap-12">
              <div className="text-center">
                <Shield
                  size={48}
                  className="mx-auto mb-2 animate-pulse"
                  style={{ color: colors.accent }}
                />
                <div className="text-xs uppercase tracking-wider text-slate-400">
                  Security
                </div>
              </div>

              <div className="text-center">
                <Zap
                  size={48}
                  className="mx-auto mb-2 animate-pulse"
                  style={{ color: colors.secondary, animationDelay: "0.5s" }}
                />
                <div className="text-xs uppercase tracking-wider text-slate-400">
                  Threat Level
                </div>
              </div>

              <div className="text-center">
                <AlertTriangle
                  size={48}
                  className="mx-auto mb-2 animate-pulse"
                  style={{ color: colors.primary, animationDelay: "1s" }}
                />
                <div className="text-xs uppercase tracking-wider text-slate-400">
                  Alert Status
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 bg-slate-900/80 rounded-full px-8 py-4 border border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-300 uppercase tracking-wider text-sm">
              System Alert Active
            </span>
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
