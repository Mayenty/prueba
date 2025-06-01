import React from 'react';
import './TimeInput.css';

function TimeInput({ label, value, onChange, name, isRunning }) {
  const handleChange = (event) => {
    let inputValue = parseInt(event.target.value, 10);
    if (isNaN(inputValue)) {
      inputValue = 0;
    }

    if (name === 'hours') {
      if (inputValue < 0) inputValue = 0;
      if (inputValue > 99) inputValue = 99;
    } else { // minutes or seconds
      if (inputValue < 0) inputValue = 0;
      if (inputValue > 59) inputValue = 59;
    }
    // Create a synthetic event object to pass to the App's handler
    onChange({ target: { name, value: inputValue } });
  };

  return (
    <div className="time-input-container">
      <label htmlFor={name}>{label}:</label>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        min="0"
        max={name === 'hours' ? '99' : '59'}
        disabled={isRunning}
      />
    </div>
  );
}

export default TimeInput;
