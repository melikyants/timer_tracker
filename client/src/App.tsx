import React from "react";
import "./App.css";
import { TimerContextProvider } from "./lib/context/TimerContext";
import { TimeTracker } from "./TimeTracker";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div id="app">
        <div className="App">
          <div className="main-app">
            <Switch>
              <Route exact path="/">
                <TimerContextProvider>
                  <TimeTracker />
                </TimerContextProvider>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
