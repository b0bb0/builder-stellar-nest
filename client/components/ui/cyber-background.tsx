import React from "react";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-cyan rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Scanning lines */}
      <div className="absolute inset-0" style={{ left: "-29px", top: "-57px" }}>
        <div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-30 animate-pulse"
          style={{ top: "20%", animationDuration: "3s" }}
        />
        <div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-30 animate-pulse"
          style={{ top: "60%", animationDuration: "4s", animationDelay: "1s" }}
        />
        <div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-30 animate-pulse"
          style={{ top: "80%", animationDuration: "5s", animationDelay: "2s" }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyber-cyan opacity-60" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyber-cyan opacity-60" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyber-cyan opacity-60" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyber-cyan opacity-60" />
    </div>
  );
}
