import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getReports, updateReportStatus, ProductReport } from "../../services/reportService";
import { FiLoader, FiAlertTriangle, FiCheckCircle, FiEye, FiExternalLink, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AdminReportsPage() {
    const [reports, setReports] = useState<ProductReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const navigate = useNavigate();

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await getReports();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
            toast.error("Failed to load reports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleResolve = async (reportId: number) => {
        try {
            setUpdatingId(reportId);
            await updateReportStatus(reportId, "RESOLVED");
            toast.success("Report marked as resolved.");
            // Optimistic update
            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: "RESOLVED" } : r));
        } catch (error) {
            console.error("Failed to update report status", error);
            toast.error("Failed to resolve report.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin" />
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Loading reports...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="py-8 px-4 md:px-0">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Product Reports</h1>
                        <p className="text-white/60 font-medium">Manage and resolve user-reported products</p>
                    </div>
                    <div className="flex bg-white/5 border border-white/5 rounded-2xl p-1.5 overflow-hidden">
                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                            Total: {reports.length}
                        </div>
                        <div className="px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            Pending: {reports.filter(r => r.status === "PENDING").length}
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-[2rem] shadow-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Store & Product</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Reporter</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Message</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center text-white/20">
                                            <FiAlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                            <p className="font-bold uppercase tracking-widest text-xs">No reports found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-white/5 transition-all group">
                                            {/* Store & Product */}
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    {report.product?.store?.id ? (
                                                        <button
                                                            onClick={() => navigate(`/admin/supervision/stores/${report.product?.store?.id}`)}
                                                            className="text-left text-xs font-black text-emerald-400 uppercase tracking-tight hover:underline transition-all"
                                                        >
                                                            {report.product?.store?.name || "Unknown Store"}
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs font-black text-emerald-400 uppercase tracking-tight opacity-50">
                                                            {report.product?.store?.name || "Unknown Store"}
                                                        </span>
                                                    )}

                                                    {report.product?.id ? (
                                                        <button
                                                            onClick={() => navigate(`/marketplace/product/${report.product?.id}`)}
                                                            className="text-left text-sm font-bold text-white hover:text-emerald-400 hover:underline transition-all"
                                                        >
                                                            {report.product?.name || "Deleted Product"}
                                                        </button>
                                                    ) : (
                                                        <span className="text-sm font-bold text-white opacity-50">
                                                            {report.product?.name || "Deleted Product"}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Reporter */}
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-white/70">{report.user?.name}</span>
                                                    <span className="text-[10px] text-white/30">{report.user?.email}</span>
                                                </div>
                                            </td>

                                            {/* Message */}
                                            <td className="px-8 py-6">
                                                <p className="text-xs text-white/60 max-w-xs line-clamp-2 md:line-clamp-none">
                                                    {report.message}
                                                </p>
                                                <span className="text-[9px] text-white/20 font-bold uppercase mt-2 block">
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-8 py-6">
                                                {report.status === "PENDING" ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 text-[10px] font-black border border-yellow-500/20 uppercase tracking-wide">
                                                        <FiClock className="w-3 h-3" />
                                                        Pending
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20 uppercase tracking-wide">
                                                        <FiCheckCircle className="w-3 h-3" />
                                                        Resolved
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {report.product?.id && (
                                                        <button
                                                            onClick={() => navigate(`/marketplace/product/${report.product?.id}`)}
                                                            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all group/btn"
                                                            title="View Product"
                                                        >
                                                            <FiEye size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                        </button>
                                                    )}

                                                    {report.status === "PENDING" && (
                                                        <button
                                                            onClick={() => handleResolve(report.id)}
                                                            disabled={updatingId === report.id}
                                                            className="h-10 px-4 bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {updatingId === report.id ? (
                                                                <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                                                            ) : (
                                                                <FiCheckCircle size={14} />
                                                            )}
                                                            Resolve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
