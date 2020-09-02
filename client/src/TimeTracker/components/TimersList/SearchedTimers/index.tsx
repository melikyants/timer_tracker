import React from "react";
import {
  milliSecToString,
  isToday,
  sortByDates,
} from "../../../../lib/helpers";
import { Timer } from "../TimerItem";
import { Timers_timers_timers } from "../../../../lib/graphql/queries/Timers/__generated__/Timers";

export const SearchedTimers = ({
  timers,
}: {
  timers: Timers_timers_timers[];
}) => {
  const searchTimers = timers.map((searchTimer: any) => {
    console.log("searchTimer", searchTimer);
    const totalTime = searchTimer.end! - searchTimer.start;
    const time = milliSecToString(totalTime);
    const date = new Date(searchTimer.end!).toString();
    return (
      <div className="timers-searched-list" key={searchTimer.id}>
        <Timer timer={searchTimer} key={searchTimer.id} search />
      </div>
    );
  });
  return <>{searchTimers}</>;
};
