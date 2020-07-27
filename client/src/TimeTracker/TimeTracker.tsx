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
  );
  const prevScrollY = React.useRef(0);
  const timerBodyRef = React.useRef<HTMLDivElement | null>(null);

  // const [goingUp, setGoingUp] = React.useState(false);
  const [headerActive, setheaderActive] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);

  const handleSceroll = React.useCallback(() => {
    const updateHeader = () => {
      let timerBody = timerBodyRef.current;

      if (timerBody) {
        const currentScrollY = timerBody.scrollTop;
        if (prevScrollY.current !== currentScrollY && !isScrolling) {
          console.log("updateHeader -> currentScrollY", currentScrollY);
          setIsScrolling(true);
        }
        if (prevScrollY.current === 0 && isScrolling) {
          setIsScrolling(false);
        }
        // if (prevScrollY.current < currentScrollY && goingUp) {
        //   setGoingUp(false);
        // }
        // if (prevScrollY.current > currentScrollY && !goingUp) {
        //   setGoingUp(true);
        // }
        if (currentScrollY > 80) {
          setheaderActive(true);
        } else {
          setheaderActive(false);
        }

        prevScrollY.current = currentScrollY;
        console.log("updateHeader -> prevScrollY.current", prevScrollY.current);
      }
    };
    updateHeader();
  }, [isScrolling]);

  React.useEffect(() => {
    let timerBody = timerBodyRef.current;
    if (timerBody) {
      timerBody.addEventListener("scroll", handleSceroll, {
        passive: true,
      });
    }
    return () => {
      if (timerBody) timerBody.removeEventListener("scroll", handleSceroll);
    };
  }, [handleSceroll]);

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

  const setHeaderClass = headerActive
    ? "time-tracker__header time-tracker__header--active"
    : "time-tracker__header";

  // console.log("prevScrollY.current", prevScrollY.current);
  // const setScroll = isScrolling
  //   ? "time-tracker time-tracker--scroll"
  //   : "time-tracker";

  return (
    <div className="time-tracker">
      <div className={setHeaderClass}>
        <TimerLog timer={timer} loading={loading} />
      </div>
      <div
        className="time-tracker__body"
        ref={timerBodyRef}
        onScroll={handleSceroll}
      >
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
    </div>
  );
};
