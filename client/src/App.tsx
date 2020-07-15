import React from "react";
import "./App.css";
import { TimerContextProvider } from "./lib/context/TimerContext";
import { TimeTracker } from "./TimeTracker";

const App = () => {
  return (
    <div id="app">
      <div className="App">
        <div className="main-app">
          <TimerContextProvider>
            <TimeTracker />
          </TimerContextProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
