import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { authApi } from "../../api/api.auth";

import IconButton from "../button/IconButton";
import {
    faUser
    , faRightFromBracket
    , faGear
    , faBell
    , faHouse
} from "@fortawesome/free-solid-svg-icons";
import Button from "../button/Button";

export default function Header() {

    const { isLoggedIn, signout, user } = useAuthStore();
    const [hasAdminAccess, setHasAdminAccess] = useState(false);
    const userName = user?.userName;

    useEffect(() => {
        const verifyRole = async () => {
            if (isLoggedIn) {
                const result = await authApi.checkAdminOrManager();
                setHasAdminAccess(result);
            } else {
                setHasAdminAccess(false);
            }
        };
        
        verifyRole();
    }, [isLoggedIn, user]);

    // 로그아웃
    const handleSignout = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await signout();
        window.location.href="/";
    }

    return (
        <header>
            <div style={{ marginRight: 'auto' }}>
                <IconButton icon={faHouse} navigateTo="/" title="메인페이지" />
            </div>
            {!isLoggedIn && (<IconButton icon={faUser} navigateTo="/signin" title="로그인" />)}
            {isLoggedIn && (<Button iconPosition="right" navigateTo="/mypage" title="마이페이지">{userName}</Button>)}
            {isLoggedIn && (<IconButton icon={faBell} navigateTo="/mypage/noti" title="알림" />)}
            {isLoggedIn && hasAdminAccess && (<IconButton icon={faGear} navigateTo="/admin" title="홈페이지 설정" />)}
            {isLoggedIn && (<IconButton icon={faRightFromBracket} onClick={handleSignout} title="로그아웃" />)}
        </header>
    );
}