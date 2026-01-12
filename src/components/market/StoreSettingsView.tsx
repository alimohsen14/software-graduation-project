import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as sellerService from '../../services/seller.service';
import * as adminService from '../../services/admin.service';
import { FiCamera, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const getService = () => window.location.pathname.startsWith('/admin') ? adminService : sellerService;

export default function StoreSettingsView() {
    const service = getService();
    const [store, setStore] = useState<sellerService.SellerStore | null>(null);
    const [loading, setLoading] = useState(true);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { refreshUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const data = await service.getStore();
                if (data) {
                    setStore(data);
                    setFormData({
                        name: data.name,
                        description: data.description || ''
                    });
                    setLogoPreview(data.logo || null);
                }
            } catch (err) {
                console.error("Failed to fetch store details", err);
                toast.error("Failed to load store details");
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Store name is required");
            return;
        }

        try {
            setIsSaving(true);
            const updatedStore = await service.updateStoreDetails({
                name: formData.name,
                description: formData.description
            });
            setStore(updatedStore);
            toast.success("Store details updated successfully");
            await refreshUser();
            navigate(window.location.pathname.startsWith('/admin') ? "/admin/market" : "/seller");
        } catch (err: any) {
            console.error("Failed to update store", err);
            const msg = err.response?.data?.message || "Failed to update store details";
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size too large (max 5MB)");
            return;
        }

        try {
            setIsUploading(true);
            const data = new FormData();
            data.append('file', file);

            const { logo } = await service.uploadStoreLogo(data);
            setLogoPreview(logo);
            toast.success("Logo uploaded successfully");

            if (store) {
                setStore({ ...store, logo });
            }
            await refreshUser();
        } catch (err) {
            console.error("Failed to upload logo", err);
            toast.error("Failed to upload logo");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="py-10 px-6 max-w-3xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                    {window.location.pathname.startsWith('/admin') ? 'Official Store' : 'Vendor Profile'}
                </h1>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Customize your platform identity and storefront</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-xl">
                    <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="mt-6 font-black text-white/20 uppercase tracking-widest text-[10px]">Awaiting Store Data...</p>
                </div>
            ) : (
                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-10 space-y-12 shadow-2xl relative overflow-hidden">
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Logo Section */}
                    <div>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">Store Brandmark</label>
                        <div className="flex flex-col sm:flex-row items-center gap-10">
                            <div
                                className="relative w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-500 shadow-inner"
                                onClick={handleLogoClick}
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Store Logo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <FiCamera className="text-white/20 w-10 h-10 group-hover:text-emerald-400/50 transition-colors" />
                                )}

                                {isUploading && (
                                    <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Uploading</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <button
                                    type="button"
                                    onClick={handleLogoClick}
                                    disabled={isUploading}
                                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 shadow-lg"
                                >
                                    {isUploading ? 'Processing...' : 'Upload New Logo'}
                                </button>
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-4 leading-relaxed">
                                    Square ratio recommended.<br />Maximum 5MB file size.
                                </p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Details Form */}
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Store Display Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner"
                                    placeholder="Enter store name..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Store Biography</label>
                                <textarea
                                    rows={5}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    maxLength={500}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-white/70 font-medium placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all resize-none shadow-inner leading-relaxed"
                                    placeholder="Tell the community about your craft..."
                                />
                                <div className="flex justify-end mt-2">
                                    <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">{formData.description.length} / 500</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSaving || isUploading}
                                className="flex items-center gap-3 px-10 py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600/30 hover:shadow-emerald-500/10 transition-all disabled:opacity-30 shadow-xl"
                            >
                                <FiSave size={18} />
                                {isSaving ? 'Syncing Changes...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
