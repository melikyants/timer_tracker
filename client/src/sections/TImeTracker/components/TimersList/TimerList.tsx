import React from 'react';


import { milliSecToString, isToday, sortByDates } from '../../../../lib';
// import { Timers_timers as ITimer } from '../../../../context/__generated__/Timers';

import { Timer } from './Timer';


export const TimersList = ({ timers, timersRefetch }: { timers: any[] | [], timersRefetch: () => void }) => {

  const timersList = timers.length ? timers : []
  const parsedTimerinTimers = timersList.map<any>((timer) => {
    const totalTime = timer.end - timer.start;
    const time = milliSecToString(totalTime);
    const date = new Date(timer.end).toString();
    return {
      ...timer,
      time,
      date,
    };
  }).filter((timer) => !timer.isRunning);

  // group timers by date
  const groupTimersByDate = Object.values(parsedTimerinTimers.reduce((result: any, next) => {
    const nextDate = new Date(next.end);
    const nextDateString = nextDate.toDateString(); // "Tue Jun 23 2020"

    if (!result[nextDateString]) {
      result[nextDateString] = {
        date: nextDateString,
        items: [],
      };
    }

    result[nextDateString].items.push(next);
    return result;
  }, {}));


  // add total time to timers that grouped by date
  const timersWithTotalTime = groupTimersByDate.map((item: any) => {
    const total = item.items.reduce((result: number, next: any) => result + (next.end - next.start), 0);

    const totalTime = milliSecToString(total);

    item.items.sort((a: any, b: any) => sortByDates(a.date, b.date));
    return {
      ...item,
      total: totalTime,
    };
  }).sort((a: any, b: any) => sortByDates(a.date, b.date));

  if (timersWithTotalTime) {
    const timersRenderList = timersWithTotalTime.map((timersByDays) => {
      const now = new Date(timersByDays.date);

      const today = isToday(now) ? 'Today' : timersByDays.date;
      return (
        <div className="timer__block" key={timersByDays.date}>
          <div className="timer__block_header">
            <div>
              {today}
            </div>
            <div>
              {timersByDays.total}
            </div>
          </div>
          <div className="timer__block_body">
            {timersByDays.items && <Timers timers={timersByDays.items} timersRefetch={timersRefetch} />}
          </div>

        </div>
      );
    });

    return (<div className="timers_list">{timersRenderList}</div>);
  }
  return <div className="timers_list">There is no time log yet!</div>;
};

export const Timers = ({ timers, timersRefetch }: { timers: any[], timersRefetch: () => void }) => (
  <div>
    {timers.map((timer: any, i: number) => <Timer timer={timer} key={timer.id} timersRefetch={timersRefetch} />)}
  </div>
);
