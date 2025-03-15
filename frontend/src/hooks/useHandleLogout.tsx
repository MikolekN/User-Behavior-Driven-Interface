import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const useHandleLogout = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            console.error("Logout failed");
        } finally {
            navigate("/");
        }
    };

    return { handleLogout };
};

export default useHandleLogout;
