import { createProxyMiddelware } from "http-proxy-middelware";

export default function(app) {
    app.use(
        "/api",
        createProxyMiddelware({
            target: "http://localhost:8000",
            changeOrigin: true,
        })
    );
};