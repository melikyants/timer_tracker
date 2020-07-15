import React from "react";

import { milliSecToString, isToday, sortByDates } from "../../../lib/helpers";

import { Timers_timers } from "../../../lib/graphql/queries/Timers/__generated__/Timers";
import { Timer } from "./Timer";

interface ITimerWith extends Timers_timers {
  time: string;
  date: string;
}

export const TimersList = ({ timers }: { timers: Timers_timers[] }) => {
  const timersList = timers.length ? timers : null;

  if (timersList) {
    const parsedTimerinTimers: ITimerWith[] = timersList
      .map<ITimerWith>((timer) => {
        const totalTime = timer.end! - timer.start;
        const time = milliSecToString(totalTime);
        const date = new Date(timer.end!).toString();
        return {
          ...timer,
          time,
          date,
        };
      })
      .filter((timer) => !timer.isRunning);

    // group timers by date
    const groupTimersByDate = Object.values(
      parsedTimerinTimers.reduce((result, next) => {
        // const nextDateSet = next.end ? next.end : 0;
        const nextDate = new Date(next.end!);
        const nextDateString: string = nextDate.toDateString(); // "Tue Jun 23 2020"

        if (!result[nextDateString]) {
          result[nextDateString] = {
            date: nextDateString,
            items: [],
          };
        }

        result[nextDateString].items.push(next);
        return result;
      }, {} as { [key: string]: { date: string; items: ITimerWith[] } })
    );

    // add total time to timers that grouped by date
    const timersWithTotalTime = groupTimersByDate
      .map((item) => {
        const total = item.items.reduce(
          (result: number, next) => result + (next.end! - next.start),
          0
        );

        const totalTime = milliSecToString(total);

        item.items.sort((a: any, b: any) => sortByDates(a.date, b.date));

        return {
          ...item,
          total: totalTime,
        };
      })
      .sort((a, b) => sortByDates(a.date, b.date));

    const timersRenderList = timersWithTotalTime.map((timersByDays) => {
      const now = new Date(timersByDays.date);

      const today = isToday(now) ? "Today" : timersByDays.date;

      return (
        <div className="timer__block" key={timersByDays.date}>
          <div className="timer__block_header">
            <div>{today}</div>
            <div>{timersByDays.total}</div>
          </div>
          <div className="timer__block_body">
            {timersByDays.items &&
              timersByDays.items.map((timer) => (
                <Timer timer={timer} key={timer.id} />
              ))}
          </div>
        </div>
      );
    });

    return <div className="timers_list">{timersRenderList}</div>;
  }
  return <div className="timers_list">There is no time log yet!</div>;
};
