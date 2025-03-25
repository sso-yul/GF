import { useState, ChangeEvent } from "react";
import { signup } from "../../api/api.user";
import Button from "../../components/button/Button";
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
    const [confirmPwd, setConfirmPwd] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigator = useNavigate();

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
        if (userData.rawPassword != confirmPwd) {
            alert("비밀번호가 일치하지 않습니다.")
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
                <input
                    type="text"
                    name="userName"
                    value={userData.userName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                    placeholder="이름을 입력하세요"
                />
            </p>
            <p>
                <input
                    type="email"
                    name="userEmail"
                    value={userData.userEmail}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    placeholder="이메일을 입력하세요"
                />
            </p>
            <p>
                <input
                    type="text"
                    name="userId"
                    value={userData.userId}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                    placeholder="아이디를 입력하세요"
                />
            </p>
            <p>
                <input
                    type="password"
                    name="rawPassword"
                    value={userData.rawPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    placeholder="비밀번호를 입력하세요"
                />
            </p>
            <p>
                <input 
                    type="password"
                    name="confirmPwd"
                    value={confirmPwd}
                    onChange={(event) => setConfirmPwd(event.target.value)}
                    autoComplete="new-password"
                    required
                    placeholder="비밀번호를 확인하세요"
                />
            </p>
            <Button iconPosition="left" onClick={handleSignup}>회원가입</Button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}