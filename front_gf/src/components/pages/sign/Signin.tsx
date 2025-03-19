import { ChangeEvent, useState } from "react";
import { signin } from "../../../api/api.sign";
import Button from "../../button/Button";

interface SigninData {
    userId: string;
    rawPassword: string;
}

export default function Signin() {
    const [signinData, setSigninData] = useState<SigninData> ({
        userId: "",
        rawPassword: ""
    });

    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSigninData({ ...signinData, [name]: value });
    }

    const handleSignin = async () => {
        try {
                await signin({
                    userId: signinData.userId,
                    rawPassword: signinData.rawPassword,
                });
            setSuccessMessage("로그인 성공");
            setError("");
        } catch (err: any) {
            setError("로그인 실패");
            setSuccessMessage("");
        }
    };

    return (
        <>
            <div className="signin-container">
                <p>아이디:
                    <input
                        type="text"
                        name="userId"
                        value={signinData.userId}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />
                </p>
                <p>비밀번호:
                    <input
                        type="password"
                        name="rawPassword"
                        value={signinData.rawPassword}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                </p>
            </div>
            <Button iconPosition="left" onClick={handleSignin}>로그인</Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <div>
                <Button iconPosition="left" size="medium" navigateTo="/signup" title="회원가입하기">회원가입 하기</Button>
            </div>
        </>
    )
}