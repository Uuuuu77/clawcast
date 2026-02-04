import { TrendingUp, AlertCircle } from "lucide-react";

interface KeyDriversProps {
  drivers: string[];
  changeFactors?: string[];
}

export function KeyDrivers({ drivers, changeFactors }: KeyDriversProps) {
  return (
    <div className="space-y-6">
      {/* Key Drivers */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Key Drivers
        </h3>
        <ul className="space-y-2">
          {drivers.map((driver, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-foreground/90"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{driver}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What Could Change This */}
      {changeFactors && changeFactors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            What Could Change This
          </h3>
          <ul className="space-y-2">
            {changeFactors.map((factor, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <span className="text-yellow-400 mt-1">⚠️</span>
                <span className="leading-relaxed">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
