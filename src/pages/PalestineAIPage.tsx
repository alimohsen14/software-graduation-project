import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AISidebar from "../components/ai/AISidebar";
import AIWelcomeBox from "../components/ai/AIWelcomeBox";
import AISuggestions from "../components/ai/AISuggestions";
import AIChatInput from "../components/ai/AIChatInput";
import AIMessageBubble from "../components/ai/AIMessageBubble";

// ...existing code...
type Message = {
  id: string;
  text: string;
  role: "user" | "assistant";
  createdAt: number;
};

export default function PalestineAIPage(): React.ReactElement {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const selectors = [
      "#sidebar",
      ".sidebar",
      ".main-sidebar",
      "[data-sidebar]",
    ];
    const added: Element[] = [];

    selectors.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) {
        el.classList.add("hidden");
        added.push(el);
      }
    });

    return () => {
      added.forEach((el) => el.classList.remove("hidden"));
    };
  }, []);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setIsLoading(true);

    const msg: Message = {
      id: String(Date.now()),
      text,
      role: "user",
      createdAt: Date.now(),
    };

    setMessages((s) => [...s, msg]);
    setInput("");

    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }

  function handleSuggestionSelect(text: string) {
    setInput(text);
    setTimeout(handleSend, 0);
  }

  return (
    <DashboardLayout>
      <div
        dir="rtl"
        style={{ background: "#3e6347" }}
        className="min-h-screen text-white"
      >
        <AISidebar />

        <main className="mx-auto max-w-[900px] px-4 py-8 md:py-12">
          <div className="flex flex-col gap-6">
            {messages.length === 0 && <AIWelcomeBox />}

            <section
              aria-live="polite"
              className="flex flex-col gap-3"
              style={{ minHeight: 240 }}
            >
              {messages.map((m) => (
                <AIMessageBubble
                  key={m.id}
                  message={m.text}
                  sender={m.role === "user" ? "user" : "ai"}
                />
              ))}
            </section>
          </div>
        </main>

        <AISuggestions onSelect={handleSuggestionSelect} />

        <AIChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
// ...existing code...
