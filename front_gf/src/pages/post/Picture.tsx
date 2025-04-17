import { useEffect } from "react";
import { useParams } from "react-router-dom";


function Picture() {
    const { customUrl } = useParams();

    useEffect(() => {
        if (customUrl) {
        }
    }, [customUrl]);

    return (
        <>
            {customUrl ? (
                <span>Picture 템플릿 - {customUrl} 메뉴</span>
            ) : (
                <span>Picture 템플릿 기본 화면</span>
            )}
        </>
    )
}
export default Picture;