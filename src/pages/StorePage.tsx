import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getStoreById, getStoreProducts, Store, StoreProduct } from "../services/store.service";
import { FiShoppingBag, FiPackage, FiArrowLeft, FiShield } from "react-icons/fi";
import MarketplaceProductCard from "../components/marketplace/MarketplaceProductCard";

export default function StorePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [storeData, productsData] = await Promise.all([
                    getStoreById(Number(id)),
                    getStoreProducts(Number(id)),
                ]);
                setStore(storeData);
                setProducts(productsData);
            } catch (err) {
                console.error("Failed to load store", err);
                setError("Failed to load store. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Loading store...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !store) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-red-600">{error || "Store not found"}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/marketplace")}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 font-medium text-sm transition"
                    >
                        <FiArrowLeft size={16} />
                        Back to Marketplace
                    </button>

                    {/* Store Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-[#eaf5ea] rounded-xl flex items-center justify-center">
                                <FiShoppingBag className="w-8 h-8 text-[#4A6F5D]" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-bold text-[#1F2933]">{store.name}</h1>
                                    {store.isOfficial && (
                                        <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold">
                                            <FiShield size={12} />
                                            Official Store
                                        </span>
                                    )}
                                </div>
                                {store.description && (
                                    <p className="text-gray-500 text-sm mb-2">{store.description}</p>
                                )}
                                <p className="text-xs text-gray-400">
                                    {products.length} products
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <FiPackage className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No products in this store</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <MarketplaceProductCard
                                    key={product.id}
                                    product={{
                                        ...product,
                                        store: {
                                            id: store.id,
                                            name: store.name,
                                            isOfficial: store.isOfficial,
                                        },
                                    }}
                                    onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                    onStoreClick={() => { }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
