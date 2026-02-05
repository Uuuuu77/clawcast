import { useState, useCallback, useRef } from "react";
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

// Map error messages to user-friendly versions
function getUserFriendlyError(message: string): string {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('service temporarily unavailable') || lowerMsg.includes('configured')) {
    return 'Our analysis service is temporarily unavailable. Please try again in a moment.';
  }
  if (lowerMsg.includes('too many requests') || lowerMsg.includes('rate limit')) {
    return 'Too many requests. Please wait a moment before trying again.';
  }
  if (lowerMsg.includes('timed out') || lowerMsg.includes('timeout')) {
    return 'This query is taking longer than expected. Please try again.';
  }
  if (lowerMsg.includes('service capacity') || lowerMsg.includes('usage limit')) {
    return 'Our service is at capacity. Please try again later.';
  }
  if (lowerMsg.includes('network') || lowerMsg.includes('fetch')) {
    return 'Unable to connect. Please check your internet connection.';
  }
  if (lowerMsg.includes('must be at least') || lowerMsg.includes('must not exceed')) {
    return message; // Pass through validation errors directly
  }
  
  return 'Analysis request failed. Please try again.';
}

export function useClawcastAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const lastQueryRef = useRef<string | null>(null);

  const analyze = useCallback(async (query: string): Promise<AnalysisResult> => {
    setIsLoading(true);
    setError(null);
    setLoadingStep(0);
    lastQueryRef.current = query;

    try {
      // Simulate step progression for UX (improved timing)
      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => Math.min(prev + 1, 3));
      }, 3000); // Slower progression for more realistic feel

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
      const rawMessage = err instanceof Error ? err.message : "Failed to analyze query";
      const friendlyMessage = getUserFriendlyError(rawMessage);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(async (): Promise<AnalysisResult | null> => {
    if (!lastQueryRef.current) return null;
    return analyze(lastQueryRef.current);
  }, [analyze]);

  const getLastQuery = useCallback(() => lastQueryRef.current, []);

  return { analyze, retry, getLastQuery, isLoading, error, loadingStep };
}
