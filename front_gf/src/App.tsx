import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getCookie, refreshToken } from './api/api.cookie';
import './App.css'

import Layout from "./components/Layout"
import Signin from "./components/pages/sign/Signin";
import Signup from "./components/pages/sign/Signup";
import Signing from "./components/pages/sign/Signing";

const AuthCheck = ({ children }: { children: React.ReactNode }) => {
        useEffect(() => {
            const checkAndRefreshToken = async () => {
            const token = getCookie("gf_token");
            const refreshTokenExists = getCookie("gf_refresh_token");

            if (!token && refreshTokenExists) {
                try {
                    console.log("액세스 토큰 없음, 갱신 시도...");
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
        element: (
                <Layout />
        ),
        children: [
            {
                path: "/signin",
                element: <Signin />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/signing",
                element: <Signing />
            },
        ]
    }
])

function App() {    
    return (
        <AuthCheck>
            <RouterProvider router={router} />
        </AuthCheck>
    );
}

export default App
