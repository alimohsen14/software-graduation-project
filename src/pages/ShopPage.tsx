import React, { useState, useEffect } from "react";
import ShopHeader from "../components/shop/ShopHeader";
import ShopFiltersBar from "../components/shop/ShopFiltersBar";
import ProductCard from "../components/shop/ProductCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getAllProducts, Product } from "../services/shopService";
import { useCart } from "../context/CartContext";
import { ProductCategory } from "../services/marketplace.service";
import { FiPackage } from "react-icons/fi";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL");
  const { cartItems, addToCart, openCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts({
          page,
          limit: 12,
          category: selectedCategory === "ALL" ? undefined : selectedCategory,
        });

        const productsArray = res.products || (Array.isArray(res) ? res : []);
        setProducts(productsArray);
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory]);

  const handleCategoryChange = (cat: ProductCategory | "ALL") => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* ================= HEADER + FILTERS SECTION ================= */}
          <div className="bg-[#eaf5ea] rounded-2xl shadow-sm border border-[#E5E7EB] mb-10 relative">
            <div className="px-8 pt-8 pb-6">
              <ShopHeader />
            </div>
            <div className="mx-8 h-px bg-[#E5E7EB]"></div>
            <div className="px-8 py-5 relative z-20">
              <ShopFiltersBar
                cartCount={cartItems.length}
                onCartClick={openCart}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>

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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((apiProduct) => {
                  const productForUI = {
                    ...apiProduct,
                    title: apiProduct.name,
                    description: apiProduct.shortDescription || "",
                  };

                  return (
                    <ProductCard
                      key={productForUI.id}
                      id={productForUI.id}
                      image={productForUI.image}
                      title={productForUI.title}
                      description={productForUI.description}
                      price={productForUI.price}
                      stock={apiProduct.stock}
                      badge={productForUI.badge}
                      badges={apiProduct.badges}
                      onAddToCart={() => addToCart(productForUI)}
                      onBuyNow={() => {
                        addToCart(productForUI);
                      }}
                    />
                  );
                })}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-emerald-100 rounded-xl text-sm font-bold text-[#4A6F5D] bg-white hover:bg-emerald-50 disabled:opacity-50 transition"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition flex items-center justify-center ${page === i + 1
                          ? "bg-[#4A6F5D] text-white"
                          : "bg-white text-gray-500 border border-gray-100 hover:bg-emerald-50"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-emerald-100 rounded-xl text-sm font-bold text-[#4A6F5D] bg-white hover:bg-emerald-50 disabled:opacity-50 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
