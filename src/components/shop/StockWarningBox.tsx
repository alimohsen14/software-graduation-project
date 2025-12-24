import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { ProductBadges } from "../../services/shopService";

type Props = {
    stock: number;
    badges?: ProductBadges;
};

export default function StockWarningBox({ stock, badges }: Props) {
    const isSoldOut = badges?.isSoldOut ?? false;
    const isLowStock = badges?.isLowStock ?? (stock > 0 && stock <= 10);

    if (!isSoldOut && !isLowStock) return null;

    if (isSoldOut) {
        return (
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2">
                <FiAlertTriangle className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-sm font-medium text-gray-600">Sold Out</span>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <FiAlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-sm font-medium text-amber-700">
                Low stock – only {stock} items left
            </span>
        </div>
    );
}
