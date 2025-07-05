import { useState } from "react";
import { useScannerAPI } from "@/hooks/useScannerAPI";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function ScannerDebug() {
  const { startScan, getHealth, error, isLoading } = useScannerAPI();
  const [healthData, setHealthData] = useState<any>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  const testHealth = async () => {
    try {
      const health = await getHealth();
      setHealthData(health);
      console.log("Health check successful:", health);
    } catch (error) {
      console.error("Health check failed:", error);
    }
  };

  const testScan = async () => {
    try {
      const scanId = await startScan({
        target: { url: "https://httpbin.org" },
        tools: [
          {
            name: "Nuclei",
            enabled: true,
            description: "Nuclei vulnerability scanner",
          },
        ],
      });
      setScanResult({ scanId, status: "started" });
      console.log("Scan started successfully:", scanId);
    } catch (error) {
      console.error("Scan failed:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scanner API Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testHealth} disabled={isLoading}>
              Test Health
            </Button>
            <Button onClick={testScan} disabled={isLoading}>
              Test Scan
            </Button>
          </div>

          {isLoading && <div className="text-blue-500">Loading...</div>}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {healthData && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong>Health Check Results:</strong>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}

          {scanResult && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              <strong>Scan Results:</strong>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(scanResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
