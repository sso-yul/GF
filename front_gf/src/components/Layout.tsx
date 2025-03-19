import { Outlet } from "react-router-dom";
import Header from "./global/Header";
import Footer from "./global/Footer";
import Navigator from "./global/Navigator";
import "../styles/layout.css"

export default function Layout() {
    return (
        <div className="layout-container">
            <Header />
            <div className="content">
                <div>
                    <Navigator />
                </div>
                <main>
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}