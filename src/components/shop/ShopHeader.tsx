import React from "react";

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

      <div className="px-8 py-8 md:flex md:items-center md:justify-between">
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

        {/* Cart Icon (Optional placement here if needed, or kept in filter bar) */}
      </div>
    </header>
  );
}
