import React from "react";
import { FiFilter } from "react-icons/fi";
import { MarketplaceFilters as FiltersType } from "../../services/marketplace.service";

const CATEGORIES = [
    { label: "Palestinian Food", value: "PALESTINIAN_FOOD" },
    { label: "Palestinian Lifestyle", value: "PALESTINIAN_LIFESTYLE" },
    { label: "Handmade", value: "HANDMADE" },
    { label: "Palestinian Heritage", value: "PALESTINIAN_HERITAGE" },
];

type Props = {
    filters: FiltersType;
    onFilterChange: (filters: FiltersType) => void;
    hideCategory?: boolean;
};

export default function MarketplaceFilters({
    filters,
    onFilterChange,
    hideCategory = false,
}: Props) {
    const handleCategoryChange = (category: string) => {
        onFilterChange({
            ...filters,
            category: category || undefined,
        });
    };

    const handleMinPriceChange = (value: string) => {
        onFilterChange({
            ...filters,
            minPrice: value ? Number(value) : undefined,
        });
    };

    const handleMaxPriceChange = (value: string) => {
        onFilterChange({
            ...filters,
            maxPrice: value ? Number(value) : undefined,
        });
    };

    const clearFilters = () => {
        onFilterChange({});
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <FiFilter className="w-5 h-5 text-[#4A6F5D]" />
                <span className="font-bold text-gray-700">Filter Products</span>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${hideCategory ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
                {/* Category */}
                {!hideCategory && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Category
                        </label>
                        <select
                            value={filters.category || ""}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Min Price */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Min Price ($)
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice === undefined ? "" : filters.minPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                    />
                </div>

                {/* Max Price */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Max Price ($)
                    </label>
                    <input
                        type="number"
                        placeholder="Unlimited"
                        value={filters.maxPrice === undefined ? "" : filters.maxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                    />
                </div>

                {/* Clear Button */}
                <div className="flex items-end">
                    <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
