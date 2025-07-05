import { useState } from "react";
import {
  CyberCard,
  CyberCardContent,
  CyberCardHeader,
  CyberCardTitle,
} from "@/components/ui/cyber-card";
import { NeonButton } from "@/components/ui/neon-button";
import { CyberInput } from "@/components/ui/cyber-input";
import CyberTerminal from "@/components/ui/cyber-terminal";
import CyberStatus from "@/components/ui/cyber-status";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScanOptions, ScanTool } from "@shared/api";
import {
  Shield,
  Target,
  Zap,
  AlertTriangle,
  Activity,
  Cpu,
} from "lucide-react";

interface ScannerProps {
  onStartScan: (options: ScanOptions) => void;
  isScanning: boolean;
}

const AVAILABLE_TOOLS: ScanTool[] = [
  {
    name: "Nuclei",
    enabled: true,
    description: "Fast vulnerability scanner with thousands of templates",
  },
  {
    name: "Httpx",
    enabled: false,
    description: "HTTP toolkit for probing services",
  },
  {
    name: "Nmap",
    enabled: false,
    description: "Network exploration and security auditing",
  },
  {
    name: "Gobuster",
    enabled: false,
    description: "Directory/file brute-forcing tool",
  },
  {
    name: "Sqlmap",
    enabled: false,
    description: "SQL injection vulnerability scanner",
  },
  {
    name: "Subfinder",
    enabled: false,
    description: "Subdomain discovery tool",
  },
];

export default function Scanner({ onStartScan, isScanning }: ScannerProps) {
  const [targetUrl, setTargetUrl] = useState("https://target.example.com");
  const [tools, setTools] = useState<ScanTool[]>(AVAILABLE_TOOLS);

  const terminalLines = [
    "Initializing LUMINOUS FLOW v2.1.0...",
    "Loading vulnerability templates...",
    "Nuclei engine: READY",
    "AI analysis module: ONLINE",
    "Awaiting target acquisition...",
  ];

  const handleToolToggle = (toolName: string, enabled: boolean) => {
    setTools(
      tools.map((tool) =>
        tool.name === toolName ? { ...tool, enabled } : tool,
      ),
    );
  };

  const handleStartScan = () => {
    const enabledTools = tools.filter((tool) => tool.enabled);
    if (enabledTools.length === 0) {
      alert("Please select at least one scanning tool");
      return;
    }

    // Validate URL format
    try {
      new URL(targetUrl);
    } catch {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    onStartScan({
      target: { url: targetUrl },
      tools: enabledTools,
      severity: ["critical", "high", "medium", "low", "info"],
      timeout: 300, // 5 minutes in seconds
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-cyber-cyan">
          <Shield className="h-8 w-8" />
          <h1 className="text-4xl font-bold text-glow-cyan">LUMINOUS FLOW</h1>
          <Shield className="h-8 w-8" />
        </div>
        <p className="text-cyber-purple text-sm tracking-widest uppercase">
          [CLASSIFIED] SECURITY ASSESSMENT PROTOCOL
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <CyberStatus status="online" label="CORE SYSTEM" />
          <CyberStatus status="online" label="AI MODULE" />
          <CyberStatus status="online" label="NUCLEI ENGINE" />
        </div>
      </div>

      {/* Target Acquisition */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            TARGET ACQUISITION
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-3">
            <Label
              htmlFor="target"
              className="text-cyber-cyan text-sm font-medium tracking-wide"
            >
              TARGET URL
            </Label>
            <CyberInput
              id="target"
              variant="target"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://target.example.com"
              disabled={isScanning}
              showStatusLine={!isScanning}
              statusText="TARGET LOCKED"
              isScanning={isScanning}
            />
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Weapon Selection */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            WEAPON SELECTION
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className={`
                  p-4 rounded-lg border transition-all duration-300 cursor-pointer
                  ${
                    tool.enabled
                      ? "border-cyber-purple bg-cyber-surface hover:border-cyber-purple hover:glow-purple"
                      : "border-cyber-surface bg-cyber-bg-dark hover:border-cyber-cyan/50"
                  }
                `}
                onClick={() => handleToolToggle(tool.name, !tool.enabled)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={tool.enabled}
                    onChange={(checked) =>
                      handleToolToggle(tool.name, !!checked)
                    }
                    className="border-cyber-cyan data-[state=checked]:bg-cyber-purple"
                    disabled={isScanning}
                  />
                  <Label
                    className={`font-medium cursor-pointer ${tool.enabled ? "text-cyber-purple" : "text-muted-foreground"}`}
                  >
                    {tool.name}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* System Terminal */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2 text-sm">
            <Cpu className="h-4 w-4" />
            SYSTEM TERMINAL
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <CyberTerminal lines={terminalLines} autoType={!isScanning} />
        </CyberCardContent>
      </CyberCard>

      {/* Debug Info */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4" />
            SCAN PARAMETERS
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded bg-cyber-surface border border-cyber-cyan/30">
              <div className="text-xs text-cyber-cyan mb-1">Selected Tools</div>
              <div className="text-lg font-mono text-white">
                {tools.filter((t) => t.enabled).length}
              </div>
            </div>
            <div className="p-3 rounded bg-cyber-surface border border-cyber-purple/30">
              <div className="text-xs text-cyber-purple mb-1">Target Type</div>
              <div className="text-lg font-mono text-white">Web App</div>
            </div>
            <div className="p-3 rounded bg-cyber-surface border border-cyber-green/30">
              <div className="text-xs text-cyber-green mb-1">Scan Mode</div>
              <div className="text-lg font-mono text-white">Standard</div>
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Execute Button */}
      <div className="flex justify-center">
        <NeonButton
          variant="scan"
          size="lg"
          onClick={handleStartScan}
          disabled={isScanning}
          className="px-12 py-4 text-lg font-bold tracking-wider"
        >
          {isScanning ? "SCANNING..." : "EXECUTE SCAN"}
        </NeonButton>
      </div>
    </div>
  );
}
