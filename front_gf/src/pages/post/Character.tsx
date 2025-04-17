import { useEffect } from "react";
import { useParams } from "react-router-dom";


function Character() {
    const { customUrl } = useParams();

    useEffect(() => {
        if (customUrl) {
        }
    }, [customUrl]);

    return (
        <>
            {customUrl ? (
                <span>Character 템플릿 - {customUrl} 메뉴</span>
            ) : (
                <span>Character 템플릿 기본 화면</span>
            )}
        </>
    )
}
export default Character;