import { Flame, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Prediction } from "./PredictionCard";
import { cn } from "@/lib/utils";

interface TrendingEventsProps {
  events: Prediction[];
  onSelect: (event: Prediction) => void;
}

export function TrendingEvents({ events, onSelect }: TrendingEventsProps) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-400" />
        <h3 className="font-semibold text-foreground">Trending Events</h3>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => onSelect(event)}
            className={cn(
              "flex-shrink-0 w-64 p-4 rounded-lg text-left transition-all",
              "bg-card/50 border border-border/30",
              "hover:border-primary/50 hover:bg-card/80 group"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </Badge>
              <span className={cn(
                "text-sm font-bold",
                event.probability >= 70 ? "text-primary" : 
                event.probability >= 40 ? "text-secondary" : "text-orange-400"
              )}>
                {event.probability}%
              </span>
            </div>
            <p className="text-sm font-medium text-foreground line-clamp-2 mb-2">
              {event.title}
            </p>
            <div className="flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Analyze <ArrowRight className="h-3 w-3 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
