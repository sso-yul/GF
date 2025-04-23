import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissionStore } from "../../stores/usePermissionStore";
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
        // 이미 권한 체크 중이면 중복 실행 방지
        if (isChecking) return;
        
        const checkUserPermission = async () => {
            // 로그인한 사용자만 권한 체크 수행
            if (isLoggedIn && user) {
                setIsChecking(true);
                const roleNo = convertRoleNameToRoleNo(user.roleName || "");
                
                if (roleNo !== 0) {
                    checkPermission(menuNo, permissionType, roleNo);
                }
                setIsChecking(false);
            }
        };
        
        checkUserPermission();
    }, [isLoggedIn, user, menuNo, permissionType, checkPermission, isChecking]);

    useEffect(() => {
        if (isLoggedIn && user && !loading && hasPermission === false) {
            navigate("/");
        }
    }, [isLoggedIn, user, hasPermission, loading, navigate]);

    return <>{children}</>;
};

export default PermissionCheck;