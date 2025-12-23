import React from "react";

export default function ShopHeader() {
  return (
    <div className="w-full">
      {/* Title Section - Left Aligned */}
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F2933] tracking-tight">
          Authentic Palestinian Marketplace
        </h1>
        {/* Sage Green Divider */}
        <div className="w-24 h-1 bg-[#4A6F5D] rounded-full mt-4 mb-4"></div>
        <p className="text-[#6B7280] max-w-2xl text-base leading-relaxed">
          Heritage crafts, organic tastes, and timeless scents directly from
          the land to your door.
        </p>
      </div>
    </div>
  );
}
