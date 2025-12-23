import axios from "axios";

const API_URL = "http://localhost:3000/uploads";

type UploadResponse = {
    url: string;
    publicId: string;
};

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post<UploadResponse>(`${API_URL}/image`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data.url;
};
