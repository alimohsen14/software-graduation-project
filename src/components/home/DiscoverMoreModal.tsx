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
    const { t, i18n } = useTranslation("discover");
    const isRtl = i18n.language === "ar";
    const direction = i18n.dir();

    const discoveryItems = [
        {
            title: t("cards.tour3d.title"),
            label: "3D Tour",
            icon: FiBox,
            path: "/soap-3d",
            description: t("cards.tour3d.desc"),
        },
        {
            title: t("cards.marketplace.title"),
            label: "Marketplace",
            icon: FiShoppingBag,
            path: "/marketplace",
            description: t("cards.marketplace.desc"),
        },
        {
            title: t("cards.ai.title"),
            label: "AI Guide",
            icon: FiCpu,
            path: "/palestine-ai",
            description: t("cards.ai.desc"),
        },
        {
            title: t("cards.archive.title"),
            label: "Archive",
            icon: FiBook,
            path: "/heritage",
            description: t("cards.archive.desc"),
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
                    {/* Subtle backdrop without heavy blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/30"
                    />

                    {/* Modal container with glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#1a130f]/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.7),0_0_80px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 pb-4 flex items-center justify-between border-b border-white/10">
                            <div className={isRtl ? "text-right" : "text-left"}>
                                <h2 className="text-2xl md:text-3xl font-black text-white mb-1">{t("title")}</h2>
                                <p className="text-white/40 text-sm font-medium">{t("subtitle")}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 md:p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all active:scale-90 shrink-0"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cards Grid */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {discoveryItems.map((item, idx) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        onClick={() => handleItemClick(item.path)}
                                        className="group relative flex flex-col p-5 md:p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
                                                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                                            </div>
                                            <span className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{item.label}</span>
                                        </div>

                                        <div className={isRtl ? "text-right" : "text-left"}>
                                            <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/40 text-sm leading-relaxed font-medium">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl md:rounded-3xl pointer-events-none" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom accent bar */}
                        <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
