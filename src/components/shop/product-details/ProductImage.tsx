import React from "react";

type Props = {
  image: string;
  badge?: string;
  name: string;
};

export default function ProductImage({ image, badge, name }: Props) {
  return (
    <div className="relative w-full max-w-md h-[320px] rounded-xl overflow-hidden bg-white shadow-sm border border-[#E5E7EB]">
      <img src={image} alt={name} className="w-full h-full object-cover" />

      {badge && (
        <span className="absolute top-3 left-3 bg-[#A33A2B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {badge}
        </span>
      )}
    </div>
  );
}

