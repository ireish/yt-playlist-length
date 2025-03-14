import React from 'react';
import ThemeToggle from './ThemeToggle';
import { ThemeContextType } from '../utils/types';

interface HeaderProps {
  theme: ThemeContextType;
}

const Header: React.FC<HeaderProps> = ({ theme }) => {
  const { darkMode } = theme;
  
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: darkMode ? '#1E1E1E' : '#FFFFFF',
      color: darkMode ? '#FFFFFF' : '#333333',
      boxShadow: darkMode ? '0 2px 10px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    }}>
      <h1 style={{ 
        fontSize: '24px',
        fontWeight: 'bold',
        color: darkMode ? '#BB86FC' : '#6200EA' 
      }}>
        YouTube Playlist Viewer
      </h1>
      <ThemeToggle theme={theme} />
    </header>
  );
};

export default Header;