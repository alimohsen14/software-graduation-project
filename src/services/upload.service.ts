import api from "../lib/api";

type UploadResponse = {
    url: string;
    publicId: string;
};

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<UploadResponse>("/uploads/image", formData, {
        headers: {
            "Content-Type": undefined, // Let browser set multipart/form-data + boundary
        },
    });

    return res.data.url;
};
