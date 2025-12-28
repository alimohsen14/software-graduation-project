import React, { useState } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

interface RejectOrderItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    productName: string;
}

export default function RejectOrderItemModal({
    isOpen,
    onClose,
    onConfirm,
    productName
}: RejectOrderItemModalProps) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;

        try {
            setIsSubmitting(true);
            await onConfirm(reason);
            setReason('');
            onClose();
        } catch (error) {
            console.error('Failed to reject item:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Reject Order Item</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                        <FiAlertCircle className="text-amber-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-900">Confirm Rejection</p>
                            <p className="text-xs text-amber-700 mt-1">
                                You are about to reject <span className="font-bold">{productName}</span>.
                                Please provide a reason to notify the buyer.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Item out of stock, shipping issues..."
                            className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none resize-vertical text-sm overflow-y-auto"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!reason.trim() || isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition shadow-lg shadow-red-200"
                        >
                            {isSubmitting ? 'Processing...' : 'Confirm Reject'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
