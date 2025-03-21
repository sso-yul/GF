import { ChangeEvent, useState } from "react";
import { signin } from "../../../api/api.sign";
import Button from "../../button/Button";
import { useNavigate } from "react-router-dom";

interface SigninData {
    userId: string;
    rawPassword: string;
}

export default function Signin() {

    const navigator = useNavigate();

    const [signinData, setSigninData] = useState<SigninData> ({
        userId: "",
        rawPassword: ""
    });

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
            navigator("/");
        } catch (err: any) {
            alert("로그인 실패");
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
            <Button iconPosition="left" size="small" onClick={handleSignin} title="로그인">로그인</Button>
            <div>
                <Button iconPosition="left" size="small" navigateTo="/signup" title="회원가입 페이지로 이동">회원가입 하기</Button>
            </div>
        </>
    )
}