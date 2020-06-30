import React from 'react';
import { useQuery } from '@apollo/react-hooks';


import { TimersList, TimerLog, TimerDetails } from './components';

import { Timers as ITimers, Timers_timers } from './__generated__/Timers';
import './styles/index.scss';

import _ from 'lodash';

import { TimerContext } from "../../lib/context/TimerContext";
import { TIMERS } from '../../lib/graphql/query'


interface ITimerext extends Timers_timers {
  project_title?: string
}

export const Timers = ({ }) => {
  const {
    data: timersData, loading, error, refetch,
  } = useQuery<any>(TIMERS);
  const [timerDetailsId] = React.useContext(TimerContext)
  console.log("Timers -> timerDetailsId", timerDetailsId)


  const timersList = timersData ? timersData.timers : [];

  const timer = timersList?.length ? timersList.filter((timer: any) => timer.isRunning)[0] : null;

  const handleTimersRefetch = async (): Promise<void> => {
    await refetch()
  }

  return (
    <div className="timers">
      <TimerLog timer={timer} />
      <div className="timersList__wrapper">
        {timerDetailsId ? <TimerDetails timerId={timerDetailsId} /> : <TimersList timers={timersList} timersRefetch={handleTimersRefetch} />}
      </div>
    </div>
  );
};
