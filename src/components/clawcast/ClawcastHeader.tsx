import { Sparkles, Menu, PanelLeftClose, PanelLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chatStore";
import { useIsMobile } from "@/hooks/use-mobile";

export function ClawcastHeader() {
  const { sidebarOpen, toggleSidebar, createThread, activeThreadId, getActiveThread } =
    useChatStore();
  const isMobile = useIsMobile();
  const activeThread = getActiveThread();

  return (
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="px-3 md:px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Sidebar toggle + Logo */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
            >
              {isMobile ? (
                <Menu className="h-4 w-4" />
              ) : sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>

            <a href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <span className="text-xl">🦞</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground tracking-tight leading-tight">
                  CLAWCAST
                </h1>
              </div>
            </a>
          </div>

          {/* Center: Thread title */}
          {activeThread && (
            <div className="flex-1 min-w-0 mx-4 hidden md:block">
              <p className="text-sm text-muted-foreground truncate text-center">
                {activeThread.title}
              </p>
            </div>
          )}

          {/* Right: New Chat + badge */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => createThread()}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New</span>
            </Button>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
