import React, { useEffect, useState } from "react";
import client from "../../api/client";
import {
    getSellerRequests,
    approveSellerRequest,
    rejectSellerRequest,
    UpgradeRequest,
} from "../../services/admin.service";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FiShoppingBag } from "react-icons/fi";

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
            // Strictly show only PENDING requests
            setRequests(data.filter(r => r.status === "PENDING"));
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
            // Remove from local state immediately for fast feedback
            setRequests((prev) => prev.filter((r) => r.id !== id));
            alert("Seller approved successfully!");
            // Re-fetch in background to stay in sync
            fetchRequests();
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
            // Remove from local state immediately for fast feedback
            setRequests((prev) => prev.filter((r) => r.id !== id));
            alert("Request rejected.");
            // Re-fetch in background to stay in sync
            fetchRequests();
        } catch (err: any) {
            console.error("Failed to reject", err);
            alert(err?.response?.data?.message || "Failed to reject request.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="py-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Seller Requests</h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Review and moderate vendor application requests</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-xl">
                        <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="mt-6 font-black text-white/20 uppercase tracking-widest text-[10px]">Awaiting Data...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 rounded-[2rem] font-bold text-center">
                        {error}
                    </div>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-xl text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-white/5 border border-white/5">
                            <FiShoppingBag size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white/40 uppercase tracking-tight">Queue is Empty</h3>
                        <p className="mt-2 font-bold text-white/20 uppercase tracking-widest text-[10px]">No pending seller requests at this time</p>
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Applicant User</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Proposed Store</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Niche & Region</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Description</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Decision</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-white/5 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors">{req.user.name}</span>
                                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{req.user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-white/70 tracking-widest uppercase">{req.storeName}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="px-2 py-1 rounded bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest w-fit border border-white/5">{req.productType}</span>
                                                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest w-fit border border-emerald-500/10">{req.region}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs text-white/30 font-bold max-w-xs line-clamp-2 leading-relaxed" title={req.description}>
                                                    {req.description}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleApprove(req.id)}
                                                        disabled={processingId === req.id}
                                                        className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all disabled:opacity-30 shadow-lg"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req.id)}
                                                        disabled={processingId === req.id}
                                                        className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-30 shadow-lg"
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
        </DashboardLayout>
    );
}
