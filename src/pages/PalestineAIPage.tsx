/* eslint-disable */
import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AISidebar from "../components/ai/AISidebar";
import AIWelcomeBox from "../components/ai/AIWelcomeBox";
import AISuggestions from "../components/ai/AISuggestions";
import AIChatInput from "../components/ai/AIChatInput";
import AIMessageBubble from "../components/ai/AIMessageBubble";

// ✅ استوردنا deleteChat
import {
  askAI,
  getChats,
  getChatMessages,
  deleteChat,
} from "../services/aiService";
import { getToken, getProfile } from "../services/authService";

// ... (نفس الأنواع Types) ...
type Message = {
  id: string;
  text: string;
  role: "user" | "assistant";
  createdAt: number;
};
type Chat = { id: number; title: string; createdAt: string };

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const token = getToken();

  // ... (نفس الـ useEffect القديم لجلب الداتا) ...
  useEffect(() => {
    if (setIsSidebarOpen) setIsSidebarOpen(false);
    async function loadData() {
      if (!token) return;
      try {
        const chatsData: Chat[] = await getChats(token);
        setChats(chatsData.reverse());
        const profileRes = await getProfile(token);
        if (profileRes.data?.user) setUserName(profileRes.data.user.name);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    }
    loadData();
  }, [setIsSidebarOpen, token]);

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setInput("");
  };

  // ✅ دالة الحذف المنطقية
  async function handleDeleteChatLogic(chatId: number) {
    if (!token) return;

    // 1. حذف بصري فوري (Optimistic Update) عشان السرعة
    setChats((prev) => prev.filter((c) => c.id !== chatId));

    // 2. إذا كان المستخدم فاتح الشات اللي انحذف، نرجعه للبداية
    if (activeChatId === chatId) {
      handleNewChat();
    }

    // 3. الاتصال بالسيرفر للحذف الفعلي
    try {
      await deleteChat(chatId, token);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      // ممكن هون ترجع الشات لو فشلت العملية (اختياري)
      alert("حدث خطأ أثناء الحذف");
    }
  }

  // ... (نفس دوال performSend و handleSendClick) ...
  async function performSend(textToSend: string) {
    if (!textToSend.trim() || !token) return;
    const userMsg: Message = {
      id: String(Date.now()),
      text: textToSend,
      role: "user",
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await askAI(textToSend, "ar", token, activeChatId);
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        text: res.answer,
        role: "assistant",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (!activeChatId) {
        setActiveChatId(res.chatId);
        const newChat: Chat = {
          id: res.chatId,
          title: res.title,
          createdAt: new Date().toISOString(),
        };
        setChats((prev) => [newChat, ...prev]);
      }
    } catch (error) {
      console.error("AI error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSendClick = () => {
    performSend(input);
    setInput("");
  };
  const handleSuggestionSelect = (text: string) => performSend(text);

  // ... (نفس دالة handleSelectChat) ...
  async function handleSelectChat(chatId: number) {
    if (!token) return;
    setActiveChatId(chatId);
    setIsLoading(true);
    try {
      const data = await getChatMessages(chatId, token);
      const formatted: Message[] = data.map((m: any) => ({
        id: String(m.id),
        text: m.content,
        role: m.role,
        createdAt: new Date(m.createdAt).getTime(),
      }));
      setMessages(formatted);
      if (window.innerWidth < 768 && toggleAISidebar) toggleAISidebar();
    } catch (error) {
      console.error("Error loading chat messages:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      style={{ background: "#3e6347" }}
      className="min-h-screen text-white relative rounded-2xl md:ml-[190px]"
    >
      <AISidebar
        isOpen={isAISidebarOpen}
        toggle={toggleAISidebar || (() => {})}
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChatLogic} // ✅ مررنا دالة الحذف
      />

      <main className="mx-auto max-w-[900px] px-4 py-8 pb-32">
        {messages.length === 0 && <AIWelcomeBox userName={userName} />}

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
          <AISuggestions onSelect={handleSuggestionSelect} />
        )}
        <AIChatInput
          value={input}
          onChange={setInput}
          onSend={handleSendClick}
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
