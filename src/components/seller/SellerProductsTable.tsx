import React, { useState } from "react";
import { FiPackage, FiEdit2, FiTrash2 } from "react-icons/fi";
import { SellerProduct } from "../../services/seller.service";
import { useTranslation } from "react-i18next";

type Props = {
    products: SellerProduct[];
    onRefresh: () => void;
    onEdit: (product: SellerProduct) => void;
    onDelete?: (productId: number) => void;
    deleteProductFn: (productId: number) => Promise<void>;
};

export default function SellerProductsTable({ products, onRefresh, onEdit, onDelete, deleteProductFn }: Props) {
    const { t, i18n } = useTranslation("seller");
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const isAr = i18n.language === "ar";

    const handleDelete = async (productId: number) => {
        if (!window.confirm(t("products.deleteConfirm"))) return;

        try {
            await deleteProductFn(productId);
            if (onDelete) {
                onDelete(productId);
            } else {
                onRefresh();
            }
        } catch (err) {
            console.error("Failed to delete product", err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl transition-all duration-300">
            <div className={`px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between ${isAr ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <FiPackage className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <h2 className="text-sm font-bold text-white uppercase tracking-tight">{t("products.activeProducts")}</h2>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">{t("products.syncInventory")}</p>
                    </div>
                </div>
                <span className="bg-white/5 text-white/40 border border-white/10 text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest leading-none">
                    {t("products.totalProducts", { count: products.length })}
                </span>
            </div>

            {products.length === 0 ? (
                <div className="px-10 py-20 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-white/5 shadow-inner">
                        <FiPackage size={28} className="text-white/10" />
                    </div>
                    <h3 className="text-base font-bold text-white/40 uppercase tracking-tight">{t("products.noProducts")}</h3>
                    <p className="mt-2 font-bold text-white/20 uppercase tracking-widest text-[9px] max-w-xs mx-auto leading-relaxed">
                        {t("products.noProductsDesc")}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className={`w-full ${isAr ? 'text-right' : 'text-left'} border-collapse`} dir={isAr ? 'rtl' : 'ltr'}>
                            <thead>
                                <tr className="text-white/30 text-[9px] font-black uppercase tracking-widest bg-white/5">
                                    <th className="px-6 py-3">{t("products.productInfo")}</th>
                                    <th className="px-6 py-3 text-center">{t("products.pricing")}</th>
                                    <th className="px-6 py-3 text-center">{t("products.inventory")}</th>
                                    <th className="px-6 py-3 text-center">{t("products.category")}</th>
                                    <th className="px-6 py-3 text-center">{t("products.actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/[0.02] transition-all duration-300 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 rounded-lg bg-stone-900 border border-white/5 overflow-hidden shadow-inner group-hover:border-emerald-500/30 transition-colors shrink-0">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="space-y-0.5 overflow-hidden">
                                                    <p className="font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight text-xs truncate">{product.name}</p>
                                                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest line-clamp-1">
                                                        {product.shortDescription || t("products.noDesc")}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-black text-emerald-400 tracking-tight">
                                                {product.price}₪
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md transition-all duration-300 ${product.stock === 0
                                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                    : product.stock <= 10
                                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    }`}
                                            >
                                                {product.stock === 0 ? t("products.outOfStock") : t("products.units", { count: product.stock })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                                                {product.category || t("products.general")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="p-2 bg-white/5 text-white/40 border border-white/5 rounded-lg hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    <FiEdit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deletingId === product.id}
                                                    className="p-2 bg-red-500/5 text-red-500/40 border border-red-500/10 rounded-lg hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-30"
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden p-4 space-y-3">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3" dir={isAr ? 'rtl' : 'ltr'}>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-lg bg-stone-900 border border-white/5 overflow-hidden shrink-0">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className={`flex-1 overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
                                        <h3 className="text-xs font-bold text-white line-clamp-1 uppercase">{product.name}</h3>
                                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-0.5 line-clamp-1">
                                            {product.shortDescription || t("products.noDesc")}
                                        </p>
                                        <div className={`flex items-center gap-2 mt-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-[8px] font-bold text-white/40 uppercase px-1.5 py-0.5 bg-white/5 rounded-md border border-white/5">
                                                {product.category || t("products.general")}
                                            </span>
                                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${product.stock === 0 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                                                {product.stock === 0 ? t("products.outOfStock") : t("products.units", { count: product.stock })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`flex items-center justify-between pt-3 border-t border-white/5 ${isAr ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center gap-1.5 ${isAr ? 'flex-row-reverse' : ''}`}>
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2.5 bg-white/5 text-white/40 border border-white/5 rounded-lg active:scale-95 transition-all"
                                        >
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2.5 bg-red-500/5 text-red-500/40 border border-red-500/10 rounded-lg active:scale-95 transition-all"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                    <span className="text-base font-black text-emerald-400 tracking-tight">
                                        {product.price}₪
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
