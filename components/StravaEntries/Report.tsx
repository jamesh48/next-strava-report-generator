import React, { useEffect, useState } from 'react';
import { Box, SelectChangeEvent } from '@mui/material';
import EntryUl from './EntryUl';
import PageNoUl from '@components/PaginationContainer/PageNoUl';
import {
  CachedEntry,
  CurrentActivity,
  Entry,
  Format,
  Sport,
} from './EntryTypes.js';
import {
  useGetAllEntriesQuery,
  useLazyGetIndividualEntryQuery,
  getSortCondition,
  getDateCondition,
  getAchievementsOnlyCondition,
} from '@redux/slices';
import { useSelector } from '@redux/reduxHooks';
import { useMobileBrowserCheck } from '@lib';

export interface ReportProps {
  sport: Sport;
  distance: number;
  format: Format;
  titleQuery: string;
}

export type CustomMouseEventHandler = (
  event: React.MouseEvent<HTMLAnchorElement>,
  cachedEntry?: Entry & CachedEntry
) => void;

const Report = (props: ReportProps) => {
  const isMobile = useMobileBrowserCheck();
  const [getIndividualEntry, individualEntryResults] =
    useLazyGetIndividualEntryQuery();
  const [fromDateQuery, toDateQuery] = useSelector(getDateCondition);
  const achievementsOnly = useSelector(getAchievementsOnlyCondition);
  const sortCondition = useSelector(getSortCondition);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(7);
  // Entries
  const [invalidEntry, setInvalidEntry] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({} as CurrentActivity);
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
    )
    .filter((entry) => {
      if (achievementsOnly) {
        return entry.achievement_count > 0;
      }
      return entry;
    });

  const handlePaginationClick: ((event: SelectChangeEvent<string>) => void) &
    React.MouseEventHandler<HTMLLIElement> = (event) => {
    setCurrentPage(Number((event.target as HTMLSelectElement).value));
  };

  const handleCloseCurrentActivity = () => {
    setCurrentActivity({} as CurrentActivity);
  };

  useEffect(() => {
    if (individualEntryResults && individualEntryResults.data) {
      setCurrentActivity(individualEntryResults.data);
    }
  }, [individualEntryResults]);

  const showIndividualEntry: CustomMouseEventHandler = async (
    event,
    cachedEntry?: Entry & CachedEntry
  ) => {
    event.preventDefault();
    if (cachedEntry) {
      setCurrentActivity({
        ...cachedEntry,
        id: Number(cachedEntry.activityId),
        best_efforts: JSON.parse(cachedEntry.bestEfforts),
        device_name: cachedEntry.deviceName,
        gear: {
          name: cachedEntry.gearName,
        },
        laps: JSON.parse(cachedEntry.laps),
        map: {
          polyline: cachedEntry.mapPolyline,
        },
        photos: {
          count: 1,
          primary: {
            urls: {
              '600': cachedEntry.primaryPhotoUrl!,
            },
          },
        },
        segment_efforts: JSON.parse(cachedEntry.segmentEfforts),
      });
    } else {
      getIndividualEntry({
        entryid: Number(event.currentTarget.dataset.indentry),
      });
    }
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
