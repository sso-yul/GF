import axios from "axios";
import { Cookies } from "react-cookie";

interface CookieOptions {
    path?: string;
    expires?: Date;
    maxAge?: number;
    domain?: string;
    secure: boolean;
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | "none";
}

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options?: CookieOptions) => {
    return cookies.set(name, value, {...options});
};

export const getCookie = (name: string) => {
    return cookies.get(name);
};

export const removeCookie = (name: string) => {
    cookies.remove(name, { path: "/" });
};

export const refreshToken = async () => {
    try {
        // 쿠키에서 리프레시 토큰 가져오기
        const refreshToken = getCookie("gf_refresh_token");
        const userId = getCookie("gf_user_id");
        console.log("리프레시 토큰 갱신 중");
        
        if (!refreshToken || !userId) {
            throw new Error("리프레시 토큰 또는 사용자 ID를 찾을 수 없습니다");
        }
        
        const response = await axios.post("/api/auth/refresh", {
            refreshToken,
            userId
        }, {
            withCredentials: true
        });

        const newAccessToken = response.data.token;

        // 새 액세스 토큰 저장
        setCookie("gf_token", newAccessToken, {
            path: "/",
            maxAge: 30 * 60, // 30분
            secure: false,
            sameSite: "strict",
        });

        return newAccessToken;
    } catch (error) {
        console.error("토큰 리프레시 실패: ", error);
        throw error;
    }
};