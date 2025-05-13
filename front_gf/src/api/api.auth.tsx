import axios from "axios";
import { getCookie, setCookie } from "./api.cookie";
import useAuthStore from "../stores/useAuthStore";

async function getNewToken(): Promise<string | null> {
    try {
        const newToken = await useAuthStore.getState().refreshAuth();
        setCookie("gf_token", newToken); // 쿠키에 저장
        return newToken;
    } catch (e) {
        console.error("Token refresh failed:", e);
        return null;
    }
}

function getAuthHeaders(token?: string) {
    return {
        headers: {
            Authorization: `Bearer ${token || getCookie("gf_token")}`
        },
        withCredentials: true
    };
}

async function requestWithRetry(url: string): Promise<boolean> {
    try {
        const res = await axios.get<boolean>(url, getAuthHeaders());
        return res.data;
    } catch (err: any) {
        if (err.response?.status === 401) {
            const newToken = await getNewToken();
            if (!newToken) return false;

            try {
                const retryRes = await axios.get<boolean>(url, getAuthHeaders(newToken));
                return retryRes.data;
            } catch (e2) {
                console.error("Retry failed:", e2);
                return false;
            }
        }
        console.error("Request failed:", err);
        return false;
    }
}

export const authApi = {
    checkAdmin: () => requestWithRetry("/api/auth/check-admin"),
    checkManager: () => requestWithRetry("/api/auth/check-manager"),
    checkAdminOrManager: () => requestWithRetry("/api/auth/check-admin-or-manager")
};
