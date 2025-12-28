import React from "react";
import { FiShoppingBag, FiUserPlus } from "react-icons/fi";

type Props = {
    onBecomeSeller: () => void;
    showBecomeSeller?: boolean;
};

export default function MarketplaceHeader({ onBecomeSeller, showBecomeSeller = true }: Props) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <FiShoppingBag className="w-8 h-8 text-[#4A6F5D]" />
                    <h1 className="text-3xl font-bold text-[#1F2933]">Marketplace</h1>
                </div>
                <p className="text-gray-500">
                    Discover products from official and seller stores
                </p>
            </div>

            {showBecomeSeller && (
                <button
                    onClick={onBecomeSeller}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4A6F5D] text-white rounded-xl font-bold hover:bg-[#3d5c4d] transition shadow-sm"
                >
                    <FiUserPlus size={18} />
                    Become a Seller
                </button>
            )}
        </div>
    );
}
