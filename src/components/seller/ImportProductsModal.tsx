import React, { useState, useRef } from 'react';
import { FiX, FiUploadCloud, FiFileText, FiAlertCircle, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
interface ImportProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    importProductsFn: (formData: FormData) => Promise<{ count: number; message: string }>;
}

export default function ImportProductsModal({ isOpen, onClose, onSuccess, importProductsFn }: ImportProductsModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validation: .xlsx only
        if (!selectedFile.name.endsWith('.xlsx')) {
            toast.error("Invalid file type. Please upload an Excel (.xlsx) file.");
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
            toast.success(`Products imported successfully (${res.count} products)`);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Import failed", err);
            const errorMessage = err.response?.data?.message || "Failed to import products. Please check your file format.";
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
            <div className="bg-zinc-950/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 w-full max-w-lg shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
                {/* Decorative Background Glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Import Inventory</h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">Bulk synchronize consortium catalog</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                        disabled={uploading}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-10 space-y-10 relative z-10">
                    {/* Guidance */}
                    <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                        <div className="flex gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                <FiFileText className="text-emerald-400" size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">Structure Specification</p>
                                <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                                    Excel file must define: <br />
                                    <span className="text-emerald-300/60">name, price, category, stock</span>
                                </p>
                                <p className="text-[9px] text-white/20 mt-3 font-black uppercase tracking-widest italic">
                                    Optional metadata: description, imageUrl
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dropzone/Input Area */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-[2.5rem] p-12 cursor-pointer transition-all duration-500
                            flex flex-col items-center justify-center text-center group overflow-hidden
                            ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'}
                            ${uploading ? 'opacity-30 cursor-not-allowed' : ''}
                        `}
                    >
                        {/* Internal Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".xlsx"
                            className="hidden"
                        />

                        {file ? (
                            <div className="space-y-4 animate-in fade-in zoom-in duration-500 relative z-10">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20 shadow-inner">
                                    <FiCheckCircle size={36} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[300px] mb-1">{file.name}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB • Integrity Verified</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="px-6 py-2 bg-red-500/5 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 transition-all shadow-lg active:scale-95"
                                >
                                    Purge Selection
                                </button>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-white/20 border border-white/5 mx-auto group-hover:bg-white/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-500 transform group-hover:-translate-y-2 shadow-inner">
                                    <FiUploadCloud size={36} />
                                </div>
                                <p className="text-xs font-black text-white uppercase tracking-widest">Initialize Asset Transmission</p>
                                <p className="text-[10px] text-white/20 mt-2 font-black uppercase tracking-widest">Protocol: Direct XLSX Uplink</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-2xl transition-all active:scale-95 disabled:opacity-30"
                        >
                            Abort
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="flex-[2] py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/10 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600/30 hover:border-emerald-500/30 transition-all shadow-xl shadow-black/20 disabled:opacity-20 disabled:shadow-none flex items-center justify-center gap-3 text-xs active:scale-[0.98]"
                        >
                            {uploading ? (
                                <>
                                    <FiLoader className="animate-spin" size={18} />
                                    Synchronizing...
                                </>
                            ) : (
                                "Initiate Matrix Upload"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
