import axios from "axios";

export const singup = async(userData: { userId: string; userName: string; userEmail: string; rawPassword: string }) => {
    try {
            const response = await axios
                        .post("/api/user/signup", {
                            userId: userData.userId,
                            userName: userData.userName,
                            userEmail: userData.userEmail,
                            rawPassword: userData.rawPassword,
                        });
                        return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data || err.message);
        }
                        
}