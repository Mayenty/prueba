import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TimeInput from './components/TimeInput';
import TimeDisplay from './components/TimeDisplay';

function App() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState({ hours: 0, minutes: 0, seconds: 0 }); // Store initial time for reset
  const audioRef = useRef(null);

  const handleStart = () => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      alert("Por favor, defina um tempo maior que zero.");
      return;
    }
    setInitialTime(time); // Save the time from which we started
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = setInterval(() => {
      setTime(prevTime => {
        let { hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          seconds = 59;
          minutes--;
        } else if (hours > 0) {
          seconds = 59;
          minutes = 59;
          hours--;
        }

        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timerId);
          setIsRunning(false);
          if (audioRef.current) {
            audioRef.current.play();
          }
          // We might want to reset to initialTime or 0 here, depending on desired behavior
          // For now, it stops at 00:00:00 and user can reset or set new time
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, audioRef]); // Add audioRef to dependencies if its existence could change, though not strictly necessary here as it's stable.

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTime(prevTime => ({
      ...prevTime,
      [name]: value // Value is already parsed in TimeInput
    }));
    // If user changes input while timer is not running, this will be the new initial time
    if (!isRunning) {
      setInitialTime(prevInitial => ({...prevInitial, [name]: value}));
    }
  };

  // Reset function could be added later if needed:
  // const handleReset = () => {
  //   setIsRunning(false);
  //   setTime(initialTime); // Or setTime({ hours: 0, minutes: 0, seconds: 0 });
  // };

  return (
    <div className="App">
      <audio ref={audioRef} src="/BeepExamen.mp3" loop />
      <header className="App-header">
        <h1>Cronômetro</h1>
        <div className="time-inputs-container">
          {isRunning ? (
            <>
              <TimeDisplay label="Horas" value={time.hours} />
              <TimeDisplay label="Minutos" value={time.minutes} />
              <TimeDisplay label="Segundos" value={time.seconds} />
            </>
          ) : (
            <>
              <TimeInput
                label="Horas"
                name="hours"
                value={time.hours}
                onChange={handleInputChange}
                isRunning={isRunning}
              />
              <TimeInput
                label="Minutos"
                name="minutes"
                value={time.minutes}
                onChange={handleInputChange}
                isRunning={isRunning}
              />
              <TimeInput
                label="Segundos"
                name="seconds"
                value={time.seconds}
                onChange={handleInputChange}
                isRunning={isRunning}
              />
            </>
          )}
        </div>
        <button onClick={handleStart} disabled={isRunning || (time.hours === 0 && time.minutes === 0 && time.seconds === 0)}>
          {isRunning ? "Contando..." : "Iniciar"}
        </button>
        {/* Optional: Add a reset button / stop sound button
        <button onClick={() => {
          setIsRunning(false); // Stop timer
          setTime(initialTime); // Reset time
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }} disabled={!isRunning && !audioRef.current?.paused === false }>
          Resetar/Parar Som
        </button>
        */}
        {(isRunning || (time.hours !== 0 || time.minutes !== 0 || time.seconds !== 0) || (!isRunning && audioRef.current && !audioRef.current.paused)) && ( // Show display when running, if time is set, or if sound is playing
          <div>
            <h2>Tempo Restante:</h2>
            <p>{String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}</p>
            { !isRunning && audioRef.current && !audioRef.current.paused && <p style={{fontSize: '1rem', color: 'red'}}>Alarme tocando!</p>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
