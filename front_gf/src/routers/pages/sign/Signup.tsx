import { useState, ChangeEvent } from "react";
import { singup } from "../../../api/api.sign";

interface UserData {
    userName: string;
    userEmail: string;
    userId: string;
    rawPassword: string;
}

export default function Signup() {
    const [userData, setUserData] = useState<UserData>({
        userName: "",
        userEmail: "",
        userId: "",
        rawPassword: ""
    });

    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSignup = async () => {
        try {
            await singup({
                userId: userData.userId,
                userName: userData.userName,
                userEmail: userData.userEmail,
                rawPassword: userData.rawPassword,
            });
            setSuccessMessage("회원가입 성공");
            setError("");
        } catch (err: any) {
            setError("회원가입 실패: " + (err.message || err));
            setSuccessMessage("");
        }
    };

    return (
        <div className="signup-container">
            회원가입
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
                    name="rawPassword"
                    value={userData.rawPassword}
                    onChange={handleChange}
                    required
                />
            </p>
            <button onClick={handleSignup}>회원가입</button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
    );
}