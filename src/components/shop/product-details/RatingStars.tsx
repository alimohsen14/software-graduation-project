import React from "react";
import { FiStar } from "react-icons/fi";

type Props = {
  rating?: number;
  reviewsCount?: number;
  showText?: boolean;
  size?: number;
};

export default function RatingStars({
  rating = 0,
  reviewsCount = 0,
  showText = true,
  size = 14,
}: Props) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <FiStar key={`full-${i}`} size={size} className="text-yellow-400" />
        ))}

        {hasHalf && (
          <FiStar
            size={size}
            className="text-yellow-400 opacity-60"
            title="Half star"
          />
        )}

        {Array.from({ length: emptyStars }).map((_, i) => (
          <FiStar key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>

      {showText && (
        <span className="text-sm text-gray-500">
          {rating.toFixed(1)} ({reviewsCount} reviews)
        </span>
      )}
    </div>
  );
}
