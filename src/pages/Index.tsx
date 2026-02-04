import { useState } from "react";
import { ClawcastHeader } from "@/components/clawcast/ClawcastHeader";
import { QueryInput } from "@/components/clawcast/QueryInput";
import { ResultCard, AnalysisResult } from "@/components/clawcast/ResultCard";
import { LoadingAnimation } from "@/components/clawcast/LoadingAnimation";
import { DisclaimerFooter } from "@/components/clawcast/DisclaimerFooter";
import { useClawcastAnalysis } from "@/hooks/useClawcastAnalysis";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { analyze, isLoading, loadingStep } = useClawcastAnalysis();
  const { toast } = useToast();

  const handleAnalyze = async (query: string) => {
    try {
      const analysisResult = await analyze(query);
      setResult(analysisResult);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to analyze. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewQuery = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ClawcastHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingAnimation currentStep={loadingStep} />
          </div>
        )}

        {/* Result State */}
        {!isLoading && result && (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={handleNewQuery}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              New Analysis
            </Button>
            <ResultCard result={result} />
          </div>
        )}

        {/* Initial State - Landing */}
        {!isLoading && !result && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm">
                <Sparkles className="h-4 w-4" />
                Evidence-Based Intelligence
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-primary">See the evidence.</span>
                <br />
                <span className="text-foreground">Make better decisions.</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Ask about any future event. ClawCast gathers evidence from multiple sources 
                and shows you exactly what it found—no hidden reasoning, no fake confidence.
              </p>
            </div>

            {/* Query Input */}
            <QueryInput onSubmit={handleAnalyze} isLoading={isLoading} />

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mt-8">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Cites every source</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Shows uncertainty</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>No hidden logic</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <DisclaimerFooter />
    </div>
  );
};

export default Index;
