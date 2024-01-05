import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId;
    const { data } = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/getUserSettings`,
      method: 'GET',
      params: {
        srg_athlete_id,
      },
    });
    return res.send(data);
  } catch (err) {
    console.log((err as { message: string }).message);
    return res.send({
      defaultSport: 'Run',
      defaultFormat: 'speedDesc',
      defaultDate: 'allTime',
    });
  }
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId;
    await axios({
      url: `${process.env.DATA_BASE_URL}/srg/saveUserSettings`,
      method: 'POST',
      params: {
        srg_athlete_id,
      },
      data: {
        defaultSport: req.body.selectedSport,
        defaultFormat: req.body.selectedFormat,
        defaultDate: req.body.selectedDate,
      },
    });
    return res.send('ok');
  } catch (err) {
    const typedErr = err as { message: string };
    console.log(typedErr.message);
    return res.send(typedErr.message);
  }
});

export default handler;
