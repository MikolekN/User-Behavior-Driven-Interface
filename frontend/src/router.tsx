import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./routes/Dashboard";
import Login from "./routes/Login";
import Register from "./routes/Register";


export const router = createBrowserRouter([
    {
      path: "/", 
      element: <App />
    },
    {
      path: "/dashboard", 
      element: <Dashboard />
    },
    {
      path: "/login", 
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    }
])