import React from 'react';
import './App.css';
import { Timers } from './sections'
import { TimerContextProvider } from "./lib/context/TimerContext";

function App() {
  return (
    <div className="App">
      <TimerContextProvider>
        <Timers />
      </TimerContextProvider>
    </div>
  );
}

export default App;
