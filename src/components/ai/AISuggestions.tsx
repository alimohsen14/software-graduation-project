import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  onSelect: (messageText: string) => void;
};

export default function AISuggestions({ onSelect }: Props): React.ReactElement {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  // Get language-specific suggestions
  const marketplaceSuggestions = t("ai.marketplaceSuggestions", { returnObjects: true }) as string[];
  const heritageSuggestions = t("ai.heritageSuggestions", { returnObjects: true }) as string[];

  // Combine: 2 marketplace + 3 heritage
  const allSuggestions = [
    ...(Array.isArray(marketplaceSuggestions) ? marketplaceSuggestions : []),
    ...(Array.isArray(heritageSuggestions) ? heritageSuggestions : [])
  ];

  if (allSuggestions.length === 0) {
    return <></>;
  }

  return (
    <div dir={direction} className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {allSuggestions.map((text, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(text)}
            className="
              px-4 py-2.5 rounded-xl
              bg-white/10 backdrop-blur-sm border border-white/10
              text-sm font-medium text-white/80
              hover:bg-white/15 hover:border-white/25 hover:text-white
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
