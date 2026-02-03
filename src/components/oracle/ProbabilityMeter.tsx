import { cn } from "@/lib/utils";

interface ProbabilityMeterProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ProbabilityMeter({ 
  value, 
  size = "md", 
  showLabel = true,
  className 
}: ProbabilityMeterProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  const getColor = () => {
    if (clampedValue >= 70) return "bg-primary";
    if (clampedValue >= 40) return "bg-secondary";
    return "bg-orange-500";
  };

  const getGlow = () => {
    if (clampedValue >= 70) return "shadow-[0_0_10px_hsl(180,100%,50%,0.5)]";
    if (clampedValue >= 40) return "shadow-[0_0_10px_hsl(270,80%,60%,0.5)]";
    return "shadow-[0_0_10px_hsl(30,100%,50%,0.5)]";
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground font-medium">Probability</span>
          <span className={cn(
            "text-sm font-bold",
            clampedValue >= 70 ? "text-primary glow-text-cyan" : 
            clampedValue >= 40 ? "text-secondary glow-text-purple" : "text-orange-400"
          )}>
            {clampedValue}%
          </span>
        </div>
      )}
      <div className={cn(
        "w-full bg-muted/50 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            getColor(),
            getGlow()
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
