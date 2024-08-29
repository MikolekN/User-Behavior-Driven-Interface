import React, { useEffect, useRef } from 'react';
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
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isPersistent) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPersistent, onToggle]);

  return (
    <li
      ref={dropdownRef}
      className="nav-list-option dropdown-item"
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      onClick={onToggle}
    >
      <span className={`dropdown-label ${isPersistent ? 'active' : ''}`}>
        {title}
      </span>
      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li className="dropdown-list-item" key={option.label}>
              <Link to={option.path}>{option.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;
