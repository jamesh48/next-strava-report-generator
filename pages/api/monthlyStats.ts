// /srg/monthlyStats?srg_athlete_id=12345&activity_type=Run

import axios from 'axios';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const activityType = req.query.activityType;
  try {
    const srg_athlete_id = req.cookies.athleteId;
    const monthlyStats = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/monthlyStats`,
      method: 'GET',
      params: {
        srg_athlete_id,
        activity_type: activityType,
      },
    });

    return res.send(monthlyStats.data);
  } catch (err) {
    const typedErr = err as {
      message: string;
      request: { res: { statusCode: number } };
    };
    if (typedErr.request.res.statusCode === 429) {
      return res.status(429).send({ error: typedErr.message });
    }
    return res.status(500).send({ error: typedErr.message });
  }
});

export default handler;
