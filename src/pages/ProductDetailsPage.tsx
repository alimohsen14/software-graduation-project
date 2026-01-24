import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductHeroSection from "../components/shop/product-details/ProductHeroSection";
import ProductDescription from "../components/shop/product-details/ProductDescription";
import ProductReviewsSection from "../components/shop/product-details/ProductReviewsSection";
import { getProductById, Product } from "../services/shopService";
import { FiArrowLeft, FiCheck, FiShoppingBag, FiPlus, FiHeart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useStoreSocialStatus } from "../hooks/useStoreSocialStatus";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("marketplace");
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAuthAction = (action: () => void) => {
    if (!isAuthenticated) {
      toast.info(t("product.loginRequired") || "Please login to continue");
      navigate("/login", { state: { from: location } });
      return;
    }
    action();
  };

  const [product, setProduct] = useState<Product | null>(null);
  const isRtl = i18n.language === "ar";
  const currentLang = i18n.language;

  // Helper to get translated product data
  const getTranslatedValue = (field: "name" | "shortDescription" | "fullDescription") => {
    if (!product) return "";
    const localized = product[`${field}_${currentLang}` as keyof Product] as string;
    return localized || product[field] || "";
  };

  const translatedName = getTranslatedValue("name");
  const translatedFullDescription = getTranslatedValue("fullDescription");

  const [loading, setLoading] = useState(true);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

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
    handleAuthAction(() => {
      addToCart(product, quantity, false); // Silent add
      setAddedToCartToast(true);
      setTimeout(() => setAddedToCartToast(false), 2000);
    });
  };

  const handleBuyNow = (quantity: number) => {
    if (!product) return;
    handleAuthAction(() => {
      addToCart(product, quantity, true); // Add and Open
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white/40 text-sm font-black uppercase tracking-[0.3em]">{t("product.loading")}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!product || product.isActive === false) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white/40 text-sm font-black uppercase tracking-[0.3em]">{t("product.notFound")}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen py-4 md:py-6 px-4 sm:px-6 animate-in fade-in duration-700" dir={isRtl ? "rtl" : "ltr"}>
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white mb-4 transition-all group ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <FiArrowLeft size={14} className={`${isRtl ? "rotate-180 group-hover:translate-x-1" : "group-hover:-translate-x-1"} transition-transform`} />
            {t("product.backToMarket")}
          </button>

          {/* Added to Cart Toast */}
          {addedToCartToast && (
            <div className={`fixed top-24 z-[100] bg-emerald-500/10 backdrop-blur-3xl text-emerald-400 px-6 py-4 rounded-xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)] flex items-center gap-4 animate-in duration-500 ${isRtl ? "left-6 md:left-10 slide-in-from-left-10" : "right-6 md:right-10 slide-in-from-right-10"}`}>
              <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <FiCheck size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{t("product.updated")}</span>
                <span className="text-xs font-bold">{t("product.addedToCartToast")}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 md:gap-4">
            {/* 1. Store/Header Section - Compact Card */}
            {product.store && (
              <div className={`bg-black/40 backdrop-blur-xl rounded-xl p-3 md:p-4 border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group ${isRtl ? "md:flex-row-reverse" : ""}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <button
                  onClick={() => navigate(`/store/${product.store?.id}`)}
                  className={`flex items-center gap-3 group/store relative z-10 ${isRtl ? "flex-row-reverse text-right" : ""}`}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover/store:border-emerald-500/30 transition-all">
                    {product.store.logo ? (
                      <img src={product.store.logo} alt={product.store.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <FiShoppingBag size={18} />
                      </div>
                    )}
                  </div>
                  <div className={`flex flex-col gap-0.5 ${isRtl ? "items-end" : "items-start"}`}>
                    <span className="text-[7px] font-black uppercase tracking-widest text-emerald-500/40">{t("store.verifiedStore")}</span>
                    <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                      <h2 className="text-sm md:text-base font-black text-white group-hover/store:text-emerald-400 transition-colors uppercase tracking-tight">
                        {product.store.name}
                      </h2>
                      {product.store.isOfficial && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase">{t("official")}</span>
                      )}
                    </div>
                  </div>
                </button>

                <div className={`flex items-center gap-2 relative z-10 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={() => handleAuthAction(toggleFollow)}
                    disabled={togglingFollow}
                    className={`flex-1 md:flex-none h-9 px-3 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border ${isFollowed
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                      : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {isFollowed ? t("following") : t("follow")}
                  </button>
                  <button
                    onClick={() => handleAuthAction(toggleFavorite)}
                    disabled={togglingFavorite}
                    className={`flex-1 md:flex-none h-9 px-3 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border ${isFavorited
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                      : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {isFavorited ? t("favorited") : t("favorite")}
                  </button>
                </div>
              </div>
            )}

            {/* 2. Primary Product HeroSection */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/10 shadow-xl relative overflow-hidden">
              <ProductHeroSection
                id={product.id}
                name={translatedName}
                image={product.image}
                badge={product.badge}
                badges={product.badges}
                shortDescription={getTranslatedValue("shortDescription")}
                price={product.price}
                stock={product.stock}
                avgRating={product.avgRating}
                reviewsCount={product.reviewsCount}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>

            {/* 3. Description Section - Compact Card */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/10 shadow-lg">
              <ProductDescription description={translatedFullDescription} />
            </div>

            {/* 4. Reviews Section - Compact Card */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/10 shadow-lg mb-4 md:mb-0">
              <ProductReviewsSection
                productId={product.id}
                avgRating={product.avgRating}
                reviewsCount={product.reviewsCount}
                onMutation={fetchProduct}
              />
            </div>

            {/* Sticky Mobile Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-black/60 backdrop-blur-2xl border-t border-white/10 md:hidden animate-in slide-in-from-bottom duration-500">
              <div className="max-w-md mx-auto flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">{t("product.price")}</span>
                  <span className="text-base font-black text-white tabular-nums">{product.price}<span className="text-emerald-500 text-xs ml-0.5">₪</span></span>
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => handleBuyNow(1)}
                    disabled={product.stock === 0}
                    className="w-full h-11 rounded-lg bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-20"
                  >
                    {product.stock === 0 ? t("product.outOfStock") : t("product.buyNow")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
