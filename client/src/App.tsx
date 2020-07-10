import React from "react";
import "./App.css";
import { TimerContextProvider } from "./lib/context/TimerContext";
import { Timers, Settings, Login, AppHeader, User, Upwork } from "./sections";
import { useApolloClient, useMutation, useQuery } from "@apollo/react-hooks";
import { LOG_IN } from "./lib/graphql/mutations";
import { Viewer } from "./lib/types";
import {
  LogIn,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Layout } from "antd";

const initialViewer: Viewer = {
  id: null,
  tokenGoogle: null,
  tokenUpwork: null,
  avatar: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = React.useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogIn, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.tokenGoogle) {
          sessionStorage.setItem("tokenGoogle", data.logIn.tokenGoogle);
        } else {
          sessionStorage.removeItem("tokenGoogle");
        }
      }
    },
  });
  const logInRef = React.useRef(logIn);

  React.useEffect(() => {
    logInRef.current();
  }, []);

  return (
    <Router>
      <Layout id="app">
        <AppHeader viewer={viewer} setViewer={setViewer} />
        <div className="App">
          <div className="main-app">
            <Switch>
              <Route exact path="/settings">
                <Settings />
              </Route>
              <Route exact path="/login">
                <Login setViewer={setViewer} />
              </Route>
              <Route exact path="/user/:id">
                <User viewer={viewer} setViewer={setViewer} />
              </Route>
              <Route path="/upwork">
                <Upwork viewer={viewer} setViewer={setViewer} />
              </Route>
              <Route exact path="/">
                <TimerContextProvider>
                  <Timers />
                </TimerContextProvider>
              </Route>
            </Switch>
          </div>
        </div>
      </Layout>
    </Router>
  );
};

export default App;
