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
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProductFn(productId);
            if (onDelete) {
                onDelete(productId);
            } else {
                onRefresh();
            }
        } catch (err) {
            console.error("Failed to delete product", err);
            alert("Failed to delete product. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-10 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <FiPackage className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Active Consignments</h2>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Real-time inventory synchronization</p>
                    </div>
                </div>
                <span className="bg-white/5 text-white/40 border border-white/10 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest">
                    {products.length} Total SKUs
                </span>
            </div>

            {products.length === 0 ? (
                <div className="px-10 py-32 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-white/5 shadow-inner">
                        <FiPackage size={40} className="text-white/10" />
                    </div>
                    <h3 className="text-xl font-black text-white/40 uppercase tracking-tight">Depleted Inventory</h3>
                    <p className="mt-2 font-bold text-white/20 uppercase tracking-widest text-[10px] max-w-xs mx-auto leading-relaxed">
                        Your catalog is currently empty. Initialize items to start distribution.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] bg-white/5">
                                <th className="px-10 py-5">Product Metadata</th>
                                <th className="px-10 py-5">Current Pricing</th>
                                <th className="px-10 py-5">Consignment Stock</th>
                                <th className="px-10 py-5">Classification</th>
                                <th className="px-10 py-5 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-all duration-300 group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative w-14 h-14 rounded-2xl bg-stone-900 border border-white/5 overflow-hidden shadow-inner group-hover:border-emerald-500/30 transition-colors">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{product.name}</p>
                                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5 line-clamp-1">
                                                    {product.shortDescription || "No metadata available"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-lg font-black text-emerald-400 tracking-tighter">
                                            {product.price}₪
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span
                                            className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border backdrop-blur-md transition-all duration-300 ${product.stock === 0
                                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                : product.stock <= 10
                                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                }`}
                                        >
                                            {product.stock === 0 ? 'Depleted' : `${product.stock} Units`}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                            {product.category || "General"}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-3 bg-white/5 text-white/40 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deletingId === product.id}
                                                className="p-3 bg-red-500/5 text-red-500/40 border border-red-500/10 rounded-xl hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all shadow-lg disabled:opacity-30"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
