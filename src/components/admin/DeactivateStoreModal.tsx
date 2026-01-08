import React, { useState } from "react";
import { FiAlertTriangle, FiLoader, FiX } from "react-icons/fi";
import { deactivateStore } from "../../services/adminStoresSupervision.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface DeactivateStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (reason: string) => void;
    storeId: number;
    storeName: string;
}

export default function DeactivateStoreModal({ isOpen, onClose, onSuccess, storeId, storeName }: DeactivateStoreModalProps) {
    const { t } = useTranslation();
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim().length < 10) {
            setError(t("admin.supervision.deactivate_error_length") || "Please provide a more detailed reason (min 10 characters).");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await deactivateStore(storeId, reason);
            toast.success(t("admin.supervision.deactivate_success") || "Store deactivated successfully");
            onSuccess(reason);
            onClose();
        } catch (err: any) {
            console.error("Deactivation failed", err);
            setError(err.response?.data?.message || t("admin.supervision.deactivate_error_generic") || "Failed to deactivate store. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
                    <div className="flex items-center gap-2 text-red-600">
                        <FiAlertTriangle className="w-5 h-5" />
                        <h2 className="font-black text-sm uppercase tracking-wider">{t("admin.supervision.deactivate_modal_title") || "Deactivate Store"}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition" aria-label="Close">
                        <FiX className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {t("admin.supervision.deactivate_warning_start") || "You are about to deactivate"} <span className="font-bold text-gray-900">{storeName}</span>.
                        {t("admin.supervision.deactivate_warning_end") || "This will hide all their products from the marketplace."}
                    </p>

                    <div className="mb-6">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 font-black">
                            {t("admin.supervision.deactivation_reason_field") || "Deactivation Reason"}
                        </label>
                        <textarea
                            autoFocus
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={t("admin.supervision.deactivation_placeholder") || "Explain why this store is being deactivated (e.g., policy violation, inactivity)..."}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition outline-none resize-none"
                        />
                        {error && <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1"><FiAlertTriangle className="w-3 h-3" /> {error}</p>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading || reason.trim().length < 10}
                            className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : (t("admin.supervision.confirm_deactivation_btn") || "Confirm Deactivation")}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="w-full py-3 bg-white text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition border border-gray-100"
                        >
                            {t("common.cancel") || "Cancel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
