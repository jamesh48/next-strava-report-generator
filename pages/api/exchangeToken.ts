import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query.code;
  try {
    const { data } = await axios(
      `${process.env.DATA_BASE_URL}/srg/exchange_token?code=${code}`
    );
    res.setHeader('Set-Cookie', `athleteId=${data};`);
    return res.redirect('http://localhost:8000');
  } catch (err: any) {
    return res.send(err);
  }
});

export default handler;
