import React from "react";
import { FiPlus } from "react-icons/fi";

type Props = {
    store: {
        name: string;
        logo?: string | null;
    };
    productCount: number;
    onAddProduct: () => void;
};

export default function SellerStoreHeader({
    store,
    productCount,
    onAddProduct,
}: Props) {
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/10 p-10 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center overflow-hidden border border-white/10 shadow-inner group transition-all duration-500 hover:border-emerald-500/30">
                        {store.logo && store.logo.length > 0 ? (
                            <img
                                src={store.logo}
                                alt={store.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="text-white font-black text-3xl uppercase tracking-tighter opacity-10 group-hover:opacity-30 transition-opacity">
                                {store.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{store.name}</h1>
                            <span className="px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                CONSORTIUM_VETTED
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                                SKU_INVENTORY: <span className="text-emerald-400/60 ml-1">{productCount} UNITS</span>
                            </p>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/5 hidden sm:block"></span>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                                STATUS: <span className="text-indigo-400/60 ml-1">PLATFORM_VIBRANT</span>
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onAddProduct}
                    className="w-full lg:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600/30 transition shadow-xl shadow-black/20 hover:shadow-emerald-500/10 active:scale-95 shrink-0"
                >
                    <FiPlus size={20} className="transition-transform group-hover:rotate-90" />
                    Archive New SKU
                </button>
            </div>
        </div>
    );
}
