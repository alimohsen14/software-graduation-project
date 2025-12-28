import React from 'react';
import { FiX, FiBox, FiShoppingBag, FiHeart, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../services/store.service';

interface StoreSocialListsProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    stores: Store[];
    type: 'followed' | 'favorite';
}

export default function StoreSocialLists({ isOpen, onClose, title, stores, type }: StoreSocialListsProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        {type === 'followed' ? (
                            <FiUsers className="text-[#4A6F5D]" size={20} />
                        ) : (
                            <FiHeart className="text-red-500 fill-red-500" size={20} />
                        )}
                        <h3 className="text-xl font-bold text-[#1d2d1f]">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-xl"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* List */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {!Array.isArray(stores) || stores.length === 0 ? (
                        <div className="py-12 text-center flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                <FiBox size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">No stores found</p>
                            <p className="text-gray-400 text-xs px-10">
                                {type === 'followed'
                                    ? "You haven't followed any stores yet. Follow stores to see them here!"
                                    : "You haven't favorited any stores yet. Keep your favorite stores in one place!"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {stores.map((store) => (
                                <button
                                    key={store.id}
                                    onClick={() => {
                                        navigate(`/store/${store.id}`);
                                        onClose();
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#eaf5ea] transition-all group text-left border border-transparent hover:border-emerald-100"
                                >
                                    <div className="relative shrink-0">
                                        {store.logo ? (
                                            <img
                                                src={store.logo}
                                                alt={store.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-white shadow-sm">
                                                <FiShoppingBag size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[#1d2d1f] truncate transition-colors group-hover:text-[#4A6F5D]">
                                                {store.name}
                                            </span>
                                            {store.isOfficial && (
                                                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0">
                                                    Official
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">{store.productCount || 0} Products</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 rounded-2xl transition shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
