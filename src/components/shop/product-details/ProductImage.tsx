import React from "react";
import ProductBadges from "../ProductBadges";

type Props = {
  image: string;
  badge?: string;
  badges?: string[];
  name: string;
};

export default function ProductImage({ image, badge, badges, name }: Props) {
  const isSoldOut = badges?.includes("SOLD_OUT") ?? false;

  return (
    <div className="relative w-full aspect-square lg:h-[600px] rounded-[3rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl group/img">
      <img
        src={image}
        alt={name}
        className={`w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110 ${isSoldOut ? "grayscale opacity-50" : ""}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

      {badges ? (
        <div className="absolute top-6 left-6 z-10">
          <ProductBadges badges={badges} />
        </div>
      ) : (
        badge && (
          <span className="absolute top-6 left-6 z-10 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
            {badge}
          </span>
        )
      )}
    </div>
  );
}


