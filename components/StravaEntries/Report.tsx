import React from 'react';
import EntryUl from './EntryUl';
import PageNoUl from '../PaginationContainer/PageNoUl';
import { getIndividualEntry } from '../../lib/AppUtils';
import { useGlobalContext } from '../GlobalStore/globalStore.js';
// import { useEntriesStore } from '../../lib/useEntries.js';
import { Entry, Format } from './EntryTypes.js';
import { Box } from '@mui/material';
import { useGetAllEntriesQuery } from '../../redux/slices/entriesSlice';

export interface ReportProps {
  sport: string;
  distance: number;
  format: Format;
  titleQuery: string;
  fromDateQuery: string;
  toDateQuery: string;
}

const Report = (props: ReportProps) => {
  // Global Context
  const [{ sortCondition }, globalDispatch] = useGlobalContext();
  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [entriesPerPage] = React.useState(7);
  // Entries
  const [invalidEntry, setInvalidEntry] = React.useState(false);
  const [currentActivity, setCurrentActivity] = React.useState({
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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [props.sport]);

  React.useEffect(() => {
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
      if (props.fromDateQuery === '' && props.toDateQuery === '') {
        return remainingEntry;
      }

      const candidateDate = new Date(remainingEntry.start_date.slice(0, 10));
      // If Only From Date is specified
      if (props.toDateQuery === '') {
        const filterFrom = new Date(props.fromDateQuery);
        return filterFrom <= candidateDate;
      }

      // If Only 'to Date' is specified
      if (props.fromDateQuery === '') {
        const filterTo = new Date(props.toDateQuery);
        return filterTo >= candidateDate;
      }

      // If both From and To Dates are specified
      const filterFrom = new Date(props.fromDateQuery);
      const filterTo = new Date(props.toDateQuery);
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

  const handlePaginationClick: React.MouseEventHandler<HTMLLIElement> = (
    event
  ) => {
    const actualId = event?.currentTarget.id.split('-');
    setCurrentPage(Number(actualId[1]));
  };

  const showIndividualEntry: React.MouseEventHandler<
    HTMLAnchorElement
  > = async (event) => {
    event.preventDefault();
    const individualEntry = await getIndividualEntry(
      Number(event.currentTarget.dataset.indentry)
    );
    setCurrentActivity(individualEntry);
  };

  const updateIndividualEntry = async (
    entryId: number,
    updatingName: string
  ) => {
    const updatedEntries = totalEntries?.reduce(
      (total: Entry[], entry: Entry) => {
        if (Number(entry.activityId) === entryId) {
          entry.name = updatingName;
        }
        total.push(entry);
        return total;
      },
      []
    );
    globalDispatch({ type: 'SET TOTAL ENTRIES', payload: updatedEntries });
    const individualEntry = await getIndividualEntry(entryId);
    setCurrentActivity(individualEntry);
  };

  return (
    <Box id="report" sx={{ margin: '2.5% auto', width: '95%' }}>
      <EntryUl
        {...props}
        invalidEntry={invalidEntry}
        currentPage={currentPage}
        entries={totalEntries!}
        entriesPerPage={entriesPerPage}
        currentActivity={currentActivity}
        showIndividualEntry={showIndividualEntry}
        updateIndividualEntry={updateIndividualEntry}
      />
      <PageNoUl
        {...props}
        entriesPerPage={entriesPerPage}
        entries={totalEntries!}
        handleClick={handlePaginationClick}
        currentPage={currentPage}
      />
    </Box>
  );
};

export default Report;
