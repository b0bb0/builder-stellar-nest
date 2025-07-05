import { useState, useEffect } from "react";
import { ScanOptions, ScanResult, AIAnalysis } from "@shared/api";
import Scanner from "@/components/Scanner";
import ScannerDashboard from "@/components/ScannerDashboard";
import ScanProgress from "@/components/ScanProgress";
import ProfessionalScanProgress from "@/components/ProfessionalScanProgress";
import AIAnalysisComponent from "@/components/AIAnalysis";
import ProfessionalScanResults from "@/components/ProfessionalScanResults";
import ProfessionalBackground from "@/components/ui/professional-background";
import { NeonButton } from "@/components/ui/neon-button";
import { useScanLifecycle } from "@/hooks/useScannerAPI";
import { useScanWebSocket } from "@/hooks/useWebSocket";
import { RotateCcw, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ScannerDebug from "@/components/ScannerDebug";

type AppState = "scanner" | "scanning" | "results";

export default function Index() {
  const [appState, setAppState] = useState<AppState>("scanner");
  const {
    currentScanId,
    scanResult,
    aiAnalysis,
    startNewScan,
    checkScanStatus,
    stopCurrentScan,
    resetScan,
    error: apiError,
    isLoading,
  } = useScanLifecycle();

  const {
    isConnected: wsConnected,
    connectionStatus,
    addScanListener,
    subscribeTo,
    scanProgress,
    scanPhase,
    vulnerabilities,
  } = useScanWebSocket(currentScanId);

  // Subscribe to scan updates via WebSocket
  useEffect(() => {
    if (!currentScanId || !wsConnected) return;

    const cleanup = addScanListener(currentScanId, (message) => {
      switch (message.type) {
        case "scan_completed":
          handleScanComplete();
          break;
        case "scan_failed":
          console.error("Scan failed:", message.data.error);
          alert(`Scan failed: ${message.data.error}`);
          setAppState("scanner");
          resetScan();
          break;
      }
    });

    return cleanup;
  }, [currentScanId, wsConnected]);

  const handleStartScan = async (options: ScanOptions) => {
    try {
      const scanId = await startNewScan(options);
      setAppState("scanning");
    } catch (error) {
      console.error("Error starting scan:", error);
      alert("Failed to start scan. Please try again.");
    }
  };

  const handleScanComplete = async () => {
    try {
      const statusResponse = await checkScanStatus();
      if (statusResponse) {
        setAppState("results");
      }
    } catch (error) {
      console.error("Error fetching scan results:", error);
    }
  };

  const handleNewScan = () => {
    setAppState("scanner");
    resetScan();
  };

  const handleStopScan = async () => {
    try {
      await stopCurrentScan();
      setAppState("scanner");
    } catch (error) {
      console.error("Error stopping scan:", error);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ProfessionalBackground />

      {/* Connection Status Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2"></div>

      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Debug component - remove this in production */}
          <div style={{ display: "none" }}>
            <ScannerDebug />
          </div>

          {appState === "scanner" && (
            <ScannerDashboard
              onStartScan={handleStartScan}
              isScanning={isLoading}
              scanProgress={scanProgress}
              scanPhase={scanPhase}
              vulnerabilityCount={vulnerabilities.length}
            />
          )}

          {appState === "scanning" && currentScanId && (
            <ProfessionalScanProgress
              scanId={currentScanId}
              onScanComplete={handleScanComplete}
            />
          )}

          {appState === "results" && scanResult && aiAnalysis && (
            <ProfessionalScanResults
              scanResult={scanResult}
              analysis={aiAnalysis}
            />
          )}

          {/* Loading Overlay */}
          {isLoading && appState === "scanner" && (
            <div className="fixed inset-0 bg-cyber-bg-dark/50 backdrop-blur-sm flex items-center justify-center z-40">
              <div className="text-center space-y-4">
                <div className="animate-spin w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full mx-auto" />
                <p className="text-cyber-cyan">Initializing scan...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
