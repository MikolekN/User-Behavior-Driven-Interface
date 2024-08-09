import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";


export const router = createBrowserRouter([
    {
      path: "/", 
      element: <App />,
      children: [
        { path: '/', element: <Home /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> }
      ],
    },
]);