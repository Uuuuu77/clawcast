import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/components/oracle/CategoryFilter";

export interface PredictionResult {
  analysis: string;
  probability: number;
  keyFactors: string[];
  sources: string[];
  category: Exclude<Category, "all">;
}

export function usePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (query: string): Promise<PredictionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('oracle-predict', {
        body: { query }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      return data as PredictionResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get prediction";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { predict, isLoading, error };
}
