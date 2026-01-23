import api from "../lib/api";

export type ReportStatus = "PENDING" | "RESOLVED";

export interface ProductReport {
    id: number;
    productId: string;
    userId: number;
    message: string;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
    product?: {
        id: number;
        name: string;
        image: string;
        store?: {
            id: number;
            name: string;
        };
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export const reportProduct = async (productId: string, message: string) => {
    console.log("REPORT PAYLOAD:", productId, typeof productId);
    const res = await api.post("/reports/product", { productId, message });
    return res.data;
};

export const getReports = async (): Promise<ProductReport[]> => {
    const res = await api.get<ProductReport[]>("/admin/reports");
    return res.data;
};

export const updateReportStatus = async (reportId: number, status: ReportStatus) => {
    const res = await api.patch(`/admin/reports/${reportId}/status`, { status });
    return res.data;
};
