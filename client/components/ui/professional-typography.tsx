import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function MainHeading({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-4xl md:text-6xl font-light text-white leading-tight tracking-tight",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function SubHeading({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "text-2xl md:text-3xl font-light text-blue-100 leading-relaxed",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SectionLabel({ children, className }: TypographyProps) {
  return (
    <div
      className={cn(
        "text-xs font-medium text-blue-300 uppercase tracking-wider opacity-70 mb-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BodyText({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-slate-300 leading-relaxed text-base", className)}>
      {children}
    </p>
  );
}

export function Accent({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-blue-400 font-medium", className)}>
      {children}
    </span>
  );
}
