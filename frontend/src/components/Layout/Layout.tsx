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
  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUsername("");
    await fetch("http://127.0.0.1:5000/api/logout", {
      method: "POST",
      credentials: 'include'
    });
  };
  
  const handleRequest = async () => {
    await fetch("http://127.0.0.1:5000/", {
      method: "GET",
      credentials: 'include'
    });
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
              <li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <button onClick={handleLogout}>Logout</button>
                <br />
                <button onClick={handleRequest}>Request</button>
              </li>
          </ul>
        </nav>
      </header>
      <main className="grid">
        {children}
      </main>
    </div>
  );
};

export default Layout;
