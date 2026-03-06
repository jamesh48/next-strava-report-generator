import ProgressBar from '@components/OptionsProfile/ProgressBar/ProgressBar'
import RadioColumn from '@components/OptionsProfile/Radios/RadioColumn'
import type { Format } from '@components/StravaEntries/EntryTypes'
import { useCSX } from '@lib'
import { Box, useTheme } from '@mui/material'
import type React from 'react'
import AdditionalFilters from './AdditionalFilters/AdditionalFilters'
import InputJSON from './input.json'

export interface RadiosProps {
  setSport: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  setDistance: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  setFormat: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  setTitleQuery: React.ChangeEventHandler<HTMLInputElement>
  titleQuery: string
  sport: string
  customDistance: boolean
  distance: number
  format: Format
}

const Radios = (props: RadiosProps) => {
  const theme = useTheme()
  // const { isSuccess } = useGetAllEntriesQuery(null);
  const isSuccess = true
  const initArr = [
    {
      title: 'Choose Sport',
      setCallback: props.setSport,
      radioValues: InputJSON.chooseSportRadios,
    },
    {
      title: 'Choose Distance',
      setCallback: props.setDistance,
      radioValues:
        props.sport === 'Run'
          ? InputJSON.distanceRunRadios
          : props.sport === 'Swim'
            ? InputJSON.distanceSwimRadios
            : props.sport === 'Ride'
              ? InputJSON.distanceRideRadios
              : InputJSON.distanceRunRadios,
      customDistance: props.customDistance,
      distance: props.distance,
    },
    {
      title: 'Choose Format',
      setCallback: props.setFormat,
      radioValues:
        props.sport === 'Run'
          ? InputJSON.formatRunRadios
          : props.sport === 'Swim'
            ? InputJSON.formatSwimRadios
            : props.sport === 'Ride'
              ? InputJSON.formatRideRadios
              : InputJSON.formatRunRadios,
      format: props.format,
    },
  ]

  return (
    <Box
      id='buttonsAndBar'
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        id='buttonLayout'
        sx={{
          display: 'flex',
          ...useCSX('row', 'column', 'flexDirection'),
          justifyContent: 'center',
          width: '95%',
          margin: '2.5% auto 0 auto',
          backgroundColor: theme.palette.mainBackground.main,
          border: `1px solid ${theme.palette.strava.main}`,
          boxShadow: `.125rem .125rem .25rem 0px ${theme.palette.strava.main}`,
        }}
      >
        {initArr.map((radioColumn) => {
          return (
            <RadioColumn
              key={radioColumn.title}
              {...radioColumn}
              isLoaded={isSuccess}
              format={props.format}
            />
          )
        })}
      </Box>

      <AdditionalFilters
        setTitleQuery={props.setTitleQuery}
        titleQuery={props.titleQuery}
      />
      <ProgressBar />
    </Box>
  )
}

export default Radios
