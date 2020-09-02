import React from "react";

import { Input, Button } from "../../../lib/components";
import { useInput } from "../../../lib/Hooks";

import { Timers_timers_timers } from "../../../lib/graphql/queries/Timers/__generated__/Timers";

import { TimersRenderList } from "./TimersRenderList";
import { SearchedTimers } from "./SearchedTimers";
import { SEARCH_NOTES } from "../../../lib/graphql/queries";
import { useLazyQuery } from "@apollo/client";

import "./TimerList.scss";

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

  return (
    <>
      <div className="timers-list" ref={timersListRef} onScroll={handleSceroll}>
        {search.length > 0 && <SearchedTimers timers={search} />}
        <TimersRenderList timersList={timersList} />
        {!isLoadingMore ? (
          <Button
            text="Load More"
            onClick={doMoreFetch}
            type="button"
            icon="arrowDown"
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
};
