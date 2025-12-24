import React from "react";
import { FiShoppingCart, FiBox } from "react-icons/fi";
import { MarketplaceProduct } from "../../services/marketplace.service";
import ProductBadges from "../shop/ProductBadges";
import StockWarningBox from "../shop/StockWarningBox";

type Props = {
    product: MarketplaceProduct;
    onClick: () => void;
    onStoreClick: () => void;
};

export default function MarketplaceProductCard({
    product,
    onClick,
    onStoreClick,
}: Props) {
    const isSoldOut = product.badges?.isSoldOut ?? false;

    const handleStoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onStoreClick();
    };

    return (
        <div
            onClick={onClick}
            className="bg-[#eaf5ea] rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
                <img
                    src={product.image}
                    className={`w-full h-full object-cover ${isSoldOut ? "grayscale opacity-70" : ""}`}
                    alt={product.name}
                />
                {product.badges && <ProductBadges badges={product.badges} />}
            </div>

            {/* Store Name */}
            <button
                onClick={handleStoreClick}
                className="flex items-center gap-1.5 text-xs text-[#4A6F5D] font-medium mb-2 hover:underline"
            >
                <FiBox size={12} />
                {product.store.name}
                {product.store.isOfficial && (
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Official
                    </span>
                )}
            </button>

            {/* Product Info */}
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-[#1F2933] leading-tight line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-sm text-[#6B7280] line-clamp-2 min-h-[40px]">
                    {product.shortDescription || product.description}
                </p>
            </div>

            {/* Stock Warning */}
            <div className="mt-2">
                <StockWarningBox stock={product.stock} badges={product.badges} />
            </div>

            {/* Price and Action */}
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-[#4A6F5D]">{product.price}₪</span>

                <button
                    onClick={(e) => e.stopPropagation()}
                    disabled={isSoldOut}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition shadow-sm ${isSoldOut
                        ? "bg-[#9CA3AF] cursor-not-allowed"
                        : "bg-[#4A6F5D] hover:bg-[#A33A2B]"
                        }`}
                >
                    <FiShoppingCart size={18} />
                </button>
            </div>
        </div>
    );
}
