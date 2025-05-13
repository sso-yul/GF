import { useState, useEffect } from "react";
import { authApi } from "../api/api.auth";

export function useAdminCheck() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const isAdminUser = await authApi.checkAdmin();
                setIsAdmin(isAdminUser);
            } catch (error) {
                console.error("Admin check failed:", error);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, []);

    return { isAdmin, loading };
}