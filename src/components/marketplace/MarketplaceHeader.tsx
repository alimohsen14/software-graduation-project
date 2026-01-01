import React from "react";
import { FiShoppingBag, FiUserPlus, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

type Props = {
    onBecomeSeller: () => void;
    showBecomeSeller?: boolean;
};

export default function MarketplaceHeader({ onBecomeSeller, showBecomeSeller = true }: Props) {
    const { toggleCart, cartItems } = useCart();
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

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleCart}
                    className="relative p-3 bg-white border border-[#E5E7EB] text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm"
                >
                    <FiShoppingCart size={20} />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#A33A2B] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </button>

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
        </div>
    );
}
