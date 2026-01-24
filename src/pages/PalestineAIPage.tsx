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
import { useTranslation } from "react-i18next";

// ===== Types =====
type AIMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
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
  const { user } = useAuth();
  const { i18n, t } = useTranslation();
  const direction = i18n.dir();

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  // Global overflow control for AI page
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

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

    const userMsg: AIMessage = {
      id: String(Date.now()),
      text,
      role: "user",
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const lang = i18n.language.startsWith("en") ? "en" : "ar";
      const res = await askAI(text, lang, activeChatId);

      const aiMsg: AIMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: res.answer,
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
      const errorMsg: AIMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: "حدث خطأ، حاول مرة أخرى 🍉",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
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

      if (window.innerWidth < 1024 && toggleAISidebar) toggleAISidebar();
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!user) return null;

  return (
    <div dir={direction} className="flex h-screen overflow-hidden bg-transparent">
      {/* Sidebar - Can overlay above chat area */}
      <AISidebar
        isOpen={isAISidebarOpen}
        toggle={toggleAISidebar || (() => { })}
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChatLogic}
      />

      {/* Main Chat Area - Flex column with internal scrolling */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Hamburger Button - Mobile/Tablet Only */}
        <button
          onClick={toggleAISidebar}
          className={`lg:hidden fixed top-20 md:top-24 z-30 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 hover:text-white hover:bg-white/20 transition-all shadow-2xl active:scale-95
            ${direction === "rtl" ? "left-6" : "right-6"}
          `}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Scrollable Messages Container - ONLY this scrolls */}
        <div className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth">
          <div className="max-w-[760px] w-full mx-auto px-4 pt-20 md:pt-24 pb-6">
            {messages.length === 0 ? (
              // Welcome State
              <div className="space-y-8 py-10">
                <div className="animate-in fade-in zoom-in duration-700">
                  <AIWelcomeBox userName={user?.name} />
                </div>

                <div className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
                  <AISuggestions onSelect={performSend} />
                </div>
              </div>
            ) : (
              // Messages
              <div className="space-y-6">
                {messages.map((m) => (
                  <AIMessageBubble key={m.id} message={m} />
                ))}
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Sticky Input Bar - Glass design, stays at bottom of chat area */}
        <div className="sticky bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-xl border-t border-white/10">
          <div className="max-w-[760px] w-full mx-auto px-4 py-3">
            <div className="bg-black/35 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-lg overflow-hidden focus-within:border-emerald-500/30 transition-all">
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
            {/* Disclaimer */}
            <p className="text-[9px] text-white/10 text-center mt-2 uppercase tracking-[0.2em] font-bold">
              Palestine3D AI • v1.0 • 🍉
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PalestineAIPage() {
  const [isAiSidebarOpen, setAiSidebarOpen] = useState(true); // Start visible by default

  return (
    <DashboardLayout
      isFullWidth
      onToggleAISidebar={() => setAiSidebarOpen((prev) => !prev)}
    >
      <AIPageContent
        isAISidebarOpen={isAiSidebarOpen}
        toggleAISidebar={() => setAiSidebarOpen((prev) => !prev)}
      />
    </DashboardLayout>
  );
}
