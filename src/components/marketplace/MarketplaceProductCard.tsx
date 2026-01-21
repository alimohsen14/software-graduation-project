import { FiShoppingCart, FiBox, FiHeart } from "react-icons/fi";
import { MarketplaceProduct } from "../../services/marketplace.service";
import ProductBadges from "../shop/ProductBadges";
import { useStoreSocialStatus } from "../../hooks/useStoreSocialStatus";
import StockWarningBox from "../shop/StockWarningBox";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";

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
    const { t, i18n } = useTranslation();
    const direction = i18n.dir();
    const { addToCart, cartItems } = useCart();
    const isSoldOut = product.badges?.includes("SOLD_OUT") ?? false;
    const {
        isFollowed,
        isFavorited,
        toggleFollow,
        toggleFavorite,
        togglingFollow,
        togglingFavorite
    } = useStoreSocialStatus(product.store.id);

    // Calculate how many of this product are in the cart
    const cartItem = cartItems.find((item) => item.id === product.id);
    const inCartCount = cartItem?.quantity ?? 0;

    const handleStoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onStoreClick();
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product, 1, false);
    };

    return (
        <div
            onClick={onClick}
            className="group bg-[#FBF7EF] rounded-2xl md:rounded-[2rem] border border-[#E6DFC6] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden cursor-pointer h-full"
            dir={direction}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden bg-white">
                <img
                    src={product.image}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? "grayscale opacity-50" : ""}`}
                    alt={product.name}
                />

                {/* Heart Icon (Top Right/Left) */}
                <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
                    disabled={togglingFavorite}
                    className={`absolute top-2 ${direction === 'rtl' ? 'left-2' : 'right-2'} md:top-4 ${direction === 'rtl' ? 'md:left-4' : 'md:right-4'} w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md z-10 ${isFavorited
                        ? "bg-red-500 text-white"
                        : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
                        }`}
                >
                    <FiHeart size={16} fill={isFavorited ? "currentColor" : "none"} className={`md:w-5 md:h-5 ${togglingFavorite ? "animate-pulse" : ""}`} />
                </button>

                {/* Badge (Top Left/Right) */}
                {product.badges && product.badges.length > 0 && (
                    <div className={`absolute top-2 ${direction === 'rtl' ? 'right-2 origin-top-right' : 'left-2 origin-top-left'} md:top-4 ${direction === 'rtl' ? 'md:right-4' : 'md:left-4'} z-10 scale-75 md:scale-100`}>
                        <ProductBadges badges={product.badges} />
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="p-3 md:p-6 flex flex-col flex-grow">
                {/* Store Info */}
                <div className="flex items-center justify-between mb-2 md:mb-4">
                    <button
                        onClick={handleStoreClick}
                        className="flex items-center gap-1.5 md:gap-2 group/store min-w-0"
                    >
                        {product.store.logo ? (
                            <img
                                src={product.store.logo}
                                alt={product.store.name}
                                className="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover border border-[#E6DFC6] shrink-0"
                            />
                        ) : (
                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                <FiBox size={10} />
                            </div>
                        )}
                        <span className="text-[8px] md:text-[10px] font-bold text-[#2f5c3f]/60 group-hover/store:text-[#2f5c3f] transition-colors tracking-wide truncate">
                            {product.store.name}
                        </span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFollow(); }}
                        disabled={togglingFollow}
                        className={`text-[8px] md:text-[10px] font-bold transition-colors shrink-0 ${isFollowed ? "text-emerald-600" : "text-[#CDA15A] hover:text-[#B88A42]"}`}
                    >
                        {isFollowed ? t("marketplace.following") : t("marketplace.follow")}
                    </button>
                </div>

                {/* Name & Description */}
                <div className="flex flex-col gap-0.5 md:gap-1 mb-3 md:mb-6">
                    <h3 className="text-sm md:text-xl font-bold text-[#2f5c3f] leading-tight line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="hidden md:block text-xs text-[#2f5c3f]/60 line-clamp-2 min-h-[32px]">
                        {product.shortDescription || product.description}
                    </p>
                    <p className="md:hidden text-[10px] text-[#2f5c3f]/60 line-clamp-1">
                        {product.shortDescription || product.description}
                    </p>
                </div>

                {/* Price & Action */}
                <div className="mt-auto pt-2 md:pt-4 border-t border-[#E6DFC6]/50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[7px] md:text-[10px] font-bold text-[#2f5c3f]/40 uppercase tracking-widest leading-none mb-0.5 md:mb-1">{t("marketplace.price")}</span>
                        <span className="text-base md:text-2xl font-black text-[#2f5c3f]">
                            {product.price}<span className={`text-[10px] md:text-sm ${direction === 'rtl' ? 'mr-0.5' : 'ml-0.5'}`}>₪</span>
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={handleAddToCart}
                            disabled={isSoldOut}
                            className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${isSoldOut
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                : "bg-[#2f5c3f] text-white hover:bg-[#274b34] hover:shadow-md active:scale-90"
                                }`}
                            title={t("marketplace.addToCart")}
                        >
                            <FiShoppingCart size={16} className="md:w-5 md:h-5" />
                        </button>

                        {/* Item-specific numeric badge */}
                        {inCartCount > 0 && (
                            <span className={`absolute -top-1.5 ${direction === 'rtl' ? '-left-1.5' : '-right-1.5'} w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-[9px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#FBF7EF] shadow-lg animate-in zoom-in duration-300`}>
                                {inCartCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
