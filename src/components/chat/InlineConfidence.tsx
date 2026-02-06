import { motion } from "framer-motion";
import { ConfidenceBadge, ConfidenceDescription, ConfidenceLevel } from "@/components/clawcast/ConfidenceBadge";

interface InlineConfidenceProps {
  level: ConfidenceLevel;
}

export function InlineConfidence({ level }: InlineConfidenceProps) {
  return (
    <motion.div
      className="flex flex-col items-start gap-1 py-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0px transparent",
            "0 0 20px hsl(var(--primary) / 0.3)",
            "0 0 0px transparent",
          ],
        }}
        transition={{ duration: 2, delay: 0.5 }}
        className="rounded-full"
      >
        <ConfidenceBadge level={level} size="md" />
      </motion.div>
      <ConfidenceDescription level={level} />
    </motion.div>
  );
}
