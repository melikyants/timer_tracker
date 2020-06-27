import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { TimersList, TimerLog } from './components';

import { Timers as ITimers, Timers_timers } from './__generated__/Timers';
import './styles/index.scss';

import _ from 'lodash';

// import { TimerContextProvider } from "../../lib/context/TimerContext";

const TIMERS = gql`
  query Timers {
    timers {
      id
      title
      project_id
      type
      notes
      description
      start
      end
      project_title
      isRunning
    }
  }
`;

interface ITimerext extends Timers_timers {
  project_title?: string
}
export const Timers = ({ }) => {
  const {
    data: timersData, loading, error, refetch,
  } = useQuery<any>(TIMERS);
  console.log("Timers -> error", error)
  console.log("Timers -> timersData", timersData)

  const timersList = timersData ? timersData.timers : [];

  const timer = timersList?.length ? timersList.filter((timer: any) => timer.isRunning)[0] : null;

  const handleTimersRefetch = async (): Promise<void> => {
    await refetch()
  }

  return (
    // <TimerContextProvider>
    <div className="timers">
      <TimerLog timer={timer} />
      <div className="timersList__wrapper">
        <TimersList timers={timersList} timersRefetch={handleTimersRefetch} />
      </div>
    </div>
    // </TimerContextProvider>
  );
};
