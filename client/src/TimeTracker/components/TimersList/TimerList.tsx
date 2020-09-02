import React from "react";

import { milliSecToString, isToday, sortByDates } from "../../../lib/helpers";

import { Input, Button, Loading } from "../../../lib/components";
import { useInput } from "../../../lib/Hooks";

import { Timers_timers_timers } from "../../../lib/graphql/queries/Timers/__generated__/Timers";
import { Timer } from "./TimerItem";
import { SEARCH_NOTES } from "../../../lib/graphql/queries";
import { useLazyQuery } from "@apollo/client";

import "./TimerList.scss";

interface ITimerWith extends Timers_timers_timers {
  time: string;
  date: string;
}

export const TimersList = ({
  timers,
  fetchMore,
  setheaderActive,
}: {
  timers: (Timers_timers_timers | null)[];
  fetchMore: () => Promise<unknown>;
  setheaderActive: (header: boolean) => void;
}) => {
  const timersList = timers.length ? timers : null;
  const { value: searchValue, bind: bindSearch } = useInput("");
  const [search, setSearch] = React.useState([]);
  const [isLoadingMore, setLoadingMore] = React.useState(false);
  const [searchNotes, { data: searchData }] = useLazyQuery(SEARCH_NOTES);

  const prevScrollY = React.useRef(0);
  const timersListRef = React.useRef<HTMLDivElement | null>(null);

  const handleSceroll = React.useCallback(() => {
    const updateHeader = () => {
      let timerBody = timersListRef.current;

      if (timerBody) {
        const currentScrollY = timerBody.scrollTop;

        if (currentScrollY > 2) {
          setheaderActive(true);
        } else {
          setheaderActive(false);
        }

        prevScrollY.current = currentScrollY;
      }
    };
    updateHeader();
  }, [setheaderActive]);

  React.useEffect(() => {
    let timerBody = timersListRef.current;
    timerBody?.addEventListener("scroll", handleSceroll);

    return () => {
      timerBody?.removeEventListener("scroll", handleSceroll);
    };
  }, [handleSceroll]);

  React.useEffect(() => {
    if (searchData && searchData.searchNotes) {
      console.log("searchData", searchData);
      setSearch(searchData.searchNotes);
    }
  }, [searchData]);

  const onSearch = async (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      console.log(searchValue); // will match any of the word
      // const searchWords = ev.currentTarget.value
      const searchAny = searchValue;
      const searchPhrase = '"' + searchValue + '"'; //search the whole phrase
      // const searchAllQuery = '"' + searchValue.split(" ").join('" "') + '"'; //this will match if all words a within the context search eg note
      console.log("onSearch -> searchAllQuery", searchPhrase);
      await searchNotes({ variables: { query: searchAny } });
    }
  };

  const doMoreFetch = () => {
    setLoadingMore(true);
    fetchMore().then(function () {
      setLoadingMore(false);
    });
  };

  if (timersList) {
    const parsedTimerinTimers: ITimerWith[] = timersList
      .map<ITimerWith>((timer: any) => {
        const totalTime = timer.end! - timer.start;
        const time = milliSecToString(totalTime);
        const date = new Date(timer.end!).toString();
        return {
          ...timer,
          time,
          date,
        };
      })
      .filter((timer) => !timer.isRunning);

    // group timers by date
    const groupTimersByDate = Object.values(
      parsedTimerinTimers.reduce((result, next) => {
        // const nextDateSet = next.end ? next.end : 0;
        const nextDate = new Date(next.end!);
        const nextDateString: string = nextDate.toDateString(); // "Tue Jun 23 2020"

        if (!result[nextDateString]) {
          result[nextDateString] = {
            date: nextDateString,
            items: [],
          };
        }

        result[nextDateString].items.push(next);
        return result;
      }, {} as { [key: string]: { date: string; items: ITimerWith[] } })
    );

    // add total time to timers that grouped by date
    const timersWithTotalTime = groupTimersByDate
      .map((item) => {
        const total = item.items.reduce(
          (result: number, next) => result + (next.end! - next.start),
          0
        );

        const totalTime = milliSecToString(total);

        item.items.sort((a: any, b: any) => sortByDates(a.date, b.date));

        return {
          ...item,
          total: totalTime,
        };
      })
      .sort((a, b) => sortByDates(a.date, b.date));

    const timersRenderList = timersWithTotalTime.map((timersByDays) => {
      const now = new Date(timersByDays.date);

      const today = isToday(now) ? "Today" : timersByDays.date;

      return (
        <div className="timers-by-date" key={timersByDays.date}>
          <div className="timers-by-date__header">
            <div className="timers-by-date__header__title">{today}</div>
            <div className="timers-by-date__header__time">
              {timersByDays.total}
            </div>
          </div>
          {timersByDays.items &&
            timersByDays.items.map((timer) => (
              <Timer timer={timer} key={timer.id} />
            ))}
        </div>
      );
    });

    return (
      <>
        <div
          className="timers-list"
          ref={timersListRef}
          onScroll={handleSceroll}
        >
          {/* <ul> */}
          {/*search.map((s: any) => {
              return (
                <li key={s.id}>
                  <h3>{s.title}</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{s.notes}</p>
                  {/* {s.notes.split("/n").map((p: string) => {
                    return <p style={"whiteSpace: pre-line;"}>{p}</p>;
                  })} */}
          {/* </li> */}
          {/* );
            })} */}
          {/* </ul> */}
          {timersRenderList}
          {!isLoadingMore ? (
            <Button
              text="Load More"
              onClick={doMoreFetch}
              type="button"
              icon="more"
              simpleIcon
            />
          ) : (
            <Button text="Load More" type="button" icon="loading" simpleIcon />
          )}
        </div>
        <div className="timers-search">
          {/* <Input type="checkbox" name="searchType" value="any"> */}
          {/* <input type="radio" name="searchType" value="all"/> */}
          <Input
            placeholder="Search in Notes"
            type="search"
            name="query"
            bind={bindSearch}
            onKeyDown={onSearch}
          />
        </div>
      </>
    );
  }
  return <div className="timers_list">There is no time log yet!</div>;
};
