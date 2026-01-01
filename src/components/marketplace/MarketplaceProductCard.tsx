import { FiShoppingCart, FiBox, FiPlus, FiCheck, FiHeart } from "react-icons/fi";
import { MarketplaceProduct } from "../../services/marketplace.service";
import ProductBadges from "../shop/ProductBadges";
import { useStoreSocialStatus } from "../../hooks/useStoreSocialStatus";
import StockWarningBox from "../shop/StockWarningBox";
import { useCart } from "../../context/CartContext";

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
    const { addToCart } = useCart();
    const isSoldOut = product.badges?.includes("SOLD_OUT") ?? false;
    const {
        isFollowed,
        isFavorited,
        toggleFollow,
        toggleFavorite,
        togglingFollow,
        togglingFavorite
    } = useStoreSocialStatus(product.store.id);

    const handleStoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onStoreClick();
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Silent add
        addToCart(product, 1, false);
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Add and Open Cart
        addToCart(product, 1, true);
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

                {/* Float Favorite Button on Image */}
                <button
                    onClick={toggleFavorite}
                    disabled={togglingFavorite}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${isFavorited
                        ? "bg-red-500 text-white scale-110"
                        : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
                        }`}
                >
                    <FiHeart size={16} fill={isFavorited ? "currentColor" : "none"} />
                </button>
            </div>

            {/* Store Name & Social Stats */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={handleStoreClick}
                    className="flex items-center gap-2 text-xs text-[#4A6F5D] font-medium hover:underline group truncate mr-2"
                >
                    {product.store.logo && product.store.logo.length > 0 ? (
                        <img
                            src={product.store.logo}
                            alt={product.store.name}
                            className="w-5 h-5 rounded-full object-cover border border-gray-200"
                        />
                    ) : (
                        <FiBox size={12} />
                    )}
                    <span className="truncate">{product.store.name}</span>
                    {product.store.isOfficial && (
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                            Official
                        </span>
                    )}
                </button>

                {/* Follow Toggle Icon */}
                <button
                    onClick={toggleFollow}
                    disabled={togglingFollow}
                    title={isFollowed ? "Unfollow Store" : "Follow Store"}
                    className={`flex items-center justify-center w-6 h-6 rounded-lg transition-colors shrink-0 ${isFollowed
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-500"
                        }`}
                >
                    {isFollowed ? <FiCheck size={14} /> : <FiPlus size={14} />}
                </button>
            </div>

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
            <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xl font-bold text-[#4A6F5D]">{product.price}₪</span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleBuyNow}
                        disabled={isSoldOut}
                        className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition shadow-sm ${isSoldOut
                            ? "bg-[#9CA3AF] cursor-not-allowed"
                            : "bg-[#A33A2B] hover:bg-[#8B2F22]"
                            }`}
                    >
                        {isSoldOut ? "Sold Out" : "Buy Now"}
                    </button>

                    <button
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition shadow-sm ${isSoldOut
                            ? "bg-[#9CA3AF] cursor-not-allowed"
                            : "bg-[#4A6F5D] hover:bg-[#3d5c4d]"
                            }`}
                        title="Add to Cart"
                    >
                        <FiShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
