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
      className="fixed left-1/2 transform -translate-x-1/2 bottom-28 w-full px-4 z-40 max-w-[700px]"
    >
      <div className="relative flex items-center gap-2">
        {/* Arrow based on direction */}
        <button
          onClick={() => scroll(direction === "rtl" ? "right" : "left")}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3e6347] text-white/80 hover:text-white hover:brightness-110 transition"
          aria-label="Scroll"
        >
          {direction === "rtl" ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </button>

        {/* Suggestions */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            className="flex gap-3 py-1"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                onClick={() => onSelect(text)}
                className="whitespace-nowrap rounded-full px-4 py-2 bg-[#4f7b61] text-white text-sm shadow-md hover:brightness-110 active:scale-[0.98] transition"
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Opposite Arrow */}
        <button
          onClick={() => scroll(direction === "rtl" ? "left" : "right")}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3e6347] text-white/80 hover:text-white hover:brightness-110 transition"
          aria-label="Scroll"
        >
          {direction === "rtl" ? (
            <FiChevronLeft className="w-5 h-5" />
          ) : (
            <FiChevronRight className="w-5 h-5" />
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
