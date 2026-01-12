import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import MarketplaceHeader from "../components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilters";
import MarketplaceProductCard from "../components/marketplace/MarketplaceProductCard";
import StoreSocialLists from "../components/marketplace/StoreSocialLists";
import {
    getMarketplaceProducts,
    MarketplaceProduct,
    MarketplaceFilters as FiltersType,
} from "../services/marketplace.service";
import { getFollowedStores, getFavoriteStores, Store } from "../services/store.service";
import { FiPackage, FiUsers, FiHeart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function MarketplacePage() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Global Auth
    const [products, setProducts] = useState<MarketplaceProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FiltersType>({
        page: 1,
        limit: 12
    });
    const [totalPages, setTotalPages] = useState(1);

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


    // Logic for "Become a Seller" button
    // user.isSeller is now normalized in AuthContext to include Admins
    const isSeller = !!user?.isSeller;
    const isPending = user?.sellerRequest?.status === "PENDING";
    const showBecomeSeller = !isSeller && !isPending && !user?.isAdmin;

    return (
        <DashboardLayout>
            <div className="relative">
                <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto" dir="rtl">
                        <MarketplaceHeader
                            onBecomeSeller={() => navigate("/become-seller")}
                            onGoToDashboard={() => navigate(user?.isAdmin ? "/admin/market" : "/seller")}
                            showBecomeSeller={showBecomeSeller}
                            showDashboard={isSeller || !!user?.isAdmin}
                        />

                        {isPending && (
                            <div className="mb-8 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-4 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500 backdrop-blur-md">
                                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                                    <FiPackage className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-0.5">الحالة: قيد الانتظار</span>
                                    <span className="text-xs font-bold">طلبك للانضمام كبائع قيد المراجعة حالياً.</span>
                                </div>
                            </div>
                        )}

                        {/* Social Stats Quick Links */}
                        {user && (
                            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
                                <button
                                    onClick={() => handleOpenSocialModal('followed')}
                                    className="flex items-center gap-3 px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wide text-white/40 hover:bg-white/10 hover:text-white transition-all shadow-xl group"
                                >
                                    <FiUsers size={16} className="group-hover:scale-110 transition-transform" />
                                    المتاجر المتابعة
                                </button>
                                <button
                                    onClick={() => handleOpenSocialModal('favorite')}
                                    className="flex items-center gap-3 px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wide text-white/40 hover:bg-white/10 hover:text-red-400 transition-all shadow-xl group"
                                >
                                    <FiHeart size={16} className="group-hover:scale-110 transition-transform" />
                                    المتاجر المفضلة
                                </button>
                            </div>
                        )}

                        <MarketplaceFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 animate-pulse">
                                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">جاري تحميل المنتجات...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in duration-500">
                                <FiPackage className="w-16 h-16 text-white/10 mb-4" />
                                <p className="text-xl font-black text-white uppercase tracking-tighter mb-1">لا يوجد منتجات</p>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">لم نجد أي منتجات تطابق بحثك حالياً</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
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
                                    السابق
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
                                    التالي
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
