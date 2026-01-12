import React, { useState } from "react";
import ProductImage from "./ProductImage";
import ProductPrice from "./ProductPrice";
import StockStatus from "./StockStatus";
import QuantitySelector from "./QuantitySelector";
import AddToCartActions from "./AddToCartActions";
import StarRating from "./StarRating";
import StockWarningBox from "../StockWarningBox";

type Props = {
  name: string;
  image: string;
  badge?: string;
  badges?: string[];
  shortDescription?: string;
  price: number;
  stock: number;
  avgRating?: number;
  reviewsCount?: number;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
};

export default function ProductHeroSection({
  name,
  image,
  badge,
  badges,
  shortDescription,
  price,
  stock,
  avgRating = 0,
  reviewsCount = 0,
  onAddToCart,
  onBuyNow,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const isSoldOut = badges?.includes("SOLD_OUT") ?? false;

  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const disabled = stock === 0 || isSoldOut;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start animate-in fade-in duration-700">
      <ProductImage image={image} badge={badge} badges={badges} name={name} />

      <div className="flex flex-col gap-8">
        <div className="space-y-3">
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            {name}
          </h1>
          {shortDescription && (
            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-lg">
              {shortDescription}
            </p>
          )}
        </div>

        <div className="flex items-center gap-6">
          <StarRating rating={avgRating} reviewsCount={reviewsCount} showText size={18} />
          <div className="h-4 w-px bg-white/10" />
          <ProductPrice price={price} />
        </div>

        <div className="space-y-6 bg-white/5 rounded-[2rem] p-8 border border-white/5 shadow-inner">
          <div className="flex items-center justify-between">
            <StockStatus stock={stock} />
            <QuantitySelector
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </div>

          <StockWarningBox stock={stock} badges={badges} />

          <AddToCartActions
            disabled={disabled}
            isSoldOut={isSoldOut}
            onAddToCart={() => onAddToCart(quantity)}
            onBuyNow={() => onBuyNow(quantity)}
          />
        </div>
      </div>
    </section>
  );
}


