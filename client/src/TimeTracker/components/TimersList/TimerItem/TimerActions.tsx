import React from "react";
import { Button } from "../../../../lib/components";
import { TimerContext } from "../../../../lib/context/TimerContext";
import { Timers } from "../../../../lib/graphql/queries/Timers/__generated__/Timers";
import {
  startTimer as IstartTimer,
  startTimerVariables,
} from "../../../../lib/graphql/mutations/StartTimer/__generated__/startTimer";
import { useMutation } from "@apollo/client";

import { START_TIMER } from "../../../../lib/graphql/mutations";
import { TIMERS } from "../../../../lib/graphql/queries";

interface TimerActions {
  timerId: string;
}
export const TimerActions = ({ timerId }: TimerActions) => {
  const { timerR, dispatchTimerR } = React.useContext(TimerContext);

  const [startTimer] = useMutation<IstartTimer, startTimerVariables>(
    START_TIMER,
    {
      update(cache, { data }) {
        const timerData = cache.readQuery<Timers>({ query: TIMERS });

        if (data && timerData) {
          cache.writeQuery({
            query: TIMERS,
            data: { timers: timerData.timers.timers.concat([data.startTimer]) },
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

  const isRunning = timerR.isRunning ? true : false;

  return (
    <div className="timer-actions">
      <Button
        onClick={() => onStartTimer(timerId)}
        icon="play"
        simpleIcon
        timerActions
        disabled={isRunning}
      />
      <Button
        onClick={() => showDetails(timerId)}
        icon="edit"
        simpleIcon
        timerActions
      />
      <Button
        onClick={() => onStartTimer(timerId)}
        icon="delete"
        simpleIcon
        timerActions
      />
    </div>
  );
};
