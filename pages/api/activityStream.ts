import axios from 'axios';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId;
    const { data } = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/activityStream/${req.query.activityId}`,
      method: 'GET',
      params: {
        srg_athlete_id,
      },
    });

    return res.send(data);
  } catch (err) {
    console.log(err);
    res.send([]);
  }
});
export default handler;
