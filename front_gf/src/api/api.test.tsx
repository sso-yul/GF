import axios from "axios";
import { getCookie } from "./api.cookie";

export const test = async() => {
    
    const token = getCookie("gf_token");  // 토큰이 제대로 있는지 확인

    const response = await axios.get("/api/test", {
        headers: {
            Authorization: `Bearer ${token}`,  // 헤더에 토큰이 제대로 추가되어야 함
        },
    });
    console.log("됨");
    return response.data;
}