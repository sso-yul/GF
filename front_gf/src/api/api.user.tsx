import axios from "axios";

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