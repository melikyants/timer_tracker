import React from "react";

import { useMutation } from "@apollo/react-hooks";

import { ReactComponent as StartIcon } from "../../../icons/arrow.svg";

import { TimerContext } from "../../../../../lib/context/TimerContext";
import { START_TIMER } from "../../../../../lib/graphql/mutation";
import { TIMERS } from "../../../../../lib/graphql/query";
import { Timer_timer } from "../../../../../lib/graphql/query/Timer/__generated__/Timer";
import { Timers } from "../../../../../lib/graphql/query/Timers/__generated__/Timers";
import {
  startTimer as IstartTimer,
  startTimerVariables,
} from "../../../../../lib/graphql/mutation/StartTimer/__generated__/startTimer";

interface ITimerWith extends Timer_timer {
  time: string;
  date: string;
}

export const Timer = ({ timer }: { timer: ITimerWith }) => {
  const { timerR, dispatchTimerR } = React.useContext(TimerContext);
  const timeStart = new Date(timer.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeEnd = new Date(timer.end!).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [startTimer] = useMutation<IstartTimer, startTimerVariables>(
    START_TIMER,
    {
      update(cache, { data }) {
        const timerData = cache.readQuery<Timers>({ query: TIMERS });

        if (data && timerData) {
          cache.writeQuery({
            query: TIMERS,
            data: { timers: timerData.timers.concat([data.startTimer]) },
          });
        }
      },
    }
  );

  const onStartTimer = async (id: string) => {
    const now = Date.now(); //timestamp in milliseconds

    if (!timerR.isRunning) {
      dispatchTimerR({
        type: "START_TIMER",
      });

      await startTimer({ variables: { start: now, id: id } }).then((result) => {
        console.log("onStartTimer -> result", result);
        dispatchTimerR({
          type: "UPDATE_TIMER_ID",
          payload: {
            runningId: result.data ? result.data.startTimer.id : "",
          },
        });
      });
    }
  };

  const showDetails = (id: string) => {
    dispatchTimerR({
      type: "OPEN_TIMER_DETAILS",
      payload: id,
    });
  };

  return (
    <div key={timer.id} className="timer">
      <div className="timer_desc" onClick={() => showDetails(timer.id)}>
        <div>{timer.title}</div>
        <div className="timer_desc_row">
          {timer.project ? (
            <div className="timer_desc__title">{timer.project.title}</div>
          ) : (
            <div>
              <button className="btn-link"> + add project</button>
            </div>
          )}
          {timer.type && <div className="timer_desc__title">{timer.type}</div>}
        </div>
      </div>
      <div>
        <div className="timer__times">
          <div>{timer.time}</div>
          <div className="timer__times_fromTo">
            {timeStart} - {timeEnd}
          </div>
        </div>

        <div className="startIcon">
          <button
            onClick={() => onStartTimer(timer.id)}
            className="btn btn__icon btn__play"
          >
            <StartIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
