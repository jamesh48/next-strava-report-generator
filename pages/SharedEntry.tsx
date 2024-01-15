import React from 'react';
import { Box, useTheme } from '@mui/material';
import { ParsedUrlQuery } from 'querystring';
import { NextApiRequest, GetServerSidePropsContext, PreviewData } from 'next';
import { IncomingMessage } from 'http';
import axios from 'axios';
import StravaEntry from '@components/StravaEntries/StravaEntry';
import { CurrentActivity, Entry } from '@components/StravaEntries/EntryTypes';
import Head from 'next/head';

type SRGReq = IncomingMessage & {
  cookies: NextApiRequest['cookies'];
  headers: {
    host: string;
  };
};

interface SRGContext
  extends GetServerSidePropsContext<ParsedUrlQuery, PreviewData> {
  req: SRGReq;
}

export type SRGSharedEventProps = (context: SRGContext) => Promise<{
  props: {};
}>;
//
const fetchGeneralServerSideActivity = async (
  athleteId: string,
  activityId: string
) => {
  const { data } = await axios({
    method: 'GET',
    url: `${process.env.DATA_BASE_URL}/srg/generalIndividualEntry/${athleteId}/${activityId}`,
  });
  return data;
};

export const getServerSideProps: SRGSharedEventProps = async ({ query }) => {
  let fetchedActivity = null;
  if (query.activityId && query.athleteId) {
    fetchedActivity = await fetchGeneralServerSideActivity(
      query.athleteId as string,
      query.activityId as string
    );
  }

  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

  return {
    props: {
      fetchedActivity,
      clientSideTokens: {
        mapbox: mapboxAccessToken,
      },
    },
  };
};

const SharedEntry = (props: { fetchedActivity: Entry & CurrentActivity }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: theme.palette.mainBackground.dark,
        alignItems: 'center',
      }}
    >
      <Head>
        <title>SRG Shared Event</title>
        <meta name="description" content="A ordered list of strava activites" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <StravaEntry
        no={0}
        showIndividualEntry={() => null}
        handleCloseCurrentActivity={() => null}
        sport={'Run'}
        entry={props.fetchedActivity}
        currentActivity={{
          ...props.fetchedActivity,
          id: Number(props.fetchedActivity.activityId),
        }}
        format="kph"
        isSharedActivity={true}
      />
    </Box>
  );
};

export default SharedEntry;
