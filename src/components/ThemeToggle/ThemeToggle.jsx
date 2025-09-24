import React from 'react';
import './ThemeToggle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <button className="theme-toggle" onClick={onToggle}>
      <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
      <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
    </button>
  );
};

export default ThemeToggle;