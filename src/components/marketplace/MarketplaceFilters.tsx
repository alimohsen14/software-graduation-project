import React from "react";
import { useTranslation } from "react-i18next";
import { FiFilter, FiSearch, FiChevronDown } from "react-icons/fi";
import { MarketplaceFilters as FiltersType, ProductCategory } from "../../services/marketplace.service";
import { PRICE_RANGES } from "../../constants/filters";

const CATEGORIES = [
    { label: "categories.food", value: ProductCategory.PALESTINIAN_FOOD },
    { label: "categories.lifestyle", value: ProductCategory.PALESTINIAN_LIFESTYLE },
    { label: "categories.handmade", value: ProductCategory.HANDMADE },
    { label: "categories.heritage", value: ProductCategory.PALESTINIAN_HERITAGE },
];

type Props = {
    filters: FiltersType;
    onFilterChange: (filters: FiltersType) => void;
    onSearchChange?: (value: string) => void;
    onResetFilters?: () => void;
    hideCategory?: boolean;
};

export default function MarketplaceFilters({
    filters,
    onFilterChange,
    onSearchChange,
    onResetFilters,
    hideCategory = false,
}: Props) {
    const { t, i18n } = useTranslation("marketplace");
    const direction = i18n.dir();

    const handleCategoryChange = (val: string) => {
        onFilterChange({
            ...filters,
            category: (val as ProductCategory) || undefined,
            page: 1,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSearchChange) {
            onSearchChange(e.target.value);
        } else {
            onFilterChange({
                ...filters,
                name: e.target.value || undefined,
                page: 1,
            });
        }
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

    const activeRange = PRICE_RANGES.find(r =>
        r.min === filters.minPrice &&
        (r.max === filters.maxPrice || (r.max === null && filters.maxPrice === undefined && filters.minPrice !== undefined))
    );

    const isFiltered = !!(filters.name || filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined);

    return (
        <div className="relative z-30 -mt-8 mb-8" dir={direction}>
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full shadow-2xl px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center gap-3 md:gap-4">

                {/* 1. Search Bar */}
                <div className="relative flex-1 w-full group">
                    <FiSearch className={`absolute ${direction === 'rtl' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors`} />
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        value={filters.name || ""}
                        onChange={handleSearchChange}
                        className={`w-full h-10 md:h-12 bg-white/5 border border-white/10 rounded-xl md:rounded-full ${direction === 'rtl' ? 'pl-12 pr-4' : 'pr-12 pl-4'} text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/10 transition-all placeholder:text-white/20`}
                    />
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-8 bg-white/10" />

                {/* 2. Category Dropdown */}
                {!hideCategory && (
                    <div className="relative w-full md:w-56 group">
                        <select
                            value={filters.category || ""}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full h-10 md:h-12 bg-white/5 border border-white/10 rounded-xl md:rounded-full px-6 text-white text-sm appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                        >
                            <option value="" className="bg-zinc-900">{t("allCategories")}</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value} className="bg-zinc-900">
                                    {t(cat.label)}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className={`absolute ${direction === 'rtl' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 text-white/40 pointer-events-none`} />
                    </div>
                )}

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-8 bg-white/10" />

                {/* 3. Price Dropdown */}
                <div className="relative w-full md:w-56 group">
                    <select
                        value={activeRange?.id || "ALL"}
                        onChange={(e) => handlePriceRangeChange(e.target.value)}
                        className="w-full h-10 md:h-12 bg-white/5 border border-white/10 rounded-xl md:rounded-full px-6 text-white text-sm appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    >
                        <option value="ALL" className="bg-zinc-900">{t("allPrices")}</option>
                        {PRICE_RANGES.map((range) => (
                            <option key={range.id} value={range.id} className="bg-zinc-900">
                                {t(range.label)}
                            </option>
                        ))}
                    </select>
                    <FiChevronDown className={`absolute ${direction === 'rtl' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 text-white/40 pointer-events-none`} />
                </div>

                {/* 4. Actions: Reset & Filter */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={onResetFilters}
                        className={`flex-1 md:flex-none h-10 md:h-12 px-6 rounded-xl md:rounded-full text-xs font-bold transition-all border ${isFiltered && onResetFilters
                            ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                            : "bg-transparent text-white/20 border-white/5 cursor-default"
                            }`}
                        disabled={!isFiltered || !onResetFilters}
                    >
                        {t("reset")}
                    </button>

                    <button
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 relative ${isFiltered ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-white/5 text-white/20 hover:text-white/40"
                            }`}
                        title={t("filters")}
                    >
                        <FiFilter size={18} />
                        {isFiltered && (
                            <span className={`absolute top-0 ${direction === 'rtl' ? 'left-0' : 'right-0'} w-3 h-3 bg-red-500 border-2 border-black rounded-full animate-pulse`} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
