import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about any future event..."
          className="min-h-[120px] pr-24 text-lg bg-card/50 border-border/50 focus:border-primary/50 resize-none placeholder:text-muted-foreground/60"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute bottom-4 right-4 gap-2"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-3 text-center">
        Examples: "Will the Fed cut rates in March 2026?" • "Ethereum ETF approval likelihood"
      </p>
    </form>
  );
}
