import axios from "axios";
import { setCookie, removeCookie } from "./api.cookie";
import { SigninRequest, SigninResponse } from "../stores/types";
import useAuthStore from "../stores/useAuthStore";

export const signin = async (signInData: SigninRequest): Promise<SigninResponse> => {
    try {
        const response = await axios.post<SigninResponse>("/api/sign/signin", signInData);
        const { token, refreshToken, userId, userName, roleName } = response.data;

        // 액세스 토큰 저장
        setCookie("gf_token", token, {
            path: "/",
            maxAge: 30 * 60, // 30분
            secure: false, // 프로덕션 환경에서는 true로 설정
            sameSite: "strict",
        });

        // 리프레시 토큰 저장
        setCookie("gf_refresh_token", refreshToken, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7일
            secure: false, // 프로덕션 환경에서는 true로 설정
            sameSite: "strict",
        });

        // 사용자 ID 저장 (리프레시 필요)
        setCookie("gf_user_id", userId, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7일
            secure: false, // 프로덕션 환경에서는 true로 설정
            sameSite: "strict",
        });

        setCookie("gf_user_name", userName, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7일
            secure: false, // 프로덕션 환경에서는 true로 설정
            sameSite: "strict",
        });

        setCookie("gf_user_roles", roleName, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7일
            secure: false, // 프로덕션 환경에서는 true로 설정
            sameSite: "strict",
        });

        // 상태 업데이트
        useAuthStore.getState().signin({
            userId,
            rawPassword: signInData.rawPassword, // 'rawPassword'는 로그인 요청에서 필요하므로 포함
        });

        return response.data;
    } catch (error) {
        console.error("로그인 실패:", error);
        throw error;
    }
};

export const signout = async (): Promise<void> => {
    try {
        // 백엔드에 로그아웃 요청 (필요한 경우)
        await axios.post("/api/sign/signout");
    } catch (error) {
        console.error("로그아웃 API 호출 실패:", error);
    } finally {
        // 쿠키 삭제
        removeCookie("gf_token");
        removeCookie("gf_refresh_token");
        removeCookie("gf_user_id");
        removeCookie("gf_user_name");
        removeCookie("gf_user_roles");

        // 상태 업데이트 (로그아웃 처리)
        useAuthStore.getState().signout();
    }
};
