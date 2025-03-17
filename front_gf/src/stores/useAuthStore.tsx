import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signin as apiSignin, signout as apiSignout } from "../api/api.sign";
import { SigninResponse } from "./types";

interface User {
  userId: string;
  userName: string;
  roles: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  signin: (userId: string, password: string) => Promise<SigninResponse>;
  signout: () => Promise<void>;
  setUser: (user: User) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      
      signin: async (userId: string, password: string) => {
        try {
          const response = await apiSignin({ userId, rawPassword: password });
          set({ 
            isLoggedIn: true, 
            user: {
              userId: response.userId,
              userName: response.userName,
              roles: response.roles
            }
          });
          return response; // 응답 반환
        } catch (error) {
          console.error("로그인 실패:", error);
          throw error;
        }
      },
      
      signout: async () => {
        try {
          await apiSignout();
          set({ isLoggedIn: false, user: null });
        } catch (error) {
          console.error("로그아웃 실패:", error);
          throw error;
        }
      },
      
      setUser: (user: User) => set({ user })
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user ? { 
          userId: state.user.userId,
          userName: state.user.userName,
          roles: state.user.roles
        } : null
      })
    }
  )
);

export default useAuthStore;