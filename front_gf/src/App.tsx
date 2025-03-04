import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'

import Layout from "./routers/Layout"
import Signin from "./routers/pages/signin/Signin";
import Signup from "./routers/pages/signup/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/signin",
                element: <Signin />
            },
            {
                path: "/signup",
                element: <Signup />
            }
        ]
    }
])

function App() {
    return <RouterProvider router={router} />;
}

export default App
