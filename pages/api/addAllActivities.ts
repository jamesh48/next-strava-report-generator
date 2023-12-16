import axios from 'axios';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const srg_athlete_id = req.cookies.athleteId;

  const { data: allEntries } = await axios({
    method: 'POST',
    url: `${process.env.DATA_BASE_URL}/srg/addAllActivities`,
    params: { srg_athlete_id },
  });
  return res.send(allEntries);
});

export default handler;
