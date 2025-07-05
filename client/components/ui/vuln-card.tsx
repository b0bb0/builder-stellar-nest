import React from "react";
import { Badge } from "@/components/ui/badge";
import { Vulnerability, SeverityLevel } from "@shared/api";
import {
  AlertTriangle,
  Shield,
  Code,
  ExternalLink,
  Clock,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VulnCardProps {
  vulnerability: Vulnerability;
  className?: string;
  isHighlighted?: boolean;
}

const severityConfig: Record<
  SeverityLevel,
  {
    color: string;
    bg: string;
    glow: string;
    icon: React.ComponentType<{ className?: string }>;
    priority: number;
  }
> = {
  critical: {
    color: "text-red-400 border-red-500",
    bg: "bg-red-950/20",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.4)]",
    icon: AlertTriangle,
    priority: 5,
  },
  high: {
    color: "text-orange-400 border-orange-500",
    bg: "bg-orange-950/20",
    glow: "shadow-[0_0_15px_rgba(251,146,60,0.4)]",
    icon: Shield,
    priority: 4,
  },
  medium: {
    color: "text-yellow-400 border-yellow-500",
    bg: "bg-yellow-950/20",
    glow: "shadow-[0_0_15px_rgba(250,204,21,0.4)]",
    icon: Code,
    priority: 3,
  },
  low: {
    color: "text-blue-400 border-blue-500",
    bg: "bg-blue-950/20",
    glow: "shadow-[0_0_15px_rgba(96,165,250,0.4)]",
    icon: Info,
    priority: 2,
  },
  info: {
    color: "text-gray-400 border-gray-500",
    bg: "bg-gray-950/20",
    glow: "shadow-[0_0_15px_rgba(156,163,175,0.4)]",
    icon: Info,
    priority: 1,
  },
};

export default function VulnCard({
  vulnerability,
  className,
  isHighlighted = false,
}: VulnCardProps) {
  const config = severityConfig[vulnerability.severity];
  const Icon = config.icon;

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]",
        "cyber-card",
        config.color,
        config.bg,
        config.glow,
        isHighlighted && "ring-2 ring-cyber-cyan",
        className,
      )}
    >
      {/* Priority indicator */}
      <div className="absolute top-2 right-2">
        <div
          className={cn(
            "w-3 h-3 rounded-full animate-pulse",
            config.color.replace("text-", "bg-").replace("border-", "bg-"),
          )}
        />
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("p-2 rounded border", config.color, config.bg)}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={cn("text-xs", config.color)}>
              {vulnerability.severity.toUpperCase()}
            </Badge>

            {vulnerability.cvss && (
              <Badge variant="outline" className="text-xs text-cyber-cyan">
                CVSS: {vulnerability.cvss}
              </Badge>
            )}

            {vulnerability.cve && (
              <Badge variant="outline" className="text-xs text-cyber-purple">
                {vulnerability.cve}
              </Badge>
            )}
          </div>

          <h3 className="font-medium text-white text-sm leading-tight mb-1">
            {vulnerability.title}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {vulnerability.description}
          </p>
        </div>
      </div>

      {/* URL and Method */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <ExternalLink className="h-3 w-3 text-cyber-cyan flex-shrink-0" />
          <code className="text-cyber-cyan font-mono break-all">
            {formatUrl(vulnerability.url)}
          </code>
        </div>

        {vulnerability.method && (
          <div className="flex items-center gap-2 text-xs">
            <Code className="h-3 w-3 text-cyber-purple flex-shrink-0" />
            <span className="text-cyber-purple font-mono">
              {vulnerability.method}
            </span>
          </div>
        )}
      </div>

      {/* Evidence */}
      {vulnerability.evidence && (
        <div className="mb-3">
          <div className="text-xs text-cyber-cyan mb-1">Evidence:</div>
          <div className="bg-cyber-bg-darker p-2 rounded border border-cyber-surface">
            <code className="text-xs text-cyber-green font-mono break-all">
              {vulnerability.evidence}
            </code>
          </div>
        </div>
      )}

      {/* Tags and Timestamp */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 flex-wrap">
          {vulnerability.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-cyber-surface text-cyber-cyan text-xs rounded font-mono"
            >
              {tag}
            </span>
          ))}
          {vulnerability.tags.length > 3 && (
            <span className="px-2 py-1 bg-cyber-surface text-muted-foreground text-xs rounded">
              +{vulnerability.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="font-mono">
            {new Date(vulnerability.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30 animate-pulse" />
    </div>
  );
}
