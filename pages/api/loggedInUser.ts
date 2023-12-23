import axios from 'axios';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId;
    var athlete = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/getLoggedInUser`,
      method: 'GET',
      params: {
        srg_athlete_id,
      },
    });
  } catch (err) {
    const typedErr = err as {
      message: string;
      request: { res: { statusCode: number } };
    };
    if (typedErr.request.res.statusCode === 429) {
      return res.status(429).send(typedErr.message);
    }
    return res.status(500).send(typedErr.message);
  }
  try {
    var stats = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/getAthleteStats/${athlete.data.id}`,
    });
  } catch (err) {
    const typedErr = err as { message: string };
    return res.status(500).send(typedErr.message);
  }

  const fullAthlete = Object.assign(athlete.data, stats.data);
  return res.status(200).send(fullAthlete);
});

export default handler;
