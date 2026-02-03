import { useState } from "react";
import { X, Search, Trash2, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryFilter, Category } from "./CategoryFilter";
import { ProbabilityMeter } from "./ProbabilityMeter";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  query: string;
  category: Exclude<Category, "all">;
  probability: number;
  analysis: string;
  createdAt: Date;
}

interface PredictionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function PredictionHistory({ 
  isOpen, 
  onClose, 
  history, 
  onDelete,
  onClear 
}: PredictionHistoryProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.query.toLowerCase().includes(search.toLowerCase()) ||
                         item.analysis.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const accuracyScore = history.length > 0 
    ? Math.round(history.reduce((acc, item) => acc + item.probability, 0) / history.length)
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={cn(
        "relative ml-auto w-full max-w-2xl h-full glass-strong flex flex-col",
        "animate-slide-in-right border-l border-border/50"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Prediction History</h2>
              <p className="text-xs text-muted-foreground">
                {history.length} predictions • Avg confidence: {accuracyScore}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive"
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-4 space-y-3 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search predictions..."
              className="pl-9 bg-muted/30 border-border/50"
            />
          </div>
          <CategoryFilter selected={categoryFilter} onSelect={setCategoryFilter} />
        </div>

        {/* History List */}
        <ScrollArea className="flex-1 p-4">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {history.length === 0 ? "No predictions yet" : "No matches found"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {history.length === 0 
                  ? "Start asking the Oracle about upcoming events!" 
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-card/50 border border-border/30 rounded-lg p-4 group hover:border-border/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">{item.query}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.createdAt.toLocaleDateString()} • {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <ProbabilityMeter value={item.probability} size="sm" />
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {item.analysis}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
