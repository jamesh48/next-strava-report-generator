import React from 'react';
import StravaEntry from './StravaEntry';
import EmptyEntry from './EmptyEntry';
import { useGlobalContext } from '../GlobalStore/globalStore.js';
import { CurrentActivity, Entry, Format } from './EntryTypes.js';
import reportStyles from '../../styles/report.module.scss';

interface EntryUIProps {
  entries: Entry[];
  entriesPerPage: number;
  currentPage: number;
  currentActivity: CurrentActivity;
  invalidEntry: boolean;
  sport: string;
  format?: Format;
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
  updateIndividualEntry: (
    entryId: number,
    updatedName: string
  ) => Promise<void>;
}

const EntryUI = (props: EntryUIProps) => {
  const [{ totalEntries }] = useGlobalContext();
  const currentEntries = props.entries.slice(
    props.currentPage * props.entriesPerPage - props.entriesPerPage,
    props.currentPage * props.entriesPerPage
  );

  const renderEntries = currentEntries.map((entry, index) => {
    return (
      <li key={index}>
        <StravaEntry
          currentActivity={props.currentActivity}
          showIndividualEntry={props.showIndividualEntry}
          updateIndividualEntry={props.updateIndividualEntry}
          no={
            props.currentPage === 1 && index >= 0 && index <= 3
              ? index
              : undefined
          }
          sport={props.sport}
          entry={entry}
          format={props.format}
        />
      </li>
    );
  });

  return (
    <ul className={reportStyles.entryUls}>
      {(currentEntries?.length === 0 && totalEntries?.length) ||
      props.invalidEntry === true ? (
        <EmptyEntry />
      ) : (
        renderEntries
      )}
    </ul>
  );
};

export default EntryUI;
