import { useState } from "react";
import {
  FiFilter,
  FiTag,
  FiDollarSign,
  FiChevronDown,
  FiShoppingCart,
} from "react-icons/fi";
import { MdSort } from "react-icons/md";

interface ShopFiltersBarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function ShopFiltersBar({
  cartCount,
  onCartClick,
}: ShopFiltersBarProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
      {/* LEFT: Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2">
          <FiFilter className="text-[#4A6F5D] text-lg" />
          <span className="text-[#1F2933] font-semibold text-sm whitespace-nowrap">
            Filter By:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setCategoryOpen(!categoryOpen);
                setPriceOpen(false);
                setSortOpen(false);
              }}
              className="flex items-center gap-2 border border-[#E5E7EB] text-[#1F2933] px-4 py-2.5 rounded-lg hover:border-[#4A6F5D] hover:bg-[#F3F4F1] transition text-sm bg-white h-10"
            >
              <FiTag className="text-[#4A6F5D]" />
              Category
              <FiChevronDown className="text-[#6B7280]" />
            </button>
            {categoryOpen && (
              <div className="absolute mt-2 bg-white shadow-lg border border-[#E5E7EB] rounded-lg w-44 z-50">
                <ul className="text-sm text-[#1F2933] py-1">
                  <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                    All
                  </li>
                  <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                    Nabulsi Soap
                  </li>
                  <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                    Oils
                  </li>
                  <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                    Ceramics
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setPriceOpen(!priceOpen);
                setCategoryOpen(false);
                setSortOpen(false);
              }}
              className="flex items-center gap-2 border border-[#E5E7EB] text-[#1F2933] px-4 py-2.5 rounded-lg hover:border-[#4A6F5D] hover:bg-[#F3F4F1] transition text-sm bg-white h-10"
            >
              <FiDollarSign className="text-[#4A6F5D]" />
              Price Range
              <FiChevronDown className="text-[#6B7280]" />
            </button>
            {priceOpen && (
              <div className="absolute mt-2 bg-white shadow-lg border border-[#E5E7EB] rounded-lg w-44 z-50">
                <ul className="text-sm text-[#1F2933] py-1">
                  <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                    All
                  </li>
                  <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                    0 - 50₪
                  </li>
                  <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                    50 - 100₪
                  </li>
                  <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                    100+ ₪
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Sort & Cart */}
      <div className="flex items-center gap-4">
        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => {
              setSortOpen(!sortOpen);
              setPriceOpen(false);
              setCategoryOpen(false);
            }}
            className="flex items-center gap-2 border border-[#E5E7EB] text-[#1F2933] px-4 py-2.5 rounded-lg hover:border-[#4A6F5D] hover:bg-[#F3F4F1] transition text-sm bg-white h-10"
          >
            <MdSort className="text-[#4A6F5D]" />
            Sort: Featured
            <FiChevronDown className="text-[#6B7280]" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border border-[#E5E7EB] rounded-lg w-48 z-50">
              <ul className="text-sm text-[#1F2933] py-1">
                <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                  Featured
                </li>
                <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                  Price: Low to High
                </li>
                <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                  Price: High to Low
                </li>
                <li className="px-4 py-2.5 hover:bg-[#F3F4F1] hover:text-[#4A6F5D] cursor-pointer transition">
                  Newest
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#4A6F5D] text-white hover:bg-[#A33A2B] transition shadow-sm"
        >
          <FiShoppingCart className="text-lg" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#A33A2B] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

