import React from 'react';
import { Link } from 'react-router-dom';
import './Dropdown.css';

interface DropdownProps {
  title: string;
  options: { label: string; path: string }[];
  isOpen: boolean;
  isPersistent: boolean;
  onToggle: () => void;
  onHover: () => void;
  onMouseLeave: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, options, isOpen, isPersistent, onToggle, onHover, onMouseLeave }) => {
  return (
    <li
      className="nav-item"
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      onClick={onToggle}
    >
      <span className={`nav-link ${isPersistent ? 'active' : ''}`}>
        {title}
      </span>
      {isOpen && (
        <ul className="dropdown">
          {options.map((option) => (
            <li key={option.label}>
              <Link to={option.path}>{option.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;
