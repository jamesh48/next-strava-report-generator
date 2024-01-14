import React from 'react';
import { Box } from '@mui/material';
import { ParsedUrlQuery } from 'querystring';
import { NextApiRequest, GetServerSidePropsContext, PreviewData } from 'next';
import { IncomingMessage } from 'http';
import axios from 'axios';
import StravaEntry from '@components/StravaEntries/StravaEntry';
import { CurrentActivity, Entry } from '@components/StravaEntries/EntryTypes';

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
const fetchServerSideActivity = async (
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
    fetchedActivity = await fetchServerSideActivity(
      query.athleteId as string,
      query.activityId as string
    );
  }
  return {
    props: {
      fetchedActivity,
      currentActivity: {},
    },
  };
};

const SharedEntry = (props: {
  fetchedActivity: Entry;
  currentActivity: CurrentActivity;
}) => {
  return (
    <Box>
      <StravaEntry
        no={0}
        showIndividualEntry={() => null}
        handleCloseCurrentActivity={() => null}
        sport={'Run'}
        entry={props.fetchedActivity}
        currentActivity={props.currentActivity}
        format="kph"
      />
    </Box>
  );
};

export default SharedEntry;
