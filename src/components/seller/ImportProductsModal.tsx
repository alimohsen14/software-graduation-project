import React, { useState, useRef } from 'react';
import { FiX, FiUploadCloud, FiFileText, FiAlertCircle, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

interface ImportProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    importProductsFn: (formData: FormData) => Promise<{ count: number; message: string }>;
}

export default function ImportProductsModal({ isOpen, onClose, onSuccess, importProductsFn }: ImportProductsModalProps) {
    const { t, i18n } = useTranslation("seller");
    const isAr = i18n.language === "ar";
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validation: .xlsx only
        if (!selectedFile.name.endsWith('.xlsx')) {
            toast.error(t("importModal.invalidFileType"));
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await importProductsFn(formData);
            toast.success(t("importModal.importSuccess", { count: res.count }));
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Import failed", err);
            const errorMessage = err.response?.data?.message || t("importModal.importFailed");
            toast.error(errorMessage, {
                autoClose: 6000,
                icon: <FiAlertCircle className="text-red-500" />
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`bg-zinc-950/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 w-full max-w-lg shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative ${isAr ? "text-right" : "text-left"}`}>
                {/* Decorative Background Glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className={`px-6 md:px-10 py-6 md:py-8 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shrink-0 ${isAr ? "flex-row-reverse" : ""}`}>
                    <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-none">{t("importModal.title")}</h3>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-2">{t("importModal.subtitle")}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                        disabled={uploading}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-6 md:p-10 space-y-8 md:space-y-10 relative z-10">
                    {/* Guidance */}
                    <div className="bg-emerald-500/10 rounded-2xl p-5 md:p-6 border border-emerald-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                        <div className={`flex gap-4 relative z-10 ${isAr ? "flex-row-reverse text-right" : "text-left"}`}>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                <FiFileText className="text-emerald-400" size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">{t("importModal.instructionsTitle")}</p>
                                <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                                    {t("importModal.instructionsDesc")}<br />
                                    <span className="text-emerald-300/60">name, price, category, stock</span>
                                </p>
                                <p className="text-[9px] text-white/20 mt-3 font-black uppercase tracking-widest italic">
                                    {t("importModal.optionalColumns")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dropzone/Input Area */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-[2.5rem] p-8 md:p-12 cursor-pointer transition-all duration-500
                            flex flex-col items-center justify-center text-center group overflow-hidden
                            ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'}
                            ${uploading ? 'opacity-30 cursor-not-allowed' : ''}
                        `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".xlsx"
                            className="hidden"
                        />

                        {file ? (
                            <div className="space-y-4 animate-in fade-in zoom-in duration-500 relative z-10">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20 shadow-inner">
                                    <FiCheckCircle size={32} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[250px] mb-1">{file.name}</p>
                                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB • {t("importModal.readyToUpload")}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="px-6 py-2 bg-red-500/5 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 transition-all shadow-lg active:scale-95"
                                >
                                    {t("importModal.cancelFile")}
                                </button>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 text-white/20 border border-white/5 mx-auto group-hover:bg-white/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-500 transform group-hover:-translate-y-2 shadow-inner">
                                    <FiUploadCloud size={32} />
                                </div>
                                <p className="text-[11px] md:text-xs font-black text-white uppercase tracking-widest">{t("importModal.dropzonePlaceholder")}</p>
                                <p className="text-[9px] text-white/20 mt-2 font-black uppercase tracking-widest">{t("importModal.formatRequired")}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="flex-[2] py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/10 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-600/30 hover:border-emerald-500/30 transition-all shadow-xl disabled:opacity-20 flex items-center justify-center gap-3 text-xs active:scale-[0.98]"
                        >
                            {uploading ? (
                                <>
                                    <FiLoader className="animate-spin" size={18} />
                                    {t("importModal.importing")}
                                </>
                            ) : (
                                t("importModal.startImport")
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl transition-all active:scale-95 disabled:opacity-30"
                        >
                            {t("importModal.cancel")}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
