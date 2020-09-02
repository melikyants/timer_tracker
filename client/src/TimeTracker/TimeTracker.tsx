import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { useQuery } from "@apollo/client";

import { TimersList, TimerLog, TimerDetails } from "./components";
import { Loading } from "../lib/components";

import { Timers as ITimers } from "../lib/graphql/queries/Timers/__generated__/Timers";

import { TimerContext } from "../lib/context/TimerContext";
import { TIMERS } from "../lib/graphql/queries";

import "./TimeTracker.scss";

export const TimeTracker = () => {
  const { data: timersData, loading, error, fetchMore } = useQuery<ITimers>(
    TIMERS
    // { notifyOnNetworkStatusChange: true }
  );

  const [headerActive, setheaderActive] = React.useState(false);

  const { timerR } = React.useContext(TimerContext);

  const timersList = timersData ? timersData.timers.timers : [];

  const timer = timersList?.length
    ? timersList.filter((timer) => timer && timer.isRunning)[0]
    : null;
  //
  if (loading && !timerR.timerDetailsId) {
    return (
      <div className="time-tracker">
        <div className="time-tracker__body">
          <div className="timers-list">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  const timersError = error ? (
    <h2>Uh oh! Something went wrong - please try again later :(</h2>
  ) : null;

  const onFetchMore = () => {
    return new Promise((resolve, reject) => {
      if (timersData && timersData.timers && timersData?.timers.hasMore) {
        fetchMore({
          variables: {
            pageSize: 12,
            after: timersData.timers.cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...fetchMoreResult,
              timers: {
                ...fetchMoreResult.timers,
                timers: [
                  ...prev.timers.timers,
                  ...fetchMoreResult.timers.timers,
                ],
              },
            };
          },
        }).then(function () {
          resolve();
        });
      }
    });
  };

  const setHeaderClass = headerActive
    ? "time-tracker__header time-tracker__header--active"
    : "time-tracker__header";

  return (
    <div className="time-tracker">
      <div className={setHeaderClass}>
        <TimerLog timer={timer} loading={loading} />
      </div>
      <div className="time-tracker__body">
        <TransitionGroup component={null}>
          {timerR.timerDetailsId ? (
            <CSSTransition key="001" timeout={400} classNames="itemD">
              <TimerDetails timerId={timerR.timerDetailsId} />
            </CSSTransition>
          ) : (
            <CSSTransition key="002" timeout={400} classNames="itemD">
              <TimersList
                timers={timersList}
                fetchMore={onFetchMore}
                setheaderActive={setheaderActive}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
        {timersError}
      </div>
    </div>
  );
};
