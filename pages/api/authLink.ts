require('dotenv').config();
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
const handler = nextConnect();

handler.get((_req: NextApiRequest, res: NextApiResponse) => {
  res.send(process.env.AUTH_LINK!);
});

export default handler;
