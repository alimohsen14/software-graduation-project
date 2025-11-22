import React from "react";

interface AIMessageBubbleProps {
  message: string;
  sender: "user" | "ai";
}

// ...existing code...
export default function AIMessageBubble({
  message,
  sender,
}: AIMessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      dir="rtl"
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md 
        ${
          isUser
            ? "bg-[#587f63] text-white rounded-br-none"
            : "bg-[#f7f5e8] text-[#1f2f25] rounded-bl-none"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
