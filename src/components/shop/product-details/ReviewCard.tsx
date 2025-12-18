import React from "react";
import RatingStars from "./RatingStars";

type Props = {
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

export default function ReviewCard({ userName, rating, comment, date }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-[#1d2d1f]">{userName}</h4>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      <RatingStars rating={rating} showText={false} size={14} />

      <p className="mt-3 text-gray-600 text-sm leading-relaxed">{comment}</p>
    </div>
  );
}
