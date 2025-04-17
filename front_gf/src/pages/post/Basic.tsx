import { useEffect } from "react";
import { useParams } from "react-router-dom";


function Basic() {
    const { customUrl } = useParams();

    useEffect(() => {
        if (customUrl) {
        }
    }, [customUrl]);

    return (
        <>
            {customUrl ? (
                <span>Basic 템플릿 - {customUrl} 메뉴</span>
            ) : (
                <span>Basic 템플릿 기본 화면</span>
            )}
        </>
    )
}
export default Basic;