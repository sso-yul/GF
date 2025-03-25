import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getCookie, refreshToken } from "./api/api.cookie";
import "./App.css";

import ProtectAdminRoute from "./stores/ProtectAdminRoute";

import Layout from "./components/Layout";

import Signin from "./pages/sign/Signin";
import Signup from "./pages/sign/Signup";
import Signing from "./pages/sign/Signing"

import Admin from "./pages/admin/Admin";

import Mypage from "./pages/user/Mypage";
import Mypost from "./pages/user/Mypost";
import Notification from "./pages/user/Notification";

import Basic from "./pages/post/Basic";
import Character from "./pages/post/Character";
import Picture from "./pages/post/Picture";
import Thread from "./pages/post/Thread";
import Rpg from "./pages/post/Rpg";

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
                element: <ProtectAdminRoute />,
                children: [
                    { path: "/admin", element: <Admin /> }
                ]
            },

            { path: "/mypage", element: <Mypage /> },
            { path: "/mypage/post", element: <Mypost /> },
            { path: "/mypage/noti", element: <Notification /> },

            { path: "/post/basic", element: <Basic /> },
            { path: "/post/char", element: <Character /> },
            { path: "/post/pic", element: <Picture /> },
            { path: "/post/thread", element: <Thread /> },
            { path: "/post/rpg", element: <Rpg /> },
        ]
    },
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <Signup /> },
    { path: "/signing", element: <Signing /> },
])

function App() {    
    return (
        <AuthCheck>
            <RouterProvider router={router} />
        </AuthCheck>
    );
}

export default App
