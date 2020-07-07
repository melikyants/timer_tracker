import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { useQuery } from "@apollo/react-hooks";

import { TimersList, TimerLog, TimerDetails } from "./components";

import {
  Timers as ITimers,
  Timers_timers,
} from "../../lib/graphql/query/Timers/__generated__/Timers";
import "./styles/index.scss";

import { TimerContext } from "../../lib/context/TimerContext";
import { TIMERS } from "../../lib/graphql/query";

export const Timers = () => {
  const { data: timersData } = useQuery<ITimers>(TIMERS);

  const { timerR } = React.useContext(TimerContext);

  const timersList = timersData ? timersData.timers : [];

  const timer = timersList?.length
    ? timersList.filter((timer: Timers_timers) => timer.isRunning)[0]
    : null;

  return (
    <div className="timers">
      <TimerLog timer={timer} />
      <div className="timersList__wrapper">
        <TransitionGroup component={null}>
          {timerR.timerDetailsId ? (
            <CSSTransition key="001" timeout={300} classNames="item">
              <TimerDetails timerId={timerR.timerDetailsId} />
            </CSSTransition>
          ) : (
            <CSSTransition key="002" timeout={400} classNames="item">
              <TimersList timers={timersList} />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </div>
  );
};
