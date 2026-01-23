import React, { useRef, useState, useEffect } from "react";
import { FiBell, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationBell() {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [markingAllRead, setMarkingAllRead] = useState(false);

    const handleToggle = () => {
        if (!isOpen) {
            // Optional: refresh from REST if needed, but realtime handles it.
            // We can call refresh() to be safe (hydration check).
            refresh();
        }
        setIsOpen(!isOpen);
        setExpandedId(null);
    };

    const handleNotificationClick = async (notification: any) => {
        // Toggle expand/collapse
        if (expandedId === notification.id) {
            setExpandedId(null);
        } else {
            setExpandedId(notification.id);
        }

        // Mark as read if not already
        if (!notification.isRead) {
            await markAsRead(notification.id, notification.isSeller);
        }
    };

    const handleNavigateToOrder = (orderId: number) => {
        setIsOpen(false);
        setExpandedId(null);
        navigate(`/orders/${orderId}`);
    };

    const handleMarkAllAsRead = async () => {
        if (markingAllRead) return;
        setMarkingAllRead(true);
        try {
            await markAllAsRead();
        } finally {
            setMarkingAllRead(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setExpandedId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="p-2 text-white/60 hover:text-white/90 hover:bg-white/5 rounded-xl transition-all active:scale-95 relative group"
            >
                <FiBell className="w-5 h-5 transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)] border border-[#1a130f]" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#1a130f]/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-[60] overflow-hidden">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-white/90 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={markingAllRead}
                                className="text-[11px] text-emerald-400 font-bold hover:text-emerald-300 disabled:opacity-50 transition-colors"
                            >
                                {markingAllRead ? "Marking..." : "Mark all read"}
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[380px] overflow-y-auto scrollbar-hide">
                        {notifications.length === 0 ? (
                            <div className="px-5 py-10 text-center text-white/20 text-xs font-medium">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const isExpanded = expandedId === notification.id;
                                return (
                                    <div
                                        key={notification.id}
                                        className={`border-b border-white/5 transition-colors ${!notification.isRead ? "bg-emerald-500/5" : "hover:bg-white/5"
                                            }`}
                                    >
                                        <button
                                            onClick={() => handleNotificationClick(notification)}
                                            className="w-full px-5 py-4 text-left flex items-start gap-4 transition disabled:opacity-50 group"
                                        >
                                            <div
                                                className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${!notification.isRead ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/30"
                                                    }`}
                                            >
                                                <FiPackage className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-[13px] leading-relaxed transition-colors ${isExpanded ? "" : "line-clamp-2"
                                                        } ${!notification.isRead
                                                            ? "text-white/90 font-bold"
                                                            : "text-white/50 font-medium"
                                                        }`}
                                                >
                                                    {notification.message}
                                                </p>
                                                <span className="text-[10px] text-white/10 font-bold uppercase mt-1.5 block tracking-wider">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-2 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                            )}
                                        </button>

                                        {/* Expanded view */}
                                        {isExpanded && notification.orderId && (
                                            <div className="px-5 pb-5 pl-[64px]">
                                                <button
                                                    onClick={() => handleNavigateToOrder(notification.orderId!)}
                                                    className="w-full text-center py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-[11px] font-bold transition-all"
                                                >
                                                    View Order Details
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
