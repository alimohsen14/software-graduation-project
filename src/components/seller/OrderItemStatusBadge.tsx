import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderItemStatus } from '../../services/seller.service';

interface OrderItemStatusBadgeProps {
    status: OrderItemStatus;
}

export default function OrderItemStatusBadge({ status }: OrderItemStatusBadgeProps) {
    const { t } = useTranslation("seller");
    const getStatusStyles = (status: OrderItemStatus) => {
        switch (status) {
            case 'PENDING_APPROVAL':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'APPROVED':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'SHIPPED':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'DELIVERED':
                return 'bg-white/5 text-white/40 border-white/10';
            case 'REJECTED':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-white/5 text-white/40 border-white/10';
        }
    };

    const formatStatus = (status: string) => {
        return status.replace(/_/g, ' ').toUpperCase();
    };

    return (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest border backdrop-blur-md transition-all duration-300 ${getStatusStyles(status)}`}>
            {t(`status.${status}`)}
        </span>
    );
}
