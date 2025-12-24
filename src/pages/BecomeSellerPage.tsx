import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { applyToBeSeller, SellerApplication } from "../services/seller.service";
import { FiShoppingBag, FiCheckCircle, FiLoader } from "react-icons/fi";

export default function BecomeSellerPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SellerApplication>({
        storeName: "",
        whatToSell: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.storeName.trim() || !formData.whatToSell.trim()) {
            setError("Please fill in all required fields");
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError("Please log in to apply as a seller");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await applyToBeSeller(token, formData);
            setSuccess(true);
        } catch (err: any) {
            console.error("Failed to submit application", err);
            setError(err.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1F2933] mb-2">
                            Application Submitted!
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Your seller application has been submitted successfully. We'll review it and get back to you soon.
                        </p>
                        <button
                            onClick={() => navigate("/marketplace")}
                            className="w-full px-6 py-3 bg-[#4A6F5D] text-white rounded-xl font-bold hover:bg-[#3d5c4d] transition"
                        >
                            Back to Marketplace
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[#eaf5ea] rounded-xl flex items-center justify-center">
                            <FiShoppingBag className="w-6 h-6 text-[#4A6F5D]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1F2933]">Become a Seller</h1>
                            <p className="text-gray-500 text-sm">Start selling on our marketplace</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Store Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                placeholder="Enter your store name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                            />
                        </div>

                        {/* What to Sell */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What do you want to sell? <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="whatToSell"
                                value={formData.whatToSell}
                                onChange={handleChange}
                                placeholder="e.g., Handmade soaps, Olive oil, Crafts"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tell us about your business
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your products and why customers should buy from you..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-[#4A6F5D] text-white rounded-xl font-bold hover:bg-[#3d5c4d] transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin" size={18} />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </button>
                    </form>

                    <p className="text-xs text-gray-400 text-center mt-6">
                        By submitting, you agree to our seller terms and conditions.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
