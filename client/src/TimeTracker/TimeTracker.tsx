import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { useQuery } from "@apollo/client";

import { TimersList, TimerLog, TimerDetails } from "./components";
import { Loading } from "../lib/components";

import { Timers as ITimers } from "../lib/graphql/queries/Timers/__generated__/Timers";
import "./styles/index.scss";

import { TimerContext } from "../lib/context/TimerContext";
import { TIMERS } from "../lib/graphql/queries";

export const TimeTracker = () => {
  const { data: timersData, loading, error, fetchMore } = useQuery<ITimers>(
    TIMERS
  );

  const { timerR } = React.useContext(TimerContext);

  const timersList = timersData ? timersData.timers.timers : [];

  const timer = timersList?.length
    ? timersList.filter((timer) => timer && timer.isRunning)[0]
    : null;

  if (loading && !timerR.timerDetailsId) {
    return (
      <div className="timers">
        <Loading />
      </div>
    );
  }

  const timersError = error ? (
    <h2>Uh oh! Something went wrong - please try again later :(</h2>
  ) : null;

  const onFetchMore = () => {
    if (timersData && timersData.timers && timersData?.timers.hasMore) {
      fetchMore({
        variables: {
          pageSize: 7,
          after: timersData.timers.cursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...fetchMoreResult,
            timers: {
              ...fetchMoreResult.timers,
              timers: [...prev.timers.timers, ...fetchMoreResult.timers.timers],
            },
          };
        },
      });
    }
  };
  return (
    <div className="timers">
      <TimerLog timer={timer} loading={loading} />
      <TransitionGroup component={null}>
        {timerR.timerDetailsId ? (
          <CSSTransition key="001" timeout={400} classNames="itemD">
            <TimerDetails timerId={timerR.timerDetailsId} />
          </CSSTransition>
        ) : (
          <CSSTransition key="002" timeout={400} classNames="itemD">
            <TimersList timers={timersList} fetchMore={onFetchMore} />
          </CSSTransition>
        )}
      </TransitionGroup>
      {timersError}
    </div>
  );
};
