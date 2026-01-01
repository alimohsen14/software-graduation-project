import client from "../api/client";

export type Review = {
    id: number;
    rating: number;
    comment?: string;
    imageUrl?: string;
    createdAt: string;
    user: {
        name: string;
    };
};

export type CreateReviewPayload = {
    rating: number;
    comment?: string;
    imageUrl?: string;
};

/**
 * Fetch all reviews for a specific product
 * GET /products/:productId/reviews
 */
export const getProductReviews = async (productId: number): Promise<Review[]> => {
    const res = await client.get<Review[]>(`/products/${productId}/reviews`);
    return res.data;
};

/**
 * Submit a new review for a product
 * POST /products/:productId/reviews
 */
export const createReview = async (productId: number, data: CreateReviewPayload): Promise<Review> => {
    const res = await client.post<Review>(`/products/${productId}/reviews`, data);
    return res.data;
};

/**
 * Update the current user's review for a product
 * PATCH /products/:productId/reviews/my
 */
export const updateMyReview = async (productId: number, data: CreateReviewPayload): Promise<Review> => {
    const res = await client.patch<Review>(`/products/${productId}/reviews/my`, data);
    return res.data;
};

/**
 * Delete the current user's review for a product
 * DELETE /products/:productId/reviews/my
 */
export const deleteMyReview = async (productId: number): Promise<void> => {
    await client.delete(`/products/${productId}/reviews/my`);
};
