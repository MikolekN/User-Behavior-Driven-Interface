import { User } from "../components/utils/User";

export interface AuthContext {
    user: User;
    setUser: (user: User) => void;
};