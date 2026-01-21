import React, { useState } from "react";
import { FiPackage, FiEdit2, FiTrash2 } from "react-icons/fi";
import { SellerProduct } from "../../services/seller.service";

type Props = {
    products: SellerProduct[];
    onRefresh: () => void;
    onEdit: (product: SellerProduct) => void;
    onDelete?: (productId: number) => void;
    deleteProductFn: (productId: number) => Promise<void>;
};

export default function SellerProductsTable({ products, onRefresh, onEdit, onDelete, deleteProductFn }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (productId: number) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

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
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in duration-700">
            <div className="px-6 md:px-10 py-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <FiPackage className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-right">
                        <h2 className="text-base md:text-lg font-black text-white uppercase tracking-tight">المنتجات النشطة</h2>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">مزامنة المخزون في الوقت الفعلي</p>
                    </div>
                </div>
                <span className="bg-white/5 text-white/40 border border-white/10 text-[9px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest leading-none">
                    إجمالي {products.length} منتجات
                </span>
            </div>

            {products.length === 0 ? (
                <div className="px-10 py-24 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/5 shadow-inner">
                        <FiPackage size={32} className="text-white/10" />
                    </div>
                    <h3 className="text-lg font-black text-white/40 uppercase tracking-tight">لا يوجد منتجات</h3>
                    <p className="mt-2 font-bold text-white/20 uppercase tracking-widest text-[9px] max-w-xs mx-auto leading-relaxed">
                        كتالوج المنتجات فارغ حالياً. ابدأ بإضافة المنتجات لعرضها هنا.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="text-white/30 text-[9px] font-black uppercase tracking-widest bg-white/5">
                                    <th className="px-10 py-4 text-right">بيانات المنتج</th>
                                    <th className="px-10 py-4 text-center">التسعير</th>
                                    <th className="px-10 py-4 text-center">المخزون</th>
                                    <th className="px-10 py-4 text-center">الفئة</th>
                                    <th className="px-10 py-4 text-left">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-all duration-300 group">
                                        <td className="px-10 py-5">
                                            <div className="flex items-center gap-4 flex-row-reverse">
                                                <div className="relative w-12 h-12 rounded-xl bg-stone-900 border border-white/5 overflow-hidden shadow-inner group-hover:border-emerald-500/30 transition-colors shrink-0">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight text-sm">{product.name}</p>
                                                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-0.5 line-clamp-1">
                                                        {product.shortDescription || "لا يوجد وصف"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-5 text-center">
                                            <span className="text-base font-black text-emerald-400 tracking-tight">
                                                {product.price}₪
                                            </span>
                                        </td>
                                        <td className="px-10 py-5 text-center">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border backdrop-blur-md transition-all duration-300 ${product.stock === 0
                                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                    : product.stock <= 10
                                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    }`}
                                            >
                                                {product.stock === 0 ? 'نفذ' : `${product.stock} نسخة`}
                                            </span>
                                        </td>
                                        <td className="px-10 py-5 text-center">
                                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                {product.category || "عام"}
                                            </span>
                                        </td>
                                        <td className="px-10 py-5 text-left">
                                            <div className="flex items-center justify-start gap-2">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="p-2.5 bg-white/5 text-white/40 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
                                                >
                                                    <FiEdit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deletingId === product.id}
                                                    className="p-2.5 bg-red-500/5 text-red-500/40 border border-red-500/10 rounded-xl hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all shadow-lg disabled:opacity-30"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden p-4 space-y-4">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4">
                                <div className="flex items-center gap-4 flex-row-reverse">
                                    <div className="w-16 h-16 rounded-xl bg-stone-900 border border-white/5 overflow-hidden shrink-0">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-right flex-1">
                                        <h3 className="text-sm font-black text-white line-clamp-1">{product.name}</h3>
                                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1 line-clamp-1">
                                            {product.shortDescription || "بدون وصف"}
                                        </p>
                                        <div className="flex items-center justify-end gap-2 mt-2">
                                            <span className="text-[9px] font-bold text-white/40 uppercase px-2 py-0.5 bg-white/5 rounded border border-white/5">
                                                {product.category || "عام"}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${product.stock === 0 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                                                {product.stock === 0 ? 'نفذ' : `${product.stock} نسخة`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-3 bg-white/5 text-white/40 border border-white/10 rounded-xl active:scale-95 transition-all shadow-lg"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-3 bg-red-500/5 text-red-500/40 border border-red-500/10 rounded-xl active:scale-95 transition-all shadow-lg"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                    <span className="text-lg font-black text-emerald-400 tracking-tight">
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
