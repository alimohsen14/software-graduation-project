import React, { useState } from "react";
import ProductImage from "./ProductImage";
import ProductPrice from "./ProductPrice";
import StockStatus from "./StockStatus";
import QuantitySelector from "./QuantitySelector";
import AddToCartActions from "./AddToCartActions";
import StarRating from "./StarRating";
import StockWarningBox from "../StockWarningBox";
import { useAuth } from "../../../context/AuthContext";
import ReportProductModal from "../../reports/ReportProductModal";
import { FiFlag } from "react-icons/fi";
import { useTranslation } from "react-i18next";

type Props = {
  id: number;
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
  id,
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
  const { user } = useAuth();
  const { t, i18n } = useTranslation("marketplace");
  const isRtl = i18n.language === "ar";

  const [quantity, setQuantity] = useState(1);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
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
    <section
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start animate-in fade-in duration-700 ${isRtl ? "text-right" : "text-left"}`}
    >
      <ProductImage image={image} badge={badge} badges={badges} name={name} />

      <div className="flex flex-col gap-3 md:gap-4">
        <div className="space-y-1.5 md:space-y-2">
          <h1 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight uppercase leading-snug">
            {name}
          </h1>
          {shortDescription && (
            <p className="text-white/40 text-[10px] md:text-xs leading-relaxed max-w-lg font-medium">
              {shortDescription}
            </p>
          )}
        </div>

        <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
          <StarRating rating={avgRating} reviewsCount={reviewsCount} showText size={14} />
          <div className="h-3 w-px bg-white/10" />
          <ProductPrice price={price} />
        </div>

        <div className="space-y-3 bg-white/5 rounded-xl p-3 md:p-5 border border-white/5 shadow-inner backdrop-blur-sm">
          <div className={`flex items-center justify-between gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
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

          {/* Report Button - Visible for users and sellers, hidden for admins */}
          {user && !user.isAdmin && (
            <div className="pt-1.5 border-t border-white/5 mt-2">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-red-400 transition-all group ${isRtl ? "flex-row-reverse" : ""}`}
              >
                <FiFlag size={10} className="group-hover:scale-110 transition-transform" />
                {t("product.reportProduct")}
              </button>
            </div>
          )}
        </div>
      </div>

      <ReportProductModal
        productId={String(id)}
        productName={name}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}


