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
            className="bg-white/5 backdrop-blur-md rounded-3xl md:rounded-[2.5rem] p-3.5 md:p-6 border border-white/10 shadow-2xl hover:shadow-black/50 transition-all duration-500 group relative overflow-hidden flex flex-col hover:-translate-y-2"
        >
            {/* Background decorative glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />

            {/* Image Section */}
            <div className="relative h-40 md:h-56 w-full rounded-2xl md:rounded-[2rem] overflow-hidden mb-4 md:mb-6 border border-white/5 bg-zinc-900 shadow-inner group/img">
                <img
                    src={product.image}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSoldOut ? "grayscale opacity-50" : ""}`}
                    alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {product.badges && (
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 scale-90 md:scale-100 origin-top-left">
                        <ProductBadges badges={product.badges} />
                    </div>
                )}

                {/* Float Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    disabled={togglingFavorite}
                    className={`absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-xl transition-all duration-300 z-10 border ${isFavorited
                        ? "bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                        : "bg-white/5 text-white/20 border-white/10 hover:text-red-400 hover:border-red-400/30"
                        }`}
                >
                    <FiHeart size={18} fill={isFavorited ? "currentColor" : "none"} className={togglingFavorite ? "animate-pulse" : ""} />
                </button>
            </div>

            {/* Store & Social Info */}
            <div className="flex items-center justify-between mb-3 md:mb-4 px-1">
                <button
                    onClick={handleStoreClick}
                    className="flex items-center gap-2 md:gap-3 group/store truncate"
                >
                    {product.store.logo && product.store.logo.length > 0 ? (
                        <div className="relative">
                            <img
                                src={product.store.logo}
                                alt={product.store.name}
                                className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white/10 group-hover/store:border-emerald-500/50 transition-colors"
                            />
                            <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm opacity-0 group-hover/store:opacity-100 transition-opacity" />
                        </div>
                    ) : (
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover/store:text-emerald-400 transition-colors">
                            <FiBox size={12} />
                        </div>
                    )}
                    <div className="flex flex-col items-start truncate">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-500/60 group-hover/store:text-emerald-400 transition-colors truncate">
                            {product.store.name}
                        </span>
                    </div>
                </button>

                <button
                    onClick={toggleFollow}
                    disabled={togglingFollow}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 border ${isFollowed
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-white/5 text-white/10 border-white/5 hover:border-white/20 hover:text-white"
                        }`}
                >
                    {isFollowed ? <FiCheck size={14} /> : <FiPlus size={14} strokeWidth={3} />}
                </button>
            </div>

            {/* Product Metadata */}
            <div className="flex flex-col gap-1.5 md:gap-2 mb-4 md:mb-6 px-1 flex-grow">
                <h3 className="text-lg md:text-xl font-black text-white tracking-tighter uppercase leading-none group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-[10px] md:text-[11px] font-bold text-white/30 uppercase tracking-widest leading-relaxed line-clamp-2 min-h-[28px] md:min-h-[32px]">
                    {product.shortDescription || product.description}
                </p>
                <div className="mt-1 md:mt-2 scale-90 md:scale-100 origin-left">
                    <StockWarningBox stock={product.stock} badges={product.badges} />
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="mt-auto pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between gap-3 md:gap-4 px-1">
                <div className="flex flex-col">
                    <span className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest">Valuation</span>
                    <span className="text-xl md:text-2xl font-black text-white leading-none">
                        {product.price}<span className="text-emerald-500 text-sm md:text-lg ml-0.5 md:ml-1">₪</span>
                    </span>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={handleBuyNow}
                        disabled={isSoldOut}
                        className={`px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-xl ${isSoldOut
                            ? "bg-white/5 text-white/10 border border-white/10 cursor-not-allowed"
                            : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 hover:shadow-emerald-500/10 active:scale-95"
                            }`}
                    >
                        {isSoldOut ? "Deprecated" : "Acquire"}
                    </button>

                    <button
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 border ${isSoldOut
                            ? "bg-white/5 text-white/10 border-white/10 cursor-not-allowed"
                            : "bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 active:scale-95"
                            }`}
                        title="Buffer Unit"
                    >
                        <FiShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
