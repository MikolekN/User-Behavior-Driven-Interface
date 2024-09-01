import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import FAQ from "../pages/FAQ";
import Info from "../pages/Info";


export const router = createBrowserRouter([
    {
      path: "/", 
      element: <App />,
      children: [
        { path: '/', element: <Home /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/chat", element: <Chat /> },
        { path: "/faq", element: <FAQ /> },
        { path: "/info", element: <Info /> }
      ],
    },
]);