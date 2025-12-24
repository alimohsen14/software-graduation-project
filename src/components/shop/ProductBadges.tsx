import React from "react";
import { ProductBadges as BadgesType } from "../../services/shopService";

type Props = {
    badges?: BadgesType;
    showLowStock?: boolean;
};

export default function ProductBadges({ badges, showLowStock = true }: Props) {
    if (!badges) return null;

    const { isSoldOut, isLowStock, isNew, isHot, isBestSeller } = badges;

    // Priority-based main badge selection
    const renderMainBadge = () => {
        if (isSoldOut) {
            return (
                <span className="bg-[#6B7280] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    SOLD OUT
                </span>
            );
        }

        if (isHot && isBestSeller) {
            return (
                <span className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    🔥 BEST SELLER
                </span>
            );
        }

        if (isBestSeller) {
            return (
                <span className="bg-[#F59E0B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    BEST SELLER
                </span>
            );
        }

        if (isHot) {
            return (
                <span className="bg-[#EF4444] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    🔥 HOT
                </span>
            );
        }

        if (isNew) {
            return (
                <span className="bg-[#10B981] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    NEW
                </span>
            );
        }

        return null;
    };

    return (
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {renderMainBadge()}

            {showLowStock && isLowStock && !isSoldOut && (
                <span className="bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    Only few items left
                </span>
            )}
        </div>
    );
}
