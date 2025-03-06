import axios from "axios";

export const signin = async(signinData: {userId: string; rawPassword: string}) => {
    try {
            const response = await axios
                        .post("/api/user/signin", {
                            userId: signinData.userId,
                            rawPassword: signinData.rawPassword,
                        })
                        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data || err.message);
    }
}