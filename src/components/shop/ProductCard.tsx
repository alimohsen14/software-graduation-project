import { FiShoppingCart, FiShoppingBag, FiCheck, FiPlus, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProductBadges from "./ProductBadges";
import StockWarningBox from "./StockWarningBox";
import { useStoreSocialStatus } from "../../hooks/useStoreSocialStatus";

type StoreInfo = {
  id: number;
  name: string;
  logo?: string;
  isOfficial?: boolean;
};

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  badge?: string;
  badges?: string[];
  store?: StoreInfo;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductCard({
  id,
  image,
  title,
  description,
  price,
  stock,
  badge,
  badges,
  store,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  const navigate = useNavigate();
  const isSoldOut = badges?.includes("SOLD_OUT") ?? false;
  const {
    isFollowed,
    isFavorited,
    toggleFollow,
    toggleFavorite,
    togglingFollow,
    togglingFavorite
  } = useStoreSocialStatus(store?.id);

  const handleStoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (store) {
      navigate(`/store/${store.id}`);
    }
  };

  return (
    <div
      onClick={() => navigate(`/shop/product/${id}`)}
      className=" bg-[#eaf5ea] rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-64 w-full rounded-xl overflow-hidden mb-4">
        <img
          src={image}
          className={`w-full h-full object-cover ${isSoldOut ? "grayscale opacity-70" : ""}`}
          alt={title}
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

        {/* Float Favorite Button on Image */}
        {store && (
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
        )}
      </div>

      {/* Store Name & Logo */}
      {store && (
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleStoreClick}
            className="flex items-center gap-2 text-xs text-[#4A6F5D] font-medium hover:underline group truncate mr-2"
          >
            {store.logo && store.logo.length > 0 ? (
              <img
                src={store.logo}
                alt={store.name}
                className="w-5 h-5 rounded-full object-cover border border-gray-200 group-hover:border-[#4A6F5D] transition-colors"
              />
            ) : (
              <FiShoppingBag size={14} />
            )}

            <span className="truncate">{store.name}</span>

            {store.isOfficial && (
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
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[#1F2933] leading-tight">
          {title}
        </h3>
        <p className="text-sm text-[#6B7280] line-clamp-2 min-h-[40px]">
          {description}
        </p>
      </div>

      {/* Stock Warning */}
      <div className="mt-3">
        <StockWarningBox stock={stock} badges={badges} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-[#4A6F5D]">{price}₪</span>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isSoldOut) onAddToCart();
            }}
            disabled={isSoldOut}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition shadow-sm ${isSoldOut
              ? "bg-[#9CA3AF] cursor-not-allowed"
              : "bg-[#4A6F5D] hover:bg-[#A33A2B]"
              }`}
          >
            <FiShoppingCart size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isSoldOut) onBuyNow();
            }}
            disabled={isSoldOut}
            className={`px-6 py-2 rounded-full text-white text-sm font-bold transition shadow-sm ${isSoldOut
              ? "bg-[#9CA3AF] cursor-not-allowed"
              : "bg-[#4A6F5D] hover:bg-[#A33A2B]"
              }`}
          >
            {isSoldOut ? "Sold Out" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}



