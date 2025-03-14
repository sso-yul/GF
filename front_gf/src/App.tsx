import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'

import Layout from "./routers/Layout"
import Signin from "./routers/pages/sign/Signin";
import Signup from "./routers/pages/sign/Signup";
import Signing from './routers/pages/sign/Signing';
import { setupGlobalInterceptors } from './api/api';

setupGlobalInterceptors();

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
            },
            {
                path: "/signing",
                element: <Signing />
            }
        ]
    }
])

function App() {    
    return <RouterProvider router={router} />;
}

export default App
