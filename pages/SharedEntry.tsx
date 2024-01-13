import React from 'react';
import { Box } from '@mui/material';
import { ParsedUrlQuery } from 'querystring';
import { NextApiRequest, GetServerSidePropsContext, PreviewData } from 'next';
import { IncomingMessage } from 'http';
import axios from 'axios';
import GeneralEntry from '@components/StravaEntries/GeneralEntry';
import { useAlertOnMount } from '@lib';

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
    },
  };
};

const SharedEntry = (props: {
  fetchedActivity: {
    name: string;
    start_date: string;
    activityId: number;
    max_speed: string;
    distance: number;
    elapsed_time: number;
    moving_time: number;
    type: string;
  };
}) => {
  return (
    <Box>
      <GeneralEntry
        handleEditingHeadlineChange={() => null}
        handleNameChange={() => null}
        editingHeadline={false}
        editedName=""
        no={0}
        sport={'Run'}
        entry={props.fetchedActivity}
        isCurrentActivity={true}
        format="kph"
      />
    </Box>
  );
};

export default SharedEntry;
