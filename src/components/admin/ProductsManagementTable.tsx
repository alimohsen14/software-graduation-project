import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiLayers, FiAlertTriangle } from "react-icons/fi";

type ProductStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface MappedProduct {
  id: string;
  image: string;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  shortDescription?: string;
  fullDescription?: string;
  category?: string;
  badge?: string;
}

interface ProductsManagementTableProps {
  products: MappedProduct[];
  onEdit: (product: MappedProduct) => void;
  onDelete: (productId: string) => void;
  isDeleting?: boolean;
}

export default function ProductsManagementTable({
  products,
  onEdit,
  onDelete,
  isDeleting = false,
}: ProductsManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<MappedProduct | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (product: MappedProduct) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/10">
        <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3 text-left">
            <FiLayers className="w-6 h-6 text-[#4A6F5D]" />
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
              Products Management
            </h2>
          </div>
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6F5D]/20 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-400 text-[11px] font-black uppercase tracking-tighter">
                <th className="px-8 py-4">Product Info</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                    {searchQuery ? "No products match your search." : "No products found."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <span className="font-bold text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-gray-900">
                      {p.price.toFixed(2)}₪
                    </td>
                    <td className="px-8 py-5 text-gray-700">{p.stock} units</td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-black border ${p.status === "IN_STOCK"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : p.status === "LOW_STOCK"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-5">
                        <button
                          title="Edit Product"
                          onClick={() => onEdit(p)}
                          className="text-[#4A6F5D] hover:scale-110 transition-transform"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          title="Delete Product"
                          onClick={() => handleDeleteClick(p)}
                          className="text-[#A33A2B] hover:scale-110 transition-transform"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <FiAlertTriangle className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border font-medium text-gray-600 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-[#A33A2B] text-white font-medium hover:bg-[#8a3024] disabled:opacity-50 flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

