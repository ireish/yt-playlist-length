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
          className="speed-slider"
        />
        <style>
          {`
            .speed-slider {
              flex: 1;
              -webkit-appearance: none;
              width: 100%;
              height: 8px;
              border-radius: 4px;
              background: ${darkMode ? '#444' : '#ddd'};
              outline: none;
              opacity: 0.9;
              transition: opacity .2s;
            }

            .speed-slider:hover {
              opacity: 1;
            }

            .speed-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 24px;
              height: 16px;
              border-radius: 4px;
              background: ${darkMode ? '#BB86FC' : '#6200EA'};
              cursor: pointer;
            }

            .speed-slider::-moz-range-thumb {
              width: 24px;
              height: 16px;
              border-radius: 4px;
              background: ${darkMode ? '#BB86FC' : '#6200EA'};
              cursor: pointer;
              border: none;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SpeedSlider;