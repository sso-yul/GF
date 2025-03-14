import axios from "axios";
import { setCookie } from "./api.cookie";

interface SigninRequest {
    userId: string;
    rawPassword: string;
}

interface SigninResponse {
    token: string;
    userId: string;
    userName: string;
    roles: string;
    refreshToken: string;
}

export const signin = async (signInData: SigninRequest): Promise<SigninResponse> => {
    try {
        const response = await axios.post<SigninResponse>("/api/sign/signin", signInData);
        const { token, refreshToken, userId } = response.data;

        // 액세스 토큰 저장
        setCookie("gf_token", token, {
            path: "/",
            maxAge: 30 * 60, // 5분
            secure: false, // 프로덕션 환경의 HTTPS에서는 true로 설정
            sameSite: "strict",
        });

        // 리프레시 토큰 저장
        setCookie("gf_refresh_token", refreshToken, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7일
            secure: false, // 프로덕션 환경의 HTTPS에서는 true로 설정
            sameSite: "strict",
        });

        // 사용자 ID 저장 (리프레시에 필요)
        setCookie("gf_user_id", userId, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7일
            secure: false,
            sameSite: "strict",
        });

        return response.data;
    } catch (error) {
        console.error("로그인 실패:", error);
        throw error;
    }
};

export const signup = async(userData: { userId: string; userName: string; userEmail: string; rawPassword: string }) => {
    try {
            const response = await axios
                        .post("/api/sign/signup", {
                            userId: userData.userId,
                            userName: userData.userName,
                            userEmail: userData.userEmail,
                            rawPassword: userData.rawPassword,
                        });
                        return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data || err.message);
        }
                        
}

export const signout = async (): Promise<void> => {
    
}