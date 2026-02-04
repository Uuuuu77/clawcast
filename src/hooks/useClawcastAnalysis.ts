import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConfidenceLevel } from "@/components/clawcast/ConfidenceBadge";
import { EvidenceItem } from "@/components/clawcast/EvidencePanel";
import { AnalysisResult } from "@/components/clawcast/ResultCard";

interface AnalysisResponse {
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
}

export function useClawcastAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const analyze = useCallback(async (query: string): Promise<AnalysisResult> => {
    setIsLoading(true);
    setError(null);
    setLoadingStep(0);

    try {
      // Simulate step progression for UX
      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => Math.min(prev + 1, 3));
      }, 2000);

      const { data, error: fnError } = await supabase.functions.invoke('clawcast-analyze', {
        body: { query }
      });

      clearInterval(stepInterval);
      setLoadingStep(3);

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const response = data as AnalysisResponse;

      return {
        query,
        eventSummary: response.eventSummary,
        confidence: response.confidence,
        keyDrivers: response.keyDrivers,
        changeFactors: response.changeFactors,
        evidence: response.evidence,
        marketOdds: response.marketOdds,
        timestamp: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze query";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyze, isLoading, error, loadingStep };
}
