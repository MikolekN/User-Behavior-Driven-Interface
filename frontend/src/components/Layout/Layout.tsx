import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isLoggedIn, setIsLoggedIn, username, setUsername, children }) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {!isLoggedIn && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
            {isLoggedIn && (
              <li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
