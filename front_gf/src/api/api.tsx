import axios, { AxiosInstance } from "axios";
import { getCookie, setCookie } from "./api.cookie";
import useAuthStore from "../stores/useAuthStore";

axios.defaults.withCredentials = true;
let isRefreshing = false;
let refreshTokenPromise: Promise<string> | null = null;

// API 클라이언트 생성
const api: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 요청에 포함
});

// 토큰 갱신 함수 - 중앙에서 관리
const refreshTokenFn = async (): Promise<string> => {
  try {
    const refreshToken = getCookie("gf_refresh_token");
    const userId = getCookie("gf_user_id");
    
    if (!refreshToken || !userId) {
      throw new Error("리프레시 토큰 또는 사용자 ID가 없습니다");
    }
    
    const response = await axios.post("/api/auth/refresh", {
      refreshToken,
      userId
    }, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });
    
    if (!response.data || !response.data.token) {
      throw new Error("유효한 토큰 응답이 없습니다");
    }
    
    const newAccessToken = response.data.token;
    
    // 새 액세스 토큰 저장
    setCookie("gf_token", newAccessToken, {
      path: "/",
      maxAge: 30 * 60, // 30분
      secure: false,
      sameSite: "strict",
    });
    
    // 토큰 스토어 업데이트 (필요한 경우)
    useAuthStore.getState().updateToken(newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    console.error("토큰 리프레시 실패: ", error);
    // 리프레시 실패 시 로그아웃 처리
    useAuthStore.getState().signout();
    
    // 현재 위치가 로그인이 필요한 페이지인지 확인
    const requiresAuth = isAuthRequiredPage(window.location.pathname);
    
    if (requiresAuth) {
      window.location.href = "/signin";
    }
    
    throw error;
  }
};

// 로그인이 필요한 페이지인지 확인하는 함수
function isAuthRequiredPage(path: string): boolean {
  // 로그인이 필요 없는 페이지 목록
  const publicPages = ["/"];
  
  // 경로가 publicPages 중 하나와 일치하면 로그인 불필요
  return !publicPages.some(page => 
    path === page || path.startsWith(`${page}/`)
  );
};

// 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    let token = getCookie("gf_token");
    
    // 토큰이 있으면 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 시 자동 토큰 갱신)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이면서 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 갱신 중이 아니면 새로운 갱신 작업 시작
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenPromise = refreshTokenFn();
        }

        // 갱신된 토큰 기다리기
        const newToken = await refreshTokenPromise;
        
        // 새 토큰으로 원래 요청 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // 원래 요청 재시도
        return axios(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 오류 반환
        return Promise.reject(refreshError);
      } finally {
        // 갱신 작업 완료 표시
        isRefreshing = false;
        refreshTokenPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export default api;