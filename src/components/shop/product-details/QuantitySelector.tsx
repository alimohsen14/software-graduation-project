import React from "react";

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
  return (
    <div className="inline-flex items-center gap-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-2.5 shadow-xl">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-xl font-bold text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl disabled:opacity-20 transition-all active:scale-90"
      >
        −
      </button>

      <div className="flex flex-col items-center">
        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Qty</span>
        <span className="text-sm font-black text-white w-6 text-center tabular-nums">
          {quantity}
        </span>
      </div>

      <button
        onClick={onIncrease}
        className="w-10 h-10 flex items-center justify-center text-xl font-bold text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all active:scale-90"
      >
        +
      </button>
    </div>
  );
}

