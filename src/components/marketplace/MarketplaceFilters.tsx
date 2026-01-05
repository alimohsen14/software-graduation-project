import React from "react";
import { FiFilter, FiTag, FiDollarSign } from "react-icons/fi";
import { MarketplaceFilters as FiltersType, ProductCategory } from "../../services/marketplace.service";
import { PRICE_RANGES } from "../../constants/filters";

const CATEGORIES = [
    { label: "Palestinian Food", value: ProductCategory.PALESTINIAN_FOOD },
    { label: "Palestinian Lifestyle", value: ProductCategory.PALESTINIAN_LIFESTYLE },
    { label: "Handmade", value: ProductCategory.HANDMADE },
    { label: "Palestinian Heritage", value: ProductCategory.PALESTINIAN_HERITAGE },
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
    const handleCategoryChange = (val: string) => {
        onFilterChange({
            ...filters,
            category: (val as ProductCategory) || undefined,
            page: 1, // Reset page on category change
        });
    };

    const handlePriceRangeChange = (rangeId: string) => {
        if (rangeId === "ALL") {
            onFilterChange({
                ...filters,
                minPrice: undefined,
                maxPrice: undefined,
                page: 1,
            });
            return;
        }

        const range = PRICE_RANGES.find(r => r.id === rangeId);
        if (range) {
            onFilterChange({
                ...filters,
                minPrice: range.min,
                maxPrice: range.max === null ? undefined : range.max,
                page: 1,
            });
        }
    };

    const clearFilters = () => {
        onFilterChange({ page: 1 });
    };

    // Determine which range is currently selected
    const activeRange = PRICE_RANGES.find(r =>
        r.min === filters.minPrice &&
        (r.max === filters.maxPrice || (r.max === null && filters.maxPrice === undefined && filters.minPrice !== undefined))
    );

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#4A6F5D]/10 rounded-xl flex items-center justify-center">
                    <FiFilter className="w-5 h-5 text-[#4A6F5D]" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">تصفية المنتجات</h3>
                    <p className="text-xs text-gray-500 font-medium">خصّص بحثك للعثور على ما تريد</p>
                </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${hideCategory ? 'lg:grid-cols-3' : 'lg:grid-cols-3'} gap-6`}>
                {/* Category */}
                {!hideCategory && (
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <FiTag className="text-[#4A6F5D]" />
                            التصنيف
                        </label>
                        <select
                            value={filters.category || ""}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#4A6F5D]/10 focus:border-[#4A6F5D] focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                            <option value="">جميع التصنيفات</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Price Range */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <FiDollarSign className="text-[#4A6F5D]" />
                        نطاق السعر
                    </label>
                    <select
                        value={activeRange?.id || "ALL"}
                        onChange={(e) => handlePriceRangeChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#4A6F5D]/10 focus:border-[#4A6F5D] focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL">كل الأسعار</option>
                        {PRICE_RANGES.map((range) => (
                            <option key={range.id} value={range.id}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-3">
                    <button
                        onClick={clearFilters}
                        className="flex-1 px-6 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                    >
                        إعادة تعيين
                    </button>
                </div>
            </div>
        </div>
    );
}
