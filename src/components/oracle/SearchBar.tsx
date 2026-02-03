import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, isLoading, placeholder = "Ask about any upcoming event..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative group">
        {/* Glow effect behind input */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center gap-2 bg-card border border-border/50 rounded-xl p-2 group-focus-within:border-primary/50 transition-colors">
          <Search className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(
              "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
              "hover:opacity-90 transition-all px-4 flex-shrink-0"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Predict
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Example queries */}
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          "Will Bitcoin reach $150K this year?",
          "Who will win the next Super Bowl?",
          "Will AI replace programmers by 2030?",
        ].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setQuery(example);
              onSearch(example);
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}
