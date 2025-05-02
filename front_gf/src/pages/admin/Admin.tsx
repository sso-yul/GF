import { Outlet } from "react-router-dom";
import IconButton from "../../components/button/IconButton";
import { 
    faUsers
    , faBars
    , faEllipsis
    , faTableList
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/adminPage.css"

export default function Admin() {
    return (
        <div className="admin-container">
            <div className="admin-left">
                <IconButton icon={faUsers} navigateTo="/admin/user" title="사용자 목록" />
                <IconButton icon={faTableList} navigateTo="/admin/menu" title="메뉴 목록" />
                <IconButton icon={faBars} navigateTo="/admin/banner" title="배너 목록" />
                <IconButton icon={faEllipsis} navigateTo="/admin/other" title="나머지" />
            </div>
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    )
}