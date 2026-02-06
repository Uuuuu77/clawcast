import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ChatMessage } from "@/stores/chatStore";
import { ChatMessageBubble } from "./ChatMessage";

interface ChatContainerProps {
  messages: ChatMessage[];
  loadingStep: number;
  onRetry?: () => void;
}

export function ChatContainer({ messages, loadingStep, onRetry }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm">
            <Sparkles className="h-4 w-4" />
            Evidence-Based Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="text-primary">See the evidence.</span>
            <br />
            <span className="text-foreground">Make better decisions.</span>
          </h1>
          <p className="text-muted-foreground">
            Ask about any future event. ClawCast gathers evidence from multiple
            sources and shows you exactly what it found.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Cites every source</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Shows uncertainty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>No hidden logic</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            loadingStep={loadingStep}
            onRetry={
              !msg.isLoading && msg.role === "assistant" && idx === messages.length - 1
                ? onRetry
                : undefined
            }
          />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
