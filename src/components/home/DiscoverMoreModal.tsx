import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCpu, FiShoppingBag, FiBook, FiBox } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface DiscoverMoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DiscoverMoreModal({ isOpen, onClose }: DiscoverMoreModalProps) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("home");
    const isRtl = i18n.language === "ar";
    const direction = i18n.dir();

    const discoveryItems = [
        {
            title: t("modal.items.ai.title"),
            label: "AI System",
            icon: FiCpu,
            path: "/palestine-ai",
            description: t("modal.items.ai.desc"),
        },
        {
            title: t("modal.items.market.title"),
            label: "Marketplace",
            icon: FiShoppingBag,
            path: "/marketplace",
            description: t("modal.items.market.desc"),
        },
        {
            title: t("modal.items.library.title"),
            label: "Heritage Library",
            icon: FiBook,
            path: "/heritage",
            description: t("modal.items.library.desc"),
        },
        {
            title: t("modal.items.module3d.title"),
            label: "3D Module",
            icon: FiBox,
            path: "/3d-module",
            description: t("modal.items.module3d.desc"),
        },
    ];

    const handleItemClick = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" dir={direction}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#1a130f]/40 border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
                            <div className={isRtl ? "text-right" : "text-left"}>
                                <h2 className="text-3xl font-black text-white mb-1">{t("modal.title")}</h2>
                                <p className="text-white/40 text-sm font-medium">{t("modal.subtitle")}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all active:scale-90"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {discoveryItems.map((item, idx) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        onClick={() => handleItemClick(item.path)}
                                        className="group relative flex flex-col p-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-3xl cursor-pointer transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
                                                <item.icon className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{item.label}</span>
                                        </div>

                                        <div className={isRtl ? "text-right" : "text-left"}>
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/40 text-sm leading-relaxed font-medium">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}