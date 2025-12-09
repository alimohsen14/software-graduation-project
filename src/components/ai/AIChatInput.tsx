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
      className="fixed left-1/2 transform -translate-x-1/2 bottom-5 w-full px-4 z-50"
      style={{ maxWidth: "700px" }}
    >
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-[22px] shadow-lg"
        style={{ background: "#456a53" }}
      >
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("ai.chatPlaceholder")}
          aria-label={t("ai.chatPlaceholder")}
          className="flex-1 resize-none bg-transparent text-white placeholder-white/70 text-sm md:text-base leading-snug outline-none border-none min-h-[36px] max-h-[180px] p-1"
          style={{ direction }}
          rows={1}
        />

        <button
          type="button"
          onClick={onSend}
          disabled={isLoading || value.trim().length === 0}
          aria-label={t("ai.send")}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-shadow ${
            isLoading || value.trim().length === 0
              ? "opacity-60 cursor-not-allowed"
              : "hover:brightness-110"
          }`}
          style={{ background: "#3e6347" }}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSend className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
