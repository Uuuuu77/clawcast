import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export function MessageInput({ onSubmit, isLoading, hasMessages }: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border/30 bg-background/95 backdrop-blur-sm p-3 md:p-4">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasMessages
              ? "Ask a follow-up question..."
              : "Ask about any future event..."
          }
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 disabled:opacity-50 min-h-[44px]"
        />
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          size="icon"
          className="h-11 w-11 rounded-xl shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2 hidden md:block">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
