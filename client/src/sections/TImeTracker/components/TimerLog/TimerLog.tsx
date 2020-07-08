import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { useInterval, milliSecToString } from "../../../../lib";

import { ReactComponent as PlayIcon } from "../../icons/arrow.svg";
import { ReactComponent as StopIcon } from "../../icons/stop.svg";

import { TimerContext } from "../../../../lib/context/TimerContext";

import { STOP_TIMER, CREATE_TIMER } from "../../../../lib/graphql/mutations";
import { TIMERS } from "../../../../lib/graphql/queries";
import { Timer_timer as ITimer_timer } from "../../../../lib/graphql/queries/Timer/__generated__/Timer";
import { Timers as ITimers } from "../../../../lib/graphql/queries/Timers/__generated__/Timers";
import {
  createTimer as IcreateTimer,
  createTimerVariables,
} from "../../../../lib/graphql/mutations/CreateTimer/__generated__/createTimer";
import {
  stopTimer as IstopTimer,
  stopTimerVariables,
} from "../../../../lib/graphql/mutations/StopTimer/__generated__/stopTimer";

interface ISTimerNew {
  start: number;
  runningSince: number;
  time: string; //human readable time
}

export const TimerLog = ({ timer }: { timer: ITimer_timer | null }) => {
  const [STitle, setSTitle] = React.useState("");
  const [STimer, setSTimer] = React.useState<ISTimerNew>({
    start: 0,
    runningSince: 0,
    time: "",
  });

  const { timerR, dispatchTimerR } = React.useContext(TimerContext);
  const [createTimer] = useMutation<IcreateTimer, createTimerVariables>(
    CREATE_TIMER,
    {
      update(cache, { data }) {
        const dataTimers = cache.readQuery<ITimers>({ query: TIMERS });

        if (dataTimers) {
          cache.writeQuery({
            query: TIMERS,
            data: { timers: dataTimers.timers.concat([data!.createTimer]) },
          });
        }
      },
    }
  );

  const [stopTimer] = useMutation<IstopTimer, stopTimerVariables>(STOP_TIMER, {
    update(cache, { data }) {
      const dataTimers = cache.readQuery<ITimers>({ query: TIMERS });

      if (dataTimers && data) {
        const index = dataTimers.timers.findIndex(
          (timer) => timer.id === data.stopTimer.id
        );
        if (index > -1) {
          dataTimers.timers[index] = data.stopTimer;
        }

        cache.writeQuery({
          query: TIMERS,
          data: { timers: dataTimers.timers },
        });
      }
    },
  });

  useInterval(
    () => {
      const runningSince = Date.now() - STimer.start;
      const timeRunning = milliSecToString(runningSince);

      setSTimer((STimer) => ({
        ...STimer,
        runningSince: STimer.runningSince + 1,
        time: timeRunning,
      }));
    },
    timerR.isRunning ? 1000 : null
  );

  React.useEffect(() => {
    if (timer) {
      const runningSince = Date.now() - timer.start;
      const timeRunning = milliSecToString(runningSince);
      dispatchTimerR({
        type: "TIMER_RUNNING",
        payload: {
          id: timer.id,
        },
      });
      setSTimer((STimer) => ({
        ...STimer,
        start: timer.start,
        time: timeRunning,
        runningSince: Date.now(),
      }));
      setSTitle(timer.title);
    }
  }, [timer, dispatchTimerR]);

  const onStartTimer = async () => {
    const now = Date.now(); //timestamp in milliseconds
    const timeRunning = milliSecToString(0);

    dispatchTimerR({
      type: "START_TIMER",
    });

    setSTimer((STimer) => ({ ...STimer, start: now, time: timeRunning }));

    await createTimer({ variables: { start: now, title: STitle } }).then(
      (result) => {
        dispatchTimerR({
          type: "UPDATE_TIMER_ID",
          payload: {
            runningId: result.data ? result.data.createTimer.id : "",
          },
        });
      }
    );
  };

  const onStopTimer = async () => {
    const now = Date.now(); //timestamp in milliseconds
    const timeRunning = milliSecToString(0);

    dispatchTimerR({
      type: "STOP_TIMER",
    });

    setSTimer((STimer) => ({
      ...STimer,
      isRunning: false,
      start: 0,
      runningSince: 0,
      time: timeRunning,
    }));

    if (timerR.isRunningId !== null) {
      setSTitle("");
      await stopTimer({ variables: { id: timerR.isRunningId, end: now } });
    }
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSTitle(e.currentTarget.value);
  };

  const onTimerDetails = (id: string) => {
    console.log("onTimerDetails -> id", id);
    dispatchTimerR({
      type: "CLOSE_TIMER_DETAILS",
    });
    dispatchTimerR({
      type: "OPEN_TIMER_DETAILS",
      payload: id,
    });
  };

  if (timer) {
    return (
      <div className="timer_log">
        <div
          className="timer_log__desc"
          onClick={() => onTimerDetails(timer.id)}
        >
          <div>{STitle ? STitle : "Add the title"}</div>
          <div className="timer_log__project">{timer.project?.title}</div>
        </div>
        <div className="timer_log__tick">{STimer.time}</div>
        <button className="btn btn__circle btn__stop" onClick={onStopTimer}>
          <StopIcon />
        </button>
      </div>
    );
  } else {
    return (
      <div className="timer_log">
        <input
          className="input"
          type="text"
          onChange={onTitleChange}
          placeholder="What are you working on?"
        />
        <button className="btn btn__circle btn__play" onClick={onStartTimer}>
          <PlayIcon />
        </button>
      </div>
    );
  }
};
