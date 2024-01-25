import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId;
    const { activityId: entry_id, shoe_id, shoe_name } = req.body;
    await axios({
      url: `${process.env.DATA_BASE_URL}/srg/shoeAlert`,
      method: 'PUT',
      params: {
        srg_athlete_id,
        entry_id,
        shoe_id,
        shoe_name,
      },
    });
    return res.send({ message: 'success' });
  } catch (err) {
    const typedErr = err as { message: string };
    return res.send({ error: typedErr.message });
  }
});

export default handler;
