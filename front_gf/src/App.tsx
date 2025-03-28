import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getCookie, refreshToken } from "./api/api.cookie";
import "./App.css";

import ProtectAdminRoute from "./stores/ProtectAdminRoute";

import Layout from "./components/Layout";

import Signin from "./pages/sign/Signin";
import Signup from "./pages/sign/Signup";

import Admin from "./pages/admin/Admin";

import Mypage from "./pages/user/Mypage";
import Mypost from "./pages/user/Mypost";
import Notification from "./pages/user/Notification";

import Basic from "./pages/post/Basic";
import Character from "./pages/post/Character";
import Picture from "./pages/post/Picture";
import Thread from "./pages/post/Thread";
import Chatter from "./pages/post/Chatter";

const AuthCheck = ({ children }: { children: React.ReactNode }) => {
        useEffect(() => {
            const checkAndRefreshToken = async () => {
            const token = getCookie("gf_token");
            const refreshTokenExists = getCookie("gf_refresh_token");

            if (!token && refreshTokenExists) {
                try {
                    await refreshToken();
                } catch (error) {
                    console.error("자동 토큰 갱신 실패:", error);
                }
            }
        };

        checkAndRefreshToken();
    }, []);

    return <>{children}</>;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: ( <Layout /> ),
        children: [
            
            // 관리자
            {
                element: <ProtectAdminRoute />,
                children: [
                    { path: "/admin", element: <Admin /> }
                ]
            },

            // 내 페이지
            { path: "/mypage", element: <Mypage /> },
            { path: "/mypage/noti", element: <Notification /> },

            // 여기 url {userName}으로 해서 주소창으로도 검색 가능하게...
            { path: "/post/userName", element: <Mypost /> },

            // 게시글 유형
            {   // 1. 기본
                path: "/basic",
                element: <Basic />
            },
            {   // 2. 캐릭터 상세
                path: "/char",
                element: <Character />
            },
            {   // 3. 채팅 형식
                path: "/chat",
                element: <Chatter />
            },
            {   // 4. 간단하게 사진만 올림
                path: "/pic",
                element: <Picture />
            },
            {   // 5. 썰 타래 형식
                path: "/thread",
                element: <Thread />
            },
        ]
    },

    // 로그인, 회원가입
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <Signup /> },
])

function App() {    
    return (
        <AuthCheck>
            <RouterProvider router={router} />
        </AuthCheck>
    );
}

export default App
