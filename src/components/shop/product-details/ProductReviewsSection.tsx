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
    <section className="mt-20">
      <h3 className="text-2xl font-bold text-[#1d2d1f] mb-6">
        Customer Reviews
      </h3>

      <div className="flex items-center gap-4 mb-8">
        <RatingStars rating={rating} reviewsCount={reviewsCount} />
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
