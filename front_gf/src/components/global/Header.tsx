import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { authApi } from "../../api/api.auth";

import Button from "../button/Button";
import IconButton from "../button/IconButton";
import {
    faUser
    , faRightFromBracket
    , faGear
    , faBell
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {

    const { isLoggedIn, signout, user } = useAuthStore();
    const [hasAdminAccess, setHasAdminAccess] = useState(false);

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
            {!isLoggedIn && (<IconButton icon={faUser} size="medium" color="blue" navigateTo="/signin" title="로그인" />)}
            {isLoggedIn && (<IconButton icon={faRightFromBracket} size="medium" color="blue" onClick={handleSignout} title="로그아웃" />)}            
            {isLoggedIn && (<IconButton icon={faBell} size="medium" color="blue" navigateTo="/" title="알림" />)}
            {isLoggedIn && hasAdminAccess && (<IconButton icon={faGear} size="medium" color="blue" title="홈페이지 설정" />)}
            <Button icon={faUser} iconPosition="right" size="medium" color="red" title="test">이요옹..</Button>
        </header>
    );
}