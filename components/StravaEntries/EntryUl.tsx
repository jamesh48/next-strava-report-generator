import React, { useMemo, useEffect, useState } from 'react';
import { Box, IconButton, List, ListItem, useTheme } from '@mui/material';
import StravaEntry from './StravaEntry';
import EmptyEntry from './EmptyEntry';
import { Format, Sport, UIEntry } from './EntryTypes.js';
import { getDateCondition, useGetAllEntriesQuery } from '@redux/slices';
import { formatTime, useCSX } from '@lib';
import { Button, Table, useCursorPagination } from 'fsh-components';
import { createColumnHelper } from '@tanstack/react-table';
import { Visibility } from '@mui/icons-material';
import StandardDialog from '@components/StandardDialog';
import EntryDetail from '@components/StravaEntries/EntryDetail';
import { When } from 'react-if';
import { useSelector } from '@redux/reduxHooks';

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
  const theme = useTheme();
  const [afterDate, beforeDate] = useSelector(getDateCondition);

  const [currEntry, setCurrEntry] = useState<undefined | UIEntry>();

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
      format: props.format,
      afterDate,
      beforeDate,
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

  const handleOpenActivityDetail = (entry: UIEntry) => {
    setCurrEntry(entry);
  };

  const handleCloseActivityDetail = () => {
    setCurrEntry(undefined);
  };

  const mobileStyles = useCSX({}, { marginBottom: '15%', marginTop: '2.5%' });

  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<UIEntry>();

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
      columnHelper.accessor('average_pace', { header: 'Average Pace' }),
      columnHelper.accessor('max_speed', {
        header: 'Max Speed',
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
                  maxWidth="lg"
                  actions={
                    <>
                      <Box />
                      <Button
                        onClick={handleCloseActivityDetail}
                        label="Close"
                      />
                    </>
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
                    format={props.format}
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
        sx={{
          header: {
            backgroundColor: theme.palette.primary.light,
          },
          row: {
            '&:nth-of-type(odd)': {
              backgroundColor: theme.palette.grey[400],
            },
            '&:hover': {
              backgroundColor: theme.palette.mainBackground.main,
            },
          },
        }}
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
