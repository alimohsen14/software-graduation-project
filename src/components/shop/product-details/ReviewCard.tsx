import { FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import StarRating from "./StarRating";
import { Review } from "../../../services/review.service";

type Props = {
  review: Review;
  isOwnReview?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ReviewCard({ review, isOwnReview, onEdit, onDelete }: Props) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-gray-900 text-sm leading-none flex items-center gap-2">
            {review.user.name}
            {isOwnReview && (
              <span className="bg-[#4A6F5D]/10 text-[#4A6F5D] text-[10px] px-1.5 py-0.5 rounded uppercase font-extrabold tracking-tight">
                You
              </span>
            )}
          </h4>
          <div className="flex items-center gap-2 text-[#6B7280] text-[11px]">
            <FiCalendar className="shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {isOwnReview && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-[#4A6F5D] hover:bg-emerald-50 rounded-lg transition-colors"
              title="Edit Review"
            >
              <FiEdit2 size={14} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Review"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <StarRating rating={review.rating} size={14} />

      {review.comment && (
        <p className="mt-3 text-gray-600 text-sm leading-relaxed italic">
          "{review.comment}"
        </p>
      )}

      {review.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 max-w-[120px]">
          <img
            src={review.imageUrl}
            alt="User review attachment"
            className="w-full h-auto object-cover hover:scale-110 transition-transform cursor-zoom-in"
          />
        </div>
      )}
    </div>
  );
}

