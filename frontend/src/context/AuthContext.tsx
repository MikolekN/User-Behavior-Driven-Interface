export interface AuthContext {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    username: string;
    setUsername: (username: string) => void;
};