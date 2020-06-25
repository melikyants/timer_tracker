import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { TimersList, TimerLog } from './components';

import { Timers as ITimers, Timers_timers } from './__generated__/Timers';
import './styles/index.scss';

import _ from 'lodash';

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
const PROJECTS = gql`
  query Projects {
    projects {
      id
      title
      info
    }
  }
`;

interface ITimerext extends Timers_timers {
  project_title?: string
}
export const Timers = ({ }) => {
  const {
    data: timersData, loading, error, refetch,
  } = useQuery<ITimers>(TIMERS);

  const {
    data: projectsData
  } = useQuery(PROJECTS);

  const timersList = timersData ? timersData.timers : [];

  const clonedTimers: ITimerext[] = timersList ? _.cloneDeep(timersList) : [];

  const projectsList = projectsData ? projectsData.projects : []

  const timersWithProject = clonedTimers.map((timer) => {
    const projectIndex = projectsList.findIndex((project: any) => project.id == timer.project_id)
    if (projectIndex > -1) {
      timer['project_title'] = projectsList[projectIndex].title
    }
    return timer
  })
  const timer = timersWithProject?.length ? timersWithProject.filter((timer) => timer.isRunning)[0] : null;


  return (
    <div className="timers">
      <TimerLog timer={timer} refetch={refetch} />
      <div className="timersList__wrapper">
        <TimersList timers={timersWithProject} refetch={refetch} />
      </div>
    </div>
  );
};
