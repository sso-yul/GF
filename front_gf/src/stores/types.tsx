export interface SigninRequest {
  userId: string;
  rawPassword: string;
}

export interface SigninResponse {
  token: string;
  userId: string;
  userName: string;
  roles: string;
  refreshToken: string;
}

export interface User {
  userId: string;
  userName: string;
  roles: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  
  // 인증 메서드
  checkAuth: () => boolean;
  signin: (credentials: SigninRequest) => Promise<void>;
  signout: () => Promise<void>;
  
  // 토큰 관리
  refreshAuth: () => Promise<string>;
  getToken: () => string | null;
  getUserInfo: () => User | null;
  updateToken: (newToken: string) => void;
}