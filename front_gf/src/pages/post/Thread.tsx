import { useEffect } from "react";
import { useParams } from "react-router-dom";


function Thread() {
    const { customUrl } = useParams();

    useEffect(() => {
        if (customUrl) {
        }
    }, [customUrl]);

    return (
        <>
            {customUrl ? (
                <span>Thread 템플릿 - {customUrl} 메뉴</span>
            ) : (
                <span>Thread 템플릿 기본 화면</span>
            )}
        </>
    )
}
export default Thread;