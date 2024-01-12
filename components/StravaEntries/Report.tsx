import React, { useEffect, useState } from 'react';
import { Box, SelectChangeEvent } from '@mui/material';
import EntryUl from './EntryUl';
import PageNoUl from '@components/PaginationContainer/PageNoUl';
import { Entry, Format, Sport } from './EntryTypes.js';
import {
  useGetAllEntriesQuery,
  useLazyGetIndividualEntryQuery,
  getSortCondition,
  getDateCondition,
} from '@redux/slices';
import { useSelector } from '@redux/reduxHooks';
import { useMobileBrowserCheck } from '@lib';

export interface ReportProps {
  sport: Sport;
  distance: number;
  format: Format;
  titleQuery: string;
}

const Report = (props: ReportProps) => {
  const isMobile = useMobileBrowserCheck();
  const [getIndividualEntry, individualEntryResults] =
    useLazyGetIndividualEntryQuery();
  const [fromDateQuery, toDateQuery] = useSelector(getDateCondition);
  const sortCondition = useSelector(getSortCondition);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(7);
  // Entries
  const [invalidEntry, setInvalidEntry] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({
    id: 0,
    name: '',
    kudos_count: 0,
    comment_count: 0,
    average_heartrate: 0,
    max_heartrate: 0,
    achievement_count: 0,
    description: '',
    device_name: '',
    laps: [{ max_heartrate: 0, average_heartrate: 0, distance: 0 }],
    photos: {
      primary: {
        urls: {
          '600': '',
        },
      },
    },
  });
  let { data: totalEntries } = useGetAllEntriesQuery(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [props.sport]);

  useEffect(() => {
    if (typeof Number(props.distance) !== 'number') {
      setInvalidEntry(true);
    } else {
      setInvalidEntry(false);
    }
  }, [props.distance]);

  totalEntries = totalEntries
    ?.filter((entry: Entry) => Number(props.distance) <= Number(entry.distance))
    .filter((remainingEntry: Entry) => props.sport === remainingEntry.type)
    .filter(
      (remainingEntry: Entry) =>
        remainingEntry.name.indexOf(props.titleQuery) > -1
    )
    .filter((remainingEntry: Entry) => {
      if (fromDateQuery === '' && toDateQuery === '') {
        return remainingEntry;
      }

      const candidateDate = new Date(remainingEntry.start_date.slice(0, 10));
      // If Only From Date is specified
      if (toDateQuery === '') {
        const filterFrom = new Date(fromDateQuery);
        return filterFrom <= candidateDate;
      }

      // If Only 'to Date' is specified
      if (fromDateQuery === '') {
        const filterTo = new Date(toDateQuery);
        return filterTo >= candidateDate;
      }

      // If both From and To Dates are specified
      const filterFrom = new Date(fromDateQuery);
      const filterTo = new Date(toDateQuery);
      return filterFrom <= candidateDate && filterTo >= candidateDate;
    })
    .slice()
    .sort(
      sortCondition === 'speedDesc'
        ? (a, b) => b.distance / b.moving_time - a.distance / a.moving_time
        : sortCondition === 'startDate'
        ? (a, b) => {
            return Number(b.start_date) - Number(a.start_date);
          }
        : sortCondition === 'timeElapsedDesc'
        ? (a, b) => {
            return b.elapsed_time - a.elapsed_time;
          }
        : sortCondition === 'timeElapsedAsc'
        ? (a, b) => a.elapsed_time - b.elapsed_time
        : sortCondition === 'movingTimeDesc'
        ? (a, b) => b.moving_time - a.moving_time
        : sortCondition === 'movingTimeAsc'
        ? (a, b) => a.moving_time - b.moving_time
        : sortCondition === 'dateDesc'
        ? (a, b) => (new Date(b.start_date) > new Date(a.start_date) && 1) || -1
        : sortCondition === 'dateAsc'
        ? (a, b) => (new Date(a.start_date) > new Date(b.start_date) && 1) || -1
        : undefined
    );

  const handlePaginationClick: ((event: SelectChangeEvent<string>) => void) &
    React.MouseEventHandler<HTMLLIElement> = (event) => {
    setCurrentPage(Number((event.target as HTMLSelectElement).value));
  };

  const handleCloseCurrentActivity = () => {
    setCurrentActivity({
      id: 0,
      name: '',
      kudos_count: 0,
      comment_count: 0,
      average_heartrate: 0,
      max_heartrate: 0,
      achievement_count: 0,
      description: '',
      device_name: '',
      laps: [{ max_heartrate: 0, average_heartrate: 0, distance: 0 }],
      photos: {
        primary: {
          urls: {
            '600': '',
          },
        },
      },
    });
  };

  useEffect(() => {
    if (individualEntryResults && individualEntryResults.data) {
      setCurrentActivity(individualEntryResults.data);
    }
  }, [individualEntryResults]);

  const showIndividualEntry: React.MouseEventHandler<HTMLDivElement> = async (
    event
  ) => {
    event.preventDefault();
    getIndividualEntry(Number(event.currentTarget.dataset.indentry));
  };

  return (
    <Box id="report" sx={{ width: '95%' }}>
      {isMobile ? (
        <PageNoUl
          {...props}
          entriesPerPage={entriesPerPage}
          entries={totalEntries!}
          handleClick={handlePaginationClick}
          currentPage={currentPage}
        />
      ) : null}
      <EntryUl
        {...props}
        invalidEntry={invalidEntry}
        currentPage={currentPage}
        entries={totalEntries!}
        entriesPerPage={entriesPerPage}
        currentActivity={currentActivity}
        showIndividualEntry={showIndividualEntry}
        handleCloseCurrentActivity={handleCloseCurrentActivity}
      />
      {!isMobile ? (
        <PageNoUl
          {...props}
          entriesPerPage={entriesPerPage}
          entries={totalEntries!}
          handleClick={handlePaginationClick}
          currentPage={currentPage}
        />
      ) : null}
    </Box>
  );
};

export default Report;
