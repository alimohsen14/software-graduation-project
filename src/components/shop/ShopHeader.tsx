import React from "react";
import { FiShoppingCart } from "react-icons/fi";

interface ShopHeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function ShopHeader({
  cartCount = 0,
  onCartClick,
}: ShopHeaderProps) {
  return (
    <header className="relative w-full bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      {/* Palestinian Flag Accents */}
      <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>
      <div className="absolute top-0 right-0 w-2 h-full bg-[#009736]"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#ce1126]"></div>

      <div className="px-8 py-8 flex items-center justify-between">
        {/* Text Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1d2d1f] tracking-tight">
            Authentic Palestinian Marketplace
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl text-base">
            Heritage crafts, organic tastes, and timeless scents directly from
            the land to your door.
          </p>
        </div>

        {/* Cart Icon */}
        <button
          onClick={onCartClick}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#1d2d1f] text-white hover:bg-[#3e6347] transition shadow-md"
        >
          <FiShoppingCart size={22} />

          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ce1126] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
