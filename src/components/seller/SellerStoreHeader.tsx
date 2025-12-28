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
    console.log("STORE LOGO HEADER:", store.logo);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#eaf5ea] rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                        {store.logo && store.logo.length > 0 ? (
                            <img
                                src={store.logo}
                                alt={store.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-[#4A6F5D] font-bold text-xl uppercase">
                                {store.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-[#1F2933]">{store.name}</h1>
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
