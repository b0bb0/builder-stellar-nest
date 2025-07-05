import React from "react";

export default function ProfessionalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Main gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0f1419 0%, #1a2332 25%, #2d3748 50%, #1a2332 75%, #0f1419 100%)",
        }}
      />

      {/* Subtle geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs with subtle glow */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)",
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle network connections */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient
            id="connectionGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="100%" stopColor="rgba(147, 197, 253, 0.1)" />
          </linearGradient>
        </defs>
        <path
          d="M 100 150 Q 300 100 500 200 T 900 150"
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <path
          d="M 150 400 Q 400 350 650 450 T 1000 400"
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        />
      </svg>

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-blue-400/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-blue-400/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-blue-400/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-blue-400/30" />
    </div>
  );
}
