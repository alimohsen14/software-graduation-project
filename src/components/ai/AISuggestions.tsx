import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
  onSelect: (messageText: string) => void;
};

export default function AISuggestions({ onSelect }: Props): React.ReactElement {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const SUGGESTIONS = t("ai.suggestions", { returnObjects: true }) as string[];


  const direction = i18n.dir();
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 220;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div
      dir={direction}
      className="w-full relative z-40"
    >
      <div className="relative flex items-center gap-4">
        {/* Arrow based on direction */}
        <button
          onClick={() => scroll(direction === "rtl" ? "right" : "left")}
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-xl group"
          aria-label="Scroll"
        >
          {direction === "rtl" ? (
            <FiChevronRight className="w-6 h-6 transition-transform group-active:translate-x-1" />
          ) : (
            <FiChevronLeft className="w-6 h-6 transition-transform group-active:-translate-x-1" />
          )}
        </button>

        {/* Suggestions */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-scroll no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            className="flex gap-4 py-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                onClick={() => onSelect(text)}
                className="whitespace-nowrap rounded-full px-6 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 shadow-lg hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-white transition-all active:scale-[0.98] animate-in fade-in zoom-in duration-300"
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Opposite Arrow */}
        <button
          onClick={() => scroll(direction === "rtl" ? "left" : "right")}
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-xl group"
          aria-label="Scroll"
        >
          {direction === "rtl" ? (
            <FiChevronLeft className="w-6 h-6 transition-transform group-active:-translate-x-1" />
          ) : (
            <FiChevronRight className="w-6 h-6 transition-transform group-active:translate-x-1" />
          )}
        </button>
      </div>

      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}
