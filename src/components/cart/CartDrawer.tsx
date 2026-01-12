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
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500"
                    onClick={closeCart}
                />

                {/* Modal Container */}
                <div
                    ref={drawerRef}
                    className="relative w-full max-w-5xl bg-[#0d0d0d]/80 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-500 group"
                >
                    {/* Background decorative glows */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />

                    {/* Header */}
                    <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/5 z-10 shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Acquisition Manifest</span>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                                <FiShoppingBag className="text-emerald-500" />
                                Your Buffer
                                <span className="text-[10px] font-black text-white/40 bg-white/5 border border-white/5 px-4 py-1 rounded-full uppercase tracking-widest">
                                    {String(cartItems.length).padStart(2, '0')} SEGMENTS
                                </span>
                            </h2>
                        </div>
                        <button
                            onClick={closeCart}
                            className="flex items-center gap-3 text-white/30 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:bg-white/10 active:scale-95"
                        >
                            <FiX size={18} />
                            Exit
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto p-10 relative z-10">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="w-32 h-32 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mb-8 group/empty">
                                    <FiShoppingBag size={48} className="text-white/10 group-hover:scale-110 group-hover:text-emerald-500/30 transition-all duration-700" />
                                </div>
                                <div className="mb-10">
                                    <p className="text-3xl font-black text-white uppercase tracking-tighter">Empty Manifest</p>
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mt-3">No acquisition data found in current session.</p>
                                </div>
                                <button
                                    onClick={closeCart}
                                    className="flex items-center gap-4 px-12 py-5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl hover:bg-emerald-600/30 transition-all font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95"
                                >
                                    <FiArrowLeft />
                                    Initialize Collection
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col xl:flex-row gap-12">
                                {/* Items List */}
                                <div className="flex-1 space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-8 p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all group/item relative overflow-hidden">
                                            <div className="w-32 h-32 bg-black rounded-2xl flex-shrink-0 overflow-hidden border border-white/10 shadow-xl relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 block">Artifact Variant</span>
                                                        <h3 className="font-black text-white text-xl uppercase tracking-tighter line-clamp-1">{item.name}</h3>
                                                        {item.store && (
                                                            <p className="text-[9px] font-black text-emerald-500/40 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                                Provider: <span className="text-white/60">{item.store.name}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Unit Valuation</span>
                                                        <p className="text-white font-black text-2xl leading-none">
                                                            {item.price.toFixed(2)}<span className="text-emerald-500 text-sm ml-1">₪</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-6">
                                                    <div className="flex items-center gap-5 bg-black/40 rounded-xl p-1.5 border border-white/5">
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
                                                        title="Purge Segment"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={closeCart}
                                        className="flex items-center gap-3 text-white/20 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mt-8 px-2 group/back"
                                    >
                                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                        Expand Acquisition
                                    </button>
                                </div>

                                {/* Summary Sidebar */}
                                <div className="xl:w-96 shrink-0">
                                    <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 sticky top-0 backdrop-blur-md overflow-hidden group/summary">
                                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-[60px]" />

                                        <h3 className="font-black text-white mb-8 text-[11px] uppercase tracking-[0.4em] border-b border-white/5 pb-6">Manifest Totals</h3>

                                        <div className="space-y-4 mb-10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Gross Valuation</span>
                                                <span className="text-white font-bold">{subtotal.toFixed(2)}₪</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Logistics Overlay</span>
                                                <span className="text-white font-bold">{shipping.toFixed(2)}₪</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-6 relative z-10">
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Final Resolution</span>
                                                <span className="text-3xl font-black text-white">{totalAmount.toFixed(2)}<span className="text-emerald-500 text-sm ml-1">₪</span></span>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full py-6 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-all shadow-2xl relative overflow-hidden group/checkout"
                                            onClick={() => setIsCheckoutOpen(true)}
                                        >
                                            <span className="relative z-10">Initiate Resolution</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-checkout:translate-x-full transition-transform duration-1000" />
                                        </button>

                                        <button
                                            onClick={clearCart}
                                            className="w-full text-[9px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-red-500/60 text-center py-4 mt-4 transition-colors"
                                        >
                                            Wipe Manifest
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
