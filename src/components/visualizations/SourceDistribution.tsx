import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { EvidenceItem } from "@/components/clawcast/EvidencePanel";

interface SourceDistributionProps {
  evidence: EvidenceItem[];
}

const TYPE_COLORS: Record<string, string> = {
  news: "hsl(210, 100%, 60%)",
  market: "hsl(160, 100%, 45%)",
  prediction: "hsl(280, 80%, 60%)",
  analysis: "hsl(35, 100%, 55%)",
};

const TYPE_LABELS: Record<string, string> = {
  news: "News",
  market: "Market",
  prediction: "Prediction",
  analysis: "Analysis",
};

export function SourceDistribution({ evidence }: SourceDistributionProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    evidence.forEach((e) => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      type: TYPE_LABELS[type] || type,
      count,
      color: TYPE_COLORS[type] || "hsl(var(--muted-foreground))",
    }));
  }, [evidence]);

  if (data.length === 0) return null;

  return (
    <div className="pt-2">
      <p className="text-xs text-muted-foreground mb-2">Source Distribution</p>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="type"
              width={70}
              tick={{ fontSize: 11, fill: "hsl(180, 20%, 60%)" }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
