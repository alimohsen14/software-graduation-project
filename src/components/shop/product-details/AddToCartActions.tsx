import React from "react";
import { FiShoppingCart } from "react-icons/fi";

type Props = {
  disabled?: boolean;
  isSoldOut?: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

export default function AddToCartActions({
  disabled = false,
  isSoldOut = false,
  onAddToCart,
  onBuyNow,
}: Props) {
  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 shadow-xl disabled:opacity-20 active:scale-90 group"
        title="Add to Acquisition Buffer"
      >
        <FiShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={onBuyNow}
        disabled={disabled}
        className={`flex-1 h-16 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl relative overflow-hidden group/buy ${isSoldOut
            ? "bg-zinc-800 text-white/20 border border-white/5 cursor-not-allowed"
            : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-[0.98]"
          }`}
      >
        <span className="relative z-10">{isSoldOut ? "Out of Segment" : "Initiate Acquisition"}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/buy:translate-x-full transition-transform duration-1000" />
      </button>
    </div>
  );
}


