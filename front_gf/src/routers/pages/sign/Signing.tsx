import { useState, useEffect } from "react"
import { getCookie } from "../../../api/api.cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    roles: string;
}

export default function Signing() {
    const [userId, setUserId] = useState<string | null>(null);
    const [roles, setRoles] = useState<string | null>(null);
    
    useEffect(() => {
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
        </>
    )
}