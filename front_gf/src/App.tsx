import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getCookie, refreshToken } from "./api/api.cookie";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ProtectAdminRoute from "./stores/ProtectAdminRoute";

import Layout from "./components/Layout";

import MainCalendar from "./components/calendar/MainCalendar";

import Signin from "./pages/sign/Signin";
import Signup from "./pages/sign/Signup";

import Admin from "./pages/admin/Admin";
import BannerList from "./pages/admin/BannerList";
import MenuList from "./pages/admin/MenuList";
import Other from "./pages/admin/Other";
import UserList from "./pages/admin/UserList";

import Mypage from "./pages/user/Mypage";
import Mypost from "./pages/user/Mypost";
import Notification from "./pages/user/Notification";

import Basic from "./pages/post/Basic";
import Character from "./pages/post/Character";
import Picture from "./pages/post/Picture";
import Thread from "./pages/post/Thread";
import Chatter from "./pages/post/Chatter";
import NoAccess from "./components/global/NoAccess";

import ColorPicker from "./components/global/ColorPicker";

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
            
            {
                path: "",
                element: <MainCalendar />
            },
            // 관리자
            {
                element: <ProtectAdminRoute />,
                children: [

                    {
                        path: "/admin",
                        element: <Admin />,
                        children: [
                            // 아래 목록들은 전부 추가, 수정, 삭제 기능 있음
                            // 배너 목록
                            { path: "banner", element: <BannerList /> },
                            // 메뉴 목록
                            { path: "menu", element: <MenuList /> },
                            // 사용자 목록
                            { path: "user", element: <UserList /> },
                            // 배경사진 관리, 내비바에 있는 정보 관리
                            { path: "other", element: <Other />}
                        ]
                    }
                ]
            },

            {path: "ex", element: <ColorPicker />},
            
            // 내 페이지
            { path: "/mypage", element: <Mypage /> },
            { path: "/noti", element: <Notification /> },

            // 여기 url {userName}으로 해서 주소창으로도 검색 가능하게...
            { path: "/post/userName", element: <Mypost /> },

            // 게시글 유형
            {   // 1. 기본
                path: "/basic",
                children: [
                    { path: "", element: <Basic /> },
                    { path: ":customUrl", element: <Basic /> }
                ]
            },
            {   // 2. 상세
                path: "/char",
                children: [
                    { path: "", element: <Character /> },
                    { path: ":customUrl", element: <Character /> }
                ]
            },
            {   // 3. 채팅 형식
                path: "/chat",
                children: [
                    { path: "", element: <Chatter /> },
                    { path: ":customUrl", element: <Chatter /> }
                ]
            },
            {   // 4. 간단하게 사진만 올림
                path: "/pic",
                children: [
                    { path: "", element: <Picture /> },
                    { path: ":customUrl", element: <Picture /> }
                ]
            },
            {   // 5. 타래 형식
                path: "/thread",
                children: [
                    { path: "", element: <Thread /> },
                    { path: ":customUrl", element: <Thread /> }
                ]
            },
        ]
    },

    // 로그인, 회원가입
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <Signup /> },

    // 접근 권한 없음
    { path: "/noAccess", element: <NoAccess />}
])

function App() {    
    return (
        <AuthCheck>
            <RouterProvider router={router} />
        </AuthCheck>
    );
}

export default App
