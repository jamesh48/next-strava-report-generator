import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId;
    const { activityId: entry_id, name, description } = req.body;
    await axios({
      url: `${process.env.DATA_BASE_URL}/srg/activityUpdate`,
      method: 'PUT',
      params: {
        srg_athlete_id,
        entry_id,
        name,
        description,
      },
    });
    return res.send('data');
  } catch (err) {
    const typedErr = err as { message: string };
    return res.send(typedErr.message);
  }
});

export default handler;
