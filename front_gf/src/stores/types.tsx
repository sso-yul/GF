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