import { FiStar } from "react-icons/fi";
import { useTranslation } from "react-i18next";

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
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "ar";
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
        <div className={`flex items-center gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-1.5 p-2 bg-white/5 rounded-xl border border-white/5 shadow-inner ${isRtl ? "flex-row-reverse" : ""}`}>
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
                                <div className={`absolute inset-0 overflow-hidden w-1/2 ${isRtl ? "right-0" : "left-0"}`}>
                                    <FiStar size={size} fill="currentColor" className="text-amber-500" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {showText && (
                <div className={`flex flex-col ${isRtl ? "items-end text-right" : "items-start text-left"}`}>
                    <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                        <span className="text-xl font-black text-white leading-none">{rating.toFixed(1)}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 whitespace-nowrap">
                            {t("marketplace.reliabilityMetric")}
                        </span>
                    </div>
                    {reviewsCount > 0 && (
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/40">
                            {reviewsCount} {t("marketplace.qualitativeVerifications")}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
