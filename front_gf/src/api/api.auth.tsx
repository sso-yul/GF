import axios from "axios";
import { getCookie } from "./api.cookie";

interface RoleCheckResponse {
    data: boolean;
}

export const authApi = {
    // 사용자가 관리자인지 확인
    checkAdmin: async (): Promise<boolean> => {
        try {
            const response = await axios.get<boolean>("/api/auth/check-admin", {
                headers: {
                    Authorization: `Bearer ${getCookie("gf_token")}`
                },
                withCredentials: true // 쿠키 전송
            });
            return response.data;
        } catch (error) {
            return false;
        }
    },

    // 사용자가 매니저인지 확인
    checkManager: async (): Promise<boolean> => {
        try {
            const response = await axios.get<boolean>("/api/auth/check-manager", {
                headers: {
                    Authorization: `Bearer ${getCookie("gf_token")}`
                },
                withCredentials: true // 쿠키 전송
            });
            return response.data;
        } catch (error) {
            return false;
        }
    },

    // 사용자가 관리자 또는 매니저인지 확인인
    checkAdminOrManager: async (): Promise<boolean> => {
        try {
            const response = await axios.get<boolean>("/api/auth/check-admin-or-manager", {
                headers: {
                    Authorization: `Bearer ${getCookie("gf_token")}`
                },
                withCredentials: true // 쿠키 전송
            });
            return response.data;
        } catch (error) {
            return false;
        }
    } 
}