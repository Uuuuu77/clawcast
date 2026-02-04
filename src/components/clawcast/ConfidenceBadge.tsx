import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const levelConfig = {
  HIGH: {
    icon: CheckCircle,
    label: "High Confidence",
    description: "Strong agreement across sources",
    className: "bg-green-500/10 text-green-400 border-green-500/30",
    iconClassName: "text-green-400",
    glowClassName: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
  },
  MEDIUM: {
    icon: HelpCircle,
    label: "Medium Confidence",
    description: "Mixed signals or limited data",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    iconClassName: "text-yellow-400",
    glowClassName: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
  },
  LOW: {
    icon: AlertTriangle,
    label: "Low Confidence",
    description: "High uncertainty or conflicting evidence",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
    iconClassName: "text-red-400",
    glowClassName: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
  },
};

const sizeConfig = {
  sm: {
    container: "px-3 py-1.5 text-sm",
    icon: "h-4 w-4",
  },
  md: {
    container: "px-4 py-2 text-base",
    icon: "h-5 w-5",
  },
  lg: {
    container: "px-6 py-3 text-lg",
    icon: "h-6 w-6",
  },
};

export function ConfidenceBadge({ 
  level, 
  size = "md", 
  showLabel = true 
}: ConfidenceBadgeProps) {
  const config = levelConfig[level];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold",
        config.className,
        config.glowClassName,
        sizes.container
      )}
    >
      <Icon className={cn(sizes.icon, config.iconClassName)} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

export function ConfidenceDescription({ level }: { level: ConfidenceLevel }) {
  const config = levelConfig[level];
  return (
    <p className="text-sm text-muted-foreground">{config.description}</p>
  );
}
