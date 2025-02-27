import axios from "axios";

export const getTest = async() => {
    return await axios
                .get("/api/test")
                .then(response => {
                    if(response.status === 200) {
                        return response.data;
                    } else {
                        throw new Error("불러오기 실패");
                    }
                })
                .catch(error => {
                    throw new Error(error.response);
                })
}