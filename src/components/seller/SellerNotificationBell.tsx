import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { getNotifications, markNotificationRead, SellerNotification } from '../../services/seller.service';

export default function SellerNotificationBell() {
    const [notifications, setNotifications] = useState<SellerNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    // Poll every 60s
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);

        // Listen for custom refresh event
        const handleRefresh = () => fetchNotifications();
        window.addEventListener('seller:refresh-notifications', handleRefresh);

        return () => {
            clearInterval(interval);
            window.removeEventListener('seller:refresh-notifications', handleRefresh);
        };
    }, []);

    // Close click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationClick = async (notification: SellerNotification) => {
        if (!notification.isRead) {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
            try {
                await markNotificationRead(notification.id);
            } catch (err) {
                console.error("Failed to mark read", err);
            }
        }

        setIsOpen(false);

        if (notification.orderId) {
            navigate(`/seller/orders`); // Logic to highlight can be added if query param support exists
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications(); // Refetch on open
                }}
                className="relative p-2 rounded-full hover:bg-white/20 text-[#1d2d1f] hover:text-[#4A6F5D] transition"
            >
                <FiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <span className="text-xs text-gray-500">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-50 last:border-0 ${!notification.isRead ? 'bg-[#f0f9f4]' : ''}`}
                                >
                                    <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-50 bg-gray-50 rounded-b-2xl">
                        <button
                            className="text-xs text-[#4A6F5D] font-medium hover:underline w-full text-center"
                            onClick={fetchNotifications}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
