import { useState, useEffect } from "react"
import { getCookie } from "../../../api/api.cookie";
import { jwtDecode } from "jwt-decode";
import { test } from "../../../api/api.test";

interface DecodedToken {
    userId: string;
    roles: string;
}

export default function Signing() {
    const [userId, setUserId] = useState<string | null>(null);
    const [roles, setRoles] = useState<string | null>(null);
    const [test1, setTest1] = useState("");
    
    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await test();  // test 함수 호출
                setTest1(response);  // 응답 값을 상태에 저장
            } catch (error) {
                console.error("test 함수 호출 중 오류: ", error);
            }
        };

        fetchData();
        const token = getCookie("gf_token");
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                setUserId(decoded.userId);
                setRoles(decoded.roles);
            } catch (error) {
                console.error("디코딩 오류: ", error);
            }
        }
    }, []);


    return (
        <>
            {userId ? (<p>로그인 중: {userId}, {roles}</p>) : (<p>로그인 하지 않은 상태</p>)}
            <p>{test1}</p>
        </>
    )
}