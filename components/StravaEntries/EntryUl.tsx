import React from 'react';
import StravaEntry from './StravaEntry';
import EmptyEntry from './EmptyEntry';
import { CurrentActivity, Entry, Format, Sport } from './EntryTypes.js';
import { List, ListItem } from '@mui/material';
import { useGetAllEntriesQuery } from '@redux/slices';
import { useCSX } from '@lib';

interface EntryUIProps {
  entries: Entry[];
  entriesPerPage: number;
  currentPage: number;
  currentActivity: CurrentActivity;
  invalidEntry: boolean;
  sport: Sport;
  format?: Format;
  showIndividualEntry: React.MouseEventHandler<HTMLDivElement>;
}

const EntryUI = (props: EntryUIProps) => {
  const { data: totalEntries } = useGetAllEntriesQuery(null);
  const currentEntries = props.entries?.slice(
    props.currentPage * props.entriesPerPage - props.entriesPerPage,
    props.currentPage * props.entriesPerPage
  );

  const renderEntries = currentEntries?.map((entry, index) => {
    return (
      <ListItem key={index} sx={{ display: 'flex', padding: 0 }}>
        <StravaEntry
          currentActivity={props.currentActivity}
          showIndividualEntry={props.showIndividualEntry}
          no={
            props.currentPage === 1 && index >= 0 && index <= 3
              ? index
              : undefined
          }
          sport={props.sport}
          entry={entry}
          format={props.format}
        />
      </ListItem>
    );
  });

  const mobileStyles = useCSX({}, { marginBottom: '15%', marginTop: '2.5%' });

  return (
    <List
      className="entryUls"
      disablePadding={true}
      sx={{
        listStyleType: 'none',
        boxShadow: '0 0 10px coral',
        ...mobileStyles,
      }}
    >
      {(currentEntries?.length === 0 && totalEntries?.length) ||
      props.invalidEntry === true ? (
        <EmptyEntry />
      ) : (
        renderEntries
      )}
    </List>
  );
};

export default EntryUI;
