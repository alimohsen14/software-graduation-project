import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductHeroSection from "../components/shop/product-details/ProductHeroSection";
import ProductDescription from "../components/shop/product-details/ProductDescription";
import ProductReviewsSection from "../components/shop/product-details/ProductReviewsSection";
import { getProductById, Product } from "../services/shopService";
import { FiArrowLeft, FiCheck, FiShoppingBag, FiPlus, FiHeart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useStoreSocialStatus } from "../hooks/useStoreSocialStatus";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  const {
    isFollowed,
    isFavorited,
    toggleFollow,
    toggleFavorite,
    togglingFollow,
    togglingFavorite
  } = useStoreSocialStatus(product?.store?.id);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getProductById(Number(id));
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = (quantity: number) => {
    if (!product) return;
    addToCart(product, quantity, false); // Silent add
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = (quantity: number) => {
    if (!product) return;
    addToCart(product, quantity, true); // Add and Open
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[#6B7280] text-base">Loading product...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!product || product.isActive === false) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[#6B7280] text-base">Product not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-3 sm:p-10 lg:p-16 animate-in fade-in duration-700">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white mb-4 md:mb-10 transition-all group min-h-[44px]"
          >
            <FiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Registry Return Pipeline
          </button>

          {/* Added to Cart Toast */}
          {addedToCart && (
            <div className="fixed top-20 right-4 sm:right-10 z-[100] bg-emerald-500/10 backdrop-blur-3xl text-emerald-400 px-5 sm:px-8 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)] flex items-center gap-3 md:gap-4 animate-in slide-in-from-right-10 duration-500">
              <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <FiCheck size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-50">Buffer Update</span>
                <span className="text-[11px] sm:text-sm font-bold">Unit committed.</span>
              </div>
            </div>
          )}

          {/* Main Content Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl md:rounded-[3.5rem] p-4 sm:p-8 lg:p-16 border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Background decorative glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />

            {/* Store Information Layer */}
            {product.store && (
              <div className="mb-6 md:mb-12 pb-6 md:pb-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 relative z-10">
                <button
                  onClick={() => navigate(`/store/${product.store?.id}`)}
                  className="flex items-center gap-3 md:gap-6 group/store transition-all"
                >
                  <div className="relative">
                    {product.store.logo && product.store.logo.length > 0 ? (
                      <img
                        src={product.store.logo}
                        alt={product.store.name}
                        className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover border border-white/10 group-hover/store:border-emerald-500/50 transition-colors shadow-2xl"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/20 group-hover/store:text-emerald-400 transition-colors">
                        <FiShoppingBag size={18} className="md:size-6" />
                      </div>
                    )}
                    <div className="absolute -inset-2 bg-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover/store:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex flex-col items-start gap-0.5 md:gap-1">
                    <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Unit Custodian</span>
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-base md:text-xl font-black text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">
                        {product.store.name}
                      </span>
                      {product.store.isOfficial && (
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/5">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto">
                  <button
                    onClick={toggleFollow}
                    disabled={togglingFollow}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-400 shadow-xl border min-h-[44px] ${isFollowed
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/5"
                      : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {isFollowed ? <FiCheck size={14} /> : <FiPlus size={14} />}
                    {isFollowed ? "Linked" : "Link Asset"}
                  </button>

                  <button
                    onClick={toggleFavorite}
                    disabled={togglingFavorite}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-400 shadow-xl border min-h-[44px] ${isFavorited
                      ? "bg-red-500/20 text-red-500 border-red-500/30 shadow-red-500/5"
                      : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10 hover:text-red-400"
                      }`}
                  >
                    <FiHeart size={14} fill={isFavorited ? "currentColor" : "none"} className={togglingFavorite ? "animate-pulse" : ""} />
                    {isFavorited ? "Priority" : "Priority Mark"}
                  </button>
                </div>
              </div>
            )}

            <div className="relative z-10">
              <ProductHeroSection
                name={product.name}
                image={product.image}
                badge={product.badge}
                badges={product.badges}
                shortDescription={product.shortDescription}
                price={product.price}
                stock={product.stock}
                avgRating={product.avgRating}
                reviewsCount={product.reviewsCount}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />

              <div className="my-8 md:my-16 h-px bg-white/5" />

              <ProductDescription description={product.fullDescription} />

              <div className="my-8 md:my-16 h-px bg-white/5" />

              <ProductReviewsSection
                productId={product.id}
                avgRating={product.avgRating}
                reviewsCount={product.reviewsCount}
                onMutation={fetchProduct}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
