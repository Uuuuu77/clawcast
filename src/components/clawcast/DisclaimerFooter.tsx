import React from "react";
import { AlertTriangle } from "lucide-react";

interface DisclaimerFooterProps {
  compact?: boolean;
}

export const DisclaimerFooter = React.forwardRef<HTMLDivElement, DisclaimerFooterProps>(
  ({ compact = false }, ref) => {
    if (compact) {
      return (
        <div ref={ref} className="text-center text-xs text-muted-foreground/70 py-4">
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Not financial advice • Decision-support tool • Predictions may be wrong
          </span>
        </div>
      );
    }

    return (
      <footer ref={ref} className="border-t border-border/30 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500/70" />
              <span className="font-medium">Important Disclaimers</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-muted-foreground/80">
              <span>• Not financial advice</span>
              <span>• Decision-support tool only</span>
              <span>• Predictions may be wrong</span>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-3">
            ClawCast synthesizes publicly available information. Always verify with primary sources before making decisions.
          </p>
        </div>
      </footer>
    );
  }
);

DisclaimerFooter.displayName = "DisclaimerFooter";
