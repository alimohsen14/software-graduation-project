import React from "react";
import { ProductBadges as BadgesType } from "../../../services/shopService";
import ProductBadges from "../ProductBadges";

type Props = {
  image: string;
  badge?: string;
  badges?: BadgesType;
  name: string;
};

export default function ProductImage({ image, badge, badges, name }: Props) {
  const isSoldOut = badges?.isSoldOut ?? false;

  return (
    <div className="relative w-full max-w-md h-[320px] rounded-xl overflow-hidden bg-white shadow-sm border border-[#E5E7EB]">
      <img
        src={image}
        alt={name}
        className={`w-full h-full object-cover ${isSoldOut ? "grayscale opacity-70" : ""}`}
      />

      {badges ? (
        <ProductBadges badges={badges} />
      ) : (
        badge && (
          <span className="absolute top-3 left-3 bg-[#A33A2B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {badge}
          </span>
        )
      )}
    </div>
  );
}


