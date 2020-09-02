import React from "react";

import { Timer_timer } from "../../../../lib/graphql/queries/Timer/__generated__/Timer";

import { TimerActions } from "./TimerActions";

interface ITimerWith extends Timer_timer {
  time: string;
  date: string;
}

export const Timer = ({
  timer,
  search,
}: {
  timer: ITimerWith;
  search?: boolean;
}) => {
  const timeStart = new Date(timer.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeEnd = new Date(timer.end!).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timerClassname = search
    ? "timer-item timer-item--search"
    : "timer-item";
  return (
    <div key={timer.id} className={timerClassname}>
      <div className="timer-description">
        <div className="timer-description__project">
          {timer.project ? (
            <div className="timer_desc__title">{timer.project.title}</div>
          ) : (
            <div>+ add project</div>
          )}
        </div>
        <div className="timer-description__title">{timer.title}</div>
      </div>
      <div className="timer-time">
        <div className="timer-time__description">
          <div className="timer-time__description__range">
            {timeStart} - {timeEnd}
          </div>
          <div>{timer.time}</div>
        </div>
        <div className="timer-time__actions">
          <TimerActions timerId={timer.id} />
        </div>
      </div>
      {search && <div className="timer-notes">{timer.notes}</div>}
    </div>
  );
};
