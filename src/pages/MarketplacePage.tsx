import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilters";
import MarketplaceProductCard from "../components/marketplace/MarketplaceProductCard";
import StoreSocialLists from "../components/marketplace/StoreSocialLists";
import {
    getMarketplaceProducts,
    MarketplaceProduct,
    MarketplaceFilters as FiltersType,
} from "../services/marketplace.service";
import { getFollowedStores, getFavoriteStores, Store } from "../services/store.service";
import { FiPackage, FiUsers, FiHeart, FiSearch, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

export default function MarketplacePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth(); // Global Auth
    const { toggleCart, cartItems } = useCart();
    const [products, setProducts] = useState<MarketplaceProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FiltersType>({
        page: 1,
        limit: 12
    });
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState(filters.name || "");

    // Logic for "Reset Filters"
    const handleResetFilters = () => {
        setSearchTerm("");
        setFilters({
            page: 1,
            limit: 12,
            name: undefined,
            category: undefined,
            minPrice: undefined,
            maxPrice: undefined
        });
    };

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.name || "")) {
                setFilters(prev => ({ ...prev, name: searchTerm || undefined, page: 1 }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, filters.name]);

    // Social Lists State
    const [socialModalType, setSocialModalType] = useState<'followed' | 'favorite' | null>(null);
    const [socialStores, setSocialStores] = useState<Store[]>([]);
    const [loadingSocial, setLoadingSocial] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Backend-driven pagination and filtering
                const res = await getMarketplaceProducts(filters);

                // Use products from the paginated response, handle potential undefined
                const productsArray = res.products || (Array.isArray(res) ? res : []);
                setProducts(productsArray);
                setTotalPages(res.totalPages || 1);
            } catch (err) {
                console.error("Failed to load marketplace", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    const handleFilterChange = (newFilters: FiltersType) => {
        setFilters(newFilters);
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenSocialModal = async (type: 'followed' | 'favorite') => {
        setSocialModalType(type);
        setLoadingSocial(true);
        try {
            const stores = type === 'followed' ? await getFollowedStores() : await getFavoriteStores();
            setSocialStores(stores);
        } catch (err) {
            console.error(`Failed to fetch ${type} stores`, err);
        } finally {
            setLoadingSocial(false);
        }
    };

    // Client-side instant filter for current page
    const displayProducts = React.useMemo(() => {
        if (!searchTerm.trim()) return products;
        const normalized = searchTerm.toLowerCase().trim();
        return products.filter(p =>
            p.name.toLowerCase().includes(normalized) ||
            p.shortDescription?.toLowerCase().includes(normalized) ||
            p.category?.toLowerCase().includes(normalized)
        );
    }, [products, searchTerm]);

    const isSearching = searchTerm.trim() !== (filters.name || "");


    // Logic for "Become a Seller" button
    // user.isSeller is now normalized in AuthContext to include Admins
    const isSeller = !!user?.isSeller;
    const isPending = user?.sellerRequest?.status === "PENDING";
    const showBecomeSeller = !isSeller && !isPending && !user?.isAdmin;

    return (
        <DashboardLayout>
            <div className="relative min-h-screen">
                {/* 1. Hero Section */}
                <section className="relative pt-12 md:pt-24 pb-8 md:pb-16 px-6 sm:px-10 overflow-hidden" dir="rtl">
                    {/* Dark gradient overlay for readability */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10 text-right">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tight">
                                {t("marketplace.title")}
                            </h1>
                            <p className="text-base md:text-xl text-white/80 font-medium max-w-2xl leading-relaxed">
                                {t("marketplace.subtitle")}
                            </p>
                        </motion.div>

                        {/* Quick Actions (Moved from Header) */}
                        <div className="flex flex-wrap items-center justify-start gap-4 mt-8">
                            {showBecomeSeller && (
                                <button
                                    onClick={() => navigate("/become-seller")}
                                    className="px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xl flex items-center gap-2 group"
                                >
                                    <FiPackage className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span>{t("marketplace.joinAsSeller")}</span>
                                </button>
                            )}
                            {(isSeller || !!user?.isAdmin) && (
                                <button
                                    onClick={() => navigate(user?.isAdmin ? "/admin/market" : "/seller")}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-xl"
                                >
                                    {user?.isAdmin ? t("marketplace.dashboard") : t("marketplace.sellerAccount")}
                                </button>
                            )}

                            {/* Cart Toggle */}
                            <button
                                onClick={toggleCart}
                                className="relative w-12 h-12 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center transition-all active:scale-95 group shadow-xl"
                            >
                                <FiShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#1a1a1a] shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-in zoom-in duration-300">
                                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                <div className="w-full p-6 sm:p-8 lg:px-10">
                    <div className="max-w-7xl mx-auto" dir="rtl">
                        {isPending && (
                            <div className="mb-8 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-4 rounded-3xl flex items-center gap-4 backdrop-blur-md">
                                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                                    <FiPackage className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-0.5">{t("marketplace.status")}: {t("auth.pending")}</span>
                                    <span className="text-xs font-bold">{t("marketplace.pendingReview")}</span>
                                </div>
                            </div>
                        )}

                        {/* Social Stats Quick Links */}
                        {user && (
                            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                                <button
                                    onClick={() => handleOpenSocialModal('followed')}
                                    className="flex items-center gap-3 px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wide transition-all shadow-xl group active:scale-95"
                                >
                                    <FiUsers size={16} className="group-hover:scale-110 transition-transform" />
                                    {t("marketplace.followedStores")}
                                </button>
                                <button
                                    onClick={() => handleOpenSocialModal('favorite')}
                                    className="flex items-center gap-3 px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wide transition-all shadow-xl group active:scale-95"
                                >
                                    <FiHeart size={16} className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                                    {t("marketplace.favoriteStores")}
                                </button>
                            </div>
                        )}

                        {/* 2. Filter Toolbar */}
                        <MarketplaceFilters
                            filters={{ ...filters, name: searchTerm }}
                            onFilterChange={handleFilterChange}
                            onSearchChange={setSearchTerm}
                            onResetFilters={handleResetFilters}
                        />

                        {/* 3. Products Section */}
                        {loading && products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 animate-pulse">
                                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{t("marketplace.loadingProducts")}</p>
                            </div>
                        ) : displayProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in duration-500">
                                <FiSearch className="w-16 h-16 text-white/10 mb-4" />
                                <p className="text-xl font-black text-white uppercase tracking-tighter mb-1">
                                    {isSearching ? t("marketplace.searching") : t("marketplace.noProducts")}
                                </p>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                    {isSearching ? t("marketplace.searchingDesc") + searchTerm : t("marketplace.noProductsDesc")}
                                </p>
                            </div>
                        ) : (
                            <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}>
                                {displayProducts.map((product) => (
                                    <MarketplaceProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                        onStoreClick={() => navigate(`/store/${product.store.id}`)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {!loading && products.length > 0 && totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                                    disabled={filters.page === 1}
                                    className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all shadow-xl active:scale-95"
                                >
                                    {t("marketplace.prev")}
                                </button>

                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-10 h-10 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center border ${(filters.page || 1) === i + 1
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
                                    className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all shadow-xl active:scale-95"
                                >
                                    {t("marketplace.next")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Social Modals */}
                <StoreSocialLists
                    isOpen={!!socialModalType}
                    onClose={() => setSocialModalType(null)}
                    title={socialModalType === 'followed' ? 'Followed Stores' : 'Favorite Stores'}
                    stores={socialStores}
                    type={socialModalType || 'followed'}
                />
            </div>
        </DashboardLayout>
    );
}
