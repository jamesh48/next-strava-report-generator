import App from '@components/App/App'
import { Box } from '@mui/material'
import Head from 'next/head'

export const getServerSideProps = () => {
  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN
  return {
    props: {
      clientSideTokens: {
        mapbox: mapboxAccessToken,
      },
    },
  }
}

export default function Home() {
  return (
    <Box>
      <Head>
        <title>Strava Report Generator</title>
        <meta name='description' content='A ordered list of strava activites' />
        <link rel='icon' href='/images/favicon.png' />
      </Head>

      <App />
    </Box>
  )
}
