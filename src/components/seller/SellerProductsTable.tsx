import React, { useState } from "react";
import { FiPackage, FiEdit2, FiTrash2 } from "react-icons/fi";
import { SellerProduct, deleteProduct } from "../../services/seller.service";

type Props = {
    products: SellerProduct[];
    onRefresh: () => void;
};

export default function SellerProductsTable({ products, onRefresh }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (productId: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const token = localStorage.getItem("accessToken");
        if (!token) return;

        setDeletingId(productId);
        try {
            await deleteProduct(token, productId);
            onRefresh();
        } catch (err) {
            console.error("Failed to delete product", err);
            alert("Failed to delete product. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <FiPackage className="w-5 h-5 text-[#4A6F5D]" />
                <h2 className="text-lg font-bold text-gray-800">Your Products</h2>
                <span className="bg-[#4A6F5D] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {products.length}
                </span>
            </div>

            {products.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No products yet</p>
                    <p className="text-gray-400 text-sm">Add your first product to start selling</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr className="text-gray-400 text-xs font-bold uppercase">
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-400 line-clamp-1">
                                                    {product.shortDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#4A6F5D]">
                                        {product.price}₪
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock === 0
                                                    ? "bg-red-100 text-red-700"
                                                    : product.stock <= 10
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {product.category || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-[#4A6F5D] hover:bg-gray-100 rounded-lg transition">
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deletingId === product.id}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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
