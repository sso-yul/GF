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

/**
 * 쿠키 설정 함수
 */
export const setCookie = (name: string, value: string, options?: CookieOptions) => {
  return cookies.set(name, value, { ...options });
};

/**
 * 쿠키 가져오기 함수
 */
export const getCookie = (name: string) => {
  return cookies.get(name);
};

/**
 * 쿠키 삭제 함수
 */
export const removeCookie = (name: string, options?: Partial<CookieOptions>) => {
  cookies.remove(name, { path: "/", ...options });
};

/**
 * 토큰 갱신 함수
 */
export const refreshToken = async () => {
  try {
    const refreshToken = getCookie("gf_refresh_token");
    const userId = getCookie("gf_user_id");
    
    if (!refreshToken || !userId) {
      throw new Error("리프레시 토큰 또는 사용자 ID가 없습니다");
    }
    
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
        userId
      }),
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error("토큰 갱신 실패");
    }
    
    const data = await response.json();
    const newAccessToken = data.token;
    
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