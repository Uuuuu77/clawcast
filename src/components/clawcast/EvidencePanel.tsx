import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Clock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface EvidenceItem {
  id: string;
  source: string;
  url?: string;
  quote: string;
  timestamp: string;
  type: "news" | "market" | "prediction" | "analysis";
  relevanceScore?: number;
}

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  marketOdds?: {
    platform: string;
    odds: string;
    url?: string;
  }[];
}

const typeLabels = {
  news: { label: "News", className: "bg-blue-500/20 text-blue-400" },
  market: { label: "Market Data", className: "bg-green-500/20 text-green-400" },
  prediction: { label: "Prediction Market", className: "bg-purple-500/20 text-purple-400" },
  analysis: { label: "Analysis", className: "bg-orange-500/20 text-orange-400" },
};

export function EvidencePanel({ evidence, marketOdds }: EvidencePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-card/30">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between px-4 py-3 h-auto hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <span className="font-medium">Evidence Sources</span>
          <Badge variant="secondary" className="text-xs">
            {evidence.length} sources
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[600px]" : "max-h-0"
        )}
      >
        <div className="p-4 space-y-4 border-t border-border/30">
          {/* Prediction Market Odds Reference */}
          {marketOdds && marketOdds.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                📊 Market Reference (not a recommendation)
              </h4>
              <div className="flex flex-wrap gap-2">
                {marketOdds.map((market, idx) => (
                  <a
                    key={idx}
                    href={market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 text-sm hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{market.platform}:</span>
                    <span className="text-primary">{market.odds}</span>
                    {market.url && <ExternalLink className="h-3 w-3" />}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Items */}
          <div className="space-y-3">
            {evidence.map((item) => (
              <EvidenceCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({ item }: { item: EvidenceItem }) {
  const typeConfig = typeLabels[item.type];

  return (
    <div className="p-3 rounded-md bg-muted/30 border border-border/30 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn("text-xs", typeConfig.className)}>
            {typeConfig.label}
          </Badge>
          <span className="text-sm font-medium">{item.source}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Clock className="h-3 w-3" />
          {item.timestamp}
        </div>
      </div>
      
      <p className="text-sm text-foreground/80 leading-relaxed">
        "{item.quote}"
      </p>

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View source <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
