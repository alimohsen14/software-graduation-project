import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiBell, FiCheck, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    Notification,
} from "../../services/notification.service";

export default function NotificationBell() {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [markingReadId, setMarkingReadId] = useState<number | null>(null);
    const [markingAllRead, setMarkingAllRead] = useState(false);

    const fetchUnreadCount = useCallback(async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const count = await getUnreadCount(token);
            setUnreadCount(count);
        } catch (err) {
            console.error("Failed to fetch unread count", err);
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        setLoading(true);
        try {
            const data = await getNotifications(token);
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            fetchNotifications();
            fetchUnreadCount();
        }
        setIsOpen(!isOpen);
        setExpandedId(null);
    };

    const handleNotificationClick = async (notification: Notification) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // Toggle expand/collapse
        if (expandedId === notification.id) {
            setExpandedId(null);
        } else {
            setExpandedId(notification.id);
        }

        // Mark as read if not already
        if (!notification.isRead && markingReadId !== notification.id) {
            setMarkingReadId(notification.id);
            try {
                await markAsRead(token, notification.id);
                // Refetch to get fresh data
                await fetchNotifications();
                await fetchUnreadCount();
            } catch (err) {
                console.error("Failed to mark as read", err);
            } finally {
                setMarkingReadId(null);
            }
        }
    };

    const handleNavigateToOrder = (orderId: number) => {
        setIsOpen(false);
        setExpandedId(null);
        navigate(`/orders/${orderId}`);
    };

    const handleMarkAllAsRead = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token || markingAllRead) return;

        setMarkingAllRead(true);
        try {
            await markAllAsRead(token);
            // Refetch to get fresh data
            await fetchNotifications();
            await fetchUnreadCount();
        } catch (err) {
            console.error("Failed to mark all as read", err);
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

    // Fetch unread count on mount
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    const getNotificationIcon = () => {
        return <FiPackage className="w-4 h-4 text-[#4A6F5D]" />;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="p-2 hover:bg-emerald-100 rounded-full transition relative"
            >
                <span className="inline-flex items-center justify-center w-9 h-9 bg-white/60 border border-emerald-200 rounded-full">
                    <FiBell className="w-5 h-5 text-[#2f5c3f]" />
                </span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={markingAllRead}
                                className="text-xs text-[#4A6F5D] font-medium hover:underline flex items-center gap-1 disabled:opacity-50"
                            >
                                <FiCheck size={12} />
                                {markingAllRead ? "Marking..." : "Mark all read"}
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const isExpanded = expandedId === notification.id;
                                return (
                                    <div
                                        key={notification.id}
                                        className={`border-b border-gray-50 ${!notification.isRead ? "bg-emerald-50/50" : ""
                                            }`}
                                    >
                                        <button
                                            onClick={() => handleNotificationClick(notification)}
                                            disabled={markingReadId === notification.id}
                                            className="w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-gray-50 transition disabled:opacity-50"
                                        >
                                            <div
                                                className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notification.isRead ? "bg-emerald-100" : "bg-gray-100"
                                                    }`}
                                            >
                                                {getNotificationIcon()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm ${isExpanded ? "" : "line-clamp-2"
                                                        } ${!notification.isRead
                                                            ? "text-gray-900 font-medium"
                                                            : "text-gray-600"
                                                        }`}
                                                >
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-2" />
                                            )}
                                        </button>

                                        {/* Expanded view with View Order button */}
                                        {isExpanded && notification.orderId && (
                                            <div className="px-4 pb-3 pl-16">
                                                <button
                                                    onClick={() => handleNavigateToOrder(notification.orderId!)}
                                                    className="text-xs bg-[#4A6F5D] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#3d5c4d] transition"
                                                >
                                                    View Order
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

