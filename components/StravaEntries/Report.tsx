import React from 'react';
import EntryUl from './EntryUl';
import PageNoUl from '../PaginationContainer/PageNoUl';
import { getIndividualEntry } from '../../lib/AppUtils';
import { useGlobalContext } from '../GlobalStore/globalStore.js';
import { useEntriesStore } from '../../lib/useEntries.js';
import reportStyles from '../../styles/report.module.scss';
import { Entry, Format } from './EntryTypes.js';

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
  const [{ totalEntries, sortCondition }, globalDispatch] = useGlobalContext();
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

  const { entries, filterAndSortEntries } = useEntriesStore((state) => state);

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

  React.useEffect(() => {
    if (totalEntries?.length) {
      filterAndSortEntries(
        totalEntries,
        sortCondition,
        props.distance,
        props.sport,
        props.titleQuery,
        props.fromDateQuery,
        props.toDateQuery
      );
    }
  }, [
    sortCondition,
    props.distance,
    props.sport,
    props.titleQuery,
    props.fromDateQuery,
    props.toDateQuery,
    totalEntries,
  ]);

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
    const updatedEntries = totalEntries.reduce(
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
    <div id={reportStyles.report}>
      <EntryUl
        {...props}
        invalidEntry={invalidEntry}
        currentPage={currentPage}
        entries={entries}
        entriesPerPage={entriesPerPage}
        currentActivity={currentActivity}
        showIndividualEntry={showIndividualEntry}
        updateIndividualEntry={updateIndividualEntry}
      />
      <PageNoUl
        {...props}
        entriesPerPage={entriesPerPage}
        entries={entries}
        handleClick={handlePaginationClick}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Report;
