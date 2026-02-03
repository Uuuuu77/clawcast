import { Eye, History, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OracleHeaderProps {
  onOpenChat: () => void;
  onOpenHistory: () => void;
}

export function OracleHeader({ onOpenChat, onOpenHistory }: OracleHeaderProps) {
  return (
    <header className="border-b border-border/50 glass-strong sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
                <Eye className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-20 blur-md" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-primary glow-text-cyan">ORACLE</span>
                <span className="text-foreground ml-1">AI</span>
              </h1>
              <p className="text-xs text-muted-foreground">See Tomorrow, Today</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenHistory}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <History className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Button
              onClick={onOpenChat}
              className={cn(
                "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
                "hover:opacity-90 transition-opacity glow-cyan"
              )}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask Oracle
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
