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
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}
      dir="rtl"
    >
      <div
        className={`max-w-[88%] sm:max-w-[75%] px-4 md:px-6 py-3 md:py-4 rounded-3xl md:rounded-[2rem] text-sm leading-relaxed shadow-xl backdrop-blur-md transition-all hover:scale-[1.01]
        ${isUser
            ? "bg-emerald-500/10 text-white/90 border border-emerald-500/20 rounded-br-none shadow-emerald-500/10"
            : "bg-indigo-500/10 text-white/80 border border-indigo-500/20 rounded-bl-none shadow-indigo-500/10"
          }`}
      >
        <p className="whitespace-pre-wrap">{message}</p>

        {/* Subtle decorative glow */}
        <div className={`absolute -inset-1 rounded-3xl md:rounded-[2rem] blur-xl opacity-20 pointer-events-none ${isUser ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
      </div>
    </div>
  );
}
