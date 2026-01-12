import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";

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
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "36px";
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
      dir={direction}
      className="w-full relative z-10"
    >
      <div
        className="flex items-end gap-3 px-6 py-4 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl transition-all focus-within:border-emerald-500/30 group"
      >
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("ai.chatPlaceholder")}
          className="flex-1 resize-none bg-transparent text-white placeholder-white/20 text-sm md:text-base leading-relaxed outline-none border-none min-h-[44px] max-h-[180px] p-2 custom-scrollbar"
          style={{ direction }}
          rows={1}
        />

        <button
          type="button"
          onClick={onSend}
          disabled={isLoading || value.trim().length === 0}
          className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group/btn overflow-hidden ${isLoading || value.trim().length === 0
            ? "opacity-20 cursor-not-allowed bg-white/5"
            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
            }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
          ) : (
            <FiSend className="w-5 h-5 relative z-10 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          )}

          {/* Animated Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
        </button>
      </div>

      {/* Heritage Focus Indicator */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 rounded-[2.5rem] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
