import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Transfer from "../pages/Transfer";
import Chat from "../pages/Chat";
import FAQ from "../pages/FAQ";
import Info from "../pages/Info";
import TransactionsHistory from "../components/TransactionsHistory/TransactionsHistory";

export const router = createBrowserRouter([
    {
      path: "/", 
      element: <App />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/transfer", element: <Transfer /> },
        { path: "/chat", element: <Chat /> },
        { path: "/faq", element: <FAQ /> },
        { path: "/info", element: <Info /> },
        { path: "transactions/history", element: <TransactionsHistory /> }
      ],
    },
]);