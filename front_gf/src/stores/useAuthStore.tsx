import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setCookie, getCookie, removeCookie, refreshToken as apiRefreshToken } from "../api/api.cookie";
import { AuthState, SigninRequest, SigninResponse } from "./types";

// 쿠키 이름 상수 정의
const COOKIE_NAMES = {
  TOKEN: "gf_token",
  REFRESH_TOKEN: "gf_refresh_token",
  USER_ID: "gf_user_id",
  USER_NAME: "gf_user_name",
  USER_ROLES: "gf_user_roles"
};

// 쿠키 기본 옵션
const DEFAULT_COOKIE_OPTIONS = {
  path: "/",
  secure: false, // 프로덕션에서만 secure 활성화
  sameSite: "strict" as const
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,

      // 쿠키에서 인증 상태 초기화
      checkAuth: () => {
        const token = getCookie(COOKIE_NAMES.TOKEN);
        const userId = getCookie(COOKIE_NAMES.USER_ID);
        const userName = getCookie(COOKIE_NAMES.USER_NAME);
        const roleName = getCookie(COOKIE_NAMES.USER_ROLES);

        if (token && userId) {
          set({
            isLoggedIn: true,
            token,
            user: { userId, userName, roleName },
          });
          return true;
        }
        return false;
      },

      // 로그인 처리
      signin: async (credentials: SigninRequest) => {
        try {
          // API 요청으로 로그인 처리
          const response = await fetch("/api/sign/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
            credentials: "include" // 쿠키 포함
          });
          
          if (!response.ok) {
            throw new Error("인증 실패");
          }
          
          const data: SigninResponse = await response.json();
          const { token, refreshToken, userId, userName, roleName } = data;

          // 쿠키에 인증 정보 저장
          setCookie(COOKIE_NAMES.TOKEN, token, {
            ...DEFAULT_COOKIE_OPTIONS,
            maxAge: 30 * 60, // 30분
          });
          
          setCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
            ...DEFAULT_COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60, // 7일
          });
          
          setCookie(COOKIE_NAMES.USER_ID, userId, {
            ...DEFAULT_COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60, // 7일
          });
          
          setCookie(COOKIE_NAMES.USER_NAME, userName, {
            ...DEFAULT_COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60, // 7일
          });
          
          setCookie(COOKIE_NAMES.USER_ROLES, roleName, {
            ...DEFAULT_COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60, // 7일
          });

          // Zustand 상태 업데이트
          set({
            isLoggedIn: true,
            token,
            user: { userId, userName, roleName },
          });
        } catch (error) {
          console.error("로그인 실패:", error);
          throw error;
        }
      },

      // 로그아웃 처리
      signout: async () => {
        try {
          // 백엔드에 로그아웃 요청
          if (get().isLoggedIn) {
            await fetch("/api/sign/signout", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${getCookie(COOKIE_NAMES.TOKEN)}`
              },
              credentials: "include" // 쿠키 포함
            });
          }
        } catch (error) {
          console.error("로그아웃 API 호출 실패:", error);
        } finally {
          // 쿠키 삭제
          removeCookie(COOKIE_NAMES.TOKEN);
          removeCookie(COOKIE_NAMES.REFRESH_TOKEN);
          removeCookie(COOKIE_NAMES.USER_ID);
          removeCookie(COOKIE_NAMES.USER_NAME);
          removeCookie(COOKIE_NAMES.USER_ROLES);

          // 상태 초기화
          set({ isLoggedIn: false, token: null, user: null });
        }
      },

      // 토큰 갱신
      refreshAuth: async () => {
        try {
          console.log("토큰 갱신 시도 중...");
          // api.cookie의 refreshToken 함수 직접 사용
          const newToken = await apiRefreshToken();
          
          // 상태 업데이트
          set({ token: newToken });
          console.log("토큰 갱신 성공");
          
          return newToken;
        } catch (error) {
          console.error("토큰 갱신 실패:", error);
          // 갱신 실패 시 로그아웃
          get().signout();
          throw error;
        }
      },

      // 현재 토큰 가져오기
      getToken: () => {
        return getCookie(COOKIE_NAMES.TOKEN);
      },

      // 현재 사용자 정보 가져오기
      getUserInfo: () => {
        const userId = getCookie(COOKIE_NAMES.USER_ID);
        const userName = getCookie(COOKIE_NAMES.USER_NAME);
        const roleName = getCookie(COOKIE_NAMES.USER_ROLES);
        
        if (userId) {
          return { userId, userName, roleName };
        }
        return null;
      },

      updateToken: (newToken: string) => {
        // 쿠키에 새 토큰 저장
        setCookie(COOKIE_NAMES.TOKEN, newToken, {
          ...DEFAULT_COOKIE_OPTIONS,
          maxAge: 30 * 60, // 30분
        });

        // 상태 업데이트
        set({ token: newToken });
      },
    }),
    {
      name: "auth-storage",
      // 로그인 상태와 사용자 정보만 영구 저장
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;