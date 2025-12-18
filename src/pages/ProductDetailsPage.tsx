import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductHeroSection from "../components/shop/product-details/ProductHeroSection";
import ProductDescription from "../components/shop/product-details/ProductDescription";
import ProductReviewsSection from "../components/shop/product-details/ProductReviewsSection";
import { getProductById, Product } from "../services/shopService";
import { FiArrowLeft } from "react-icons/fi";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#3e6347]">
          <p className="text-white text-lg">Loading product...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#3e6347]">
          <p className="text-white text-lg">Product not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-[#3e6347] p-6 lg:p-10">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium"
          >
            <FiArrowLeft />
            Back to Shop
          </button>

          <ProductHeroSection
            name={product.name}
            image={product.image}
            badge={product.badge}
            shortDescription={product.shortDescription}
            price={product.price}
            stock={product.stock}
            rating={product.rating}
            reviewsCount={product.reviewsCount}
            onAddToCart={(quantity) =>
              console.log("Add to cart:", product.id, quantity)
            }
            onBuyNow={(quantity) =>
              console.log("Buy now:", product.id, quantity)
            }
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
    </DashboardLayout>
  );
}
