import React from "react";
import { useMutation } from "@apollo/react-hooks";

import { useInterval, useInput } from "../../../lib/Hooks";
import { milliSecToString } from "../../../lib/helpers";
import { Input } from "../../../lib/components";
import { Timer } from "../../../lib/types";
import { TimerContext } from "../../../lib/context/TimerContext";

import { ReactComponent as PlayIcon } from "../../icons/arrow.svg";
import { ReactComponent as StopIcon } from "../../icons/stop.svg";

import { STOP_TIMER, CREATE_TIMER } from "../../../lib/graphql/mutations";
import { TIMERS } from "../../../lib/graphql/queries";
import { Timer_timer as ITimer_timer } from "../../../lib/graphql/queries/Timer/__generated__/Timer";
import { Timers as ITimers } from "../../../lib/graphql/queries/Timers/__generated__/Timers";
import {
  createTimer as IcreateTimer,
  createTimerVariables,
} from "../../../lib/graphql/mutations/CreateTimer/__generated__/createTimer";
import {
  stopTimer as IstopTimer,
  stopTimerVariables,
} from "../../../lib/graphql/mutations/StopTimer/__generated__/stopTimer";

export const TimerLog = ({ timer }: { timer: ITimer_timer | null }) => {
  const {
    value: valueTitle,
    setValue: setTitle,
    reset: resetTitle,
    bind: bindTitle,
  } = useInput("");

  const [STimer, setSTimer] = React.useState<Timer>({
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
      setTitle(timer.title);
    }
  }, [timer, dispatchTimerR, setTitle]);

  const onStartTimer = async () => {
    const now = Date.now(); //timestamp in milliseconds
    const timeRunning = milliSecToString(0);

    dispatchTimerR({
      type: "START_TIMER",
    });

    setSTimer((STimer) => ({ ...STimer, start: now, time: timeRunning }));

    await createTimer({ variables: { start: now, title: valueTitle } }).then(
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
      resetTitle();
      await stopTimer({ variables: { id: timerR.isRunningId, end: now } });
    }
  };

  const onTimerDetails = (id: string) => {
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
          <div>{valueTitle ? valueTitle : "Add the title"}</div>
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
        <Input
          type="text"
          bind={bindTitle}
          placeholder="What are you working on?"
        />
        <button className="btn btn__circle btn__play" onClick={onStartTimer}>
          <PlayIcon />
        </button>
      </div>
    );
  }
};
