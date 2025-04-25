import Button from "../button/Button";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function NoAccess() {
    return (
        <>
        <p>접근 권한이 없습니다.</p>
        <Button icon={faHouse} iconPosition="left" navigateTo="/" title="메인페이지">홈으로 돌아가기</Button>
        </>
    )
} 