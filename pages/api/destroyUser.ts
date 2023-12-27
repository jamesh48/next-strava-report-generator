import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId;
    const { data } = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/destroyUser`,
      method: 'GET',
      params: {
        srg_athlete_id,
      },
    });
    return res.send(data);
  } catch (err) {
    const typedErr = err as { message: string };
    console.log(typedErr.message);
    return res.send(typedErr.message);
  }
});

export default handler;
