import React from 'react';
import { List, ListItem, useTheme } from '@mui/material';
import StravaEntry from './StravaEntry';
import EmptyEntry from './EmptyEntry';
import { CurrentActivity, Entry, Format, Sport } from './EntryTypes.js';
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
  const theme = useTheme();
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
        boxShadow: '0 0 10px ' + theme.palette.strava.contrastColor,
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
