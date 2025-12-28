import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (quantity: number) => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = (quantity: number) => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/shop");
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

  if (!product) {
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
      <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F2933] mb-6 font-medium text-sm transition"
          >
            <FiArrowLeft size={16} />
            Back to Shop
          </button>

          {/* Added to Cart Toast */}
          {addedToCart && (
            <div className="fixed top-20 right-6 z-50 bg-[#4A6F5D] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
              <FiCheck size={18} />
              Added to cart!
            </div>
          )}

          {/* Main Content Card */}
          <div className="bg-[#eaf5ea] rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E5E7EB]">
            {/* Store Info */}
            {product.store && (
              <div className="mb-6 pb-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={() => navigate(`/store/${product.store?.id}`)}
                  className="flex items-center gap-3 text-[#4A6F5D] hover:underline transition group"
                >
                  {product.store.logo && product.store.logo.length > 0 ? (
                    <img
                      src={product.store.logo}
                      alt={product.store.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#eaf5ea] flex items-center justify-center border border-gray-200">
                      <FiShoppingBag size={20} />
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm text-gray-500 font-medium">Sold by:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{product.store.name}</span>
                      {product.store.isOfficial && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide">
                          Official
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleFollow}
                    disabled={togglingFollow}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${isFollowed
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-[#4A6F5D] text-white hover:bg-[#3d5c4d]"
                      }`}
                  >
                    {isFollowed ? <FiCheck /> : <FiPlus />}
                    {isFollowed ? "Following" : "Follow Store"}
                  </button>

                  <button
                    onClick={toggleFavorite}
                    disabled={togglingFavorite}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${isFavorited
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <FiHeart fill={isFavorited ? "currentColor" : "none"} />
                    {isFavorited ? "Favorited" : "Favorite Store"}
                  </button>
                </div>
              </div>
            )}

            <ProductHeroSection
              name={product.name}
              image={product.image}
              badge={product.badge}
              badges={product.badges}
              shortDescription={product.shortDescription}
              price={product.price}
              stock={product.stock}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            <ProductDescription description={product.fullDescription} />

            <ProductReviewsSection
              rating={product.rating}
              reviewsCount={product.reviewsCount}
              reviews={[
                {
                  userName: "Ahmad",
                  rating: 5,
                  comment: "Excellent quality and authentic product.",
                  date: "2025-01-02",
                },
                {
                  userName: "Sara",
                  rating: 4,
                  comment: "Very good, will buy again.",
                  date: "2025-01-10",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
