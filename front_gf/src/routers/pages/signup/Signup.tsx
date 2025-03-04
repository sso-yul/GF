import React, { useState, ChangeEvent } from "react";
import axios from "axios";

// 사용자 입력 타입 정의
interface UserData {
    userName: string;
    userEmail: string;
    userId: string;
    password: string;
}

export default function Signup() {
    // 사용자 입력 상태
    const [userData, setUserData] = useState<UserData>({
        userName: "",
        userEmail: "",
        userId: "",
        password: ""
    });

    // 에러 및 성공 메시지 상태
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    // 입력값 변화 처리 함수
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // 회원가입 처리 함수
    const handleSignup = async () => {
        try {
            // 회원가입 API 호출
            const response = await axios.post("/api/user/signup", {
                userId: userData.userId,
                userName: userData.userName,
                userEmail: userData.userEmail,
                password: userData.password,
            });

            // 성공 시 메시지 처리
            setSuccessMessage("회원가입이 성공적으로 완료되었습니다.");
            setError("");
        } catch (err: any) {
            // 에러 처리
            setError("회원가입 실패: " + (err.response?.data || err.message));
            setSuccessMessage("");
        }
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <p>
                이름:
                <input
                    type="text"
                    name="userName"
                    value={userData.userName}
                    onChange={handleChange}
                    required
                />
            </p>
            <p>
                이메일:
                <input
                    type="email"
                    name="userEmail"
                    value={userData.userEmail}
                    onChange={handleChange}
                    required
                />
            </p>
            <p>
                아이디:
                <input
                    type="text"
                    name="userId"
                    value={userData.userId}
                    onChange={handleChange}
                    required
                />
            </p>
            <p>
                비밀번호:
                <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                />
            </p>
            <button onClick={handleSignup}>회원가입</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}