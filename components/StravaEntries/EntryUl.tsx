import StandardDialog from '@components/StandardDialog'
import EntryDetail from '@components/StravaEntries/EntryDetail'
import { formatTime, useCSX } from '@lib'
import { Visibility } from '@mui/icons-material'
import { Box, IconButton, List, ListItem, useTheme } from '@mui/material'
import { useSelector } from '@redux/reduxHooks'
import {
  getAchievementsOnlyCondition,
  getDateCondition,
  getSortCondition,
  useGetAllEntriesQuery,
} from '@redux/slices'
import { createColumnHelper } from '@tanstack/react-table'
import { Button, Table, useCursorPagination } from 'fsh-components'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { When } from 'react-if'
import EmptyEntry from './EmptyEntry'
import type { Format, Sport, UIEntry } from './EntryTypes.js'
import StravaEntry from './StravaEntry'

interface EntryUIProps {
  entriesPerPage: number
  currentPage: number
  invalidEntry: boolean
  sport: Sport
  format?: Format
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>
  handleCloseCurrentActivity: () => void
  titleQuery: string
  distance?: number
}

const EntryUI = (props: EntryUIProps) => {
  const theme = useTheme()
  const sortCondition = useSelector(getSortCondition)
  const [afterDate, beforeDate] = useSelector(getDateCondition)
  const hasAchievements = useSelector(getAchievementsOnlyCondition)

  const [currEntry, setCurrEntry] = useState<undefined | UIEntry>()

  const {
    hasMore,
    canGoBack,
    handleNextPage,
    handlePreviousPage,
    updatePagination,
    getCurrentToken,
    reset,
  } = useCursorPagination()

  useEffect(() => {
    reset()
  }, [props.sport, hasAchievements, reset])

  const { data: entries } = useGetAllEntriesQuery(
    {
      limit: 50,
      lastKey: getCurrentToken(),
      activityType: props.sport,
      format: props.format,
      afterDate,
      beforeDate,
      hasAchievements,
      search: props.titleQuery,
      sortCondition,
      minDistance: props.distance,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  console.info(entries)

  useEffect(() => {
    if (entries) {
      updatePagination(
        JSON.stringify(entries.lastKey) || null,
        !!entries.lastKey,
      )
    }
  }, [entries, updatePagination])

  const renderEntries = entries?.results?.map((entry, index) => {
    return (
      <ListItem key={entry.activityId} sx={{ display: 'flex', padding: 0 }}>
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
    )
  })

  const openActivityDetail = Boolean(currEntry)

  const handleOpenActivityDetail = (entry: UIEntry) => {
    setCurrEntry(entry)
  }

  const handleCloseActivityDetail = () => {
    setCurrEntry(undefined)
  }

  const mobileStyles = useCSX({}, { marginBottom: '15%', marginTop: '2.5%' })

  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<UIEntry>()

    return [
      columnHelper.accessor('name', {
        header: 'Name',
      }),
      columnHelper.accessor('startDate', {
        header: 'Date',
        cell: (cellProps) => {
          return formatTime(cellProps.getValue())
        },
      }),
      columnHelper.display({
        header: 'Distance',
        cell: (cellProps) => {
          return cellProps.row.original.distance
        },
      }),
      columnHelper.accessor('elapsed_time', {
        header: 'Time Elapsed',
      }),
      columnHelper.accessor('averagePace', { header: 'Average Pace' }),
      columnHelper.accessor('maxSpeed', {
        header: 'Max Speed',
      }),
      columnHelper.accessor('achievementCount', {
        header: 'Achievement Count',
      }),
      columnHelper.display({
        header: 'Detail',
        cell: (cellProps) => {
          const selectedEntry = cellProps.row.original

          return (
            <>
              <IconButton
                onClick={() => {
                  handleOpenActivityDetail(selectedEntry)
                }}
              >
                <Visibility />
              </IconButton>
              <When condition={!!open}>
                <StandardDialog
                  height='auto'
                  title={selectedEntry.name}
                  maxWidth='lg'
                  actions={
                    <>
                      <Box />
                      <Button
                        onClick={handleCloseActivityDetail}
                        label='Close'
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
                    activityId={currEntry?.activityId}
                    sport={props.sport}
                    format={props.format}
                  />
                </StandardDialog>
              </When>
            </>
          )
        },
      }),
    ]
  }, [openActivityDetail])

  return (
    <List
      className='entryUls'
      disablePadding
      sx={{
        listStyleType: 'none',
        border: `1px solid ${theme.palette.strava.main}`,
        boxShadow: `.125rem .125rem .25rem 0px ${theme.palette.strava.main}`,
        ...mobileStyles,
      }}
    >
      <Table
        data={entries?.results || []}
        columns={tableColumns}
        paginationType='numbered'
        hasMore={hasMore}
        canGoBack={canGoBack}
        onNextPage={handleNextPage}
        sx={{
          header: {
            backgroundColor: theme.palette.mainBackground.main,
          },
          row: {
            '&:nth-of-type(odd)': {
              backgroundColor: theme.palette.grey[200],
            },
            '&:hover': {
              backgroundColor: theme.palette.mainBackground.main,
            },
          },
        }}
        onPreviousPage={handlePreviousPage}
      />
      {(entries?.count === 0 && entries?.results.length) ||
      props.invalidEntry === true ? (
        <EmptyEntry />
      ) : (
        renderEntries
      )}
    </List>
  )
}

export default EntryUI
