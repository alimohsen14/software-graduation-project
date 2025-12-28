import React, { useEffect, useState } from "react";
import client from "../../api/client";
import {
    getSellerRequests,
    approveSellerRequest,
    rejectSellerRequest,
    UpgradeRequest,
} from "../../services/admin.service";
import Navbar from "../../components/navbar/Navbar";

export default function SellerRequestsPage() {
    const [requests, setRequests] = useState<UpgradeRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSellerRequests();
            setRequests(data);
        } catch (err: any) {
            console.error("Failed to fetch requests", err);
            setError(err?.response?.data?.message || "Failed to load requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: number) => {
        if (!window.confirm("Are you sure you want to approve this seller?")) return;
        setProcessingId(id);
        try {
            await approveSellerRequest(id);
            setRequests((prev) => prev.filter((r) => r.id !== id));
            alert("Seller approved successfully!");
        } catch (err: any) {
            console.error("Failed to approve", err);
            alert(err?.response?.data?.message || "Failed to approve seller.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: number) => {
        const reason = window.prompt("Please provide a reason for rejection:");
        if (reason === null) return; // User cancelled

        if (!reason.trim()) {
            alert("Rejection reason is required.");
            return;
        }

        setProcessingId(id);
        try {
            await rejectSellerRequest(id, reason);
            setRequests((prev) => prev.filter((r) => r.id !== id));
            alert("Request rejected.");
        } catch (err: any) {
            console.error("Failed to reject", err);
            alert(err?.response?.data?.message || "Failed to reject request.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar onMenuClick={() => { }} />
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-[#1d2d1f] mb-6">Seller Requests</h1>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading requests...</div>
                ) : error ? (
                    <div className="p-6 bg-red-50 text-red-600 rounded-lg">{error}</div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                        No pending seller requests.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100/50 border-b">
                                        <th className="p-4 text-xs font-bold text-gray-600 uppercase">User</th>
                                        <th className="p-4 text-xs font-bold text-gray-600 uppercase">Store Name</th>
                                        <th className="p-4 text-xs font-bold text-gray-600 uppercase">Type</th>
                                        <th className="p-4 text-xs font-bold text-gray-600 uppercase">Region</th>
                                        <th className="p-4 text-xs font-bold text-gray-600 uppercase">Description</th>
                                        <th className="p-4 text-xs font-bold text-gray-600 uppercase">Status</th>
                                        <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4">
                                                <div className="font-medium text-[#1d2d1f]">{req.user.name}</div>
                                                <div className="text-xs text-gray-500">{req.user.email}</div>
                                            </td>
                                            <td className="p-4 text-sm font-medium">{req.storeName}</td>
                                            <td className="p-4 text-sm text-gray-600">{req.productType}</td>
                                            <td className="p-4 text-sm text-gray-600">{req.region}</td>
                                            <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={req.description}>
                                                {req.description}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full">
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req.id)}
                                                        disabled={processingId === req.id}
                                                        className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req.id)}
                                                        disabled={processingId === req.id}
                                                        className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
