import { cn } from "@/lib/utils";
import { 
  Trophy, 
  Bitcoin, 
  Vote, 
  Cpu, 
  TrendingUp, 
  Palette, 
  Music,
  Sparkles
} from "lucide-react";

export type Category = "all" | "sports" | "crypto" | "politics" | "tech" | "finance" | "culture" | "music";

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

const categories: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
  { id: "politics", label: "Politics", icon: Vote },
  { id: "tech", label: "Tech/AI", icon: Cpu },
  { id: "finance", label: "Finance", icon: TrendingUp },
  { id: "culture", label: "Culture", icon: Palette },
  { id: "music", label: "Music", icon: Music },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selected === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "border",
              isSelected
                ? "bg-primary/20 border-primary text-primary glow-cyan"
                : "bg-card/50 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
