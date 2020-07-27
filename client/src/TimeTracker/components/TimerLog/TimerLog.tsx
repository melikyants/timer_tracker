import React from "react";
import { useMutation } from "@apollo/client";

import { useInterval, useInput } from "../../../lib/Hooks";
import { milliSecToString } from "../../../lib/helpers";
import { Input, Button, Loading } from "../../../lib/components";
import { Timer } from "../../../lib/types";
import { TimerContext } from "../../../lib/context/TimerContext";

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

import "./TimerLog.scss";

export const TimerLog = ({
  timer,
  loading,
}: {
  timer: ITimer_timer | null;
  loading: any;
}) => {
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
        const readCachedTimers = cache.readQuery<ITimers>({
          query: TIMERS,
        });

        if (readCachedTimers && data) {
          cache.writeQuery({
            query: TIMERS,
            data: {
              timers: {
                timers: readCachedTimers.timers.timers.concat([
                  data.createTimer,
                ]),
              },
            },
          });
        }
      },
    }
  );

  const [stopTimer] = useMutation<IstopTimer, stopTimerVariables>(STOP_TIMER);

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

  if (loading) {
    return (
      <div className="timer-log">
        <Loading />
      </div>
    );
  }

  if (timer) {
    return (
      <div className="timer-log">
        <div className="timer-log__left">
          <Button icon="stop" onClick={onStopTimer} />
          <div
            className="timer-description"
            onClick={() => onTimerDetails(timer.id)}
          >
            <div className="timer-description__project">
              {timer.project?.title ? timer.project?.title : "+ add project"}
            </div>
            <div>{valueTitle ? valueTitle : "+ add title"}</div>
          </div>
        </div>
        <div className="timer-log__tick timer-log__tick--active">
          {STimer.time}
        </div>
      </div>
    );
  } else {
    return (
      <div className="timer-log">
        <div className="timer-log__left">
          <Button icon="play" onClick={onStartTimer} />
          <div className="timer-description">
            <Input
              type="text"
              bind={bindTitle}
              placeholder="What are you working on?"
            />
          </div>
        </div>
        <div className="timer-log__tick">00:00</div>
      </div>
    );
  }
};
