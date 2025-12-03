import React, { useMemo, useEffect, useState } from 'react';
import { IconButton, List, ListItem, useTheme } from '@mui/material';
import StravaEntry from './StravaEntry';
import EmptyEntry from './EmptyEntry';
import { Entry, Format, Sport } from './EntryTypes.js';
import { useGetAllEntriesQuery } from '@redux/slices';
import { formatTime, useCSX } from '@lib';
import { Button, Table, useCursorPagination } from 'fsh-components';
import { createColumnHelper } from '@tanstack/react-table';
import { Visibility } from '@mui/icons-material';
import StandardDialog from '@components/StandardDialog';
import EntryDetail from '@components/StravaEntries/EntryDetail';
import { When } from 'react-if';

interface EntryUIProps {
  entriesPerPage: number;
  currentPage: number;
  invalidEntry: boolean;
  sport: Sport;
  format?: Format;
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
  handleCloseCurrentActivity: () => void;
}

const EntryUI = (props: EntryUIProps) => {
  const [currEntry, setCurrEntry] = useState<undefined | Entry>();
  const theme = useTheme();

  const {
    hasMore,
    canGoBack,
    handleNextPage,
    handlePreviousPage,
    updatePagination,
    getCurrentToken,
  } = useCursorPagination();

  const { data: entries } = useGetAllEntriesQuery(
    {
      limit: 50,
      lastKey: getCurrentToken(),
      activityType: props.sport,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (entries) {
      updatePagination(
        JSON.stringify(entries.lastKey) || null,
        !!entries.lastKey
      );
    }
  }, [entries, updatePagination]);

  const renderEntries = entries?.items?.map((entry, index) => {
    return (
      <ListItem key={index} sx={{ display: 'flex', padding: 0 }}>
        <StravaEntry
          showIndividualEntry={props.showIndividualEntry}
          no={
            props.currentPage === 1 && index >= 0 && index <= 3
              ? index
              : undefined
          }
          sport={props.sport}
          entry={entry}
          format={props.format}
          handleCloseCurrentActivity={props.handleCloseCurrentActivity}
        />
      </ListItem>
    );
  });

  const openActivityDetail = Boolean(currEntry);

  const handleOpenActivityDetail = (entry: Entry) => {
    setCurrEntry(entry);
  };

  const handleCloseActivityDetail = () => {
    setCurrEntry(undefined);
  };

  const mobileStyles = useCSX({}, { marginBottom: '15%', marginTop: '2.5%' });

  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<Entry>();

    return [
      columnHelper.accessor('name', {
        header: 'Name',
      }),
      columnHelper.accessor('start_date', {
        header: 'Date',
        cell: (cellProps) => {
          return formatTime(cellProps.getValue());
        },
      }),
      columnHelper.display({
        header: 'Distance',
        cell: (cellProps) => {
          return cellProps.row.original.distance;
        },
      }),
      columnHelper.accessor('elapsed_time', {
        header: 'Time Elapsed',
      }),
      columnHelper.display({
        header: 'Detail',
        cell: (cellProps) => {
          const selectedEntry = cellProps.row.original;

          return (
            <>
              <IconButton
                onClick={() => {
                  handleOpenActivityDetail(selectedEntry);
                }}
              >
                <Visibility />
              </IconButton>
              <When condition={!!open}>
                <StandardDialog
                  height="auto"
                  title={selectedEntry.name}
                  actions={
                    <Button onClick={handleCloseActivityDetail} label="Close" />
                  }
                  open={
                    openActivityDetail &&
                    selectedEntry.activityId === currEntry?.activityId
                  }
                  onClose={handleCloseActivityDetail}
                >
                  <EntryDetail
                    activityId={currEntry?.activityId!}
                    sport={props.sport}
                  />
                </StandardDialog>
              </When>
            </>
          );
        },
      }),
    ];
  }, [openActivityDetail]);

  return (
    <List
      className="entryUls"
      disablePadding
      sx={{
        listStyleType: 'none',
        boxShadow: '0 0 10px ' + theme.palette.strava.contrastColor,
        ...mobileStyles,
      }}
    >
      <Table
        data={entries?.items || []}
        columns={tableColumns}
        paginationType="cursor"
        hasMore={hasMore}
        canGoBack={canGoBack}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />
      {(entries?.count === 0 && entries?.items.length) ||
      props.invalidEntry === true ? (
        <EmptyEntry />
      ) : (
        renderEntries
      )}
    </List>
  );
};

export default EntryUI;
