import axios, { AxiosInstance } from "axios";
import { getCookie, refreshToken } from "./api.cookie";
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

    // 액세스 토큰 만료 에러인 경우
    if (error.response?.status === 401 && error.response?.data?.code === 'EXPIRED_TOKEN') {
      // 이미 재시도 중이 아닌 경우
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // 토큰 갱신 중이 아니라면
        if (!isRefreshing) {
          isRefreshing = true;
          
          // 토큰 갱신 Promise 생성 및 캐싱
          refreshTokenPromise = new Promise(async (resolve, reject) => {
            try {
              const response = await axios.post('/api/auth/refresh', {}, {
                withCredentials: true
              });

              const newAccessToken = response.data.accessToken;
              
              // 토큰 스토어 업데이트
              useAuthStore.getState().updateToken(newAccessToken);
              
              resolve(newAccessToken);
            } catch (refreshError) {
              // 리프레시 토큰도 만료되었을 경우 로그아웃 처리
              useAuthStore.getState().signout();
              window.location.href = '/signin';
              reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          });
        }

        // 대기 중인 토큰 갱신 Promise 사용
        try {
          const newToken = await refreshTokenPromise;
          
          // 새 토큰으로 원래 요청 헤더 업데이트
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // 원래 요청 재시도
          return axios(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;