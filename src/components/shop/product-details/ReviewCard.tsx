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
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-[#1F2933] text-sm">{userName}</h4>
        <span className="text-xs text-[#6B7280]">{date}</span>
      </div>

      <RatingStars rating={rating} showText={false} size={12} />

      <p className="mt-2 text-[#6B7280] text-sm leading-relaxed">{comment}</p>
    </div>
  );
}

