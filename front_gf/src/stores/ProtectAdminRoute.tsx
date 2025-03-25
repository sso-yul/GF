import { useEffect, useState, FC } from "react";
import { Outlet } from "react-router-dom"
import useAuthStore from "./useAuthStore"
import { authApi } from "../api/api.auth"

const ProtectAdminRoute: FC = () => {
    const { isLoggedIn } = useAuthStore();
    const [hasAccess, setHasAccess] = useState<boolean>(false);

    useEffect(() => {
        const checkAccess = async(): Promise<void> => {
            if (!isLoggedIn) {
                setHasAccess(false);
                return;
            }
            try {
                const hasAdminOrManagerAccess = await authApi.checkAdminOrManager();                
                setHasAccess(hasAdminOrManagerAccess);
                if (!hasAdminOrManagerAccess) {
                    alert("접근 권한이 없습니다.");
                    window.location.href="/";
                }
            } catch (error) {
                setHasAccess(false);
            }
        }
        checkAccess();
    }, [isLoggedIn]);

    if (!hasAccess) {
        return null;
    }
    
    return <Outlet />;
}

export default ProtectAdminRoute;