import React from "react";

type Props = {
  image: string;
  badge?: string;
  name: string;
};

export default function ProductImage({ image, badge, name }: Props) {
  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
      <img src={image} alt={name} className="w-full h-full object-cover" />

      {badge && (
        <span className="absolute top-4 left-4 bg-[#ce1126] text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
          {badge}
        </span>
      )}
    </div>
  );
}
