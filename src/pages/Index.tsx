import { useCallback } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useClawcastAnalysis } from "@/hooks/useClawcastAnalysis";
import { useToast } from "@/hooks/use-toast";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageInput } from "@/components/chat/MessageInput";
import { ClawcastHeader } from "@/components/clawcast/ClawcastHeader";
import { AnimatePresence } from "framer-motion";

const Index = () => {
  const {
    activeThreadId,
    sidebarOpen,
    createThread,
    addMessage,
    updateMessage,
    getActiveThread,
  } = useChatStore();
  const { analyze, isLoading, loadingStep } = useClawcastAnalysis();
  const { toast } = useToast();

  const activeThread = getActiveThread();
  const messages = activeThread?.messages ?? [];

  const handleSubmit = useCallback(
    async (query: string) => {
      // Create thread if needed
      let threadId = activeThreadId;
      if (!threadId) {
        threadId = createThread();
      }

      // Add user message
      addMessage(threadId, {
        role: "user",
        content: query,
        timestamp: new Date().toISOString(),
      });

      // Add loading assistant message
      const loadingMsgId = addMessage(threadId, {
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isLoading: true,
      });

      try {
        const result = await analyze(query);
        updateMessage(threadId, loadingMsgId, {
          isLoading: false,
          content: result.eventSummary,
          analysisResult: result,
        });
      } catch (error) {
        // Remove loading message on error
        updateMessage(threadId, loadingMsgId, {
          isLoading: false,
          content:
            error instanceof Error
              ? error.message
              : "Analysis failed. Please try again.",
        });
        toast({
          title: "Analysis Failed",
          description:
            error instanceof Error
              ? error.message
              : "Unable to analyze. Please try again.",
          variant: "destructive",
        });
      }
    },
    [activeThreadId, createThread, addMessage, updateMessage, analyze, toast]
  );

  const handleRetry = useCallback(async () => {
    if (!activeThread || activeThread.messages.length === 0) return;
    // Find the last user message
    const lastUserMsg = [...activeThread.messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMsg) {
      handleSubmit(lastUserMsg.content);
    }
  }, [activeThread, handleSubmit]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ClawcastHeader />

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          <ChatSidebar />
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0">
          <ChatContainer
            messages={messages}
            loadingStep={loadingStep}
            onRetry={handleRetry}
          />
          <MessageInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            hasMessages={messages.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
