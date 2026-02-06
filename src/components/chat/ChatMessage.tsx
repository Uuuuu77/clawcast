import { motion } from "framer-motion";
import { User, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatMessage as ChatMessageType } from "@/stores/chatStore";
import { InlineConfidence } from "./InlineConfidence";
import { InlineEvidenceCard } from "./InlineEvidenceCard";
import { KeyDrivers } from "@/components/clawcast/KeyDrivers";
import { LoadingAnimation } from "@/components/clawcast/LoadingAnimation";
import { SourceDistribution } from "@/components/visualizations/SourceDistribution";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: ChatMessageType;
  loadingStep?: number;
  onRetry?: () => void;
}

export function ChatMessageBubble({ message, loadingStep = 0, onRetry }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    const text = message.analysisResult
      ? `${message.analysisResult.eventSummary}\n\nConfidence: ${message.analysisResult.confidence}\n\nKey Drivers:\n${message.analysisResult.keyDrivers.map((d, i) => `${i + 1}. ${d}`).join("\n")}`
      : message.content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
          <span className="text-lg">🦞</span>
        </div>
      )}

      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary/15 border border-primary/20 text-foreground"
            : "bg-card/60 border border-border/40 text-foreground"
        }`}
      >
        {/* Loading state */}
        {message.isLoading && (
          <div className="py-2">
            <LoadingAnimation currentStep={loadingStep} />
          </div>
        )}

        {/* User message */}
        {isUser && <p className="text-sm leading-relaxed">{message.content}</p>}

        {/* Assistant message with analysis */}
        {!isUser && !message.isLoading && message.analysisResult && (
          <div className="space-y-3">
            {/* Summary */}
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{message.analysisResult.eventSummary}</ReactMarkdown>
            </div>

            {/* Confidence */}
            <InlineConfidence level={message.analysisResult.confidence} />

            {/* Key Drivers */}
            <KeyDrivers
              drivers={message.analysisResult.keyDrivers}
              changeFactors={message.analysisResult.changeFactors}
            />

            {/* Source Distribution */}
            {message.analysisResult.evidence.length > 0 && (
              <SourceDistribution evidence={message.analysisResult.evidence} />
            )}

            {/* Evidence */}
            <InlineEvidenceCard
              evidence={message.analysisResult.evidence}
              marketOdds={message.analysisResult.marketOdds}
            />

            {/* Actions */}
            <div className="flex items-center gap-1 pt-2 border-t border-border/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 text-xs gap-1 text-muted-foreground"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              {onRetry && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRetry}
                  className="h-7 text-xs gap-1 text-muted-foreground"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </Button>
              )}
              <span className="ml-auto text-xs text-muted-foreground/60">
                {message.analysisResult.timestamp}
              </span>
            </div>
          </div>
        )}

        {/* Plain assistant text (fallback) */}
        {!isUser && !message.isLoading && !message.analysisResult && (
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center mt-1">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}
