import React from 'react';
import { OrderItemStatus } from '../../services/seller.service';

interface OrderItemStatusBadgeProps {
    status: OrderItemStatus;
}

export default function OrderItemStatusBadge({ status }: OrderItemStatusBadgeProps) {
    const getStatusStyles = (status: OrderItemStatus) => {
        switch (status) {
            case 'PENDING_APPROVAL':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'APPROVED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'DELIVERED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatStatus = (status: string) => {
        return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200 ${getStatusStyles(status)}`}>
            {formatStatus(status)}
        </span>
    );
}
