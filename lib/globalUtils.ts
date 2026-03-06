import type { SxProps } from '@mui/material'
import axios, { type AxiosResponse } from 'axios'
import dayjs, { type Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { isEmpty, isNil } from 'lodash'
import { type CSSProperties, useCallback, useEffect, useState } from 'react'

dayjs.extend(duration)

export const useMobileBrowserCheck = () => {
  const [mobileBrowserState, setMobileBrowserState] = useState(false)

  useEffect(() => {
    const mobileBrowserCheck = () => {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
      ]
      return toMatch.some((toMatchItem) => {
        // Second condition works for iPads that display intel mac...
        return (
          navigator.userAgent.match(toMatchItem) ||
          (navigator.userAgent.indexOf('Macintosh') > -1 &&
            'ontouchend' in document)
        )
      })
    }

    setMobileBrowserState(mobileBrowserCheck())
  }, [])

  return mobileBrowserState
}

type CSSPropertyIdentifier = keyof CSSProperties

export function useCSX<T extends CSSPropertyIdentifier>(
  regularSx: SxProps | CSSProperties[T],
  mobileSx: SxProps | CSSProperties[T],
  identifier?: T,
): SxProps {
  const isMobile = useMobileBrowserCheck()
  if (typeof identifier === 'string') {
    return isMobile ? { [identifier]: mobileSx } : { [identifier]: regularSx }
  } else {
    return (isMobile ? mobileSx : regularSx) as SxProps
  }
}

export const authorizeApp = async () => {
  const response: AxiosResponse = await axios('/api/authLink')
  window.location = response.data
}

export const fetchUserData = async () => {
  try {
    const { data } = await axios({
      url: '/api/loggedInUser',
      withCredentials: true,
    })
    return data
  } catch (err) {
    const typedErr = err as { message: string }
    if (typedErr.message.indexOf('429') === -1) {
      authorizeApp()
    } else {
      return 429
    }
  }
}

export const formatDate = (
  date: Dayjs | null | string | undefined,
  forPresentation: boolean = false,
) => {
  if (isNil(date) || isEmpty(date)) {
    return null
  }

  if (forPresentation) {
    return dayjs(date).format('MM/DD/YYYY').toString()
  }

  return dayjs(date).format('YYYY-MM-DD').toString()
}

export const formatTime = (
  date: Dayjs | null | string | undefined,
  timeOnly: boolean = false,
) => {
  if (isNil(date)) {
    return null
  }

  if (timeOnly) {
    return dayjs(date).format('h:mm:ss a').toString()
  }

  return dayjs(date).format('MM/DD/YYYY h:mm:ss a').toString()
}

export const formatElapsedTime = (elapsedTime: number) => {
  const dur = dayjs.duration(elapsedTime, 'seconds')
  const hours = Math.floor(dur.asHours())
  const minutes = dur.minutes()
  const seconds = dur.seconds()

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }
}

export const useModal = () => {
  const [open, setOpen] = useState(false)

  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])

  return { onOpen, onClose, open }
}
