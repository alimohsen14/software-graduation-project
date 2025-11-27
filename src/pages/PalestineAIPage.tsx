import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AISidebar from "../components/ai/AISidebar";
import AIWelcomeBox from "../components/ai/AIWelcomeBox";
import AISuggestions from "../components/ai/AISuggestions";
import AIChatInput from "../components/ai/AIChatInput";
import AIMessageBubble from "../components/ai/AIMessageBubble";

type Message = {
  id: string;
  text: string;
  role: "user" | "assistant";
  createdAt: number;
};

type AIPageProps = {
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  // استقبلنا البروبس الخاصة بالـ AI Sidebar
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

  // إغلاق القائمة الرئيسية عند التحميل (اختياري)
  useEffect(() => {
    if (setIsSidebarOpen) setIsSidebarOpen(false);
  }, [setIsSidebarOpen]);

  function handleSend() {
    if (!input.trim()) return;

    const msg: Message = {
      id: String(Date.now()),
      text: input,
      role: "user",
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => setIsLoading(false), 600);
  }

  function handleSuggestionSelect(text: string) {
    setInput(text);
    setTimeout(handleSend, 0);
  }

  return (
    <div
      dir="rtl"
      style={{ background: "#3e6347" }}
      className="min-h-screen text-white relative rounded-2xl md:ml-[190px] transition-all duration-300"
    >
      {/* 
         ملاحظة: ضفت md:ml-[190px] للـ container 
         عشان المحتوى ما ييجي تحت الـ Sidebar بالديسك توب
         لأن الـ Sidebar ماخد fixed
      */}

      {/* AI Sidebar */}
      <AISidebar
        isOpen={isAISidebarOpen}
        toggle={toggleAISidebar || (() => {})}
      />

      {/* Content */}
      <main className="mx-auto max-w-[900px] px-4 py-8 pb-32">
        {messages.length === 0 && <AIWelcomeBox />}

        {messages.map((m) => (
          <AIMessageBubble
            key={m.id}
            message={m.text}
            sender={m.role === "user" ? "user" : "ai"}
          />
        ))}
      </main>

      <div className=" md:pr-[190px]">
        {/*  Container for input area to respect sidebar on desktop */}
        <AISuggestions onSelect={handleSuggestionSelect} />

        <AIChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default function PalestineAIPage() {
  // هون عرفنا الستيت عشان نقدر نتحكم فيه من النافبار ومن السايدبار نفسه
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
