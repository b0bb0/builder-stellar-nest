import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CyberTerminalProps {
  lines: string[];
  className?: string;
  autoType?: boolean;
  typeSpeed?: number;
}

export default function CyberTerminal({
  lines,
  className,
  autoType = true,
  typeSpeed = 50,
}: CyberTerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (!autoType || currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];

    if (currentChar < currentLine.length) {
      const timer = setTimeout(() => {
        setCurrentChar(currentChar + 1);
      }, typeSpeed);
      return () => clearTimeout(timer);
    } else {
      // Line complete, move to next
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, currentLine]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentChar(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentChar, currentLineIndex, lines, autoType, typeSpeed]);

  const currentTypingLine =
    currentLineIndex < lines.length
      ? lines[currentLineIndex].substring(0, currentChar)
      : "";

  return (
    <div
      className={cn(
        "bg-cyber-bg-darker border border-cyber-cyan/50 rounded p-4 font-mono text-sm",
        "shadow-[0_0_20px_rgba(0,255,255,0.3)] relative overflow-hidden",
        className,
      )}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-cyber-cyan/30">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <span className="text-cyber-cyan text-xs">LUMINOUS_FLOW_TERMINAL</span>
      </div>

      {/* Terminal content */}
      <div className="space-y-1">
        {displayedLines.map((line, index) => (
          <div key={index} className="text-cyber-cyan">
            <span className="text-cyber-purple">$</span> {line}
          </div>
        ))}

        {currentLineIndex < lines.length && (
          <div className="text-cyber-cyan">
            <span className="text-cyber-purple">$</span> {currentTypingLine}
            <span className="animate-pulse">|</span>
          </div>
        )}
      </div>

      {/* Scanning overlay effect */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent 
                      animate-pulse pointer-events-none"
      />
    </div>
  );
}
