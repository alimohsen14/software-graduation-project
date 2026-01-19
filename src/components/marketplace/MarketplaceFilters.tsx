import React from "react";
import { FiFilter, FiTag, FiDollarSign } from "react-icons/fi";
import { MarketplaceFilters as FiltersType, ProductCategory } from "../../services/marketplace.service";
import { PRICE_RANGES } from "../../constants/filters";

const CATEGORIES = [
    { label: "مأكولات فلسطينية", value: ProductCategory.PALESTINIAN_FOOD },
    { label: "نمط حياة فلسطيني", value: ProductCategory.PALESTINIAN_LIFESTYLE },
    { label: "صناعة يدوية", value: ProductCategory.HANDMADE },
    { label: "تراث فلسطيني", value: ProductCategory.PALESTINIAN_HERITAGE },
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
        <div className="bg-[#0d0d0d]/40 backdrop-blur-3xl rounded-2xl md:rounded-[2.5rem] border border-white/5 shadow-2xl p-4 sm:p-8 md:p-10 mb-6 md:mb-12 relative overflow-hidden group" dir="rtl">
            {/* Background decorative glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-10 mb-6 md:mb-10 relative z-10">
                <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-xl transition-transform duration-500 group-hover:scale-105">
                        <FiFilter className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-emerald-500/40 text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-0.5 leading-none">بحث متقدم</span>
                        <h3 className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase leading-none">تصفية النتائج</h3>
                    </div>
                </div>

                <button
                    onClick={clearFilters}
                    className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/20 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl hover:bg-white/10 hover:text-white hover:border-white/10 transition-all active:scale-95 shadow-lg min-h-[44px] flex items-center justify-center"
                >
                    إعادة ضبط
                </button>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${hideCategory ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-8 relative z-10`}>
                {/* Category */}
                {!hideCategory && (
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/10 mr-3">
                            <FiTag className="text-emerald-500/30" />
                            تصنيف المنتجات
                        </label>
                        <div className="relative group/select">
                            <select
                                value={filters.category || ""}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[12px] font-bold text-white/40 focus:bg-white/10 focus:border-emerald-500/20 focus:text-white transition-all appearance-none cursor-pointer outline-none hover:border-white/10 shadow-inner"
                            >
                                <option value="" className="bg-zinc-900">جميع التصنيفات</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value} className="bg-zinc-900">
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/10 group-hover/select:text-emerald-500/40 transition-colors">
                                <FiFilter size={14} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Price Range */}
                <div className="space-y-3">
                    <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/10 mr-3">
                        <FiDollarSign className="text-emerald-500/30" />
                        نطاق السعر
                    </label>
                    <div className="relative group/select">
                        <select
                            value={activeRange?.id || "ALL"}
                            onChange={(e) => handlePriceRangeChange(e.target.value)}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[12px] font-bold text-white/40 focus:bg-white/10 focus:border-emerald-500/20 focus:text-white transition-all appearance-none cursor-pointer outline-none hover:border-white/10 shadow-inner"
                        >
                            <option value="ALL" className="bg-zinc-900">جميع الأسعار</option>
                            {PRICE_RANGES.map((range) => (
                                <option key={range.id} value={range.id} className="bg-zinc-900">
                                    {range.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/10 group-hover/select:text-emerald-500/40 transition-colors">
                            <FiFilter size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
