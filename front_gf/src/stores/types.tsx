export interface SigninRequest {
  userId: string;
  rawPassword: string;
}

export interface SigninResponse {
  token: string;
  userId: string;
  userName: string;
  roleName: string;
  refreshToken: string;
}

export interface User {
  userId: string;
  userName: string;
  roleName?: string;
  userImg?: string;
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

export interface TableProps {
  columns: string[];
  data: any[];
  editableColumns?: string[];
  options?: { [key: string]: string[] };
  onEdit?: (updateData: any[]) => void;
}