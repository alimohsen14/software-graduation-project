import React from "react";

type Props = {
  price: number;
};

export default function ProductPrice({ price }: Props) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Global Valuation</span>
      <div className="text-4xl font-black text-white leading-none">
        {price}<span className="text-emerald-500 text-2xl ml-1">₪</span>
      </div>
    </div>
  );
}

