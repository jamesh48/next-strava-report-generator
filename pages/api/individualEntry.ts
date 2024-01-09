import axios, { AxiosResponse } from 'axios';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { CurrentActivity } from '@components/StravaEntries/EntryTypes';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const srg_athlete_id = req.cookies.athleteId;
  try {
    const { data } = await axios<{}, AxiosResponse<CurrentActivity>>({
      url: `${process.env.DATA_BASE_URL}/srg/individualEntry/${req.query.entryid}`,
      method: 'GET',
      params: {
        srg_athlete_id,
      },
    });
    res.status(200).send(data);
  } catch (err) {
    const typedErr = err as { message: string };
    return res.send({ error: typedErr.message });
  }
});

export default handler;
