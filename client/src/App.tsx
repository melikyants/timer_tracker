import React from "react";
import { TimerContextProvider } from "./lib/context/TimerContext";
import { TimeTracker } from "./TimeTracker";

const App = () => {
  return (
    <TimerContextProvider>
      <TimeTracker />
    </TimerContextProvider>
  );
};

export default App;
