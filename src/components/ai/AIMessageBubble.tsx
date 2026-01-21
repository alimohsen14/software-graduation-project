import React from "react";
import { useTranslation } from "react-i18next";

// Define the precise types matching the new backend structure
type AIMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: number;
};

interface AIMessageBubbleProps {
  message: AIMessage;
}

// Main Component
export default function AIMessageBubble({ message }: AIMessageBubbleProps) {
  const { i18n } = useTranslation();
  const isUser = message.role === "user";

  return (
    <div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div
        className={`max-w-[88%] sm:max-w-[75%] px-4 md:px-5 py-3 md:py-4 rounded-2xl text-sm leading-relaxed backdrop-blur-sm transition-all
        ${isUser
            ? "bg-emerald-500/10 text-white/90 border border-emerald-500/20 rounded-br-md shadow-sm"
            : "bg-indigo-500/10 text-white/80 border border-indigo-500/20 rounded-bl-md shadow-sm w-full md:w-auto"
          }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
}
