import React, { useRef, useEffect } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isLoading?: boolean;
};

export default function AIChatInput({
  value,
  onChange,
  onSend,
  isLoading = false,
}: Props): React.ReactElement {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto resize textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;

    ta.style.height = "36px"; // starting height
    const maxH = 180;
    ta.style.height = Math.min(ta.scrollHeight, maxH) + "px";
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim().length > 0) onSend();
    }
  }

  return (
    <div
      dir="rtl"
      className="fixed left-1/2 transform -translate-x-1/2 bottom-5 w-full px-4 z-50"
      style={{ maxWidth: "700px" }}
    >
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-[22px] shadow-lg"
        style={{
          background: "#456a53",
        }}
      >
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب سؤالك عن فلسطين هنا..."
          aria-label="اكتب سؤالك عن فلسطين هنا"
          className="flex-1 resize-none bg-transparent text-white placeholder-white/70 text-sm md:text-base leading-snug outline-none border-none min-h-[36px] max-h-[180px] p-1"
          style={{ direction: "rtl" }}
          rows={1}
        />

        <button
          type="button"
          onClick={onSend}
          disabled={isLoading || value.trim().length === 0}
          aria-label="إرسال"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-shadow ${
            isLoading || value.trim().length === 0
              ? "opacity-60 cursor-not-allowed"
              : "hover:brightness-110"
          }`}
          style={{ background: "#3e6347" }}
        >
          {isLoading ? (
            <svg
              className="w-4 h-4 text-white animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              <path
                d="M22 12a10 10 0 00-10-10"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22l-4-9-9-4 20-7z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
