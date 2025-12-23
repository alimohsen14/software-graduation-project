import React from "react";
import RatingStars from "./RatingStars";
import ReviewCard from "./ReviewCard";

type Review = {
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

type Props = {
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
};

export default function ProductReviewsSection({
  rating = 0,
  reviewsCount = 0,
  reviews = [],
}: Props) {
  return (
    <section className="mt-10 pt-8 border-t border-[#E5E7EB]">
      <h3 className="text-lg font-bold text-[#1F2933] mb-4">
        Customer Reviews
      </h3>

      <div className="flex items-center gap-3 mb-6">
        <RatingStars rating={rating} reviewsCount={reviewsCount} />
      </div>

      {reviews.length === 0 ? (
        <p className="text-[#6B7280] text-sm">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              userName={review.userName}
              rating={review.rating}
              comment={review.comment}
              date={review.date}
            />
          ))}
        </div>
      )}
    </section>
  );
}

