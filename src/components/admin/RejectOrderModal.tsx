import React, { useState } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";

type Props = {
    orderId: string;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading?: boolean;
};

export default function RejectOrderModal({
    orderId,
    onClose,
    onConfirm,
    isLoading = false,
}: Props) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError("Rejection reason is required");
            return;
        }
        setError("");
        onConfirm(reason.trim());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <FiX size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <FiAlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Reject Order</h2>
                        <p className="text-sm text-gray-500">Order #{orderId}</p>
                    </div>
                </div>

                {/* Reason Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please provide a reason for rejecting this order..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 transition resize-none"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {isLoading ? "Rejecting..." : "Reject Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}
