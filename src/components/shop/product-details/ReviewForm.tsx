import React, { useState } from "react";
import { FiCamera, FiX, FiLoader, FiSend } from "react-icons/fi";
import StarRating from "./StarRating";
import { uploadImage } from "../../../services/upload.service";
import { useTranslation } from "react-i18next";

type Props = {
    initialRating?: number;
    initialComment?: string;
    initialImageUrl?: string;
    onSubmit: (rating: number, comment: string, imageUrl?: string) => Promise<void>;
    onCancel?: () => void;
    isEditing?: boolean;
};

export default function ReviewForm({
    initialRating = 0,
    initialComment = "",
    initialImageUrl = "",
    onSubmit,
    onCancel,
    isEditing = false
}: Props) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "ar";

    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState(initialComment);
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError(null);
            const url = await uploadImage(file);
            setImageUrl(url);
        } catch (err) {
            setError(t("marketplace.reviews.uploadFailed"));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError(t("marketplace.reviews.selectRating"));
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await onSubmit(rating, comment, imageUrl);
            if (!isEditing) {
                setRating(0);
                setComment("");
                setImageUrl("");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || t("marketplace.reviews.submitFailed"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`bg-black/40 backdrop-blur-xl rounded-2xl p-5 md:p-6 border border-white/10 shadow-2xl space-y-5 animate-in zoom-in duration-500 ${isRtl ? "text-right" : "text-left"}`}>
            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">
                {isEditing ? t("marketplace.reviews.editReview") : t("marketplace.reviews.addReview")}
            </h4>

            <div className="space-y-3">
                <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">{t("marketplace.reviews.ratingLabel")}</label>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 shadow-inner inline-block">
                    <StarRating
                        rating={rating}
                        interactive
                        onRatingChange={setRating}
                        size={24}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">{t("marketplace.reviews.commentLabel")}</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t("marketplace.reviews.commentPlaceholder")}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/10 focus:border-emerald-500/30 focus:bg-white/[0.08] transition-all outline-none min-h-[90px] resize-none text-sm ${isRtl ? "text-right" : "text-left"}`}
                />
            </div>

            <div className="space-y-3">
                <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">{t("marketplace.reviews.visualProof")}</label>
                <div className={`flex items-center gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {imageUrl ? (
                        <div className="relative group w-16 h-16">
                            <img src={imageUrl} alt="Review" className="w-full h-full object-cover rounded-xl border border-white/10 shadow-xl transition-transform group-hover:scale-105" />
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <FiX size={10} />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer w-16 h-16 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-emerald-500/30 hover:bg-white/5 transition-all text-white/20 group">
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                            {uploading ? <FiLoader className="animate-spin" size={16} /> : <FiCamera size={16} className="group-hover:scale-110 transition-transform" />}
                            <span className="text-[7px] font-black uppercase tracking-widest mt-1 text-center leading-tight">{uploading ? t("marketplace.reviews.uploading") : t("marketplace.reviews.addImage")}</span>
                        </label>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded-lg">
                    {t("marketplace.reviews.error")}: {error}
                </div>
            )}

            <div className={`flex flex-col sm:flex-row gap-3 pt-2 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
                <button
                    type="submit"
                    disabled={submitting || uploading || rating === 0}
                    className="flex-1 bg-emerald-600/20 text-emerald-400 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-emerald-500/20 hover:bg-emerald-600/30 disabled:opacity-20 transition-all shadow-xl active:scale-[0.98]"
                >
                    {submitting ? <FiLoader className="animate-spin" /> : <FiSend />}
                    {isEditing ? t("marketplace.reviews.updateReview") : t("marketplace.reviews.addReview")}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                    >
                        {t("marketplace.reviews.cancel")}
                    </button>
                )}
            </div>
        </form>
    );
}
