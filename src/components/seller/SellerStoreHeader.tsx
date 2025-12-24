import React from "react";
import { FiShoppingBag, FiPlus, FiCheckCircle } from "react-icons/fi";
import { SellerStore } from "../../services/seller.service";

type Props = {
    store: SellerStore;
    productCount: number;
    onAddProduct: () => void;
};

export default function SellerStoreHeader({
    store,
    productCount,
    onAddProduct,
}: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#eaf5ea] rounded-xl flex items-center justify-center">
                        <FiShoppingBag className="w-7 h-7 text-[#4A6F5D]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-[#1F2933]">{store.name}</h1>
                            {store.isApproved && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <FiCheckCircle size={12} />
                                    Approved
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">
                            {productCount} products • Seller Dashboard
                        </p>
                    </div>
                </div>

                <button
                    onClick={onAddProduct}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4A6F5D] text-white rounded-xl font-bold hover:bg-[#3d5c4d] transition shadow-sm"
                >
                    <FiPlus size={18} />
                    Add Product
                </button>
            </div>
        </div>
    );
}
