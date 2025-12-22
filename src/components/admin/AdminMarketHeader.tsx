import React from "react";
import { FiPlus } from "react-icons/fi";

interface AdminMarketHeaderProps {
  onAddProduct: () => void;
}

export default function AdminMarketHeader({
  onAddProduct,
}: AdminMarketHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
      <div className="text-left">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Admin Market Dashboard
        </h1>
        <p className="text-white/80 text-sm font-medium mt-1">
          Palestine3D – Authentic Palestinian Marketplace Management
        </p>
      </div>

      <button
        onClick={onAddProduct}
        className="flex items-center justify-center gap-2 bg-[#74a52d] hover:bg-[#85bd33] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
      >
        <FiPlus className="w-5 h-5" />
        Add New Product
      </button>
    </div>
  );
}
