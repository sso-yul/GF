import { Outlet } from "react-router-dom";
import Header from "./global/Header";
import Footer from "./global/Footer";
import Navigator from "./global/Navigator";
import "../styles/layout.css"

export default function Layout() {
    return (
        <>
            <Header />
            <div className="layout-container">
                <div className="content">
                    <div>
                        <Navigator />
                    </div>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
}