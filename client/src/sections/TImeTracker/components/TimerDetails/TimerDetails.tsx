import React from "react";

import { Projects } from "./Projects";
import { useInput, useTextarea } from "../../../../lib";

import { useMutation, useQuery } from "@apollo/react-hooks";

import { TimerContext } from "../../../../lib/context/TimerContext";
import { ReactComponent as DeleteIcon } from "../../icons/delete.svg";

import {
  Timer,
  TimerVariables,
  Timer_timer,
} from "../../../../lib/graphql/query/Timer/__generated__/Timer";
import {
  deleteTimer as IdeleteTimer,
  deleteTimerVariables,
} from "../../../../lib/graphql/mutation/DeleteTimer/__generated__/deleteTimer";
import {
  updateTimer as IupdateTimer,
  updateTimerVariables,
} from "../../../../lib/graphql/mutation/UpdateTimer/__generated__/updateTimer";
import { Timers } from "../../../../lib/graphql/query/Timers/__generated__/Timers";
import { TIMERS, TIMER } from "../../../../lib/graphql/query";
import { DELETE_TIMER, UPDATE_TIMER } from "../../../../lib/graphql/mutation";
import { Types } from "./Types";
import { TimerType as ITimerType } from "../../../../lib/graphql/globalTypes";

export const TimerDetails = ({ timerId }: { timerId: string }) => {
  const {
    value: timerTitle,
    setValue: setTimerValue,
    bind: bindTitle,
  } = useInput("");
  const {
    value: projectDescription,
    setValue: setprojectDescription,
    bind: bindProjectDescription,
  } = useTextarea("");
  const {
    value: timerNotes,
    setValue: settimerNotes,
    bind: bindtimerNotes,
  } = useTextarea("");

  const { dispatchTimerR } = React.useContext(TimerContext);
  const [projectId, setProjectId] = React.useState("");
  const [timerType, setTimerType] = React.useState(ITimerType.ANY);

  const { data, loading } = useQuery<Timer, TimerVariables>(TIMER, {
    variables: {
      id: timerId,
    },
  });

  const updateState = React.useCallback(
    (timer) => {
      console.log("timer", timer);
      setTimerValue(timer.title);
      if (timer.project) {
        setProjectId(timer.project.id ? timer.project.id : "");
        setprojectDescription(
          timer.project.description ? timer.project.description : ""
        );
      }
      settimerNotes(timer.notes ? timer.notes : "");
    },
    [setTimerValue, setProjectId, setprojectDescription, settimerNotes]
  );

  React.useEffect(() => {
    if (data) {
      const timer: Timer_timer = data.timer;
      updateState(timer);
    }
  }, [data, updateState]);

  const [deleteTimer] = useMutation<IdeleteTimer, deleteTimerVariables>(
    DELETE_TIMER,
    {
      update(cache, { data }) {
        const timersData = cache.readQuery<Timers>({ query: TIMERS });
        if (timersData) {
          const index = timersData.timers.findIndex(
            (timer) => timer.id === data!.deleteTimer.id
          );
          if (index > -1) {
            timersData.timers.splice(index, 1);
          }
          cache.writeQuery({
            query: TIMERS,
            data: { timers: timersData.timers },
          });
        }
      },
    }
  );

  const [updateTimer] = useMutation<IupdateTimer, updateTimerVariables>(
    UPDATE_TIMER,
    {
      update(cache, { data }) {
        const dataTimer = cache.readQuery<Timer>({
          query: TIMER,
          variables: { id: timerId },
        });
        if (dataTimer) {
          cache.writeQuery({
            query: TIMER,
            data: { timer: Object.assign(dataTimer.timer, data!.updateTimer) },
          });
        }
      },
    }
  );

  if (loading) return <div>Loading...</div>;

  const timerFetched = data ? data.timer : null;

  const onCancleDetails = () => {
    dispatchTimerR({
      type: "CLOSE_TIMER_DETAILS",
    });
  };

  const onDeleteTimer = async () => {
    await deleteTimer({ variables: { id: timerId } });
    dispatchTimerR({
      type: "CLOSE_TIMER_DETAILS",
    });
  };

  const onChangeProjectId = (id: string, description: string | null) => {
    setProjectId(id);
    setprojectDescription(description ? description : "");
  };

  const onChangeType = (type: ITimerType) => {
    setTimerType(type);
  };

  const onSubmitTimerDetails = async () => {
    console.log(
      "onSubmitTimerDetails -> projectDescription",
      projectDescription
    );
    await updateTimer({
      variables: {
        id: timerId,
        title: timerTitle,
        project_id: projectId,
        project_description: projectDescription,
        notes: timerNotes,
        type: timerType,
      },
    });
  };

  return (
    <div className="TimerDetails_wrapper">
      <h3>Details</h3>
      <div className="TimerDetails__body">
        <div>
          <input placeholder="Title" className="input" {...bindTitle} />
        </div>
        <div className="TimerDetails__body__row">
          {timerFetched && (
            <Projects
              timer={timerFetched}
              onChangeProjectId={onChangeProjectId}
            />
          )}
          {timerFetched && (
            <Types timer={timerFetched} onChangeType={onChangeType} />
          )}
          <div>Times goes here</div>
        </div>
        <div>
          <textarea
            name="project_description"
            placeholder="Description of the Project"
            rows={4}
            className="textarea"
            {...bindProjectDescription}
            disabled={!projectId}
          />
        </div>
        <div>
          <textarea
            name="timer_notes"
            placeholder="Keep some notes"
            rows={10}
            className="textarea"
            {...bindtimerNotes}
          />
        </div>
        <div className="btn-block">
          <button className="btn btn__icon" onClick={onDeleteTimer}>
            <DeleteIcon />
          </button>
          <button className="btn" onClick={onCancleDetails}>
            Cancel
          </button>
          <button className="btn" onClick={onSubmitTimerDetails}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
