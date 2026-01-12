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
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 p-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                {Array.from({ length: 5 }).map((_, i) => {
                    const isFull = i < fullStars;
                    const isHalf = i === fullStars && hasHalf;
                    const isInteractive = interactive && onRatingChange;

                    return (
                        <div
                            key={i}
                            onClick={() => isInteractive && onRatingChange(i + 1)}
                            className={`relative ${isInteractive ? "cursor-pointer hover:scale-125 transition-transform duration-300" : ""}`}
                        >
                            <FiStar
                                size={size}
                                fill={isFull ? "currentColor" : "none"}
                                className={`${isFull ? "text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "text-white/10"}`}
                            />
                            {isHalf && (
                                <div className="absolute inset-0 overflow-hidden w-1/2">
                                    <FiStar size={size} fill="currentColor" className="text-amber-500" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {showText && (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-white leading-none">{rating.toFixed(1)}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 whitespace-nowrap">
                            Reliability Metric
                        </span>
                    </div>
                    {reviewsCount > 0 && (
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/40">
                            {reviewsCount} Qualitative Verifications
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
