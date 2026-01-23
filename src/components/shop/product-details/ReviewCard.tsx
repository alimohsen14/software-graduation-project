import { FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import StarRating from "./StarRating";
import { Review } from "../../../services/review.service";
import { useTranslation } from "react-i18next";

type Props = {
  review: Review;
  isOwnReview?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ReviewCard({ review, isOwnReview, onEdit, onDelete }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const formattedDate = new Date(review.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : i18n.language === "fr" ? "fr-FR" : "en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`bg-white/5 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all group relative overflow-hidden ${isRtl ? "text-right" : "text-left"}`}>
      {/* Decorative Glow */}
      <div className={`absolute -top-10 w-32 h-32 bg-white/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? "-left-10" : "-right-10"}`} />

      <div className={`flex items-start justify-between mb-4 relative z-10 ${isRtl ? "flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse text-right" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center border border-white/10 text-[9px] font-black text-white/40">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h4 className={`font-black text-white text-xs uppercase tracking-widest leading-none flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
              {review.user.name}
              {isOwnReview && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[7px] px-1.5 py-0.5 rounded-full border border-emerald-500/20 uppercase font-black tracking-widest">
                  {t("marketplace.reviews.author")}
                </span>
              )}
            </h4>
            <div className={`flex items-center gap-1.5 text-white/20 text-[8px] font-black uppercase tracking-widest mt-1 ${isRtl ? "flex-row-reverse" : ""}`}>
              <FiCalendar className="shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {isOwnReview && (
          <div className={`flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all ${isRtl ? "-translate-x-2 group-hover:translate-x-0 flex-row-reverse" : "translate-x-2 group-hover:translate-x-0"}`}>
            <button
              onClick={onEdit}
              className="w-8 h-8 flex items-center justify-center bg-white/5 text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-lg transition-all"
              title={t("marketplace.reviews.edit")}
            >
              <FiEdit2 size={14} />
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 flex items-center justify-center bg-white/5 text-white/30 hover:text-red-500 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-lg transition-all"
              title={t("marketplace.reviews.delete")}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className={`mb-4 relative z-10 ${isRtl ? "flex justify-end" : ""}`}>
        <StarRating rating={review.rating} size={14} />
      </div>

      {review.comment && (
        <div className="relative z-10">
          <div className={`absolute top-0 text-white/5 text-4xl font-black -translate-y-2 ${isRtl ? "right-0 translate-x-2" : "left-0 -translate-x-2"}`}>"</div>
          <p className={`text-white/40 text-xs md:text-sm leading-relaxed italic relative z-10 ${isRtl ? "pr-2" : "pl-2"}`}>
            {review.comment}
          </p>
        </div>
      )}

      {review.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 group/revimg relative z-10">
          <img
            src={review.imageUrl}
            alt="User review attachment"
            className="w-full h-auto object-cover opacity-80 group-hover/revimg:opacity-100 group-hover/revimg:scale-105 transition-all cursor-zoom-in"
          />
        </div>
      )}
    </div>
  );
}

