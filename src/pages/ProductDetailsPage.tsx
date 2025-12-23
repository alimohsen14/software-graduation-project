import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductHeroSection from "../components/shop/product-details/ProductHeroSection";
import ProductDescription from "../components/shop/product-details/ProductDescription";
import ProductReviewsSection from "../components/shop/product-details/ProductReviewsSection";
import { getProductById, Product } from "../services/shopService";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

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
            <ProductHeroSection
              name={product.name}
              image={product.image}
              badge={product.badge}
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
