import React, { useState } from "react";
import { FiLoader, FiX, FiAlertTriangle, FiMessageSquare } from "react-icons/fi";
import { sendWarning } from "../../services/adminStoresSupervision.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface SendWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    storeId: string;
}

export default function SendWarningModal({ isOpen, onClose, onSuccess, storeId }: SendWarningModalProps) {
    const { t } = useTranslation();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            await sendWarning(storeId, message);
            toast.success("Warning sent successfully");
            setMessage("");
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to send warning", err);
            toast.error("Failed to send warning");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
                    <div className="flex items-center gap-2 text-amber-600">
                        <FiAlertTriangle className="w-5 h-5" />
                        <h2 className="font-black text-sm uppercase tracking-wider">Send Official Warning</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition" aria-label="Close">
                        <FiX className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        This message will be sent to the store owner. Use this to warn about policy violations or required actions.
                    </p>

                    <div className="mb-6">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 font-black">
                            Warning Message (Arabic)
                        </label>
                        <textarea
                            autoFocus
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="اكتب رسالة التحذير هنا..."
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition outline-none resize-none"
                            dir="rtl"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            className="w-full py-3 bg-amber-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : "Send Warning"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="w-full py-3 bg-white text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition border border-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
