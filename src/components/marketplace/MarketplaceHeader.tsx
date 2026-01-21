import React from "react";
import { FiShoppingBag, FiUserPlus, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import SellerNotificationBell from "../seller/SellerNotificationBell";

type Props = {
    onBecomeSeller: () => void;
    onGoToDashboard: () => void;
    showBecomeSeller?: boolean;
    showDashboard?: boolean;
};

export default function MarketplaceHeader({
    onBecomeSeller,
    onGoToDashboard,
    showBecomeSeller = true,
    showDashboard = false
}: Props) {
    const { toggleCart, cartItems } = useCart();
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-8 mb-6 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700" dir="rtl">
            <div className="flex items-center gap-3 md:gap-6 group w-full lg:w-auto">
                <div className="shrink-0 w-10 h-10 md:w-16 md:h-16 bg-emerald-500/5 backdrop-blur-3xl rounded-xl md:rounded-[1.5rem] border border-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[5deg] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <FiShoppingBag className="w-5 h-5 md:w-8 md:h-8 relative z-10" />
                </div>
                <div>
                    <div className="flex flex-col mb-1 text-right">
                        <span className="text-emerald-500/40 text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-0.5 pr-2 md:pr-3 border-r-2 border-emerald-500/30 leading-none">
                            سوق التراث
                        </span>
                        <h1 className="text-xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] transition-all group-hover:tracking-tight duration-700">
                            المتجر
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-5 w-full xl:w-auto">
                {showDashboard && (
                    <div className="hidden sm:block">
                        <SellerNotificationBell />
                    </div>
                )}

                <button
                    onClick={toggleCart}
                    className="relative w-14 h-14 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/20 text-emerald-400 rounded-full transition-all duration-500 shadow-xl flex items-center justify-center group/cart active:scale-90"
                >
                    <FiShoppingCart size={22} className="group-hover/cart:scale-110 transition-transform duration-500" />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#1a1a1a] shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-in zoom-in duration-500">
                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </button>

                <div className="h-8 w-px bg-white/5 hidden xl:block mx-1" />

                {showBecomeSeller && (
                    <button
                        onClick={onBecomeSeller}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-full font-black text-[10px] uppercase tracking-[0.1em] hover:bg-emerald-600/30 transition-all active:scale-95 group/btn shadow-xl"
                    >
                        <FiUserPlus size={18} className="group-hover/btn:rotate-12 transition-transform duration-500" />
                        <span>انضم كبائع</span>
                    </button>
                )}

                {showDashboard && (
                    <button
                        onClick={onGoToDashboard}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-full font-black text-[10px] uppercase tracking-[0.1em] hover:bg-emerald-600/30 transition-all active:scale-95 group/btn shadow-xl"
                    >
                        <FiShoppingBag size={18} className="group-hover/btn:-translate-y-1 transition-transform duration-500" />
                        <span>
                            {window.location.pathname.startsWith('/admin') || (typeof window !== 'undefined' && (window as any).isAdminCheck) ? "لوحة التحكم" : "حساب التاجر"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
