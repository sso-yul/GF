import { Outlet } from "react-router-dom";

export default function Admin() {
    return (
        <>
            관리자 페이지
            <Outlet />
        </>
    )
}