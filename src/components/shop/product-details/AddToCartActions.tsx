import React from "react";
import { FiShoppingCart } from "react-icons/fi";

type Props = {
  disabled?: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

export default function AddToCartActions({
  disabled = false,
  onAddToCart,
  onBuyNow,
}: Props) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="w-10 h-10 rounded-full bg-[#4A6F5D] flex items-center justify-center text-white hover:bg-[#A33A2B] transition shadow-sm disabled:opacity-50"
      >
        <FiShoppingCart size={18} />
      </button>

      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="px-6 py-2 rounded-full bg-[#4A6F5D] text-white text-sm font-bold hover:bg-[#A33A2B] transition shadow-sm disabled:opacity-50"
      >
        Buy Now
      </button>
    </div>
  );
}

