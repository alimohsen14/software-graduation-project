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
        <div className="p-6 sm:p-10 min-h-screen">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#1d2d1f]">{window.location.pathname.startsWith('/admin') ? 'Official Store Settings' : 'Store Settings'}</h1>
                    <p className="text-gray-500 mt-1">Update store identity and details.</p>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-500">Loading store details...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">

                        {/* Logo Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">Store Logo</label>
                            <div className="flex items-center gap-6">
                                <div
                                    className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-[#4A6F5D] transition"
                                    onClick={handleLogoClick}
                                >
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Store Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <FiCamera className="text-gray-400 w-8 h-8 group-hover:text-[#4A6F5D] transition" />
                                    )}

                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={handleLogoClick}
                                        disabled={isUploading}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A6F5D] disabled:opacity-50"
                                    >
                                        {isUploading ? 'Uploading...' : 'Change Logo'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Recommended size: 400x400px. JPG, PNG.
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

                        <hr className="border-gray-100" />

                        {/* Details Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6F5D] focus:border-transparent outline-none transition"
                                    placeholder="Enter store name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    maxLength={500}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6F5D] focus:border-transparent outline-none transition resize-none"
                                    placeholder="Describe your store..."
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{formData.description.length}/500</p>
                            </div>

                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving || isUploading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#4A6F5D] text-white font-medium rounded-xl hover:bg-[#3d5c4d] focus:ring-4 focus:ring-[#4A6F5D]/20 disabled:opacity-50 transition shadow-sm"
                                >
                                    <FiSave className="w-4 h-4" />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
