import { cn } from "@/lib/utils";
import { Eye, User } from "lucide-react";
import { ProbabilityMeter } from "./ProbabilityMeter";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  probability?: number;
  keyFactors?: string[];
  sources?: string[];
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isAssistant ? "items-start" : "items-start flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isAssistant
            ? "bg-gradient-to-br from-primary to-secondary"
            : "bg-muted"
        )}
      >
        {isAssistant ? (
          <Eye className="h-4 w-4 text-primary-foreground" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex-1 max-w-[85%] space-y-3",
          isAssistant ? "" : "text-right"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-3 inline-block text-left",
            isAssistant
              ? "bg-card border border-border/50"
              : "bg-primary/20 border border-primary/30"
          )}
        >
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Probability meter for predictions */}
        {isAssistant && message.probability !== undefined && (
          <div className="bg-card/50 border border-border/30 rounded-lg p-3 max-w-sm">
            <ProbabilityMeter value={message.probability} size="md" />
          </div>
        )}

        {/* Key factors */}
        {isAssistant && message.keyFactors && message.keyFactors.length > 0 && (
          <div className="bg-card/50 border border-border/30 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Key Factors
            </p>
            <ul className="space-y-1">
              {message.keyFactors.map((factor, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources */}
        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.sources.map((source, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground"
              >
                {source}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground/60">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
