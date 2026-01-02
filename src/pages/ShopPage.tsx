import React, { useState, useEffect } from "react";
import ShopHeader from "../components/shop/ShopHeader";
import ShopFiltersBar from "../components/shop/ShopFiltersBar";
import ProductCard from "../components/shop/ProductCard";
import LoadMoreButton from "../components/shop/LoadMoreButton";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getAllProducts, Product } from "../services/shopService";
import { useCart } from "../context/CartContext";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { cartItems, addToCart, openCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.filter(p => p.isActive !== false));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* ================= HEADER + FILTERS SECTION ================= */}
          <div className="bg-[#eaf5ea] rounded-2xl shadow-sm border border-[#E5E7EB] mb-10 relative">
            {/* Header Section */}
            <div className="px-8 pt-8 pb-6">
              <ShopHeader />
            </div>

            {/* Separator Line */}
            <div className="mx-8 h-px bg-[#E5E7EB]"></div>

            {/* Filters Section */}
            <div className="px-8 py-5 relative z-20">
              <ShopFiltersBar
                cartCount={cartItems.length}
                onCartClick={openCart}
              />
            </div>
          </div>

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
                    // Cart opens automatically
                  }}
                />
              );
            })}
          </div>

          <LoadMoreButton onClick={() => console.log("Load More")} />
        </div>
      </div>
    </DashboardLayout>
  );
}
