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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="bg-[#0d0d0d]/90 backdrop-blur-3xl w-full max-w-md rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 group relative">
                {/* Background decorative glows */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />

                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/5 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Relational Database</span>
                        <div className="flex items-center gap-4">
                            {type === 'followed' ? (
                                <FiUsers className="text-emerald-500" size={24} />
                            ) : (
                                <FiHeart className="text-red-500" size={24} />
                            )}
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{title}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/20 hover:text-white transition-all p-3 hover:bg-white/10 rounded-2xl border border-transparent hover:border-white/10"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="p-6 max-h-[60vh] overflow-y-auto relative z-10 scrollbar-hide">
                    {!Array.isArray(stores) || stores.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-white/10 group-hover:text-emerald-500/30 transition-all duration-700">
                                <FiBox size={40} />
                            </div>
                            <div className="space-y-3">
                                <p className="text-white font-black uppercase tracking-tighter text-xl">Null Manifest</p>
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] px-10 leading-relaxed">
                                    {type === 'followed'
                                        ? "No active subscriptions detected in current segment."
                                        : "No high-value favorites recorded in local matrix."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {stores.map((store) => (
                                <button
                                    key={store.id}
                                    onClick={() => {
                                        navigate(`/store/${store.id}`);
                                        onClose();
                                    }}
                                    className="flex items-center gap-6 p-4 rounded-[1.5rem] hover:bg-white/5 transition-all group/item text-left border border-transparent hover:border-white/10 relative overflow-hidden"
                                >
                                    <div className="relative shrink-0">
                                        {store.logo ? (
                                            <img
                                                src={store.logo}
                                                alt={store.name}
                                                className="w-14 h-14 rounded-full object-cover border border-white/10 group-hover/item:border-emerald-500/50 transition-colors shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-white/5 group-hover/item:text-emerald-400 transition-colors shadow-xl">
                                                <FiShoppingBag size={24} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-md opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex-1 min-w-0 relative z-10">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-lg font-black text-white/80 truncate transition-colors group-hover/item:text-white uppercase tracking-tighter">
                                                {store.name}
                                            </span>
                                            {store.isOfficial && (
                                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shrink-0">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full group-hover/item:animate-pulse" />
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest transition-colors group-hover/item:text-white/40">
                                                {String(store.productCount || 0).padStart(2, '0')} SEGMENTS
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-8 bg-white/5 border-t border-white/5 relative z-10">
                    <button
                        onClick={onClose}
                        className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-[1.5rem] transition-all active:scale-95 shadow-2xl"
                    >
                        Exit Directory
                    </button>
                </div>
            </div>
        </div>
    );
}
