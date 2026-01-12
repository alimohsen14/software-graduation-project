import React, { useState } from "react";
import { FiCamera, FiX, FiLoader, FiSend } from "react-icons/fi";
import StarRating from "./StarRating";
import { uploadImage } from "../../../services/upload.service";

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
            setError("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating.");
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
            setError(err.response?.data?.message || "Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl space-y-8 animate-in zoom-in duration-500">
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
                {isEditing ? "Modify Narrative" : "Register experience"}
            </h4>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">How would you calibrate this unit?</label>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner inline-block">
                    <StarRating
                        rating={rating}
                        interactive
                        onRatingChange={setRating}
                        size={32}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Qualitative Assessment (Optional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Document your experience with this artifact..."
                    className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/10 focus:border-emerald-500/30 focus:bg-white/[0.08] transition-all outline-none min-h-[140px] resize-none text-base"
                />
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Visual Evidence (Optional)</label>
                <div className="flex items-center gap-6">
                    {imageUrl ? (
                        <div className="relative group w-24 h-24">
                            <img src={imageUrl} alt="Review" className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-2xl transition-transform group-hover:scale-105" />
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer w-24 h-24 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-emerald-500/30 hover:bg-white/5 transition-all text-white/20 group">
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                            {uploading ? <FiLoader className="animate-spin" size={24} /> : <FiCamera size={24} className="group-hover:scale-110 transition-transform" />}
                            <span className="text-[9px] font-black uppercase tracking-widest mt-2">{uploading ? "TRANSF..." : "ADD VISUAL"}</span>
                        </label>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl animate-bounce">
                    Error: {error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                    type="submit"
                    disabled={submitting || uploading || rating === 0}
                    className="flex-1 bg-emerald-600/20 text-emerald-400 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 border border-emerald-500/20 hover:bg-emerald-600/30 disabled:opacity-20 transition-all shadow-2xl active:scale-[0.98]"
                >
                    {submitting ? <FiLoader className="animate-spin" /> : <FiSend />}
                    {isEditing ? "Sync Modified Narrative" : "Commit to Global Manifest"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                    >
                        Abort Modification
                    </button>
                )}
            </div>
        </form>
    );
}
