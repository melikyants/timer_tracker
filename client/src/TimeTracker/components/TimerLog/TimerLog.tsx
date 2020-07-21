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
import styled from "styled-components";
import { create } from "domain";

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
      <div className="timer_log">
        <Loading />
      </div>
    );
  }

  if (timer) {
    return (
      <StyledTimerHeader>
        <StyledTimerInput onClick={() => onTimerDetails(timer.id)}>
          <div>{valueTitle ? valueTitle : "Add the title"}</div>
          <div className="timer_log__project">{timer.project?.title}</div>
        </StyledTimerInput>
        <div className="timer_log__tick">{STimer.time}</div>
        <Button icon="stop" onClick={onStopTimer} />
      </StyledTimerHeader>
    );
  } else {
    return (
      <StyledTimerHeader>
        <Input
          type="text"
          bind={bindTitle}
          placeholder="What are you working on?"
        />
        <Button icon="arrow" onClick={onStartTimer} />
      </StyledTimerHeader>
    );
  }
};

const StyledTimerHeader = styled.div`
  height: 84px;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  flex: 1 auto;
  padding: 0 12px;
  position: relative;
  & button {
    flex-shrink: 0;
    margin-left: 12px;
  }
`;

const StyledTimerInput = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  text-align: left;
`;
