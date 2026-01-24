import React, { useEffect, useRef, useState } from "react";
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import CheckoutModal from "../checkout/CheckoutModal";
import { createOrder, mockPayment } from "../../services/order.service";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function CartDrawer() {
    const { t, i18n } = useTranslation("marketplace");
    const isRtl = i18n.language === "ar";
    const { t: g } = useTranslation();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCheckoutClick = () => {
        if (!isAuthenticated) {
            toast.info(t("auth.loginRequired") || "Please login to continue");
            navigate("/login", { state: { from: location } });
            closeCart();
            return;
        }
        setIsCheckoutOpen(true);
    };

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
    // REMOVED platform fees as per requirements
    const totalAmount = subtotal;

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

            try {
                await mockPayment(order.id);
                alert(t("checkout.success"));
            } catch (paymentError) {
                console.error("Payment failed", paymentError);
                alert(t("checkout.paymentFailed"));
            }

            clearCart();
            setIsCheckoutOpen(false);
            closeCart();
        } catch (err: unknown) {
            console.error("Order failed", err);
            const errorMessage =
                err instanceof Error ? err.message : t("checkout.errorRequired");
            alert(errorMessage);
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4" dir={isRtl ? "rtl" : "ltr"}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
                    onClick={closeCart}
                />

                {/* Modal Container */}
                <div
                    ref={drawerRef}
                    className="relative w-full h-[85vh] md:h-auto md:max-h-[85vh] md:max-w-[420px] bg-[#0d0d0d] md:bg-[#0d0d0d]/90 md:backdrop-blur-3xl rounded-t-2xl md:rounded-2xl border-t md:border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-500 group"
                >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] z-10 shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mb-0.5">{g("appName")}</span>
                            <h2 className={`text-lg font-black text-white uppercase tracking-tighter flex items-center ${isRtl ? "flex-row-reverse" : ""} gap-2`}>
                                <FiShoppingBag className="text-emerald-500 shrink-0" size={18} />
                                {t("cart.title")}
                                <span className="inline-flex text-[9px] font-black text-white/40 bg-white/5 border border-white/5 px-3 py-0.5 rounded-full uppercase tracking-widest ml-2">
                                    {String(cartItems.length).padStart(2, '0')}
                                </span>
                            </h2>
                        </div>
                        <button
                            onClick={closeCart}
                            className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-all bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 active:scale-95"
                        >
                            <FiX size={16} />
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-5 relative z-10 custom-scrollbar">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mb-5 group/empty">
                                    <FiShoppingBag size={30} className="text-white/10 group-hover:scale-110 group-hover:text-emerald-500/30 transition-all duration-700" />
                                </div>
                                <div className="mb-6">
                                    <p className="text-xl font-black text-white uppercase tracking-tighter">{t("cart.emptyTitle")}</p>
                                    <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] mt-2 max-w-[200px] mx-auto">{t("cart.emptyDesc")}</p>
                                </div>
                                <button
                                    onClick={closeCart}
                                    className={`flex items-center ${isRtl ? "flex-row-reverse text-right" : ""} gap-3 px-8 py-3.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-600/30 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95`}
                                >
                                    <FiArrowLeft className={isRtl ? "rotate-180" : ""} size={14} />
                                    {t("cart.startShopping")}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {cartItems.map((item) => (
                                    <div key={item.id} className={`flex gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group/item relative overflow-hidden ${isRtl ? "text-right" : "text-left"}`}>
                                        <div className="w-16 h-16 rounded-lg bg-black flex-shrink-0 overflow-hidden border border-white/5 shadow-lg">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-black text-white text-[11px] uppercase tracking-tight line-clamp-1">{item.name}</h3>
                                                    {item.store && (
                                                        <p className="text-[7px] font-black text-emerald-500/40 uppercase tracking-widest mt-1 truncate">
                                                            <span className="text-white/30">{item.store.name}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <p className="text-white font-black text-sm">
                                                        {item.price.toFixed(0)}<span className="text-emerald-500 text-[10px] ml-0.5">₪</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2.5 bg-black/40 rounded-lg p-0.5 border border-white/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-white hover:bg-white/10 transition-all"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <FiMinus size={10} />
                                                    </button>
                                                    <span className="text-[10px] font-black w-4 text-center text-white tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-white hover:bg-white/10 transition-all"
                                                    >
                                                        <FiPlus size={10} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-white/10 hover:text-red-500 transition-all p-1"
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-4 md:p-5 border-t border-white/5 bg-white/[0.02] shrink-0">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{t("cart.subtotal")}</span>
                                    <span className="text-[11px] font-bold text-white/60">{subtotal.toFixed(2)}₪</span>
                                </div>
                                <div className="flex justify-between items-center px-1 pt-2 border-t border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">{t("cart.total")}</span>
                                    <span className="text-xl font-black text-white">{totalAmount.toFixed(0)}<span className="text-emerald-500 text-xs ml-0.5">₪</span></span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-all relative overflow-hidden group/checkout"
                                    onClick={handleCheckoutClick}
                                >
                                    <span className="relative z-10">{t("cart.checkout")}</span>
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="w-full text-[8px] font-black uppercase tracking-[0.2em] text-white/10 hover:text-red-500/60 py-2 transition-colors"
                                >
                                    {t("cart.clear")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Checkout Modal */}
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
