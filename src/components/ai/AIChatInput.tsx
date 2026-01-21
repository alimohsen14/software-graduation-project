import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
};

export default function AIChatInput({ value, onChange, onSend, isLoading }: Props): React.ReactElement {
  const { t, i18n } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const direction = i18n.dir();

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !isLoading) {
      onSend();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl transition-all focus-within:border-emerald-500/50 shadow-inner"
      dir={direction}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("ai.chatPlaceholder")}
        rows={1}
        disabled={isLoading}
        className="w-full bg-transparent border-none text-white placeholder-white/40 resize-none py-2 px-3 max-h-[160px] focus:ring-0 text-base font-normal leading-relaxed scrollbar-hide disabled:opacity-50"
        style={{ minHeight: "44px" }}
      />

      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className={`
          flex-shrink-0 p-2.5 rounded-xl flex items-center justify-center transition-all duration-200
          ${value.trim() && !isLoading
            ? "bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20"
            : "bg-white/5 text-white/30 cursor-not-allowed"
          }
        `}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <FiSend className={`w-5 h-5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
        )}
      </button>
    </form>
  );
}
