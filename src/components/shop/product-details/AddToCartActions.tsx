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
    <div className="flex items-center gap-4">
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-[#1d2d1f] flex items-center justify-center text-white hover:bg-[#3e6347] transition shadow-md disabled:opacity-50"
      >
        <FiShoppingCart size={20} />
      </button>

      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="px-8 py-3 rounded-full bg-[#ce1126] text-white font-bold hover:bg-[#a40e1e] transition shadow-md disabled:opacity-50"
      >
        Buy Now →
      </button>
    </div>
  );
}
