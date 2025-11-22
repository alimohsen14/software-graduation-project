import React from "react";

type Props = {
  onSelect: (messageText: string) => void;
};

const SUGGESTIONS = [
  "احكيلي عن تاريخ الصبّانات في نابلس",
  "شو هي أشهر العادات الفلسطينية؟",
  "عرفني على مدينة فلسطينية",
  "اشرحلي القضية الفلسطينية باختصار",
];

export default function AISuggestions({ onSelect }: Props): React.ReactElement {
  return (
    <div
      dir="rtl"
      className="fixed left-1/2 transform -translate-x-1/2 bottom-20 w-full px-4 z-40 max-w-[700px]"
      aria-hidden={false}
    >
      <div className="overflow-x-auto no-scrollbar">
        <div className="inline-flex gap-3 py-1">
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
    </div>
  );
}
