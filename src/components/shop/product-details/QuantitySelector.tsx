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
  const { t, i18n } = useTranslation("marketplace");
  const isRtl = i18n.language === "ar";

  return (
    <div className={`inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 shadow ${isRtl ? "flex-row-reverse" : ""}`}>
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-7 h-7 flex items-center justify-center text-base font-bold text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-md disabled:opacity-20 transition-all active:scale-90"
      >
        −
      </button>

      <div className="flex flex-col items-center min-w-[16px]">
        <span className="text-[6px] font-black text-white/20 uppercase tracking-widest leading-none mb-0.5">
          {t("product.quantity")}
        </span>
        <span className="text-[11px] font-black text-white w-4 text-center tabular-nums">
          {quantity}
        </span>
      </div>

      <button
        onClick={onIncrease}
        className="w-7 h-7 flex items-center justify-center text-base font-bold text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-md transition-all active:scale-90"
      >
        +
      </button>
    </div>
  );
}

