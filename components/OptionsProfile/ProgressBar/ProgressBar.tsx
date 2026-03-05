import { hasStatus } from '@components/UserProfile/UserProfile'
import { useCSX, useInterval } from '@lib'
import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  type SxProps,
  type Theme,
  useTheme,
} from '@mui/material'
import { useDispatch, useSelector } from '@redux/reduxHooks'
import {
  completeProgressBarProgress,
  getProgressBarProgress,
  getSortCondition,
  incrementProgressBarProgress,
  resetProgressBarProgress,
  SortCondition,
  setSortCondition,
  useAddAllActivitiesMutation,
  useDestroyUserAndActivitiesMutation,
  useGetAllEntriesQuery,
  useGetUserProfileQuery,
} from '@redux/slices'
import { useCallback, useEffect, useState } from 'react'

const muiUpdateButtonContainerSx: SxProps = {
  minHeight: '5vmax',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '95%',
}

const muiUpdateButtonSx = (theme: Theme) => ({
  cursor: 'pointer',
  textRendering: 'geometricPrecision',
  backgroundColor: theme.palette.mainBackground.main,
  color: theme.palette.strava.main,
  border: `2px solid ${theme.palette.strava.contrastColor}`,
  boxShadow: `0 0 5px  ${theme.palette.strava.contrastColor}`,
  padding: '0.5vmax 1vmax',
  minWidth: '10%',
  margin: '1rem 0.5rem',
  height: '3rem',
  '&:hover': {
    backgroundColor: theme.palette.strava.contrastColor,
    color: theme.palette.strava.contrastText,
    border: `2px solid ${theme.palette.strava.contrastText}`,
    cursor: 'pointer',
  },
})

const menuItemStyles = (indicator: boolean, theme: Theme) => ({
  textAlign: 'center !important',
  display: 'flex',
  justifyContent: 'center',
  bgcolor: indicator
    ? `${theme.palette.strava.main} !important`
    : theme.palette.common.white,
  color: indicator ? theme.palette.common.white : theme.palette.strava.main,
  '&:hover': {
    backgroundColor: theme.palette.mainBackground.main,
  },
})

// time it takes to delete one dynamodb record in ms
const dynamoDBDeletionRatePerRecord = 110
const dynamoDBInsertionRatePerRecord = 30

const ProgressBar = () => {
  const theme = useTheme()
  const [deletionRate, setDeletionRate] = useState(75)
  const [insertionRate, setInsertionRate] = useState(125)
  const dispatch = useDispatch()
  const { data: allEntries } = useGetAllEntriesQuery(null)
  const { isError, error } = useGetUserProfileQuery(null)
  const sortCondition = useSelector(getSortCondition)

  useEffect(() => {
    const numberOfEntries = allEntries?.count
    if (numberOfEntries) {
      const currentDeletionRate =
        (numberOfEntries * dynamoDBDeletionRatePerRecord) / 100
      const currentInsertionRate =
        (numberOfEntries * dynamoDBInsertionRatePerRecord) / 100
      setInsertionRate(currentInsertionRate)
      setDeletionRate(currentDeletionRate)
    }
  }, [allEntries?.count])

  const progressBarProgress = useSelector(getProgressBarProgress)
  const [
    addAllActivities,
    {
      isSuccess: isSuccessAdd,
      isLoading: isLoadingAdd,
      isUninitialized: isUninitializedAdd,
    },
  ] = useAddAllActivitiesMutation()
  const [
    _,
    {
      isSuccess: isSuccessDestroy,
      isLoading: isLoadingDestroy,
      isUninitialized: isUninitializedDestroy,
    },
  ] = useDestroyUserAndActivitiesMutation({
    fixedCacheKey: 'destroy-user-key',
  })

  useInterval(
    () => {
      if (isSuccessAdd) {
        dispatch(completeProgressBarProgress())
        setTimeout(() => {
          dispatch(resetProgressBarProgress())
        }, 750)
      } else if (isLoadingAdd) {
        dispatch(incrementProgressBarProgress(progressBarProgress))
      }
    },
    isSuccessAdd || isUninitializedAdd ? -1 : insertionRate,
  )

  useInterval(
    () => {
      if (isSuccessDestroy) {
        dispatch(completeProgressBarProgress())
        setTimeout(() => {
          dispatch(resetProgressBarProgress())
          window.location.reload()
        }, 1000)
      } else if (isLoadingDestroy) {
        dispatch(incrementProgressBarProgress(progressBarProgress))
      }
    },
    isSuccessDestroy || isUninitializedDestroy ? -1 : deletionRate,
  )

  const fillerStyles = {
    width: `${progressBarProgress}%`,
  }

  const updateEntries: () => Promise<void> = async () => {
    await addAllActivities(null)
  }

  const setSortConditionCallback = useCallback(
    (event: SelectChangeEvent<SortCondition>) => {
      dispatch(setSortCondition(event.target.value))
    },
    [dispatch],
  )

  const mobileStyleSelect = useCSX('unset', '1', 'flex')
  const mobileStyleUpdateButton = useCSX('unset', '.5', 'flex')

  const rateLimitExceeded = isError && hasStatus(error) && error.status === 429

  return progressBarProgress === 0 ? (
    <Box className='updateButtonContainer' sx={muiUpdateButtonContainerSx}>
      {sortCondition ? (
        <Select
          className='updateButton'
          onChange={setSortConditionCallback}
          // @ts-expect-error
          sx={{
            ...muiUpdateButtonSx(theme),
            ...mobileStyleSelect,
          }}
          value={sortCondition || 'speedDesc'}
        >
          <MenuItem
            value={SortCondition.DISTANCE_DESC}
            sx={menuItemStyles(
              sortCondition === SortCondition.DISTANCE_DESC,
              theme,
            )}
          >
            Distance: Furthest First
          </MenuItem>
          <MenuItem
            value={SortCondition.SPEED_DESC}
            sx={menuItemStyles(
              sortCondition === SortCondition.SPEED_DESC,
              theme,
            )}
          >
            Speed: Fastest First
          </MenuItem>
          <MenuItem
            value={SortCondition.DATE_DESC}
            sx={menuItemStyles(
              sortCondition === SortCondition.DATE_DESC,
              theme,
            )}
          >
            Date: Most Recent
          </MenuItem>
          <MenuItem
            value={SortCondition.DATE_ASC}
            sx={menuItemStyles(sortCondition === SortCondition.DATE_ASC, theme)}
          >
            Date: Least Recent
          </MenuItem>
          <MenuItem
            value={SortCondition.MOVING_TIME_DESC}
            sx={menuItemStyles(
              sortCondition === SortCondition.MOVING_TIME_DESC,
              theme,
            )}
          >
            Moving Time: Longest First
          </MenuItem>
          <MenuItem
            value={SortCondition.MOVING_TIME_ASC}
            sx={menuItemStyles(
              sortCondition === SortCondition.MOVING_TIME_ASC,
              theme,
            )}
          >
            Moving Time: Shortest First
          </MenuItem>
          <MenuItem
            value={SortCondition.TIME_ELAPSED_DESC}
            sx={menuItemStyles(
              sortCondition === SortCondition.TIME_ELAPSED_DESC,
              theme,
            )}
          >
            Time Elapsed: Longest First
          </MenuItem>
          <MenuItem
            value={SortCondition.TIME_ELAPSED_ASC}
            sx={menuItemStyles(
              sortCondition === SortCondition.TIME_ELAPSED_ASC,
              theme,
            )}
          >
            Time Elapsed: Shortest First
          </MenuItem>
        </Select>
      ) : (
        <Box
          sx={{
            ...muiUpdateButtonSx(theme),
            height: '1rem',
            width: '1rem',
          }}
        />
      )}
      {!rateLimitExceeded ? (
        <OutlinedInput
          type='button'
          className='updateButton'
          value='Fetch New Activities!'
          onClick={updateEntries}
          // @ts-expect-error
          sx={{
            ...muiUpdateButtonSx(theme),
            ...mobileStyleUpdateButton,
          }}
          inputProps={{ sx: { cursor: 'pointer' } }}
        />
      ) : null}
    </Box>
  ) : (
    <Box className='updateButtonContainer' sx={muiUpdateButtonContainerSx}>
      <Box
        id='progressBarContainer'
        sx={{
          width: '95%',
          border: `1px solid ${theme.palette.strava.contrastColor}`,
          boxShadow: `0 0 5px ${theme.palette.strava.contrastColor}`,
          backgroundColor: theme.palette.strava.contrastColor,
          borderRadius: '50px',
          margin: '1% 2.5%',
        }}
      >
        <Box
          className='progressBarFiller'
          style={fillerStyles}
          sx={{
            height: '100%',
            background: `linear-gradient(
              99deg,
              rgba(73, 81, 255, 1) 15%,
              rgba(0, 241, 255, 1) 42%,
              rgba(21, 221, 51, 1) 100%)`,
            borderRadius: 'inherit',
            textAlign: 'right',
            transition: 'width 0.1s ease-in-out',
          }}
        >
          <Box
            className='progressBarCounter'
            sx={{
              padding: 5,
              color: theme.palette.strava.contrastText,
              fontWeight: 900,
            }}
          >{`${progressBarProgress}%`}</Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProgressBar
