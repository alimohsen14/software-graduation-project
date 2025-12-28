import React, { useState, useRef } from 'react';
import { FiX, FiUploadCloud, FiFileText, FiAlertCircle, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { importProductsFromExcel } from '../../services/seller.service';

interface ImportProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ImportProductsModal({ isOpen, onClose, onSuccess }: ImportProductsModalProps) {
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
            const res = await importProductsFromExcel(formData);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-[#1d2d1f]">Import Products</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Bulk upload via Excel spreadsheet</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-xl"
                        disabled={uploading}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Guidance */}
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                        <div className="flex gap-3">
                            <FiFileText className="text-emerald-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-emerald-900">Required Columns</p>
                                <p className="text-xs text-emerald-800 leading-relaxed mt-1 opacity-80">
                                    Your Excel file MUST contain: <br />
                                    <span className="font-bold underline">name, price, category, stock</span>
                                </p>
                                <p className="text-xs text-emerald-700 mt-2 italic">
                                    Optional: description, imageUrl
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dropzone/Input Area */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-3xl p-10 cursor-pointer transition-all duration-300
                            flex flex-col items-center justify-center text-center group
                            ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-[#4A6F5D] hover:bg-gray-50/50'}
                            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
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
                            <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                                    <FiCheckCircle size={32} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 truncate max-w-[280px]">{file.name}</p>
                                    <p className="text-[11px] text-gray-500 font-medium">{(file.size / 1024).toFixed(1)} KB • Ready to upload</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 border-b border-rose-200 mt-2 transition-colors uppercase tracking-wider"
                                >
                                    Remove file
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-400 group-hover:bg-[#4A6F5D]/10 group-hover:text-[#4A6F5D] transition-all duration-300 transform group-hover:-translate-y-1">
                                    <FiUploadCloud size={32} />
                                </div>
                                <p className="text-sm font-bold text-gray-900">Click to upload spreadsheet</p>
                                <p className="text-[11px] text-gray-400 mt-2 font-medium">Support: .xlsx files only</p>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 py-4 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="flex-[2] py-4 bg-[#1d2d1f] text-white rounded-2xl font-bold hover:bg-[#2a3f2d] transition shadow-lg shadow-gray-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <FiLoader className="animate-spin" size={18} />
                                    Importing...
                                </>
                            ) : (
                                "Start Import"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
