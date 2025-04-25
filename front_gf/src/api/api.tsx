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
export const refreshTokenFn = async (): Promise<string> => {
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

    // 익명 사용자 요청인지 확인
    const isAnonymousRequest = config.headers?.isAnonymous === 'true';

    if (isAnonymousRequest) {
      // 익명 사용자 요청이면 Authorization 헤더를 추가하지 않고 익명 표시만 추가
      config.headers.isAnonymous = "true";
      delete config.headers.Authorization;
      return config;
    }

    let token = getCookie("gf_token");
    
    // 토큰이 있으면 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 토큰이 없고 익명 접근 가능한 API인 경우
      const path = config.url || '';
      const anonymousAccessiblePaths = ["/menus/list", "/permission-check"];
      
      if (anonymousAccessiblePaths.some(p => path.includes(p))) {
        // 익명 사용자로 요청 표시
        config.headers.isAnonymous = "true";
      }
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
        // 갱신 실패 시 익명 사용자로 처리할지 결정
        const path = originalRequest.url || '';
        
        // 익명 사용자 접근 가능한 API 경로 목록 (예: 메뉴 목록)
        const anonymousAccessiblePaths = ["/menus/list", "/permission-check"];
        
        // 익명 사용자 접근 가능한 경로인 경우
        if (anonymousAccessiblePaths.some(p => path.includes(p))) {
          console.log("익명 사용자로 재요청", originalRequest);
          // 익명 사용자로 재요청
          originalRequest.headers.isAnonymous = 'true';
          delete originalRequest.headers.Authorization;
          return axios(originalRequest);
        }
        
        return Promise.reject(refreshError);
      } finally {
        // 갱신 작업 완료 표시
        isRefreshing = false;
        refreshTokenPromise = null;
      }
    }

    // 익명 사용자 요청인 경우 처리
    if (originalRequest.headers?.isAnonymous === 'true') {
      console.log("익명 사용자로 재요청");
      // 익명 사용자 요청에는 토큰 갱신을 시도하지 않고 해당 요청을 익명 사용자로 재시도
      
      // 원래 요청을 익명 사용자용으로 변경
      originalRequest.headers.isAnonymous = 'true';
      delete originalRequest.headers.Authorization; // 인증 헤더 제거
      
      return axios(originalRequest);
    }
    

    return Promise.reject(error);
  }
);

export default api;