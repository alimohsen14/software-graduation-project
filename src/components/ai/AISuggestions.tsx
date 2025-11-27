import React, { useRef } from "react";

type Props = {
  onSelect: (messageText: string) => void;
};

const SUGGESTIONS = [
  "احكيلي عن تاريخ الصبّانات في نابلس",
  "شو هي أشهر العادات الفلسطينية؟",
  "عرفني على مدينة فلسطينية",
  "اشرحلي القضية الفلسطينية باختصار",
  "احكيلي عن المسجد الأقصى",
  "شو قصة صابونة نابلس؟",
];

export default function AISuggestions({ onSelect }: Props): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = 220;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div
      dir="rtl"
      className="fixed left-1/2 transform -translate-x-1/2 bottom-28 w-full px-4 z-40 max-w-[700px]"
    >
      <div className="relative flex items-center gap-2">
        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll Right"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3e6347] text-white/80 hover:text-white hover:brightness-110 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Suggestions List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-scroll"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE & Edge
          }}
        >
          <div
            className="flex gap-3 py-1"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => onSelect(text)}
                className="whitespace-nowrap rounded-full px-4 py-2 bg-[#4f7b61] text-white text-sm shadow-md hover:brightness-110 active:scale-[0.98] transition"
                aria-label={text}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll Left"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3e6347] text-white/80 hover:text-white hover:brightness-110 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Hide scrollbar in Webkit browsers */}
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
