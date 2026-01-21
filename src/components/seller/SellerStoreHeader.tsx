import { FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";

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
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === "ar";

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/10 p-10 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10 ${isAr ? "lg:flex-row-reverse" : ""}`}>
                <div className={`flex flex-col sm:flex-row items-center gap-8 ${isAr ? "sm:flex-row-reverse" : ""}`}>
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
                    <div className={`text-center flex-1 ${isAr ? "sm:text-right" : "sm:text-left"}`}>
                        <div className={`flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-4 ${isAr ? "sm:flex-row-reverse" : ""}`}>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{store.name}</h1>
                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                {t("seller.trustedStore")}
                            </span>
                        </div>
                        <div className={`flex flex-wrap justify-center items-center gap-5 ${isAr ? "sm:justify-end" : "sm:justify-start"}`}>
                            <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{t("seller.productCount")}:</span>
                                <span className="text-emerald-400 font-black text-xs">{productCount}</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-white/10 hidden sm:block"></span>
                            <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{t("marketplace.status")}:</span>
                                <span className="text-indigo-400 font-black text-xs uppercase">{t("seller.active")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onAddProduct}
                    className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600/30 transition shadow-xl active:scale-95 shrink-0"
                >
                    <FiPlus size={18} className={isAr ? "order-last" : ""} />
                    {t("seller.addProduct")}
                </button>
            </div>
        </div>
    );
}
