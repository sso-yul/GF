import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PermissionCheck from "../../components/global/permissionCheck";
import { getMenuNoByMenuUrl } from "../../api/api.menu";


function Basic() {
    const { customUrl } = useParams();
    const [menuNo, setMenuNo] = useState<number | null>(null);

    useEffect(() => {
        const fetchMenuNo = async () => {
            if (!customUrl) return;

            try {
                const response = await getMenuNoByMenuUrl(customUrl);
                setMenuNo(response.menuNo);
            } catch (error) {
                console.error("menuNo 로드 실패:", error);
            }
        };

        fetchMenuNo();
    }, [customUrl]);

    return menuNo !== null ? (
        <PermissionCheck menuNo={menuNo} permissionType="READ">
            {customUrl ? (
                <span>Thread 템플릿 - {customUrl} 메뉴</span>
            ) : (
                <span>Thread 템플릿 기본 화면</span>
            )}
        </PermissionCheck>
    ) : (
        <div>Loading menu info...</div>
    );
}

export default Basic;