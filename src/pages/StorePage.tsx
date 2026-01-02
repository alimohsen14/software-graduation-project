import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
    getPublicStoreById,
    getStoreProducts,
    getStoreSocialStatus,
    followStore,
    unfollowStore,
    favoriteStore,
    unfavoriteStore,
    Store,
    StoreProduct
} from "../services/store.service";
import { FiShoppingBag, FiPackage, FiArrowLeft, FiShield, FiUser, FiHeart, FiPlus, FiCheck } from "react-icons/fi";
import MarketplaceProductCard from "../components/marketplace/MarketplaceProductCard";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilters";
import { MarketplaceFilters as FiltersType } from "../services/marketplace.service";
import { useAuth } from "../context/AuthContext";

/**
 * Store Page
 * Displays public store information, products, and social status.
 */
export default function StorePage() {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAuthenticated = !!user;

    // Core States
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FiltersType>({});

    // Social States
    const [isFollowed, setIsFollowed] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [togglingFollow, setTogglingFollow] = useState(false);
    const [togglingFavorite, setTogglingFavorite] = useState(false);

    // Consolidated Fetch Data Handler
    const fetchData = useCallback(async (id: number, currentFilters: FiltersType) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch public store data and products (concurrently)
            const [storeData, productsData] = await Promise.all([
                getPublicStoreById(id),
                getStoreProducts(id, currentFilters),
            ]);

            setStore(storeData);
            setProducts(productsData.filter(p => p.isActive !== false));
            document.title = `${storeData.name} | Palestine 3D`;

            // 2. Fetch social status only if authenticated
            if (isAuthenticated) {
                try {
                    const social = await getStoreSocialStatus(id);
                    setIsFollowed(social.isFollowed);
                    setIsFavorited(social.isFavorited);
                } catch (socialErr) {
                    console.warn("Failed to fetch social status:", socialErr);
                    // Default to false if social status fails
                    setIsFollowed(false);
                    setIsFavorited(false);
                }
            } else {
                setIsFollowed(false);
                setIsFavorited(false);
            }
        } catch (err: any) {
            console.error("Critical store load failure:", err);
            if (err.response?.status === 404) {
                setError("Store not found");
            } else {
                setError("Failed to load store. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const numericStoreId = Number(storeId);
        if (!storeId || Number.isNaN(numericStoreId)) {
            setError("Invalid store");
            setLoading(false);
            return;
        }
        fetchData(numericStoreId, filters);
        return () => { document.title = "Palestine 3D"; };
    }, [storeId, fetchData, filters]);

    // Action Handlers
    const handleToggleFollow = async () => {
        if (!isAuthenticated) return navigate("/login");
        if (!store || togglingFollow) return;

        const previousState = isFollowed;
        // Optimistic Update
        setIsFollowed(!previousState);
        setTogglingFollow(true);

        try {
            if (previousState) {
                await unfollowStore(store.id);
            } else {
                await followStore(store.id);
            }
        } catch (err) {
            console.error("Follow toggle failed:", err);
            // Revert on error
            setIsFollowed(previousState);
        } finally {
            setTogglingFollow(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) return navigate("/login");
        if (!store || togglingFavorite) return;

        const previousState = isFavorited;
        // Optimistic Update
        setIsFavorited(!previousState);
        setTogglingFavorite(true);

        try {
            if (previousState) {
                await unfavoriteStore(store.id);
            } else {
                await favoriteStore(store.id);
            }
        } catch (err: any) {
            console.error("Favorite toggle failed:", err);
            // Revert on error
            setIsFavorited(previousState);

            // Handle specific 400 error (limit reached)
            if (err.response?.status === 400) {
                alert("You can favorite up to 10 stores only");
            }
        } finally {
            setTogglingFavorite(false);
        }
    };

    const handleFilterChange = (newFilters: FiltersType) => {
        setFilters(newFilters);
    };

    // Error State
    if (error || (!loading && !store)) {
        return (
            <DashboardLayout>
                <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-red-50 text-red-600 p-8 rounded-3xl mb-8 max-w-md shadow-sm border border-red-100">
                        <FiShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                        <p className="opacity-90">{error || "This store doesn't exist."}</p>
                    </div>
                    <button
                        onClick={() => navigate("/marketplace")}
                        className="flex items-center gap-2 px-8 py-3 bg-[#4A6F5D] text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        <FiArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // Loading State
    if (loading && !store) {
        return (
            <DashboardLayout>
                <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#4A6F5D]/20 border-t-[#4A6F5D] rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium tracking-wide">Fetching Store Information...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen p-4 sm:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Back Navigation */}
                    <button
                        onClick={() => navigate("/marketplace")}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#4A6F5D] mb-8 font-semibold text-sm transition group"
                    >
                        <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Explore Marketplace
                    </button>

                    {/* Store Branding Header */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-10 mb-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A6F5D]/5 rounded-bl-[5rem] -mr-10 -mt-10"></div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                            {/* Logo Wrapper */}
                            <div className="w-28 h-28 bg-[#f8faf9] rounded-3xl flex items-center justify-center overflow-hidden border-2 border-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0">
                                {store?.logo ? (
                                    <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FiShoppingBag className="w-12 h-12 text-[#4A6F5D]/30" />
                                )}
                            </div>

                            {/* Store Details Info */}
                            <div className="flex-1 w-full text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                    <div>
                                        <div className="flex items-center justify-center md:justify-start flex-wrap gap-3 mb-2">
                                            <h1 className="text-4xl font-black text-[#1F2933] tracking-tight">{store?.name}</h1>
                                            {store?.isOfficial && (
                                                <div className="bg-[#4A6F5D] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                                    <FiShield size={12} />
                                                    Official
                                                </div>
                                            )}
                                        </div>
                                        {store?.ownerName && (
                                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 font-medium">
                                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <FiUser size={12} className="text-[#4A6F5D]" />
                                                </div>
                                                <span>Curated by <span className="text-gray-900 font-bold">{store.ownerName}</span></span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Interaction Buttons */}
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={handleToggleFavorite}
                                            disabled={togglingFavorite}
                                            className={`p-3 rounded-2xl border transition-all duration-300 ${isFavorited
                                                ? "bg-red-50 border-red-100 text-red-500 shadow-sm"
                                                : "bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400"
                                                }`}
                                            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                                        >
                                            <FiHeart size={20} fill={isFavorited ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={handleToggleFollow}
                                            disabled={togglingFollow}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${isFollowed
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                : "bg-[#4A6F5D] text-white shadow-lg shadow-[#4A6F5D]/20 hover:-translate-y-0.5"
                                                }`}
                                        >
                                            {isFollowed ? (
                                                <><FiCheck size={18} /> Following</>
                                            ) : (
                                                <><FiPlus size={18} /> Follow Store</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {store?.description ? (
                                    <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0 text-sm md:text-base">
                                        {store.description}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic text-sm">Welcome to our official store page on Palestine 3D.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4A6F5D]/10 rounded-xl flex items-center justify-center">
                                <FiPackage className="text-[#4A6F5D]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1F2933]">Available Products</h2>
                            <span className="text-gray-400 font-medium ml-2">({products.length})</span>
                        </div>
                    </div>

                    <MarketplaceFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        hideCategory={true}
                    />

                    {loading ? (
                        <div className="min-h-[200px] flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-[#4A6F5D]/20 border-t-[#4A6F5D] rounded-full animate-spin"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center py-20 px-4 text-center">
                            <FiPackage className="w-16 h-16 text-gray-200 mb-6" />
                            <h3 className="text-xl font-bold text-gray-500 mb-2">No Products Found</h3>
                            <p className="text-gray-400 max-w-xs">No products match your current price filter. Please try a different range.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <MarketplaceProductCard
                                    key={product.id}
                                    product={{
                                        ...product,
                                        store: {
                                            id: store!.id,
                                            name: store!.name,
                                            logo: store?.logo || null,
                                            isOfficial: store?.isOfficial || false,
                                        },
                                        isActive: product.isActive
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
