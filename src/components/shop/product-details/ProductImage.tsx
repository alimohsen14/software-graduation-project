import React from "react";
import ProductBadges from "../ProductBadges";
import { useTranslation } from "react-i18next";

type Props = {
  image: string;
  badge?: string;
  badges?: string[];
  name: string;
};

export default function ProductImage({ image, badge, badges, name }: Props) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const isSoldOut = badges?.includes("SOLD_OUT") ?? false;

  return (
    <div className="relative w-full h-[260px] md:h-[360px] rounded-xl overflow-hidden bg-zinc-900/50 border border-white/10 shadow-xl group/img flex items-center justify-center">
      <img
        src={image}
        alt={name}
        className={`max-w-full max-h-full object-contain transition-transform duration-1000 group-hover/img:scale-105 ${isSoldOut ? "grayscale opacity-50" : ""}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 pointer-events-none" />

      {badges ? (
        <div className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} z-10`}>
          <ProductBadges badges={badges} />
        </div>
      ) : (
        badge && (
          <span className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} z-10 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg`}>
            {badge}
          </span>
        )
      )}
    </div>
  );
}


