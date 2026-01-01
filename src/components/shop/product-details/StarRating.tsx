import React from "react";
import { FiStar } from "react-icons/fi";

type Props = {
    rating: number;
    max?: number;
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
    size?: number;
    showText?: boolean;
    reviewsCount?: number;
};

export default function StarRating({
    rating,
    max = 5,
    onRatingChange,
    interactive = false,
    size = 16,
    showText = false,
    reviewsCount = 0
}: Props) {
    const fullStars = Math.floor(rating);
    const hasHalf = !interactive && rating - fullStars >= 0.5;
    const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

    const renderStar = (index: number, type: "full" | "half" | "empty") => {
        const key = `${type}-${index}`;
        const className = type === "empty" ? "text-gray-300" : "text-yellow-400";
        const isInteractive = interactive && onRatingChange;

        return (
            <div
                key={key}
                onClick={() => isInteractive && onRatingChange(index + 1)}
                className={`${isInteractive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            >
                <FiStar
                    size={size}
                    fill={type === "full" ? "currentColor" : "none"}
                    className={className}
                />
            </div>
        );
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                    if (i < fullStars) return renderStar(i, "full");
                    if (i === fullStars && hasHalf) return (
                        <div key={`half-${i}`} className="relative">
                            <FiStar size={size} className="text-gray-300" />
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                <FiStar size={size} fill="currentColor" className="text-yellow-400" />
                            </div>
                        </div>
                    );
                    return renderStar(i, "empty");
                })}
            </div>
            {showText && (
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                    {rating.toFixed(1)} {reviewsCount > 0 && `(${reviewsCount} reviews)`}
                </span>
            )}
        </div>
    );
}
