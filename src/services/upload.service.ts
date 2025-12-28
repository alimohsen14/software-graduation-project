import client from "../api/client";

type UploadResponse = {
    url: string;
    publicId: string;
};

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await client.post<UploadResponse>("/uploads/image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data.url;
};
