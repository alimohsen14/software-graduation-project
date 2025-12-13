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
    <div className="w-full mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* LEFT: Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-600 text-lg" />
          <span className="text-gray-700 font-semibold text-sm md:text-base">
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
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm bg-white"
            >
              <FiTag className="text-gray-600" />
              Category
              <FiChevronDown className="text-gray-500" />
            </button>
            {categoryOpen && (
              <div className="absolute mt-2 bg-white shadow-md border rounded-lg w-40 z-50">
                <ul className="text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    All
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Nabulsi Soap
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Oils
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm bg-white"
            >
              <FiDollarSign className="text-gray-600" />
              Price Range
              <FiChevronDown className="text-gray-500" />
            </button>
            {priceOpen && (
              <div className="absolute mt-2 bg-white shadow-md border rounded-lg w-40 z-50">
                <ul className="text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    All
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    0 - 50₪
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    50 - 100₪
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    100+ ₪
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Sort & Cart */}
      <div className="flex items-center gap-3">
        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => {
              setSortOpen(!sortOpen);
              setPriceOpen(false);
              setCategoryOpen(false);
            }}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm bg-white"
          >
            <MdSort className="text-gray-600" />
            Sort: Featured
            <FiChevronDown className="text-gray-500" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-md border rounded-lg w-40 z-50">
              <ul className="text-sm text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Featured
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Price: Low to High
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Price: High to Low
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Newest
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className="relative flex items-center justify-center p-2 rounded-lg bg-[#1d2d1f] text-white hover:bg-[#2a402d] transition shadow-md"
        >
          <FiShoppingCart className="text-xl" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
