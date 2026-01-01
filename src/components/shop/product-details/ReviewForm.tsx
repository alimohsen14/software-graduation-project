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
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-900 text-lg">
                {isEditing ? "Edit Your Review" : "Share Your Experience"}
            </h4>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">How would you rate this product?</label>
                <StarRating
                    rating={rating}
                    interactive
                    onRatingChange={setRating}
                    size={28}
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Your Comment (Optional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or disliked..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A6F5D] focus:border-transparent transition-all outline-none min-h-[100px] resize-none text-gray-700"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Attach a photo (Optional)</label>
                <div className="flex items-center gap-4">
                    {imageUrl ? (
                        <div className="relative group w-20 h-20">
                            <img src={imageUrl} alt="Review" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FiX size={12} />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-[#4A6F5D] hover:bg-gray-50 transition-all text-gray-400">
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                            {uploading ? <FiLoader className="animate-spin" size={20} /> : <FiCamera size={20} />}
                            <span className="text-[10px] font-medium mt-1">{uploading ? "Uploading..." : "Add Photo"}</span>
                        </label>
                    )}
                </div>
            </div>

            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={submitting || uploading || rating === 0}
                    className="flex-1 bg-[#4A6F5D] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#3d5c4d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                >
                    {submitting ? <FiLoader className="animate-spin" /> : <FiSend />}
                    {isEditing ? "Update Review" : "Post Review"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
