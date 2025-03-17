import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'

import { getCookie, refreshToken } from './api/api.cookie';

import Layout from "./routers/Layout"
import Signin from "./routers/pages/sign/Signin";
import Signup from "./routers/pages/sign/Signup";
import Signing from './routers/pages/sign/Signing';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            const token = getCookie("gf_token");
            const refresh = getCookie("gf_refresh_token");

            if (!token && refresh) {
                try {
                    await refreshToken();
                } catch (error) {
                    console.error("토큰 갱신 실패, 로그인 페이지로 이동합니다.");
                    window.location.href = "/signin";
                }
            }
            setLoading(false);
        };

        checkAndRefreshToken();
    }, []);

    if (loading) return <div>로딩 중...</div>;

    return <>{children}</>;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <Layout />
            </AuthProvider>),
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
            }
        ]
    }
])

function App() {    
    return <RouterProvider router={router} />;
}

export default App
