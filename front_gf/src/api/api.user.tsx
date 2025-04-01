import axios from "axios";
import api from "./api";
import { User } from "../stores/types";

// 회원 가입
export const signup = async (userData: { userId: string; userName: string; userEmail: string; rawPassword: string }) => {
    try {
        const response = await axios.post("/api/user/register", {
            userId: userData.userId,
            userName: userData.userName,
            userEmail: userData.userEmail,
            rawPassword: userData.rawPassword,
        });
        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data || err.message);
    }
};

// 사용자 목록 조회(관리자는 전체, 매니저는 관리자 제외, 나머지는 관리자와 매니저 제외)
export const getUserList = async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>("/user/list");
      return response.data;
    } catch (error) {
      console.error("사용자 목록을 불러오지 못함", error);
      throw error;
    }
  };