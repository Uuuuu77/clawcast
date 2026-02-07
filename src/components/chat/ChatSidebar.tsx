import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore, ChatThread } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { DisclaimerFooter } from "@/components/clawcast/DisclaimerFooter";

export function ChatSidebar() {
  const {
    threads,
    activeThreadId,
    sidebarOpen,
    createThread,
    deleteThread,
    setActiveThread,
    setSidebarOpen,
  } = useChatStore();
  const isMobile = useIsMobile();

  const handleNewChat = () => {
    createThread();
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectThread = (id: string) => {
    setActiveThread(id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteThread(id);
  };

  const handleGoHome = () => {
    setActiveThread(null);
    if (isMobile) setSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 bg-card/95 backdrop-blur-sm border-r border-border/30">
      {/* Header */}
      <div className="p-3 border-b border-border/30 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewChat}
          className="gap-2 flex-1"
        >
          <Plus className="h-4 w-4" />
          New Analysis
        </Button>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="ml-2 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Home / Landing */}
        <button
          onClick={handleGoHome}
          className={cn(
            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
            activeThreadId === null
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <span className="text-base">🦞</span>
          <span className="font-medium">Home</span>
        </button>

        {threads.length > 0 && (
          <div className="pt-2">
            <span className="text-xs text-muted-foreground/60 px-3 uppercase tracking-wider">
              History
            </span>
          </div>
        )}

        <AnimatePresence>
          {threads.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              isActive={thread.id === activeThreadId}
              onSelect={() => handleSelectThread(thread.id)}
              onDelete={(e) => handleDelete(e, thread.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Disclaimer at bottom */}
      <div className="p-3 border-t border-border/30">
        <DisclaimerFooter compact />
      </div>
    </div>
  );

  // Mobile: overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: always visible when open
  if (!sidebarOpen) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 256, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="shrink-0 overflow-hidden"
    >
      {sidebarContent}
    </motion.div>
  );
}

function ThreadItem({
  thread,
  isActive,
  onSelect,
  onDelete,
}: {
  thread: ChatThread;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const timeAgo = getRelativeTime(thread.updatedAt);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={onSelect}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors group flex items-start gap-2",
        isActive
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-medium">{thread.title}</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{timeAgo}</p>
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive shrink-0"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </motion.button>
  );
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
