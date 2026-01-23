import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div className={`inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 shadow-lg ${isRtl ? "flex-row-reverse" : ""}`}>
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-8 h-8 flex items-center justify-center text-lg font-bold text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg disabled:opacity-20 transition-all active:scale-90"
      >
        −
      </button>

      <div className="flex flex-col items-center min-w-[20px]">
        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none mb-0.5">
          {t("marketplace.control") || "Control"}
        </span>
        <span className="text-xs font-black text-white w-5 text-center tabular-nums">
          {quantity}
        </span>
      </div>

      <button
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center text-lg font-bold text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition-all active:scale-90"
      >
        +
      </button>
    </div>
  );
}

