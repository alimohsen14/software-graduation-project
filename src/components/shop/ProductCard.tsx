import { FiShoppingCart } from "react-icons/fi";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  badge?: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductCard({
  image,
  title,
  description,
  price,
  badge,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* IMAGE CONTAINER */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gray-100 mb-4">
        <img src={image} className="w-full h-full object-cover" alt={title} />
        {badge && (
          <span className="absolute top-3 left-3 bg-[#ce1126] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {badge}
          </span>
        )}
      </div>

      {/* TEXT CONTENT */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[#1d2d1f] leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
          {description}
        </p>
      </div>

      {/* FOOTER: Price & Buttons */}
      <div className="mt-6 flex items-center justify-between">
        {/* PRICE (Matching the Green Background) */}
        <span className="text-2xl font-bold text-[#3e6347]">{price}₪</span>

        <div className="flex items-center gap-3">
          {/* Cart Icon - Dark Green */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-10 h-10 rounded-full bg-[#1d2d1f] flex items-center justify-center text-white hover:bg-[#3e6347] transition shadow-md"
            title="Add to Cart"
          >
            <FiShoppingCart size={18} />
          </button>

          {/* Buy Now - Red */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow();
            }}
            className="px-6 py-2 rounded-full bg-[#ce1126] text-white text-sm font-bold hover:bg-[#a40e1e] transition shadow-md"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
