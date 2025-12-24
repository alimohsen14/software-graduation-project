import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import MarketplaceHeader from "../components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilters";
import MarketplaceProductCard from "../components/marketplace/MarketplaceProductCard";
import {
    getMarketplaceProducts,
    getMarketplaceCategories,
    MarketplaceProduct,
    MarketplaceFilters as FiltersType,
} from "../services/marketplace.service";
import { FiPackage } from "react-icons/fi";

export default function MarketplacePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<MarketplaceProduct[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FiltersType>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getMarketplaceProducts(filters),
                    getMarketplaceCategories(),
                ]);
                // Shuffle products for random display
                const shuffled = [...productsData].sort(() => Math.random() - 0.5);
                setProducts(shuffled);
                setCategories(categoriesData);
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

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <MarketplaceHeader
                        onBecomeSeller={() => navigate("/become-seller")}
                    />

                    <MarketplaceFilters
                        categories={categories}
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
                </div>
            </div>
        </DashboardLayout>
    );
}
