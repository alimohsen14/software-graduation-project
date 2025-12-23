import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  badge?: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductCard({
  id,
  image,
  title,
  description,
  price,
  badge,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/shop/product/${id}`)}
      className=" bg-[#eaf5ea] rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-64 w-full rounded-xl overflow-hidden mb-4">
        <img src={image} className="w-full h-full object-cover" alt={title} />
        {badge && (
          <span className="absolute top-3 left-3 bg-[#A33A2B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[#1F2933] leading-tight">
          {title}
        </h3>
        <p className="text-sm text-[#6B7280] line-clamp-2 min-h-[40px]">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-2xl font-bold text-[#4A6F5D]">{price}₪</span>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-10 h-10 rounded-full bg-[#4A6F5D] flex items-center justify-center text-white hover:bg-[#A33A2B] transition shadow-sm"
          >
            <FiShoppingCart size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow();
            }}
            className="px-6 py-2 rounded-full bg-[#4A6F5D] text-white text-sm font-bold hover:bg-[#A33A2B] transition shadow-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
