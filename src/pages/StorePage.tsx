import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
    getPublicStoreById,
    getStoreSocialStatus,
    followStore,
    unfollowStore,
    favoriteStore,
    unfavoriteStore,
    Store
} from "../services/store.service";
import { FiShoppingBag, FiPackage, FiArrowLeft, FiShield, FiUser, FiHeart, FiPlus, FiCheck } from "react-icons/fi";
import MarketplaceProductCard from "../components/marketplace/MarketplaceProductCard";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilters";
import { MarketplaceFilters as FiltersType, getMarketplaceProducts, MarketplaceProduct } from "../services/marketplace.service";
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
    const [products, setProducts] = useState<MarketplaceProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FiltersType>({
        page: 1,
        limit: 12
    });
    const [totalPages, setTotalPages] = useState(1);

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
                getMarketplaceProducts({ ...currentFilters, storeId: id }),
            ]);

            setStore(storeData);
            setProducts(productsData.products);
            setTotalPages(productsData.totalPages);
            document.title = `${storeData.name} | Palestine 3D`;

            // 2. Fetch social status only if authenticated
            if (isAuthenticated) {
                try {
                    const social = await getStoreSocialStatus(id);
                    setIsFollowed(social.isFollowed);
                    setIsFavorited(social.isFavorited);
                } catch (socialErr) {
                    console.warn("Failed to fetch social status:", socialErr);
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
            setIsFollowed(previousState);
        } finally {
            setTogglingFollow(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) return navigate("/login");
        if (!store || togglingFavorite) return;

        const previousState = isFavorited;
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
            setIsFavorited(previousState);
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

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className="w-full min-h-screen p-6 sm:p-12 lg:p-20 animate-in fade-in duration-700">
                <div className="max-w-7xl mx-auto">
                    {/* Back Navigation */}
                    <button
                        onClick={() => navigate("/marketplace")}
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white mb-12 transition-all group"
                    >
                        <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Marketplace Exit Terminal
                    </button>

                    {/* Store Branding Header */}
                    <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] border border-white/10 shadow-2xl p-10 md:p-16 mb-16 overflow-hidden relative group">
                        {/* Background decorative glows */}
                        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
                        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />

                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 relative z-10">
                            {/* Logo Wrapper */}
                            <div className="w-40 h-40 bg-zinc-900 rounded-[3rem] flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-105 shrink-0 relative">
                                {store?.logo ? (
                                    <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FiShoppingBag className="w-16 h-16 text-white/10" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Store Details Info */}
                            <div className="flex-1 w-full text-center lg:text-left">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-10">
                                    <div>
                                        <div className="flex items-center justify-center lg:justify-start flex-wrap gap-5 mb-4">
                                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">{store?.name}</h1>
                                            {store?.isOfficial && (
                                                <div className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-500/5">
                                                    <FiShield size={14} />
                                                    Verified Custodian
                                                </div>
                                            )}
                                        </div>
                                        {store?.ownerName && (
                                            <div className="flex items-center justify-center lg:justify-start gap-3">
                                                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                                                    <FiUser size={14} className="text-emerald-500" />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-widest text-white/30">Registry Lead: <span className="text-white">{store.ownerName}</span></span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Interaction Buttons */}
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={handleToggleFavorite}
                                            disabled={togglingFavorite}
                                            className={`w-14 h-14 rounded-2xl border transition-all duration-300 flex items-center justify-center shadow-xl ${isFavorited
                                                ? "bg-red-500/20 border-red-500/30 text-red-500 shadow-red-500/5"
                                                : "bg-white/5 border-white/10 text-white/20 hover:border-red-500/40 hover:text-red-400"
                                                }`}
                                            title={isFavorited ? "Remove priority" : "Mark priority"}
                                        >
                                            <FiHeart size={22} fill={isFavorited ? "currentColor" : "none"} className={togglingFavorite ? "animate-pulse" : ""} />
                                        </button>
                                        <button
                                            onClick={handleToggleFollow}
                                            disabled={togglingFollow}
                                            className={`flex items-center gap-3 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-2xl border ${isFollowed
                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/5"
                                                : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 active:scale-95"
                                                }`}
                                        >
                                            {isFollowed ? (
                                                <><FiCheck size={18} /> Established</>
                                            ) : (
                                                <><FiPlus size={18} /> Establish Link</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {store?.description ? (
                                    <p className="text-white/40 leading-relaxed max-w-3xl mx-auto lg:mx-0 text-base md:text-lg font-medium">
                                        {store.description}
                                    </p>
                                ) : (
                                    <p className="text-white/20 uppercase tracking-widest text-xs italic">Registry entry pending detailed documentation.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Section Header */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5">
                                <FiPackage className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">Unit Inventory</h2>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Catalog Manifest</p>
                            </div>
                        </div>
                    </div>

                    <MarketplaceFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        hideCategory={true}
                    />

                    {loading ? (
                        <div className="min-h-[400px] flex flex-col items-center justify-center animate-pulse">
                            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Catalog...</span>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 flex flex-col items-center justify-center py-32 px-10 text-center animate-in zoom-in duration-500 shadow-2xl">
                            <FiPackage className="w-20 h-20 text-white/10 mb-8" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Null Manifest</h3>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No units available in current segment.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                {products.map((product) => (
                                    <MarketplaceProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                        onStoreClick={() => { }}
                                    />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-20 flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                                        disabled={filters.page === 1}
                                        className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all shadow-xl active:scale-95"
                                    >
                                        Previous Segment
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`w-12 h-12 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center border ${(filters.page || 1) === i + 1
                                                        ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                        : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10 hover:text-white"
                                                    }`}
                                            >
                                                {String(i + 1).padStart(2, '0')}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
                                        disabled={filters.page === totalPages}
                                        className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all shadow-xl active:scale-95"
                                    >
                                        Next Segment
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
