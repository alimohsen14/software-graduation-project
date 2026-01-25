import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation("seller");
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-950/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
                {/* Decorative Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shrink-0">
                    <div className="text-right flex-1">
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{t("rejectModal.title")}</h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">{t("rejectModal.subtitle")}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
                    <div className="flex gap-4 p-6 bg-red-500/5 rounded-2xl border border-red-500/10 flex-row-reverse">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/10 shrink-0">
                            <FiAlertCircle className="text-red-500" size={20} />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1.5">{t("rejectModal.critical")}</p>
                            <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                                {t("rejectModal.initiating", { name: productName })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 text-right">
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                            {t("rejectModal.protocol")} <span className="text-red-500/50 ml-1">*</span>
                        </label>
                        <textarea
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            dir="rtl"
                            placeholder={t("rejectModal.placeholder")}
                            className="w-full min-h-[140px] px-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] text-white/60 font-medium placeholder:text-white/10 focus:bg-white/10 focus:border-red-500/30 outline-none transition-all resize-none shadow-inner leading-relaxed text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-2xl transition-all active:scale-95"
                        >
                            {t("rejectModal.abort")}
                        </button>
                        <button
                            type="submit"
                            disabled={!reason.trim() || isSubmitting}
                            className="flex-[2] py-4 bg-red-600/20 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600/30 transition-all shadow-xl shadow-red-500/5 active:scale-[0.98] disabled:opacity-20 text-[10px]"
                        >
                            {isSubmitting ? t("rejectModal.verifying") : t("rejectModal.finalize")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
