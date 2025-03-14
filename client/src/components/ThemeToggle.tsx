import React from 'react';
import { ThemeContextType } from '../utils/types';

interface ThemeToggleProps {
  theme: ThemeContextType;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme }) => {
  const { darkMode, toggleDarkMode } = theme;
  
  return (
    <button 
      onClick={toggleDarkMode}
      style={{
        background: 'transparent',
        border: 'none',
        color: darkMode ? '#BB86FC' : '#6200EA',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
      }}
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};

export default ThemeToggle;