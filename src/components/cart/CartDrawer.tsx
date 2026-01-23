import React, { useEffect, useRef, useState } from "react";
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import CheckoutModal from "../checkout/CheckoutModal";
import { createOrder, mockPayment } from "../../services/order.service";
import { useTranslation } from "react-i18next";

export default function CartDrawer() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "ar";

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
                alert(t("marketplace.checkout.success"));
            } catch (paymentError) {
                console.error("Payment failed", paymentError);
                alert(t("marketplace.checkout.paymentFailed"));
            }

            clearCart();
            setIsCheckoutOpen(false);
            closeCart();
        } catch (err: unknown) {
            console.error("Order failed", err);
            const errorMessage =
                err instanceof Error ? err.message : t("marketplace.checkout.errorRequired");
            alert(errorMessage);
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4" dir={isRtl ? "rtl" : "ltr"}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
                    onClick={closeCart}
                />

                {/* Modal Container */}
                <div
                    ref={drawerRef}
                    className="relative w-full h-full md:h-auto md:max-h-[92vh] md:max-w-5xl bg-[#0d0d0d] md:bg-[#0d0d0d]/80 md:backdrop-blur-3xl md:rounded-[3.5rem] border-t md:border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-full md:slide-in-from-bottom-0 duration-500 group"
                >
                    {/* Background decorative glows (Hidden on mobile for performance) */}
                    <div className="hidden md:block absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
                    <div className="hidden md:block absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />

                    {/* Header */}
                    <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/5 flex items-center justify-between bg-white/5 z-10 shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-1 md:mb-2">{t("appName")}</span>
                            <h2 className={`text-xl md:text-3xl font-black text-white uppercase tracking-tighter flex items-center ${isRtl ? "flex-row-reverse" : ""} gap-3 md:gap-4`}>
                                <FiShoppingBag className="text-emerald-500 shrink-0" />
                                {t("marketplace.cart.title")}
                                <span className="hidden sm:inline-flex text-[10px] font-black text-white/40 bg-white/5 border border-white/5 px-4 py-1 rounded-full uppercase tracking-widest">
                                    {String(cartItems.length).padStart(2, '0')} {t("marketplace.cart.items")}
                                </span>
                            </h2>
                        </div>
                        <button
                            onClick={closeCart}
                            className={`flex items-center ${isRtl ? "flex-row-reverse" : ""} gap-2 md:gap-3 text-white/30 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest bg-white/5 p-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/5 hover:bg-white/10 active:scale-95`}
                        >
                            <FiX size={18} />
                            <span className="hidden sm:inline">{t("marketplace.cart.exit")}</span>
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mb-6 md:mb-8 group/empty">
                                    <FiShoppingBag size={40} className="text-white/10 group-hover:scale-110 group-hover:text-emerald-500/30 transition-all duration-700" />
                                </div>
                                <div className="mb-8 md:mb-10">
                                    <p className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">{t("marketplace.cart.emptyTitle")}</p>
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mt-3 whitespace-pre-wrap">{t("marketplace.cart.emptyDesc")}</p>
                                </div>
                                <button
                                    onClick={closeCart}
                                    className={`flex items-center ${isRtl ? "flex-row-reverse text-right" : ""} gap-4 px-10 py-4 md:px-12 md:py-5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl md:rounded-2xl hover:bg-emerald-600/30 transition-all font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95`}
                                >
                                    <FiArrowLeft className={isRtl ? "rotate-180" : ""} />
                                    {t("marketplace.cart.startShopping")}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col xl:flex-row gap-8 md:gap-12">
                                {/* Items List */}
                                <div className="flex-1 space-y-4 md:space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className={`flex flex-col sm:flex-row gap-4 md:gap-8 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all group/item relative overflow-hidden ${isRtl ? "text-right" : "text-left"}`}>
                                            <div className="w-full sm:w-24 sm:h-24 md:w-32 md:h-32 aspect-square md:aspect-auto bg-black rounded-xl md:rounded-2xl flex-shrink-0 overflow-hidden border border-white/10 shadow-xl relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className={`flex justify-between items-start gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                                                    <div className={isRtl ? "text-right" : "text-left"}>
                                                        <span className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 block">{t("marketplace.cart.product")}</span>
                                                        <h3 className="font-black text-white text-lg md:text-xl uppercase tracking-tighter line-clamp-2">{item.name}</h3>
                                                        {item.store && (
                                                            <p className={`text-[9px] font-black text-emerald-500/40 uppercase tracking-widest mt-2 flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                                                                {t("marketplace.cart.seller")}: <span className="text-white/60">{item.store.name}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className={`flex flex-col shrink-0 ${isRtl ? "items-start" : "items-end"}`}>
                                                        <span className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{t("marketplace.cart.unitPrice")}</span>
                                                        <p className="text-white font-black text-xl md:text-2xl leading-none">
                                                            {item.price.toFixed(2)}<span className="text-emerald-500 text-sm ml-1">₪</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center justify-between mt-4 md:mt-6 ${isRtl ? "flex-row-reverse" : ""}`}>
                                                    <div className={`flex items-center gap-4 bg-black/40 rounded-xl p-1 md:p-1.5 border border-white/5 ${isRtl ? "flex-row-reverse" : ""}`}>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all disabled:opacity-10"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <FiMinus size={14} />
                                                        </button>
                                                        <span className="text-sm font-black w-6 text-center text-white tabular-nums">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
                                                        >
                                                            <FiPlus size={14} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20"
                                                        title={t("marketplace.cart.remove")}
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={closeCart}
                                        className={`flex items-center ${isRtl ? "flex-row-reverse text-right" : ""} gap-3 text-white/20 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mt-4 md:mt-8 px-2 group/back`}
                                    >
                                        <FiArrowLeft className={`transition-transform duration-300 ${isRtl ? "rotate-180 group-hover:translate-x-1" : "group-hover:-translate-x-1"}`} />
                                        {t("marketplace.cart.continueShopping")}
                                    </button>
                                </div>

                                {/* Summary Sidebar */}
                                <div className="xl:w-96 shrink-0 mt-8 xl:mt-0">
                                    <div className="bg-white/5 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/10 sticky top-0 backdrop-blur-md overflow-hidden group/summary">
                                        <div className="hidden md:block absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-[60px]" />

                                        <h3 className={`font-black text-white mb-6 md:mb-8 text-[11px] uppercase tracking-[0.4em] border-b border-white/5 pb-4 md:pb-6 ${isRtl ? "text-right" : "text-left"}`}>{t("marketplace.cart.summary")}</h3>

                                        <div className="space-y-4 mb-8 md:mb-10">
                                            <div className={`flex justify-between items-center ${isRtl ? "flex-row-reverse" : ""}`}>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{t("marketplace.cart.subtotal")}</span>
                                                <span className="text-white font-bold">{subtotal.toFixed(2)}₪</span>
                                            </div>
                                            {/* FEES REMOVED AS REQUESTED */}
                                            <div className={`flex justify-between items-center pt-4 md:pt-6 border-t border-white/10 mt-4 md:mt-6 relative z-10 ${isRtl ? "flex-row-reverse" : ""}`}>
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500/60">{t("marketplace.cart.total")}</span>
                                                <span className="text-2xl md:text-3xl font-black text-white">{totalAmount.toFixed(2)}<span className="text-emerald-500 text-sm ml-1">₪</span></span>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full py-5 md:py-6 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl md:rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-all shadow-2xl relative overflow-hidden group/checkout"
                                            onClick={() => setIsCheckoutOpen(true)}
                                        >
                                            <span className="relative z-10">{t("marketplace.cart.checkout")}</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/checkout:translate-x-full transition-transform duration-1000" />
                                        </button>

                                        <button
                                            onClick={clearCart}
                                            className="w-full text-[9px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-red-500/60 text-center py-4 mt-2 md:mt-4 transition-colors"
                                        >
                                            {t("marketplace.cart.clear")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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
