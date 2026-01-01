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
      style={{ background: "#3e6347" }}
      className="min-h-screen text-white relative rounded-2xl md:ml-[190px]"
    >
      <AISidebar
        isOpen={isAISidebarOpen}
        toggle={toggleAISidebar || (() => { })}
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChatLogic}
      />

      <main className="mx-auto max-w-[900px] px-4 py-8 pb-32">
        {messages.length === 0 && (
          <AIWelcomeBox userName={user.name} />
        )}

        {messages.map((m) => (
          <AIMessageBubble
            key={m.id}
            message={m.text}
            sender={m.role === "user" ? "user" : "ai"}
          />
        ))}
      </main>

      <div className="md:pr-[190px]">
        {messages.length === 0 && (
          <AISuggestions onSelect={performSend} />
        )}

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
