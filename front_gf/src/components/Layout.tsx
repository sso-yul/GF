import { Outlet } from "react-router-dom";
import Header from "./global/Header";

export default function Layout() {
    return(
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            푸터
        </>
    )
}