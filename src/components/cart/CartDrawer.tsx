import React, { useEffect, useRef, useState } from "react";
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import CheckoutModal from "../checkout/CheckoutModal";
import { createOrder, mockPayment } from "../../services/order.service";

export default function CartDrawer() {
    const {
        cartItems,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const drawerRef = useRef<HTMLDivElement>(null);

    // Checkout State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            // Don't close modal if checkout modal is open (simple check)
            if (e.key === "Escape" && !isCheckoutOpen) closeCart();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeCart, isCheckoutOpen]);

    // Prevent scrolling when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const shipping = 15;
    const totalAmount = subtotal + shipping;

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
            // 1. Create Order
            const order = await createOrder({
                city,
                address,
                phone,
                total: totalAmount,
                items: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });

            // 2. Mock Payment
            try {
                await mockPayment(order.id);
                alert("Order placed and payment successful!");
            } catch (paymentError) {
                console.error("Payment failed", paymentError);
                alert("Order created, but payment failed. Please retry from your profile.");
            }

            clearCart();
            setIsCheckoutOpen(false);
            closeCart();
            // Optional: Redirect to profile/orders could happen here
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
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop (Darker and blocks content) */}
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                    onClick={closeCart}
                />

                {/* Modal Container */}
                <div
                    ref={drawerRef}
                    className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b flex items-center justify-between bg-white z-10 shrink-0">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <FiShoppingBag className="text-[#4A6F5D]" />
                            Your Cart
                            <span className="text-sm font-medium text-white bg-[#4A6F5D] px-2.5 py-0.5 rounded-full">
                                {cartItems.length} items
                            </span>
                        </h2>
                        <button
                            onClick={closeCart}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                        >
                            <FiX size={18} />
                            Close
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                                    <FiShoppingBag size={40} className="text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">Your cart is empty</p>
                                    <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
                                </div>
                                <button
                                    onClick={closeCart}
                                    className="flex items-center gap-2 px-8 py-3 bg-[#4A6F5D] text-white rounded-xl hover:bg-[#3d5c4d] transition-colors font-bold shadow-lg shadow-[#4A6F5D]/20 animate-pulse"
                                >
                                    <FiArrowLeft />
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Items List */}
                                <div className="flex-1 space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-colors">
                                            <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 shadow-sm">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{item.name}</h3>
                                                        {item.store && (
                                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                Sold by: <span className="font-medium text-gray-700">{item.store.name}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="text-[#4A6F5D] font-bold text-lg">
                                                        {item.price.toFixed(2)}₪
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center gap-3 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 hover:text-[#4A6F5D] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <FiMinus size={14} />
                                                        </button>
                                                        <span className="text-sm font-bold w-6 text-center text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 hover:text-[#4A6F5D] transition-colors"
                                                        >
                                                            <FiPlus size={14} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                        title="Remove item"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={closeCart}
                                        className="flex items-center gap-2 text-gray-500 hover:text-[#1F2933] font-medium transition-colors mt-6 px-2"
                                    >
                                        <FiArrowLeft />
                                        Continue Shopping
                                    </button>
                                </div>

                                {/* Summary Sidebar */}
                                <div className="lg:w-80 shrink-0">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-0">
                                        <h3 className="font-bold text-gray-900 mb-6 text-lg border-b border-gray-200 pb-4">Order Summary</h3>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal</span>
                                                <span>{subtotal.toFixed(2)}₪</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Shipping</span>
                                                <span>{shipping}₪</span>
                                            </div>
                                            <div className="flex justify-between text-xl font-bold text-[#4A6F5D] pt-4 border-t border-gray-200">
                                                <span>Total</span>
                                                <span>{totalAmount.toFixed(2)}₪</span>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full py-4 bg-[#4A6F5D] text-white rounded-xl font-bold hover:bg-[#3d5c4d] active:scale-[0.98] transition-all shadow-lg shadow-[#4A6F5D]/20 mb-3"
                                            onClick={() => setIsCheckoutOpen(true)}
                                        >
                                            Proceed to Checkout
                                        </button>

                                        <button
                                            onClick={clearCart}
                                            className="w-full text-xs text-gray-400 hover:text-red-500 text-center py-2"
                                        >
                                            Clear Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Checkout Modal (Rendered via Portal or separate layer usually, but strictly z-index managed here) */}
            {isCheckoutOpen && (
                <div className="relative z-[110]">
                    <CheckoutModal
                        total={totalAmount}
                        onClose={() => setIsCheckoutOpen(false)}
                        onConfirm={handleConfirmOrder}
                        isLoading={isOrdering}
                    />
                </div>
            )}
        </>
    );
}
