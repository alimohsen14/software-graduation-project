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
    <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-7 h-7 flex items-center justify-center text-base font-medium text-[#6B7280] hover:text-[#1F2933] disabled:opacity-40 transition"
      >
        −
      </button>

      <span className="w-8 text-center font-medium text-[#1F2933] text-sm">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        className="w-7 h-7 flex items-center justify-center text-base font-medium text-[#6B7280] hover:text-[#1F2933] transition"
      >
        +
      </button>
    </div>
  );
}

