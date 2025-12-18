import React, { useState } from "react";
import ProductImage from "./ProductImage";
import ProductPrice from "./ProductPrice";
import StockStatus from "./StockStatus";
import QuantitySelector from "./QuantitySelector";
import AddToCartActions from "./AddToCartActions";
import RatingStars from "./RatingStars";

type Props = {
  name: string;
  image: string;
  badge?: string;
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
  shortDescription,
  price,
  stock,
  rating = 0,
  reviewsCount = 0,
  onAddToCart,
  onBuyNow,
}: Props) {
  const [quantity, setQuantity] = useState(1);

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

  const disabled = stock === 0;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <ProductImage image={image} badge={badge} name={name} />

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold text-[#1d2d1f]">{name}</h1>

        {shortDescription && (
          <p className="text-gray-600 max-w-xl">{shortDescription}</p>
        )}

        <RatingStars rating={rating} reviewsCount={reviewsCount} />

        <ProductPrice price={price} />

        <StockStatus stock={stock} />

        <QuantitySelector
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />

        <AddToCartActions
          disabled={disabled}
          onAddToCart={() => onAddToCart(quantity)}
          onBuyNow={() => onBuyNow(quantity)}
        />
      </div>
    </section>
  );
}
