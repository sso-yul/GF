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
        const response = await axios.post("/api/auth/refresh", {}, {
            withCredentials: true // 쿠키 자동전달 허용
        });

        const newAccessToken = response.data.token;

        // 새로운 Access Token을 쿠키에 저장
        setCookie("gf_token", newAccessToken, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "strict",
        });

        return newAccessToken;
    } catch (error) {
        console.error("토큰 만료 또는 오류 발생: ", error);
        throw error;
    }
};