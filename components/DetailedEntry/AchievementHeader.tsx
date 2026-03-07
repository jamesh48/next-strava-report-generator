import { useCSX, useMobileBrowserCheck } from '@lib'
import { Box, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import CarouselArrows from './CarouselArrows'
import SwitchLink from './SwitchLink'

interface AchievementHeaderProps {
  achievementHeaderTitle: string
  handleSetPosition: (p: number) => void
  position: number
  currentSegmentDataLength: number | undefined
  toggleable: boolean | undefined
}

const AchievementHeader = (props: AchievementHeaderProps) => {
  const theme = useTheme()
  const [direction, setDirection] = useState('neutral')
  const isMobile = useMobileBrowserCheck()

  useEffect(() => {
    if (direction !== 'neutral') {
      let counter = Number(props.position)
      const wholeNumber = setInterval(() => {
        if (direction === 'forward') {
          counter += 0.1
        } else {
          counter -= 0.1
        }
        props.handleSetPosition(Number(counter.toFixed(1)))
        if (Number(counter.toFixed(1)) % 1 === 0) {
          clearInterval(wholeNumber)
          setDirection('neutral')
        }
      }, 35)
      return () => {
        clearInterval(wholeNumber)
      }
    }
    return
  }, [direction])

  const mobileTitleCentered = useCSX(
    { width: '50%', flex: 1 },
    {
      flex: 1,
      width: '100%',
      textAlign: 'center',
      alignItems: 'center',
      display: 'flex',
    },
  )

  const changeEffort = (event: React.MouseEvent<HTMLElement>) => {
    const nextResult = /next-button/g.test(event.currentTarget.id)
    nextResult ? setDirection('forward') : setDirection('backward')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '92.5%',
        flexDirection: 'column',
        padding: '1rem',

        backgroundColor: theme.palette.action.hover,
        borderRadius: '8px 8px 0 0',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          gap: '1rem',
        }}
      >
        <Typography
          variant='h4'
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            ...mobileTitleCentered,
          }}
        >
          {props.achievementHeaderTitle}
        </Typography>
        {!isMobile ? (
          <CarouselArrows
            position={props.position}
            changeEffort={changeEffort}
            currentSegmentDataLength={props.currentSegmentDataLength}
          />
        ) : null}
        {props.toggleable && !isMobile ? <SwitchLink /> : null}
      </Box>
      {props.toggleable && isMobile ? <SwitchLink /> : null}
    </Box>
  )
}

export default AchievementHeader
