import { Outlet } from "react-router-dom";

export default function Layout() {
    return(
        <>
            헤더
            <main>
                <Outlet />
            </main>
            푸터
        </>
    )
}