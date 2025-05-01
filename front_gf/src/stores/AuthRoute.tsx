import { JSX } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

type Props = {
    children: JSX.Element;
};

const AuthRoute = ({ children }: Props) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AuthRoute;