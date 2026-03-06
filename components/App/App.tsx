/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <x> */
import Radios from '@components/OptionsProfile/Radios/Radios'
import type { Format, Sport } from '@components/StravaEntries/EntryTypes'
import Report from '@components/StravaEntries/Report'
//
import UserProfile from '@components/UserProfile/UserProfile'
import { Box, useTheme } from '@mui/material'
import { useDispatch, useSelector } from '@redux/reduxHooks'
import { getSportCondition, setSportCondition } from '@redux/slices'
import React, {
  type ChangeEventHandler,
  type MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'
import PopupModal from './PopupModal'

export default function App() {
  const theme = useTheme()
  // Radios
  const sport = useSelector(getSportCondition)
  const dispatch = useDispatch()
  const [format, setFormat] = useState<Format>('kph')
  const [titleQuery, setTitleQuery] = useState('')

  const [distance, setDistance] = useState(0)
  const [customDistance, setCustomDistance] = React.useState(false)

  useEffect(() => {
    setDistance(0)
  }, [sport])

  useEffect(() => {
    setFormat(sport === 'Run' ? 'kph' : sport === 'Swim' ? 'avgmpace' : 'kph')
  }, [sport])

  useEffect(() => {
    setCustomDistance(false)
  }, [sport])

  const setSportCallback: MouseEventHandler<HTMLLabelElement> &
    ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const value = (e.target as HTMLInputElement).value as Sport
    dispatch(setSportCondition(value))
  }

  const setFormatCallback: MouseEventHandler<HTMLLabelElement> &
    ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const value = (e.target as HTMLInputElement).value
    setFormat(value as Format)
  }

  const setTitleQueryCallback: ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      setTitleQuery(event.currentTarget.value)
    }, [])

  const setDistanceCallback: MouseEventHandler<HTMLLabelElement> &
    ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const placeholder = (e.target as HTMLInputElement).placeholder
    let value = (e.currentTarget as HTMLInputElement).value
    if (!value) {
      value = (e.target as HTMLInputElement).value
    }

    setDistance(Number(value))

    if (placeholder === 'Custom Distance' && Number(value) !== 0) {
      setCustomDistance(true)
    } else {
      setCustomDistance(false)
    }
  }

  return (
    <Box
      id='mainContainer'
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        id='upperSection'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '1%',
          border: `1px solid ${theme.palette.strava.contrastColor}`,
          boxShadow: `.125rem .125rem .25rem 0px ${theme.palette.strava.main}`,
          backgroundColor: theme.palette.mainBackground.dark,
        }}
      >
        <UserProfile />

        <Radios
          setSport={setSportCallback}
          setDistance={setDistanceCallback}
          setFormat={setFormatCallback}
          setTitleQuery={setTitleQueryCallback}
          titleQuery={titleQuery}
          sport={sport}
          customDistance={customDistance}
          distance={distance}
          format={format}
        />
        <Report
          sport={sport}
          format={format}
          distance={distance}
          titleQuery={titleQuery}
        />
      </Box>
      <PopupModal />
    </Box>
  )
}
