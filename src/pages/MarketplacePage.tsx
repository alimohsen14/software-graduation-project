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
                    <div className="max-w-7xl mx-auto">
                        <MarketplaceHeader
                            onBecomeSeller={() => navigate("/become-seller")}
                            onGoToDashboard={() => navigate(user?.isAdmin ? "/admin/market" : "/seller")}
                            showBecomeSeller={showBecomeSeller}
                            showDashboard={isSeller || !!user?.isAdmin}
                        />

                        {isPending && (
                            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center gap-2">
                                <FiPackage className="w-5 h-5" />
                                <span>Your seller application is currently under review.</span>
                            </div>
                        )}

                        {/* Social Stats Quick Links */}
                        {user && (
                            <div className="flex items-center gap-3 mb-6">
                                <button
                                    onClick={() => handleOpenSocialModal('followed')}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-emerald-100 rounded-xl text-sm font-bold text-[#4A6F5D] hover:bg-emerald-50 transition shadow-sm"
                                >
                                    <FiUsers size={18} />
                                    Followed Stores
                                </button>
                                <button
                                    onClick={() => handleOpenSocialModal('favorite')}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition shadow-sm"
                                >
                                    <FiHeart size={18} />
                                    Favorite Stores
                                </button>
                            </div>
                        )}

                        <MarketplaceFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <p className="text-gray-500">Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <FiPackage className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">No products found</p>
                                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
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
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                                    disabled={filters.page === 1}
                                    className="px-4 py-2 border border-emerald-100 rounded-xl text-sm font-bold text-[#4A6F5D] bg-white hover:bg-emerald-50 disabled:opacity-50 transition shadow-sm"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-10 h-10 rounded-xl text-sm font-bold transition flex items-center justify-center ${(filters.page || 1) === i + 1
                                                ? "bg-[#4A6F5D] text-white shadow-md"
                                                : "bg-white text-gray-500 border border-gray-100 hover:bg-emerald-50 hover:text-[#4A6F5D]"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
                                    disabled={filters.page === totalPages}
                                    className="px-4 py-2 border border-emerald-100 rounded-xl text-sm font-bold text-[#4A6F5D] bg-white hover:bg-emerald-50 disabled:opacity-50 transition shadow-sm"
                                >
                                    Next
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
