import React, { useState, useEffect } from "react";
import ShopHeader from "../components/shop/ShopHeader";
import ShopFiltersBar from "../components/shop/ShopFiltersBar";
import ProductCard from "../components/shop/ProductCard";
import LoadMoreButton from "../components/shop/LoadMoreButton";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getAllProducts, Product } from "../services/shopService";
import { useCart } from "../context/CartContext";
import CheckoutModal from "../components/checkout/CheckoutModal";
import { createOrder } from "../services/order.service";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<"shop" | "cart">("shop");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();

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

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      await createOrder(
        {
          city,
          address,
          phone,
          total: totalAmount + 15,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        token
      );

      clearCart(); // 🧹 يفضّي السلة
      setIsCheckoutOpen(false); // ❌ يسكر المودال
      setView("shop"); // 🔙 يرجّع على السوق
    } catch (err) {
      console.error("Order failed", err);
      alert("Failed to place order");
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-[#3e6347] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ShopHeader
            cartCount={cartItems.length}
            onCartClick={() => setView("cart")}
          />

          {/* ================= SHOP VIEW ================= */}
          {view === "shop" && (
            <>
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md mb-8">
                <ShopFiltersBar
                  cartCount={cartItems.length}
                  onCartClick={() => setView("cart")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      badge={productForUI.badge}
                      onAddToCart={() => addToCart(productForUI)}
                      onBuyNow={() => {
                        addToCart(productForUI);
                        setIsCheckoutOpen(true);
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
            <div className="bg-white rounded-3xl p-6 shadow-2xl min-h-[60vh]">
              <button
                onClick={() => setView("shop")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium"
              >
                <FiArrowLeft /> Back to Shopping
              </button>

              <h2 className="text-3xl font-bold text-[#1d2d1f] mb-6">
                Your Shopping Cart
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-lg">
                    Your cart is currently empty.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-[#3e6347] font-semibold">
                              {item.price}₪ × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="bg-gray-50 p-6 rounded-2xl sticky top-10">
                      <div className="flex justify-between text-2xl font-bold text-[#3e6347] mb-6">
                        <span>Total</span>
                        <span>{totalAmount + 15}₪</span>
                      </div>
                      <button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full py-3 rounded-full bg-red-600 text-white font-bold"
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
            total={totalAmount + 15}
            onClose={() => setIsCheckoutOpen(false)}
            onConfirm={handleConfirmOrder}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
