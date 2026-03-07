import EntryDetail from '@components/StravaEntries/EntryDetail'
import { Box, useTheme } from '@mui/material'
import type { GetServerSidePropsContext } from 'next'
import Head from 'next/head'

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const { activityId, athleteId } = query
  return {
    props: {
      activityId: activityId ? Number(activityId) : null,
      athleteId: athleteId ? Number(athleteId) : null,
      clientSideTokens: {
        mapbox: process.env.MAPBOX_ACCESS_TOKEN || '',
      },
    },
  }
}

const SharedEntry = (props: { activityId: number | null; athleteId: number | null }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        bgcolor: theme.palette.mainBackground.main,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      <Head>
        <title>SRG Shared Event</title>
        <meta name='description' content='A ordered list of strava activites' />
        <link rel='icon' href='/images/favicon.png' />
      </Head>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {props.activityId && (
          <EntryDetail
            activityId={props.activityId}
            athleteId={props.athleteId ?? undefined}
            sport='Run'
            format='kph'
            isSharedActivity={true}
          />
        )}
      </Box>
    </Box>
  )
}

export default SharedEntry
