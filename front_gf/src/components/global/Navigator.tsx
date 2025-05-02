import { JSX, useEffect, useState } from "react"
import "../../styles/navigator.css"
import { useLocation, useNavigate } from "react-router-dom"
import { MenuList } from "../../stores/types";
import { getAccessibleMenus } from "../../api/api.menu";
import useAuthStore from "../../stores/useAuthStore";

const Navigator = (): JSX.Element => {

    const navigate = useNavigate();
    const location = useLocation();
    const [menus, setMenus] = useState<MenuList[]>([]);

    const userId = useAuthStore(state => state.user?.userId);

    // 메뉴 클릭 핸들러
    const handleMenuClick = (menu: MenuList): void => {
        navigate(`/${menu.categoryName}/${menu.menuUrl}`);
    }

    // 현재 선택된 메뉴 확인
    const isActive = (menu: MenuList): boolean => {
        const pattern = new RegExp(`^/${menu.categoryName}/${menu.menuUrl}`);
        return pattern.test(location.pathname);
    };

    // 메뉴를 순서(menuOrder)에 따라 정렬
    const sortedMenus = [...menus].sort((a, b) => a.menuOrder - b.menuOrder);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const menuData = await getAccessibleMenus();
                setMenus(menuData);
            } catch (error) {
                console.log("메뉴 목록을 가져오지 못함.");
                throw error;
            }
        }
        fetchMenuData();
    }, [userId]);
    
    return (
        <>
            <div className="navi-left">
                <ul className="menu-list">
                    {sortedMenus.map((menu) => (
                        <li
                            key={menu.menuNo}
                            className={`menu-item ${isActive(menu) ? 'active' : ''}`}
                            onClick={() => handleMenuClick(menu)}
                        >
                            {menu.menuName}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
export default Navigator;