import React, { useState, useEffect } from "react";
import ShopHeader from "../components/shop/ShopHeader";
import ShopFiltersBar from "../components/shop/ShopFiltersBar";
import ProductCard from "../components/shop/ProductCard";
import LoadMoreButton from "../components/shop/LoadMoreButton";
import { FiArrowLeft, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getAllProducts, Product } from "../services/shopService";
import { useCart } from "../context/CartContext";
import CheckoutModal from "../components/checkout/CheckoutModal";
import { createOrder } from "../services/order.service";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<"shop" | "cart">("shop");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 15;
  const totalAmount = subtotal + shipping;

  // ===============================
  // ✅ CONFIRM CHECKOUT
  // ===============================
  const handleConfirmOrder = async ({
    city,
    address,
    phone,
  }: {
    city: string;
    address: string;
    phone: string;
  }) => {
    setIsOrdering(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      await createOrder(
        {
          city,
          address,
          phone,
          total: totalAmount,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        token
      );

      clearCart();
      setIsCheckoutOpen(false);
      setView("shop");
      alert("Order placed successfully!");
    } catch (err: unknown) {
      console.error("Order failed", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to place order";
      alert(errorMessage);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* ================= UNIFIED HEADER + FILTERS SECTION ================= */}
          {view === "shop" && (
            <>
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
                    onCartClick={() => setView("cart")}
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
                        setView("cart");
                      }}
                    />
                  );
                })}
              </div>

              <LoadMoreButton onClick={() => console.log("Load More")} />
            </>
          )}

          {/* ================= CART VIEW ================= */}
          {view === "cart" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB] min-h-[60vh]">
              <button
                onClick={() => setView("shop")}
                className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F2933] mb-8 font-medium transition"
              >
                <FiArrowLeft />
                Back to Shopping
              </button>

              <h2 className="text-3xl font-bold text-[#1F2933] mb-6">
                Your Shopping Cart
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-[#F3F4F1] rounded-xl border border-[#E5E7EB]">
                  <p className="text-[#6B7280] text-lg">
                    Your cart is currently empty.
                  </p>
                  <button
                    onClick={() => setView("shop")}
                    className="mt-4 px-6 py-2 bg-[#4A6F5D] text-white rounded-lg font-medium hover:bg-[#3d5c4d] transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-[#E5E7EB]"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-bold text-[#1F2933]">
                              {item.name}
                            </h3>
                            <p className="text-[#4A6F5D] font-semibold">
                              {item.price}₪
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:text-[#1F2933] transition"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-8 text-center font-medium text-[#1F2933]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:text-[#1F2933] transition"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <span className="w-20 text-right font-bold text-[#1F2933]">
                            {(item.price * item.quantity).toFixed(2)}₪
                          </span>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#A33A2B] hover:text-[#8a3024] p-2 transition"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="bg-[#eaf5ea] p-6 rounded-2xl sticky top-10 border border-[#E5E7EB]">
                      <h3 className="font-bold text-[#1F2933] mb-4">
                        Order Summary
                      </h3>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between text-[#6B7280]">
                          <span>Subtotal</span>
                          <span>{subtotal.toFixed(2)}₪</span>
                        </div>
                        <div className="flex justify-between text-[#6B7280]">
                          <span>Shipping</span>
                          <span>{shipping}₪</span>
                        </div>
                      </div>

                      <div className="border-t border-[#E5E7EB] pt-4 flex justify-between text-xl font-bold text-[#4A6F5D]">
                        <span>Total</span>
                        <span>{totalAmount.toFixed(2)}₪</span>
                      </div>

                      <button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full mt-6 py-3 rounded-full bg-[#4A6F5D] text-white font-bold hover:bg-[#A33A2B] transition"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= CHECKOUT MODAL ================= */}
        {isCheckoutOpen && (
          <CheckoutModal
            total={totalAmount}
            onClose={() => setIsCheckoutOpen(false)}
            onConfirm={handleConfirmOrder}
            isLoading={isOrdering}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
