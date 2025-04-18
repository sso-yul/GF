import { useEffect } from "react";
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

    const hasPermission = usePermissionStore(state => state.hasPermission);
    const checkPermission = usePermissionStore(state => state.checkPermission);

    const user = useAuthStore(state => state.user);

    // roleName → roleNo 변환
    const roleNo = convertRoleNameToRoleNo(user?.roleName || "");

    useEffect(() => {
        const checkUserPermission = async () => {
            if (roleNo !== 0) {
                await checkPermission(menuNo, permissionType, roleNo);
            }
        };
        
        checkUserPermission();
    }, [menuNo, permissionType, roleNo, checkPermission]);

    useEffect(() => {
        if (hasPermission === false) {
            navigate("/");
        }
    }, [hasPermission, navigate]);

    return <>{children}</>;
};

export default PermissionCheck;
