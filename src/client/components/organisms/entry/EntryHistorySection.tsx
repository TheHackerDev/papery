import { useEffect, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import useEntryHistoryStore from "../../../store/entry/entryHistoryStore";
import { HistoryCalendar } from "../../molecules/entry/HistoryCalendar";
import useEntryStore from "../../../store/entry/entryStore";
import useEntrySearchStore from "../../../store/entry/entrySearchStore";

export function EntryHistorySection(props: { onSelectDate?: () => void }) {
  // stores
  const entryHistoryStore = useEntryHistoryStore();
  const entryStore = useEntryStore();
  const entrySearchStore = useEntrySearchStore();
  // states

  const changeYear = (year: string) => {
    entryHistoryStore.setYearAndFetchEntryHistories(year);
  };

  const onClickDate = (date: string) => {
    props.onSelectDate && props.onSelectDate();

    entrySearchStore.addDateToSearchText(date);
    entryStore.fetchEntriesBySearchText();
  };

  const onClickMonth = (month: number) => {
    props.onSelectDate && props.onSelectDate();

    const yearMonth = `${entryHistoryStore.year}-${(month + 1)
      .toString()
      .padStart(2, "0")}`;

    entrySearchStore.addDateToSearchText(yearMonth);
    entryStore.fetchEntriesBySearchText();
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();

    entryHistoryStore.setYearAndFetchEntryHistories(currentYear);
  }, [null]);

  return (
    <div className="flex flex-col justify-stretch h-full">
      <div className="pb-3">
        <YearController year={entryHistoryStore.year} changeYear={changeYear} />
      </div>

      <div className="overflow-y-scroll no-scrollbar">
        <HistoryCalendar
          loading={entryHistoryStore.loading}
          year={entryHistoryStore.year}
          calendarDates={entryHistoryStore.calendarDates}
          entryHistories={entryHistoryStore.entryHistories}
          onClickDate={onClickDate}
          onClickMonth={onClickMonth}
          searchText={entrySearchStore.searchText}
        />
      </div>
    </div>
  );
}

/**
 * YearController
 */

function YearController(props: {
  year: string;
  changeYear: (year: string) => void;
}) {
  // states
  const [year, setYear] = useState(props.year);
  // refs
  const yearRef = useRef(props.year);
  const intervalRef = useRef<NodeJS.Timeout>();

  const changeWithDelay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      props.changeYear(yearRef.current);
      clearInterval(intervalRef.current);
    }, 500);
  };

  const onClickPrev = () => {
    const prevYear = (parseInt(year) - 1).toString();
    setYear(prevYear);
    yearRef.current = prevYear;
    changeWithDelay();
  };

  const onClickNext = () => {
    const nextYear = (parseInt(year) + 1).toString();
    setYear(nextYear);
    yearRef.current = nextYear;
    changeWithDelay();
  };

  return (
    <div className="flex items-center justify-between">
      <button
        className="btn-text px-1 py-1 rounded-md text-foreLighter"
        onClick={onClickPrev}
      >
        <LuChevronLeft />
      </button>
      <div className="text-xs text-fore font-bold">{year}</div>
      <button
        className="btn-text px-1 py-1 rounded-md text-foreLighter"
        onClick={onClickNext}
      >
        <LuChevronRight />
      </button>
    </div>
  );
}
