import React, { useState } from "react";
import ProductImage from "./ProductImage";
import ProductPrice from "./ProductPrice";
import StockStatus from "./StockStatus";
import QuantitySelector from "./QuantitySelector";
import AddToCartActions from "./AddToCartActions";
import RatingStars from "./RatingStars";
import StockWarningBox from "../StockWarningBox";
import { ProductBadges } from "../../../services/shopService";

type Props = {
  name: string;
  image: string;
  badge?: string;
  badges?: ProductBadges;
  shortDescription?: string;
  price: number;
  stock: number;
  rating?: number;
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
  rating = 0,
  reviewsCount = 0,
  onAddToCart,
  onBuyNow,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const isSoldOut = badges?.isSoldOut ?? false;

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
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <ProductImage image={image} badge={badge} badges={badges} name={name} />

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2933] leading-tight">
          {name}
        </h1>

        {shortDescription && (
          <p className="text-[#6B7280] text-sm leading-relaxed max-w-md">
            {shortDescription}
          </p>
        )}

        <RatingStars rating={rating} reviewsCount={reviewsCount} />

        <ProductPrice price={price} />

        <StockStatus stock={stock} />

        {/* Stock Warning Box */}
        <StockWarningBox stock={stock} badges={badges} />

        <div className="flex items-center gap-4 mt-2">
          <QuantitySelector
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        </div>

        <AddToCartActions
          disabled={disabled}
          isSoldOut={isSoldOut}
          onAddToCart={() => onAddToCart(quantity)}
          onBuyNow={() => onBuyNow(quantity)}
        />
      </div>
    </section>
  );
}


