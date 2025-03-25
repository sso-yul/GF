import axios from "axios";
import { getCookie } from "./api.cookie";
import useAuthStore from "../stores/useAuthStore";

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
        } catch (error: any) {
            // 401 에러인 경우 토큰 재발급 시도
            if (error.response?.status === 401) {
                try {
                    // 토큰 갱신 
                    const newToken = await useAuthStore.getState().refreshAuth();
                    
                    // 새 토큰으로 다시 요청
                    const response = await axios.get<boolean>("/api/auth/check-admin-or-manager", {
                        headers: {
                            Authorization: `Bearer ${newToken}`
                        },
                        withCredentials: true
                    });
                    
                    return response.data;
                } catch (refreshError) {
                    // 토큰 갱신 실패 시
                    console.error('Token refresh failed:', refreshError);
                    return false;
                }
            }
            
            // 다른 에러의 경우
            console.error('Check admin error:', error);
            return false;
        }
    }
}