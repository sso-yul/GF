import { useState, ChangeEvent } from "react";
import { signup } from "../../../api/api.user";
import Button from "../../button/Button";
import { useNavigate } from "react-router-dom"

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

    const navigator = useNavigate();

    const [error, setError] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSignup = async () => {

        if(!userData.userName.trim()) {
            alert("이름을 입력하세요.");
            return;
        }
        if(!userData.userEmail.trim()) {
            alert("이메일을 입력하세요.");
            return;
        }
        if(!userData.userId.trim()) {
            alert("아이디를 입력하세요.");
            return;
        }
        if(!userData.rawPassword.trim()) {
            alert("비밀번호를 입력하세요.");
            return;
        }
        

        try {
            await signup({
                userId: userData.userId,
                userName: userData.userName,
                userEmail: userData.userEmail,
                rawPassword: userData.rawPassword,
            });
            alert("회원가입이 완료되었습니다.");
            navigator("/signin");
            setError("");
        } catch (err: any) {
            setError(err.message || err);
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
                    autoComplete="name"
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
                    autoComplete="email"
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
                    autoComplete="username"
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
                    autoComplete="new-password"
                    required
                />
            </p>
            <Button iconPosition="left" onClick={handleSignup}>회원가입</Button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}