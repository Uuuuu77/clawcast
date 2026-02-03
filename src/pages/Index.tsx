import { useState } from "react";
import { OracleHeader } from "@/components/oracle/OracleHeader";
import { SearchBar } from "@/components/oracle/SearchBar";
import { CategoryFilter, Category } from "@/components/oracle/CategoryFilter";
import { PredictionCard, Prediction } from "@/components/oracle/PredictionCard";
import { TrendingEvents } from "@/components/oracle/TrendingEvents";
import { OracleChat } from "@/components/oracle/OracleChat";
import { PredictionHistory } from "@/components/oracle/PredictionHistory";
import { usePrediction } from "@/hooks/usePrediction";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

// Sample trending predictions
const sampleTrending: Prediction[] = [
  {
    id: "1",
    title: "Will Bitcoin surpass $100,000 by end of 2026?",
    category: "crypto",
    probability: 72,
    eventDate: "Dec 2026",
    summary: "Based on current market trends, institutional adoption, and halving effects.",
  },
  {
    id: "2", 
    title: "Kansas City Chiefs to win Super Bowl LX",
    category: "sports",
    probability: 28,
    eventDate: "Feb 2026",
    summary: "Dynasty potential, but increased competition from rising NFC contenders.",
  },
  {
    id: "3",
    title: "AGI achieved by major tech company by 2030",
    category: "tech",
    probability: 35,
    eventDate: "2030",
    summary: "Rapid AI progress, but fundamental challenges remain in general reasoning.",
  },
  {
    id: "4",
    title: "Taylor Swift wins Grammy for Album of Year 2026",
    category: "music",
    probability: 45,
    eventDate: "Feb 2026",
    summary: "Strong catalog, but competition from emerging artists is fierce.",
  },
];

interface HistoryItem {
  id: string;
  query: string;
  category: Exclude<Category, "all">;
  probability: number;
  analysis: string;
  createdAt: Date;
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState<string | undefined>();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { predict, isLoading } = usePrediction();
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    try {
      const result = await predict(query);
      
      // Create a new prediction card
      const newPrediction: Prediction = {
        id: crypto.randomUUID(),
        title: query,
        category: result.category,
        probability: result.probability,
        eventDate: "Analyzed now",
        summary: result.analysis.slice(0, 150) + "...",
        keyFactors: result.keyFactors,
      };
      
      setPredictions((prev) => [newPrediction, ...prev]);

      // Add to history
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        query,
        category: result.category,
        probability: result.probability,
        analysis: result.analysis,
        createdAt: new Date(),
      };
      setHistory((prev) => [historyItem, ...prev]);

      toast({
        title: "Prediction Complete",
        description: `${result.probability}% probability analyzed`,
      });
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Unable to analyze. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTrendingSelect = (event: Prediction) => {
    setChatQuery(event.title);
    setChatOpen(true);
  };

  const handleCardClick = (prediction: Prediction) => {
    setChatQuery(prediction.title);
    setChatOpen(true);
  };

  const filteredPredictions = selectedCategory === "all" 
    ? predictions 
    : predictions.filter(p => p.category === selectedCategory);

  const filteredTrending = selectedCategory === "all"
    ? sampleTrending
    : sampleTrending.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <OracleHeader 
        onOpenChat={() => { setChatQuery(undefined); setChatOpen(true); }}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Predictions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-primary glow-text-cyan">See Tomorrow,</span>
            <br />
            <span className="text-foreground">Today</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask about any upcoming event in sports, crypto, politics, tech, finance, culture, or music. 
            Oracle AI analyzes data to give you probability-based predictions.
          </p>
        </section>

        {/* Search Bar */}
        <section className="max-w-2xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Category Filter */}
        <section className="flex justify-center">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg font-medium">Oracle is analyzing...</span>
            </div>
          </div>
        )}

        {/* Trending Events */}
        {!isLoading && filteredTrending.length > 0 && (
          <section>
            <TrendingEvents events={filteredTrending} onSelect={handleTrendingSelect} />
          </section>
        )}

        {/* User's Predictions */}
        {filteredPredictions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Your Predictions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPredictions.map((prediction) => (
                <PredictionCard 
                  key={prediction.id} 
                  prediction={prediction} 
                  onClick={() => handleCardClick(prediction)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!isLoading && predictions.length === 0 && (
          <section className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to see the future?
              </h3>
              <p className="text-muted-foreground">
                Ask about any upcoming event and Oracle AI will analyze the probability and key factors.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Chat Panel */}
      <OracleChat 
        isOpen={chatOpen} 
        onClose={() => { setChatOpen(false); setChatQuery(undefined); }}
        initialQuery={chatQuery}
      />

      {/* History Panel */}
      <PredictionHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onDelete={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
        onClear={() => setHistory([])}
      />
    </div>
  );
};

export default Index;
