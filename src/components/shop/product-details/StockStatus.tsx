import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type Props = {
  stock: number;
};

export default function StockStatus({ stock }: Props) {
  const inStock = stock > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] leading-none">Inventory Registry</span>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-lg ${inStock
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
          : "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5"
        }`}>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
        {inStock ? `Nominal: ${stock} Units` : "Depleted"}
      </div>
    </div>
  );
}

