import React from "react";
import "./App.css";
import { Timers } from "./sections";
import { TimerContextProvider } from "./lib/context/TimerContext";
import { Upwork } from "./sections";

function App() {
  return (
    <div className="App">
      <div className="main-app">
        <Upwork />
        <TimerContextProvider>
          <Timers />
        </TimerContextProvider>
      </div>
    </div>
  );
}

export default App;
