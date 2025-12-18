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
    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="text-xl font-bold text-gray-600 disabled:opacity-40"
      >
        −
      </button>

      <span className="w-6 text-center font-medium">{quantity}</span>

      <button onClick={onIncrease} className="text-xl font-bold text-gray-600">
        +
      </button>
    </div>
  );
}
