import React from 'react';
import './TimeDisplay.css';

function TimeDisplay({ label, value }) {
  const formattedValue = String(value).padStart(2, '0');
  return (
    <div className="time-display-container">
      <span className="time-display-label">{label}:</span>
      <span className="time-display-value">{formattedValue}</span>
    </div>
  );
}

export default TimeDisplay;
