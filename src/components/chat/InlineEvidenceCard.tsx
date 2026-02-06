import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceItem } from "@/components/clawcast/EvidencePanel";
import { EvidencePanel } from "@/components/clawcast/EvidencePanel";

interface InlineEvidenceCardProps {
  evidence: EvidenceItem[];
  marketOdds?: {
    platform: string;
    odds: string;
    url?: string;
  }[];
}

export function InlineEvidenceCard({ evidence, marketOdds }: InlineEvidenceCardProps) {
  const [expanded, setExpanded] = useState(false);

  const typeCounts = evidence.reduce(
    (acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="mt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="gap-2 text-muted-foreground hover:text-foreground w-full justify-between px-3"
      >
        <div className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">Evidence Sources</span>
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {evidence.length}
          </Badge>
          <div className="hidden sm:flex items-center gap-1">
            {Object.entries(typeCounts).map(([type, count]) => (
              <span
                key={type}
                className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground"
              >
                {type} {count}
              </span>
            ))}
          </div>
        </div>
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </Button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2">
              <EvidencePanel evidence={evidence} marketOdds={marketOdds} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
