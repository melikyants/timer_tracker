import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { TimersList, TimerLog, TimerDetails } from './components';

import { Timers as ITimers, Timers_timers } from '../../lib/graphql/query/Timers/__generated__/Timers';
import './styles/index.scss';

import { TimerContext } from "../../lib/context/TimerContext";
import { TIMERS } from '../../lib/graphql/query'


export const Timers = () => {
  const {
    data: timersData,
  } = useQuery<ITimers>(TIMERS);

  const [timerContext,] = React.useContext(TimerContext)

  const timersList = timersData ? timersData.timers : [];

  const timer = timersList?.length ? timersList.filter((timer: Timers_timers) => timer.isRunning)[0] : null;

  return (
    <div className="timers">
      <TimerLog timer={timer} />
      <div className="timersList__wrapper">
        {timerContext.timerDetailsId ? <TimerDetails timerId={timerContext.timerDetailsId} /> : <TimersList timers={timersList} />}
      </div>
    </div>
  );
};
