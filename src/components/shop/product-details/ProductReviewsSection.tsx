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
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await deleteMyReview(productId);
      await fetchReviews();
      onMutation?.();
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  };

  return (
    <section className="mt-16 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 border-l-2 border-emerald-500/30 pl-4 flex items-center gap-4">
            User Experience Registry
            <span className="bg-white/5 text-white/40 text-[9px] font-black px-3 py-1 rounded-full border border-white/5">
              {String(reviews.length).padStart(2, '0')} ENTRIES
            </span>
          </h3>
          <StarRating rating={avgRating} reviewsCount={reviewsCount} showText size={22} />
        </div>

        {!isAuthenticated && (
          <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-[2rem] flex items-center gap-4 backdrop-blur-md">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-500">
              <FiMessageSquare size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/40">Credential Required</span>
              <p className="text-sm font-bold text-amber-500/80">
                Authenticate to contribute to this manifest.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Review Form Area */}
      {isAuthenticated && (
        <div className="mb-16">
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
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[3rem] flex flex-col md:flex-row md:items-center justify-between gap-8 backdrop-blur-md group/myreview relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover/myreview:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/40 mb-2 block">Personal Contribution Verified</span>
                <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-1">Your review is live</h4>
                <p className="text-white/40 text-sm font-medium">Manifest entries can be recalibrated or purged at your discretion.</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="relative z-10 bg-emerald-600/20 text-emerald-400 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-600/30 transition-all active:scale-95 shadow-xl"
              >
                Modify Entry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reviews List Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Manifest Segments</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-32 bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center group/null">
          <FiMessageSquare className="text-white/5 mb-8 group-hover:scale-110 transition-transform duration-1000" size={64} />
          <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Null manifest</h4>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No qualitative data captured for this unit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

