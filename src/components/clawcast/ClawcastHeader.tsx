import { Sparkles } from "lucide-react";

export function ClawcastHeader() {
  return (
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <span className="text-2xl">🦞</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                CLAWCAST
              </h1>
              <p className="text-xs text-muted-foreground">
                Evidence-based intelligence
              </p>
            </div>
          </a>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">AI-Powered Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
}
