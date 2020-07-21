import React from "react";

import { Projects } from "./Projects";

import { useInput, useTextarea } from "../../../lib/Hooks";
import { Input, Button, Textarea, Loading } from "../../../lib/components";
import { TimerContext } from "../../../lib/context/TimerContext";

import { useMutation, useQuery } from "@apollo/client";

import {
  Timer,
  TimerVariables,
  Timer_timer,
} from "../../../lib/graphql/queries/Timer/__generated__/Timer";
import {
  deleteTimer as IdeleteTimer,
  deleteTimerVariables,
} from "../../../lib/graphql/mutations/DeleteTimer/__generated__/deleteTimer";
import {
  updateTimer as IupdateTimer,
  updateTimerVariables,
} from "../../../lib/graphql/mutations/UpdateTimer/__generated__/updateTimer";
import { Timers } from "../../../lib/graphql/queries/Timers/__generated__/Timers";
import { TIMERS, TIMER } from "../../../lib/graphql/queries";
import { DELETE_TIMER, UPDATE_TIMER } from "../../../lib/graphql/mutations";
import { Types } from "./Types";
import { TimerType as ITimerType } from "../../../lib/graphql/globalTypes";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";

import styled from "styled-components/macro";
import _ from "lodash";

function addZero(i: number | string) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const StyledButtonTime = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  font-family: $fontFamily;
  font-size: 1rem;
`;

const StyledButtonBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & > button:not(:first-child) {
    margin-left: 16px;
  }
`;

export const TimerDetails = ({ timerId }: { timerId: string }) => {
  const {
    value: timerTitle,
    setValue: setTimerTitle,
    bind: bindTitle,
  } = useInput("");

  const {
    value: projectDescription,
    setValue: setprojectDescription,
    bind: bindProjectDescription,
  } = useTextarea("");
  const {
    value: timerNotes,
    setValue: setTimerNotes,
    bind: bindtimerNotes,
  } = useTextarea("");

  const [date, setDate] = React.useState(new Date());
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [duration, setDuration] = React.useState("");

  const { timerR, dispatchTimerR } = React.useContext(TimerContext);
  const [projectId, setProjectId] = React.useState<string | null>(null);
  const [timerType, setTimerType] = React.useState(ITimerType.ANY);

  const { data, loading } = useQuery<Timer, TimerVariables>(TIMER, {
    variables: {
      id: timerId,
    },
  });

  const updateState = React.useCallback(
    (timer) => {
      console.log("timer", timer);
      setTimerTitle(timer.title);
      if (timer.project) {
        setProjectId(timer.project.id ? timer.project.id : "");
        setprojectDescription(
          timer.project.description ? timer.project.description : ""
        );
      }
      setDate(timer.start);
      console.log("timer.type", timer.type);
      setTimerType(timer.type);
      const startHours =
        timer.start && addZero(new Date(timer.start).getHours());
      const startMinutes =
        timer.start && addZero(new Date(timer.start).getMinutes());
      const totalStartTime = `${startHours}:${startMinutes}`;
      setStartTime(totalStartTime);

      if (timer.end) {
        const endHours = addZero(new Date(timer.end).getHours());
        const endMinutes = addZero(new Date(timer.end).getMinutes());
        const totalEndTime = `${endHours}:${endMinutes}`;

        setEndTime(totalEndTime);
      } else {
        setEndTime("");
      }

      const duration = timer.end
        ? timer.end - timer.start
        : Date.now() - timer.start;
      const hours = Math.floor(duration / 1000 / 60 / 60);
      const minutes = Math.floor((duration / 1000 / 60) % 60);

      const durationTimeFormated = hours
        ? `${hours} h ${minutes} min`
        : `${minutes} min`;

      setDuration(durationTimeFormated);

      setTimerNotes(timer.notes ? timer.notes : "");
    },
    [setTimerTitle, setProjectId, setprojectDescription, setTimerNotes]
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
        if (timersData && data) {
          const clonedTimers = _.clone(timersData.timers.timers);

          const index = clonedTimers.findIndex(
            (timer: any) => timer && timer.id === data.deleteTimer.id
          );

          if (index > -1) {
            clonedTimers.splice(index, 1);
          }

          cache.writeQuery({
            query: TIMERS,
            data: { timers: clonedTimers },
          });
        }
      },
    }
  );

  const [updateTimer] = useMutation<IupdateTimer, updateTimerVariables>(
    UPDATE_TIMER
  );

  if (loading)
    return (
      <StyledDetailsWrapper>
        <Loading />
      </StyledDetailsWrapper>
    );

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

  const onChangeProjectId = (id: string | null, description: string | null) => {
    setProjectId(id);
    setprojectDescription(description ? description : "");
  };

  const onChangeType = (type: ITimerType) => {
    setTimerType(type);
  };

  const handleDateChange = (date: Date) => {
    setDate(date);
  };

  const onSaveTimerDetails = async () => {
    const dateT = new Date(date).toDateString();
    const startTimerMilliseconds = new Date(`${dateT} ${startTime}`).getTime();
    console.log("onSaveTimerDetails -> endTime", endTime);
    const endTimerMilliseconds = endTime
      ? new Date(`${dateT} ${endTime}`).getTime()
      : null;
    console.log(
      "onSaveTimerDetails -> endTimerMilliseconds",
      endTimerMilliseconds
    );

    //If the timer is running, do not update the time for, only the content
    console.log("onSaveTimerDetails -> timerId", timerId);
    console.log("onSaveTimerDetails -> timerR.isRunningId", timerR.isRunningId);
    await updateTimer({
      variables: {
        id: timerId,
        title: timerTitle,
        project_id: projectId,
        project_description: projectDescription,
        notes: timerNotes,
        type: timerType,
        start: startTimerMilliseconds,
        end: endTimerMilliseconds,
      },
    });
  };

  const TimeInput = React.forwardRef(
    ({ value, onClick }: { value: any; onClick: any }, __refs) => (
      <StyledButtonTime onClick={onClick}>{value}</StyledButtonTime>
    )
  );

  return (
    <StyledDetailsWrapper>
      <h3>Details</h3>
      <StyledDetailsWrapperBody>
        <Input type="text" placeholder="Title" bind={bindTitle} name="title" />
        <StyledDetailsWrapperBodyFlexRow>
          {timerFetched && (
            <Projects
              timer={timerFetched}
              onChangeProjectId={onChangeProjectId}
            />
          )}
          {timerFetched && (
            <Types timer={timerFetched} onChangeType={onChangeType} />
          )}
        </StyledDetailsWrapperBodyFlexRow>
        <StyledDetailsTymerBlock>
          <StyledDetailsWrapperBodyFlexRow>
            <div>Duration: {duration}</div>
            <TimePicker
              onChange={setStartTime}
              value={startTime}
              disableClock={true}
            />
            {endTime && (
              <TimePicker
                onChange={setEndTime}
                value={endTime}
                disableClock={true}
              />
            )}
          </StyledDetailsWrapperBodyFlexRow>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            dateFormat="EE, d MMMM yyyy"
            popperClassName="some-custom-class"
            popperPlacement="bottom-start"
            popperModifiers={{
              offset: {
                enabled: true,
                offset: "5px, 10px",
              },
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: "viewport",
              },
            }}
            customInput={<TimeInput value onClick />}
            // inline={true}
          />
        </StyledDetailsTymerBlock>
        <Textarea
          name="project_description"
          placeholder="Description of the Project"
          rows={4}
          bind={bindProjectDescription}
          disabled={!projectId}
        />
        <Textarea
          name="timer_notes"
          placeholder="Keep some notes"
          rows={10}
          bind={bindtimerNotes}
        />
        <StyledButtonBlock>
          <Button icon="delete" simpleIcon onClick={onDeleteTimer} />
          <Button text="Cancel" onClick={onCancleDetails} />
          <Button text="Save" onClick={onSaveTimerDetails} />
        </StyledButtonBlock>
      </StyledDetailsWrapperBody>
    </StyledDetailsWrapper>
  );
};

const StyledDetailsWrapper = styled.div`
  border-radius: 6px;
  padding: 12px;
  overflow: scroll;
  height: calc(100% - 84px);
  position: relative;
  border-radius: 12px;

  & h3 {
    margin: 0 0 16px;
    text-align: left;
  }
`;
const StyledDetailsWrapperBody = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 250px;

  & > * {
    margin-bottom: 16px;
  }
`;
const StyledDetailsWrapperBodyFlexRow = styled.div`
  display: flex;
`;

const StyledDetailsTymerBlock = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;
