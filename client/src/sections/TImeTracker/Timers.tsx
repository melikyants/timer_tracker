import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { TimersList, TimerLog } from './components';

import { Timers as ITimers } from './__generated__/Timers';
import './styles/index.scss';

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
      isRunning
    }
  }
`;
export const Timers = ({ }) => {
  const {
    data: timersData, loading, error, refetch,
  } = useQuery<ITimers>(TIMERS);

  const timersList = timersData ? timersData.timers : null;
  const timer = timersList?.length ? timersList.filter((timer) => timer.isRunning)[0] : null;

  return (
    <div className="timers">
      <TimerLog timer={timer} refetch={refetch} />
      <div className="timersList__wrapper">
        <TimersList timers={timersList} refetch={refetch} />
      </div>
    </div>
  );
};
