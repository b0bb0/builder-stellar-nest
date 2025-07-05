import { Link } from "react-router-dom";
import { NeonButton } from "@/components/ui/neon-button";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-cyber-purple">
          <AlertTriangle className="h-12 w-12" />
          <h1 className="text-8xl font-bold text-glow-purple">404</h1>
          <AlertTriangle className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-cyber-cyan text-glow-cyan">
            ACCESS DENIED
          </p>
          <p className="text-muted-foreground tracking-widest uppercase text-sm">
            [ERROR] SECTOR NOT FOUND
          </p>
        </div>
        <div className="pt-8">
          <Link to="/">
            <NeonButton variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              RETURN TO BASE
            </NeonButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
