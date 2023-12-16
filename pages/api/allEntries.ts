import axios from 'axios';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { withSession } from '../middleware';
const handler = nextConnect();

handler.use(withSession());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const srg_athlete_id = req.cookies.athleteId;
  const { data } = await axios({
    url: `${process.env.DATA_BASE_URL}/srg/allActivities`,
    method: 'GET',
    params: {
      srg_athlete_id,
    },
  });

  return res.send(
    data.sort(
      (a: any, b: any) =>
        b.distance / b.moving_time - a.distance / a.moving_time
    )
  );
});
export default handler;
