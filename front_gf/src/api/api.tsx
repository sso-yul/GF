import axios, { AxiosInstance } from "axios";
import { getCookie, refreshToken } from "./api.cookie";
import useAuthStore from "../stores/useAuthStore";

// API 클라이언트 생성
const api: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 요청에 포함
});

// 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    let token = getCookie("gf_token");
    
    // 토큰이 없으면 리프레시 시도
    if (!token) {
      try {
        if (getCookie("gf_refresh_token") && getCookie("gf_user_id")) {
          console.log("액세스 토큰 없음. 리프레시 토큰으로 갱신 시도...");
          token = await refreshToken(); // 직접 api.cookie의 함수 호출
        }
      } catch (error) {
        console.error("토큰 갱신 실패:", error);
      }
    }
    
    // 토큰 갱신 시도 후에도 토큰이 있으면 헤더에 추가
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
    
    // 401 에러이고 아직 재시도하지 않은 경우 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 토큰 갱신 시도
        const authStore = useAuthStore.getState();
        const refreshTokenValue = getCookie("gf_refresh_token");
        const userId = getCookie("gf_user_id");
        
        // 리프레시 토큰이 없으면 로그인 페이지로 리디렉션
        if (!refreshTokenValue || !userId) {
          throw new Error("리프레시 토큰 또는 사용자 ID가 없습니다");
        }
        
        await authStore.refreshAuth();
        
        // 토큰이 새로고침되면 원래 요청 재시도
        const newToken = getCookie("gf_token");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 리디렉션
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;