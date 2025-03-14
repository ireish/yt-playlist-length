import React from 'react';

interface SpeedSliderProps {
  speed: number;
  onChange: (speed: number) => void;
  darkMode: boolean;
}

const SpeedSlider: React.FC<SpeedSliderProps> = ({ speed, onChange, darkMode }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    onChange(newSpeed);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '16px'
    }}>
      <label 
        htmlFor="speed-slider"
        style={{ 
          fontSize: '14px',
          color: darkMode ? '#CCCCCC' : '#666666'
        }}
      >
        Playback Speed: {speed.toFixed(2)}x
      </label>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <input
          id="speed-slider"
          type="range"
          min="1"
          max="2"
          step="0.05"
          value={speed}
          onChange={handleChange}
          style={{
            flex: 1,
            accentColor: darkMode ? '#BB86FC' : '#6200EA'
          }}
        />
        <span style={{ 
          fontSize: '14px',
          color: darkMode ? '#FFFFFF' : '#333333',
          fontWeight: 'bold',
          minWidth: '60px',
          textAlign: 'center'
        }}>
          {speed.toFixed(2)}x
        </span>
      </div>
    </div>
  );
};

export default SpeedSlider;