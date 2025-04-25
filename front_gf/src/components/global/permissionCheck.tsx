import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissionStore } from "../../stores/usePermissionStore";
import { getCookie } from "../../api/api.cookie";
import { refreshTokenFn } from "../../api/api";
import { convertRoleNameToRoleNo } from "../../utils/utils";
import useAuthStore from "../../stores/useAuthStore";

type PermissionCheckProps = {
    menuNo: number;
    permissionType: string;
    children: React.ReactNode;
};

const PermissionCheck: React.FC<PermissionCheckProps> = ({ menuNo, permissionType, children }) => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(false);

    const hasPermission = usePermissionStore(state => state.hasPermission);
    const checkPermission = usePermissionStore(state => state.checkPermission);
    const loading = usePermissionStore(state => state.loading);

    const user = useAuthStore(state => state.user);
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);

    useEffect(() => {
        if (isChecking) return;
    
        const checkUserPermission = async () => {
            setIsChecking(true);
    
            // 토큰이 없고 로그인이 필요한 사용자라면 refresh 시도
            const token = getCookie("gf_token");
            const refreshToken = getCookie("gf_refresh_token");
    
            if (!token && refreshToken && user) {
                try {
                    await refreshTokenFn();
                } catch (e) {
                    console.error("토큰 자동 갱신 실패");
                }
            }
    
            // 실제 권한 체크
            const roleNo = isLoggedIn && user ? convertRoleNameToRoleNo(user.roleName || "") : 5;
            const isAnonymous = !(isLoggedIn && user);
    
            checkPermission(menuNo, permissionType, roleNo, isAnonymous);
            setIsChecking(false);
        };
    
        checkUserPermission();
    }, [isLoggedIn, user, menuNo, permissionType, checkPermission, isChecking]);

    useEffect(() => {
        if (!loading && hasPermission === false) {
            navigate("/noAccess")
        }
    }, [hasPermission, loading, navigate]);

    return <>{children}</>;
};

export default PermissionCheck;