/* eslint-disable */
import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AISidebar from "../components/ai/AISidebar";
import AIWelcomeBox from "../components/ai/AIWelcomeBox";
import AISuggestions from "../components/ai/AISuggestions";
import AIChatInput from "../components/ai/AIChatInput";
import AIMessageBubble from "../components/ai/AIMessageBubble";

import {
  askAI,
  getChats,
  getChatMessages,
  deleteChat,
} from "../services/aiService";

import { useAuth } from "../context/AuthContext";

// ===== Types =====
type Message = {
  id: string;
  text: string;
  role: "user" | "assistant";
  createdAt: number;
};

type Chat = {
  id: number;
  title: string;
  createdAt: string;
};

type AIPageProps = {
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isAISidebarOpen?: boolean;
  toggleAISidebar?: () => void;
};

function AIPageContent({
  setIsSidebarOpen,
  isAISidebarOpen = false,
  toggleAISidebar,
}: AIPageProps) {
  const { user, refreshUser } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  useEffect(() => {
    if (setIsSidebarOpen) setIsSidebarOpen(false);

    getChats()
      .then((data) => setChats(data.reverse()))
      .catch(() => { });
  }, [setIsSidebarOpen]);

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setInput("");
  };

  async function handleDeleteChatLogic(chatId: number) {
    setChats((prev) => prev.filter((c) => c.id !== chatId));

    if (activeChatId === chatId) handleNewChat();

    try {
      await deleteChat(chatId);
    } catch { }
  }

  async function performSend(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      text,
      role: "user",
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await askAI(text, "ar", activeChatId);

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        text: res.answer,
        role: "assistant",
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (!activeChatId) {
        setActiveChatId(res.chatId);
        setChats((prev) => [
          {
            id: res.chatId,
            title: res.title,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectChat(chatId: number) {
    setActiveChatId(chatId);
    setIsLoading(true);

    try {
      const data = await getChatMessages(chatId);
      setMessages(
        data.map((m: any) => ({
          id: String(m.id),
          text: m.content,
          role: m.role,
          createdAt: new Date(m.createdAt).getTime(),
        }))
      );

      if (window.innerWidth < 768 && toggleAISidebar) toggleAISidebar();
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div
      dir="rtl"
      className="min-h-[calc(100vh-120px)] flex flex-col relative"
    >
      <AISidebar
        isOpen={isAISidebarOpen}
        toggle={toggleAISidebar || (() => { })}
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChatLogic}
      />

      <main className="flex-1 flex flex-col relative md:pr-[190px]">
        {/* Main Content Glass Container */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-3 md:px-8 py-5 md:py-10 pb-40 relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-full min-w-full">
            <div className="p-5 md:p-12 flex-1">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                  <AIWelcomeBox userName={user?.name} />
                </div>
              )}

              <div className="space-y-4 md:space-y-6">
                {messages.map((m) => (
                  <AIMessageBubble
                    key={m.id}
                    message={m.text}
                    sender={m.role === "user" ? "user" : "ai"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Interactions Overlay */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:pr-[190px]">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pb-6 md:pb-10">
            {messages.length === 0 && (
              <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
                <AISuggestions onSelect={performSend} />
              </div>
            )}

            <div className="relative">
              <AIChatInput
                value={input}
                onChange={setInput}
                onSend={() => {
                  performSend(input);
                  setInput("");
                }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PalestineAIPage() {
  const [isAiSidebarOpen, setAiSidebarOpen] = useState(false);

  return (
    <DashboardLayout
      onToggleAISidebar={() => setAiSidebarOpen((prev) => !prev)}
    >
      <AIPageContent
        isAISidebarOpen={isAiSidebarOpen}
        toggleAISidebar={() => setAiSidebarOpen((prev) => !prev)}
      />
    </DashboardLayout>
  );
}
