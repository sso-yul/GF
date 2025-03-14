import axios, { AxiosInstance } from "axios";
import { getCookie, removeCookie, refreshToken } from "./api.cookie";

// api.tsx
// 기본 axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = getCookie("gf_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 새 토큰 발급
        const newToken = await refreshToken();
        
        // 토큰이 갱신되었으므로, 헤더를 업데이트
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // 실패한 요청을 재시도
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 실패 시 로그아웃 처리
        removeCookie("gf_token");
        removeCookie("gf_refresh_token");
        removeCookie("gf_user_id");
        
        // 로그인 페이지로 리다이렉트
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// 전역 axios에 인터셉터 적용 (모든 axios 요청에 적용)
export const setupGlobalInterceptors = () => {
  // 요청 인터셉터
  axios.interceptors.request.use(
    (config) => {
      const token = getCookie("gf_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const newToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          removeCookie("gf_token");
          removeCookie("gf_refresh_token");
          removeCookie("gf_user_id");
          window.location.href = "/signin";
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};