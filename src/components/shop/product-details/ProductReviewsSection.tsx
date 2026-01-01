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
    <section className="mt-12 pt-10 border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
            Customer Reviews
            <span className="bg-gray-100 text-gray-500 text-sm font-bold px-3 py-1 rounded-full">
              {reviews.length}
            </span>
          </h3>
          <StarRating rating={avgRating} reviewsCount={reviewsCount} showText size={20} />
        </div>

        {!isAuthenticated && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
            <FiMessageSquare className="text-[#4A6F5D]" />
            <p className="text-sm font-medium text-[#4A6F5D]">
              Log in to share your review!
            </p>
          </div>
        )}
      </div>

      {/* Review Form Area */}
      {isAuthenticated && (
        <div className="mb-12">
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
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[#4A6F5D] mb-1">You've reviewed this product</h4>
                <p className="text-[#4A6F5D]/70 text-sm">Thank you for your feedback! You can update or remove your review anytime.</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#4A6F5D] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#3d5c4d] transition-all"
              >
                Edit Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reviews List Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <FiLoader className="animate-spin" size={32} />
          <p className="font-medium">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <FiMessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
          <h4 className="text-gray-500 font-bold text-lg">No reviews yet</h4>
          <p className="text-gray-400 text-sm">Be the first to share your experience with this item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

