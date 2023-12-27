import React from 'react';
import StravaEntry from './StravaEntry';
import EmptyEntry from './EmptyEntry';
import { CurrentActivity, Entry, Format } from './EntryTypes.js';
import { List, ListItem } from '@mui/material';
import { useGetAllEntriesQuery } from '@redux/slices';

interface EntryUIProps {
  entries: Entry[];
  entriesPerPage: number;
  currentPage: number;
  currentActivity: CurrentActivity;
  invalidEntry: boolean;
  sport: string;
  format?: Format;
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
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

  return (
    <List
      className="entryUls"
      disablePadding={true}
      sx={{
        listStyleType: 'none',
        marginBottom: '1%',
        boxShadow: '0 0 10px coral',
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
