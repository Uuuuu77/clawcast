import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProbabilityMeter } from "./ProbabilityMeter";
import { Category } from "./CategoryFilter";
import { cn } from "@/lib/utils";
import { 
  Trophy, Bitcoin, Vote, Cpu, TrendingUp, Palette, Music, 
  Calendar, ArrowRight 
} from "lucide-react";

export interface Prediction {
  id: string;
  title: string;
  category: Exclude<Category, "all">;
  probability: number;
  eventDate: string;
  summary: string;
  keyFactors?: string[];
}

interface PredictionCardProps {
  prediction: Prediction;
  onClick?: () => void;
}

const categoryIcons: Record<Exclude<Category, "all">, React.ComponentType<{ className?: string }>> = {
  sports: Trophy,
  crypto: Bitcoin,
  politics: Vote,
  tech: Cpu,
  finance: TrendingUp,
  culture: Palette,
  music: Music,
};

const categoryColors: Record<Exclude<Category, "all">, string> = {
  sports: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  crypto: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  politics: "bg-red-500/20 text-red-400 border-red-500/30",
  tech: "bg-primary/20 text-primary border-primary/30",
  finance: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  culture: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  music: "bg-secondary/20 text-secondary border-secondary/30",
};

export function PredictionCard({ prediction, onClick }: PredictionCardProps) {
  const Icon = categoryIcons[prediction.category];

  return (
    <Card 
      className={cn(
        "glass cursor-pointer group transition-all duration-300",
        "hover:border-primary/50 hover:glow-cyan"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn("border", categoryColors[prediction.category])}
            >
              <Icon className="h-3 w-3 mr-1" />
              {prediction.category.charAt(0).toUpperCase() + prediction.category.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {prediction.eventDate}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mt-2 line-clamp-2 group-hover:text-primary transition-colors">
          {prediction.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {prediction.summary}
        </p>
        
        <ProbabilityMeter value={prediction.probability} />
        
        <div className="flex items-center justify-end text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View Analysis <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}
