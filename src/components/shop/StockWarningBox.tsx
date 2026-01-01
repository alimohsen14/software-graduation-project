import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

type Props = {
    stock: number;
    badges?: string[];
};

export default function StockWarningBox({ stock, badges = [] }: Props) {
    const isSoldOut = badges?.includes("SOLD_OUT") ?? false;
    const isLowStock = badges?.includes("LOW_STOCK") ?? false;

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
                Low stock
            </span>
        </div>
    );
}
