import React, { useEffect, useState, useCallback } from "react";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import {
  getProductReviews,
  createReview,
  updateMyReview,
  deleteMyReview,
  Review
} from "../../../services/review.service";
import { useAuth } from "../../../context/AuthContext";
import { FiMessageSquare, FiLoader } from "react-icons/fi";
import { useTranslation } from "react-i18next";

type Props = {
  productId: number;
  avgRating?: number;
  reviewsCount?: number;
  onMutation?: () => void;
};

export default function ProductReviewsSection({
  productId,
  avgRating = 0,
  reviewsCount = 0,
  onMutation,
}: Props) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Auth Check
  const isAuthenticated = !!user;

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProductReviews(productId);
      // Sort by newest
      setReviews(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Find if current user has a review
  const myReview = isAuthenticated ? reviews.find(r => r.user.name === user?.name) : null;

  const handleCreateReview = async (rating: number, comment: string, imageUrl?: string) => {
    await createReview(productId, { rating, comment, imageUrl });
    await fetchReviews();
    onMutation?.();
  };

  const handleUpdateReview = async (rating: number, comment: string, imageUrl?: string) => {
    await updateMyReview(productId, { rating, comment, imageUrl });
    await fetchReviews();
    setIsEditing(false);
    onMutation?.();
  };

  const handleDeleteReview = async () => {
    if (!window.confirm(t("marketplace.reviews.deleteConfirm"))) return;
    try {
      await deleteMyReview(productId);
      await fetchReviews();
      onMutation?.();
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  };

  return (
    <section className="animate-in fade-in duration-700">
      <div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 ${isRtl ? "xl:flex-row-reverse" : ""}`}>
        <div>
          <h3 className={`text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/40 mb-4 border-emerald-500/30 flex items-center gap-3 ${isRtl ? "border-l-2 pl-3 flex-row-reverse text-right" : "border-r-2 pr-3"}`}>
            {t("marketplace.reviews.title")}
            <span className="bg-white/5 text-white/40 text-[8px] font-black px-2 py-0.5 rounded-full border border-white/5">
              {String(reviews.length).padStart(2, '0')} {t("marketplace.reviews.entries")}
            </span>
          </h3>
          <div className={isRtl ? "flex justify-end" : ""}>
            <StarRating rating={avgRating} reviewsCount={reviewsCount} showText size={18} />
          </div>
        </div>

        {!isAuthenticated && (
          <div className={`bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex items-center gap-4 backdrop-blur-md ${isRtl ? "flex-row-reverse text-right" : ""}`}>
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20 text-amber-500">
              <FiMessageSquare size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-amber-500/40">{t("marketplace.reviews.loginRequired")}</span>
              <p className="text-xs font-bold text-amber-500/80">
                {t("marketplace.reviews.loginToParticipate")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Review Form Area */}
      {isAuthenticated && (
        <div className="mb-8">
          {isEditing ? (
            <ReviewForm
              isEditing
              initialRating={myReview?.rating}
              initialComment={myReview?.comment}
              initialImageUrl={myReview?.imageUrl}
              onSubmit={handleUpdateReview}
              onCancel={() => setIsEditing(false)}
            />
          ) : !myReview ? (
            <ReviewForm onSubmit={handleCreateReview} />
          ) : (
            <div className={`bg-emerald-500/5 border border-emerald-500/10 p-5 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md group/myreview relative overflow-hidden ${isRtl ? "md:flex-row-reverse text-right" : ""}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover/myreview:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10">
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/40 mb-1 block">{t("marketplace.reviews.contributionVerified")}</span>
                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">{t("marketplace.reviews.reviewPublished")}</h4>
                <p className="text-white/40 text-xs font-medium">{t("marketplace.reviews.editDeleteNote")}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="relative z-10 bg-emerald-600/20 text-emerald-400 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-600/30 transition-all active:scale-95 shadow-xl"
              >
                {t("marketplace.reviews.editReview")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reviews List Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-3 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{t("marketplace.reviews.loading")}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center group/null">
          <FiMessageSquare className="text-white/5 mb-6 group-hover:scale-110 transition-transform duration-1000" size={48} />
          <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{t("marketplace.reviews.noReviews")}</h4>
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">{t("marketplace.reviews.beFirst")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwnReview={isAuthenticated && review.user.name === user?.name}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>
      )}
    </section>
  );
}

