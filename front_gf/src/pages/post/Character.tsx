import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PermissionCheck from "../../components/global/PermissionCheck";
import { getMenuNoByMenuUrl } from "../../api/api.menu";

function Character() {
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

    if (menuNo === null) {
        return null;
    }

    return (
        <>
            <PermissionCheck menuNo={menuNo} permissionType="READ">
                <span>{customUrl} 메뉴</span>
            </PermissionCheck>
        </>
    )
}
export default Character;