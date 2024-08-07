// src/components/MainMenu.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const MainMenu = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : undefined}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : undefined}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined}>
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default MainMenu;
