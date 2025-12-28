import { useState, useEffect, useCallback } from 'react';
import {
    getStoreSocialStatus,
    followStore,
    unfollowStore,
    favoriteStore,
    unfavoriteStore,
    StoreSocialStatus
} from '../services/store.service';
import { toast } from 'react-toastify';

// Simple in-memory cache to avoid redundant status fetches
const socialStatusCache: Record<number, StoreSocialStatus> = {};

export function useStoreSocialStatus(storeId: number | undefined) {
    const [status, setStatus] = useState<StoreSocialStatus>({
        isFollowed: false,
        isFavorited: false
    });
    const [loading, setLoading] = useState(false);
    const [togglingFollow, setTogglingFollow] = useState(false);
    const [togglingFavorite, setTogglingFavorite] = useState(false);

    const fetchStatus = useCallback(async () => {
        if (!storeId) return;

        // Check cache first
        if (socialStatusCache[storeId]) {
            setStatus(socialStatusCache[storeId]);
            return;
        }

        setLoading(true);
        try {
            const data = await getStoreSocialStatus(storeId);
            socialStatusCache[storeId] = data;
            setStatus(data);
        } catch (err) {
            console.error(`Failed to fetch social status for store ${storeId}`, err);
        } finally {
            setLoading(false);
        }
    }, [storeId]);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const toggleFollow = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!storeId || togglingFollow) return;

        setTogglingFollow(true);
        try {
            if (status.isFollowed) {
                await unfollowStore(storeId);
                toast.success("Unfollowed store");
            } else {
                await followStore(storeId);
                toast.success("Following store");
            }

            const newStatus = { ...status, isFollowed: !status.isFollowed };
            socialStatusCache[storeId] = newStatus;
            setStatus(newStatus);
        } catch (err) {
            toast.error("Failed to update follow status");
        } finally {
            setTogglingFollow(false);
        }
    };

    const toggleFavorite = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!storeId || togglingFavorite) return;

        setTogglingFavorite(true);
        try {
            if (status.isFavorited) {
                await unfavoriteStore(storeId);
                toast.success("Removed from favorites");
            } else {
                await favoriteStore(storeId);
                toast.success("Added to favorites");
            }

            const newStatus = { ...status, isFavorited: !status.isFavorited };
            socialStatusCache[storeId] = newStatus;
            setStatus(newStatus);
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to update favorite status";
            if (msg.includes("limit") || msg.includes("10")) {
                toast.error("You can only favorite up to 10 stores");
            } else {
                toast.error(msg);
            }
        } finally {
            setTogglingFavorite(false);
        }
    };

    return {
        ...status,
        loading,
        togglingFollow,
        togglingFavorite,
        toggleFollow,
        toggleFavorite,
        refresh: fetchStatus
    };
}
