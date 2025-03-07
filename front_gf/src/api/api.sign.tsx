import axios from "axios";
import { getCookie, setCookie } from "./api.cookie";
import { refreshToken } from "./api.cookie";

interface SigninResponse {
    token: string;
    userId: string;
    userName: string;
}

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers["Content-Type"] = "application/json";

// 인터셉터 사용해 요청 보내기 전 Authorization 헤더에 액세스 토큰 자동으로 포함
axios.interceptors.request.use(
    (config) => {
        const token = getCookie("gf_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 사용해 401 오류 발생 시 리프레시 토큰을 통해 새로운 액세스 토큰 발급
axios.interceptors.response.use(
    // 응답이 정상적인 경우
    (response) => response,
    // 응답이 비정상적인 경우
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // 무한 루프 방지
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshToken();

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return axios(originalRequest);
            } catch (refreshError) {
                console.error("갱신 실패: ", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)


export const singup = async(userData: { userId: string; userName: string; userEmail: string; rawPassword: string }) => {
    try {
            const response = await axios
                        .post("/api/sign/signup", {
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

export const signin = async(signinData: {userId: string; rawPassword: string}) => {
    try {
            const response = await axios
                        .post("/api/sign/signin", {
                            userId: signinData.userId,
                            rawPassword: signinData.rawPassword,
                        });

            const data: SigninResponse = response.data;

            if (response.status === 200) {
                setCookie("gf_token", data.token, {
                    path: "/",
                    maxAge: 5 * 60,
                    secure: false,
                    sameSite: "strict",
                });
                return data;
            } else {
                throw new Error ("로그인 실패 응답 못 받음");
            }            
    } catch (err: any) {
        throw new Error(err.response?.data || err.message);
    }
}