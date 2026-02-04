import { ConfidenceBadge, ConfidenceDescription, ConfidenceLevel } from "./ConfidenceBadge";
import { KeyDrivers } from "./KeyDrivers";
import { EvidencePanel, EvidenceItem } from "./EvidencePanel";
import { Calendar, Target } from "lucide-react";

export interface AnalysisResult {
  query: string;
  eventSummary: string;
  confidence: ConfidenceLevel;
  keyDrivers: string[];
  changeFactors: string[];
  evidence: EvidenceItem[];
  marketOdds?: {
    platform: string;
    odds: string;
    url?: string;
  }[];
  timestamp: string;
}

interface ResultCardProps {
  result: AnalysisResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Event Summary Card */}
      <div className="p-6 rounded-xl bg-card/50 border border-border/50 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Event Analysis</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {result.eventSummary}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
            <Calendar className="h-4 w-4" />
            <span>{result.timestamp}</span>
          </div>
        </div>

        {/* Confidence Badge - Prominent */}
        <div className="flex flex-col items-center py-6 space-y-2 border-y border-border/30">
          <ConfidenceBadge level={result.confidence} size="lg" />
          <ConfidenceDescription level={result.confidence} />
        </div>

        {/* Key Drivers */}
        <KeyDrivers 
          drivers={result.keyDrivers} 
          changeFactors={result.changeFactors} 
        />
      </div>

      {/* Evidence Panel */}
      <EvidencePanel 
        evidence={result.evidence} 
        marketOdds={result.marketOdds} 
      />
    </div>
  );
}
